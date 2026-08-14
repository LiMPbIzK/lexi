// Canjeo del código de invitación contra el servidor + máscara de código.
// Cada dispositivo debe registrar un código emitido manualmente antes de
// poder subir/reproducir audio.

import { getUserId, saveInviteCode, saveDeviceMode, saveDeviceToken, getDeviceToken, saveUserName } from './user';
import { getDeviceFingerprintAsync } from './fingerprint';

export interface ClaimResult {
  ok: boolean;
  mode?: 'full' | 'demo';
  user?: string;
  error?: string;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Extrae solo los dígitos del código (8 máximo), en mayúsculas.
 * Acepta tanto "XXXX-XXXX" como "LEXI-XXXX-XXXX" y quita todo lo no alfanumérico.
 * No restringe el alfabeto: la validación real la hace el servidor contra la BD.
 */
export function normalizeDigits(raw: string): string {
  let upper = raw.toUpperCase().trim();
  if (upper.startsWith('LEXI-')) upper = upper.slice(5);
  else if (upper.startsWith('LEXI')) upper = upper.slice(4);
  return upper.replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

/** Valor visual del input: inserta el guión tras el 4º dígito. */
export function displayValue(digits: string): string {
  return digits.length <= 4 ? digits : `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

/** Código completo con prefijo: LEXI-XXXX-XXXX. */
export function buildFullCode(digits: string): string {
  return `LEXI-${displayValue(digits)}`;
}

/** True si el código está completo (8 dígitos). */
export function isCodeComplete(digits: string): boolean {
  return digits.length === 8;
}

/** Normaliza un código arbitrario (URL, pegado) a formato LEXI-XXXX-XXXX. */
export function normalizeCode(raw: string): string {
  return buildFullCode(normalizeDigits(raw));
}

async function doClaim(code: string, deviceToken: string | null): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Device-Id': getUserId()
  };
  if (deviceToken) headers['X-Device-Token'] = deviceToken;
  try {
    headers['X-Device-Fingerprint'] = await getDeviceFingerprintAsync();
  } catch {
    /* fingerprint no disponible */
  }

  return fetch('/api/claim', {
    method: 'POST',
    headers,
    body: JSON.stringify({ code })
  });
}

/**
 * Envía el código al servidor y, si es válido, lo guarda localmente.
 * Si el servidor dice "ya usado" (409) y el dispositivo conserva el token o el
 * fingerprint, reintenta automáticamente (caso en el que el navegador perdió el
 * UUID y el mismo usuario recupera su dispositivo).
 */
export async function claimInviteCode(code: string): Promise<ClaimResult> {
  try {
    const savedToken = getDeviceToken();
    let res = await doClaim(code, savedToken);

    // Recuperación automática: 409 pero tenemos token/fingerprint
    if (res.status === 409) {
      res = await doClaim(code, savedToken);
    }

    if (res.ok) {
      const data = (await res.json()) as {
        mode?: 'full' | 'demo';
        token?: string;
        user?: string;
      };
      const mode = data.mode ?? 'full';
      const user = data.user ?? '';
      saveInviteCode(code.trim().toUpperCase());
      saveDeviceMode(mode);
      if (data.token) saveDeviceToken(data.token);
      if (user) saveUserName(user);
      return { ok: true, mode, user };
    }

    let message = 'No se pudo registrar el dispositivo.';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* sin cuerpo JSON */
    }
    return { ok: false, error: message };
  } catch {
    return { ok: false, error: 'Sin conexión. Inténtalo más tarde.' };
  }
}
