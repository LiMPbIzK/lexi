// Autenticación por códigos de invitación (alta manual) + modo demo.
// La API solo acepta dispositivos registrados que hayan canjeado un código.

import type { Env } from '../env';

export const DEVICE_HEADER = 'x-device-id';

// Código demo compartible: registra el dispositivo en modo solo lectura.
export const DEMO_CODE = 'LEXI-DEMO-CODE';
export const DEMO_LABEL = 'Demo';

export type DeviceMode = 'full' | 'demo';

/**
 * Devuelve el UUID del dispositivo o null si la cabecera falta/no es válida.
 */
export function getDeviceId(request: Request): string | null {
  const id = request.headers.get(DEVICE_HEADER);
  if (!id) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }
  return id.toLowerCase();
}

/** Indica si el dispositivo está registrado (ha canjeado un código). */
export async function isDeviceRegistered(env: Env, deviceId: string): Promise<boolean> {
  const row = await env.DB.prepare('SELECT id FROM devices WHERE id = ?')
    .bind(deviceId)
    .first();
  return row !== null;
}

/** Devuelve el modo de un dispositivo registrado, o null si no existe. */
export async function getDeviceMode(env: Env, deviceId: string): Promise<DeviceMode | null> {
  const row = await env.DB.prepare('SELECT mode FROM devices WHERE id = ?')
    .bind(deviceId)
    .first<{ mode: DeviceMode }>();
  return row?.mode ?? null;
}

/**
 * Intenta canjear un código de invitación para este dispositivo.
 * Devuelve { status, mode }.
 * status: 'ok' | 'invalid' | 'used' | 'revoked' | 'conflict'
 * mode: 'full' | 'demo'
 */
export async function claimCode(
  env: Env,
  code: string,
  deviceId: string
): Promise<{ status: 'ok' | 'invalid' | 'used' | 'revoked' | 'conflict'; mode: DeviceMode }> {
  const normalized = code.trim().toUpperCase();

  // Código demo: siempre válido y compartible (sin fila en invite_codes)
  if (normalized === DEMO_CODE) {
    const now = Date.now();
    try {
      // code = NULL: la columna es UNIQUE y el demo es compartible entre muchos
      // dispositivos, así que no podemos reutilizar 'LEXI-DEMO-CODE' como clave.
      // Al hacer conflict se resetea el modo a demo (permite volver a demo).
      await env.DB.prepare(
        `INSERT INTO devices (id, code, label, created_at, last_seen_at, mode)
         VALUES (?, NULL, ?, ?, ?, 'demo')
         ON CONFLICT(id) DO UPDATE SET
           code = NULL,
           label = excluded.label,
           mode = 'demo',
           last_seen_at = excluded.last_seen_at`
      ).bind(deviceId, DEMO_LABEL, now, now).run();
    } catch (e) {
      console.error('claim demo error:', e);
      return { status: 'conflict', mode: 'demo' };
    }
    return { status: 'ok', mode: 'demo' };
  }

  if (!/^[A-Z0-9-]{4,40}$/.test(normalized)) return { status: 'invalid', mode: 'full' };

  const row = await env.DB.prepare(
    'SELECT code, claimed_by, label, revoked_at FROM invite_codes WHERE code = ?'
  )
    .bind(normalized)
    .first<{ code: string; claimed_by: string | null; label: string; revoked_at: number | null }>();

  if (!row) return { status: 'invalid', mode: 'full' };

  if (row.revoked_at) return { status: 'revoked', mode: 'full' };

  if (row.claimed_by && row.claimed_by !== deviceId) {
    return { status: 'used', mode: 'full' };
  }

  const now = Date.now();
  try {
    await env.DB.batch([
      env.DB.prepare(
        'UPDATE invite_codes SET claimed_by = ?, claimed_at = ? WHERE code = ?'
      ).bind(deviceId, now, normalized),
      env.DB.prepare(
        `INSERT INTO devices (id, code, label, created_at, last_seen_at, mode)
         VALUES (?, ?, ?, ?, ?, 'full')
         ON CONFLICT(id) DO UPDATE SET
           code = excluded.code,
           label = excluded.label,
           mode = 'full',
           last_seen_at = excluded.last_seen_at`
      ).bind(deviceId, normalized, row.label, now, now)
    ]);
  } catch {
    return { status: 'conflict', mode: 'full' };
  }
  return { status: 'ok', mode: 'full' };
}

/** Revoca un código (si existe y no está revocado ya). Devuelve true si se revocó. */
export async function revokeCode(env: Env, code: string): Promise<boolean> {
  const normalized = code.trim().toUpperCase();
  const res = await env.DB.prepare(
    'UPDATE invite_codes SET revoked_at = ? WHERE code = ? AND revoked_at IS NULL'
  )
    .bind(Date.now(), normalized)
    .run();
  return res.meta.changes > 0;
}
