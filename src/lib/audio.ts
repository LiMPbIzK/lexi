// Reproducción y subida de audio (grabaciones del usuario subidas a R2).
// Se reproduce vía el proxy /api/audio/*; se cachea en Cache Storage.
// Todas las peticiones llevan X-Device-Id (credencial débil del dispositivo).

import { getUserId } from './user';
import { identityHeaders } from './fingerprint';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function deviceHeaders(): Record<string, string> {
  return identityHeaders();
}

// Audio actualmente en reproducción (para poder detenerlo con Parar)
let activeAudio: HTMLAudioElement | null = null;
let activeAudioResolve: (() => void) | null = null;

/** Detiene la reproducción de audio en curso (p. ej. botón Parar).
 *  Fuerza la resolución de la promesa pendiente de playCardAudioEnd. */
export function stopActiveAudio(): void {
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch {
      /* ignore */
    }
    activeAudio = null;
    if (activeAudioResolve) {
      activeAudioResolve();
      activeAudioResolve = null;
    }
  }
}

// ---------------------------------------------------------------
// Caché de audio (Cache Storage 'lexi-audio')
// Política: max 200 entradas y 30 días de vida.
// ---------------------------------------------------------------
const AUDIO_CACHE = 'lexi-audio';
const MAX_ENTRIES = 200;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

function urlFor(audioKey: string): string {
  return `/api/audio/${audioKey}`;
}

async function openAudioCache(): Promise<Cache> {
  return caches.open(AUDIO_CACHE);
}

/** Elimina entradas caducadas y las más antiguas si se supera el máximo. */
async function pruneAudioCache(): Promise<void> {
  const cache = await openAudioCache();
  const requests = await cache.keys();
  if (requests.length === 0) return;

  const now = Date.now();
  const entries: { url: string; age: number }[] = [];

  for (const req of requests) {
    const res = await cache.match(req);
    const dateHeader = res?.headers.get('date');
    const storedAt = dateHeader ? Date.parse(dateHeader) : now;
    entries.push({ url: req.url, age: Number.isFinite(storedAt) ? storedAt : now });
  }

  // borrar caducados
  for (const e of entries) {
    if (now - e.age > MAX_AGE_MS) {
      await cache.delete(e.url);
    }
  }

  // si aún supera el máximo, borrar los más antiguos
  const remaining = await cache.keys();
  if (remaining.length > MAX_ENTRIES) {
    const remainingEntries = entries
      .filter((e) => now - e.age <= MAX_AGE_MS)
      .sort((a, b) => a.age - b.age);
    const toDelete = remaining.length - MAX_ENTRIES;
    for (let i = 0; i < Math.min(toDelete, remainingEntries.length); i++) {
      await cache.delete(remainingEntries[i].url);
    }
  }
}

/** Guarda un blob en la caché de audio (tras grabar o reproducir). */
export async function cacheAudioBlob(audioKey: string, blob: Blob): Promise<void> {
  if (!isBrowser() || !('caches' in window)) return;
  try {
    const cache = await openAudioCache();
    await cache.put(urlFor(audioKey), new Response(blob, { headers: { Date: new Date().toUTCString() } }));
    await pruneAudioCache();
  } catch {
    /* no crítico */
  }
}

/** True si el audio está cacheado localmente (reproducible sin conexión). */
export async function isAudioAvailableOffline(audioKey: string): Promise<boolean> {
  if (!isBrowser() || !('caches' in window)) return false;
  try {
    const cache = await openAudioCache();
    return (await cache.match(urlFor(audioKey))) !== undefined;
  } catch {
    return false;
  }
}

async function getAudioResponse(url: string): Promise<Response | null> {
  // 1. caché local
  if ('caches' in window) {
    const cache = await openAudioCache();
    const cached = await cache.match(url);
    if (cached) return cached;
  }
  // 2. red (R2 vía proxy)
  const res = await fetch(url, { headers: deviceHeaders() });
  if (!res.ok) return null;
  if ('caches' in window) {
    const cache = await openAudioCache();
    await cache.put(url, res.clone());
    await pruneAudioCache();
  }
  return res;
}

/**
 * Reproduce un audio desde R2 (vía proxy del mismo origen).
 * Cachea en Cache Storage para reproductores offline.
 * Devuelve true si se reprodujo.
 */
export async function playCardAudio(audioKey: string): Promise<boolean> {
  if (!isBrowser()) return false;

  const url = urlFor(audioKey);

  try {
    const response = await getAudioResponse(url);
    if (!response) return false;

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const audio = new Audio(objectUrl);
    await audio.play();
    audio.addEventListener('ended', () => URL.revokeObjectURL(objectUrl), { once: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Sube un blob de audio a R2. Devuelve { ok, key?, error? }.
 * durationMs: duración de la grabación (validada por el servidor).
 */
export interface UploadResult {
  ok: boolean;
  key?: string;
  mime?: string;
  size?: number;
  error?: string;
  status?: number;
}

export async function uploadAudio(blob: Blob, durationMs?: number): Promise<UploadResult> {
  if (!isBrowser()) return { ok: false, error: 'No disponible en este contexto.' };

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        ...deviceHeaders(),
        'Content-Type': blob.type || 'audio/webm',
        ...(durationMs ? { 'X-Duration-Ms': String(Math.round(durationMs)) } : {})
      },
      body: blob
    });

    if (!res.ok) {
      let error = 'Error al subir el audio.';
      try {
        const data = await res.json();
        if (data?.error) error = data.error;
      } catch {
        /* sin cuerpo JSON */
      }
      return { ok: false, status: res.status, error };
    }

    const data = (await res.json()) as { key: string; mime: string; size: number };
    return { ok: true, key: data.key, mime: data.mime, size: data.size };
  } catch {
    return { ok: false, error: 'Sin conexión al subir el audio.' };
  }
}

/** Borra un audio del dispositivo (R2 + caché local). Devuelve true si se borró. */
export async function deleteAudio(audioKey: string): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    const res = await fetch(`/api/audio/${audioKey}`, {
      method: 'DELETE',
      headers: deviceHeaders()
    });
    // borrar también de la caché local para que el audio viejo no suene offline
    if ('caches' in window) {
      try {
        const cache = await openAudioCache();
        await cache.delete(urlFor(audioKey));
      } catch {
        /* no crítico */
      }
    }
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Reproduce un audio desde R2 y resuelve cuando termina (o falla).
 * Se usa para encadenar la reproducción palabra a palabra en la frase.
 * Devuelve true si se reprodujo hasta el final.
 */
export async function playCardAudioEnd(audioKey: string): Promise<boolean> {
  if (!isBrowser()) return false;

  const url = urlFor(audioKey);

  try {
    const response = await getAudioResponse(url);
    if (!response) return false;

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const audio = new Audio(objectUrl);
    activeAudio = audio;

    return await new Promise<boolean>((resolve) => {
      const cleanup = () => {
        if (activeAudio === audio) activeAudio = null;
        if (activeAudioResolve) activeAudioResolve = null;
        URL.revokeObjectURL(objectUrl);
        audio.removeEventListener('ended', onEnd);
        audio.removeEventListener('error', onErr);
      };
      const onEnd = () => {
        cleanup();
        resolve(true);
      };
      const onErr = () => {
        cleanup();
        resolve(false);
      };
      // la cancelación (Parar) resuelve la promesa como "no terminado"
      activeAudioResolve = () => {
        cleanup();
        resolve(false);
      };
      audio.addEventListener('ended', onEnd, { once: true });
      audio.addEventListener('error', onErr, { once: true });
      audio.play().catch(() => {
        cleanup();
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}
