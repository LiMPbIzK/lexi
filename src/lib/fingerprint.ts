// Fingerprint del dispositivo: huella estable calculada de características de
// hardware/software. NO depende de localStorage/IndexedDB, así que sobrevive a
// cualquier limpieza de storage del navegador. Sirve como refuerzo para
// recuperar el vínculo de un código de invitación si el UUID local se pierde.

import { getUserId } from './user';

/** Combina señales estables del dispositivo en una cadena. */
function collectSignals(): string[] {
  const signals: string[] = [];

  if (typeof navigator !== 'undefined') {
    signals.push(navigator.userAgent);
    signals.push(navigator.language);
    if ('platform' in navigator) signals.push(String(navigator.platform ?? ''));
    if ('hardwareConcurrency' in navigator) signals.push(String(navigator.hardwareConcurrency));
    if ('deviceMemory' in navigator) signals.push(String(navigator.deviceMemory ?? ''));
  }

  if (typeof screen !== 'undefined') {
    signals.push(String(screen.width));
    signals.push(String(screen.height));
    signals.push(String(screen.colorDepth));
    signals.push(String(screen.availWidth));
    signals.push(String(screen.availHeight));
  }

  if (typeof devicePixelRatio !== 'undefined') {
    signals.push(String(devicePixelRatio));
  }

  try {
    signals.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    /* ignore */
  }

  // canvas fingerprint: añade estabilidad (render text -> hash)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 60;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('LeXi', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('AAC', 4, 40);
      signals.push(canvas.toDataURL());
    }
  } catch {
    /* ignore */
  }

  return signals;
}

let cachedFingerprint: string | null = null;
let fingerprintPromise: Promise<string> | null = null;

/** Calcula y cachea el fingerprint (SHA-256 de las señales). Devuelve 64 hex. */
export async function getDeviceFingerprintAsync(): Promise<string> {
  if (cachedFingerprint) return cachedFingerprint;
  if (fingerprintPromise) return fingerprintPromise;

  fingerprintPromise = (async () => {
    const input = collectSignals().join('|');
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    cachedFingerprint = hex;
    return hex;
  })();

  return fingerprintPromise;
}

/** Fingerprint ya calculado (o null si aún no está listo). */
export function getCachedFingerprint(): string | null {
  return cachedFingerprint;
}

/** Precálculo temprano + solicitud de almacenamiento persistente. */
export function warmFingerprint(): void {
  void getDeviceFingerprintAsync();
  // solicitar storage persistente para reducir la limpieza de IndexedDB/localStorage
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    void navigator.storage.persist();
  }
}

/** Cabeceras de identidad para peticiones al servidor (síncronas). */
export function identityHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'X-Device-Id': getUserId() };
  if (cachedFingerprint) headers['X-Device-Fingerprint'] = cachedFingerprint;
  return headers;
}
