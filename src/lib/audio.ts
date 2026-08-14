// Reproducción y subida de audio (grabaciones del usuario subidas a R2).
// Se reproduce vía el proxy /api/audio/*; se cachea en Cache Storage.
// Todas las peticiones llevan X-Device-Id (credencial débil del dispositivo).

import { getUserId } from './user';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function deviceHeaders(): Record<string, string> {
  return { 'X-Device-Id': getUserId() };
}

/**
 * Reproduce un audio desde R2 (vía proxy del mismo origen).
 * Cachea en Cache Storage para reproductores offline.
 * Devuelve true si se reprodujo.
 */
export async function playCardAudio(audioKey: string): Promise<boolean> {
  if (!isBrowser()) return false;

  const url = `/api/audio/${audioKey}`;

  try {
    let response: Response | undefined;
    if ('caches' in window) {
      const cache = await caches.open('lexi-audio');
      const cached = await cache.match(url);
      if (cached) response = cached;
    }

    if (!response) {
      response = await fetch(url, { headers: deviceHeaders() });
      if (!response.ok) return false;
      if ('caches' in window) {
        const cache = await caches.open('lexi-audio');
        await cache.put(url, response.clone());
      }
    }

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

/** Borra un audio del dispositivo. Devuelve true si se borró. */
export async function deleteAudio(audioKey: string): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    const res = await fetch(`/api/audio/${audioKey}`, {
      method: 'DELETE',
      headers: deviceHeaders()
    });
    return res.ok;
  } catch {
    return false;
  }
}
