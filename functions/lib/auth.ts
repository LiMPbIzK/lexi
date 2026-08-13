// Autenticación por códigos de invitación (alta manual) + modo demo.
// La API solo acepta dispositivos registrados que hayan canjeado un código.

import type { Env } from '../env';

export const DEVICE_HEADER = 'x-device-id';
export const TOKEN_HEADER = 'x-device-token';

// Código demo compartible: registra el dispositivo en modo solo lectura.
export const DEMO_CODE = 'LEXI-DEMO-CODE';
export const DEMO_LABEL = 'Demo';

export type DeviceMode = 'full' | 'demo';

export type ClaimStatus = 'ok' | 'invalid' | 'used' | 'revoked' | 'conflict';

export interface ClaimResult {
  status: ClaimStatus;
  mode: DeviceMode;
  token?: string;
}

function newToken(): string {
  return crypto.randomUUID();
}

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

/** Token de recuperación enviado por el cliente (puede estar vacío). */
export function getDeviceToken(request: Request): string | null {
  const t = request.headers.get(TOKEN_HEADER);
  if (!t) return null;
  return /^[0-9a-f-]{8,64}$/i.test(t) ? t.toLowerCase() : null;
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
 * - Para códigos full: si el código ya está reclamado por OTRO device y el
 *   cliente presenta el `device_token` que coincide con el de ese device,
 *   se permite la RECUPERACIÓN: se re-vincula el código a este dispositivo.
 * Devuelve { status, mode, token? }.
 */
export async function claimCode(
  env: Env,
  code: string,
  deviceId: string,
  deviceToken: string | null = null
): Promise<ClaimResult> {
  const normalized = code.trim().toUpperCase();

  // Código demo: siempre válido y compartible (sin fila en invite_codes)
  if (normalized === DEMO_CODE) {
    const now = Date.now();
    try {
      await env.DB.prepare(
        `INSERT INTO devices (id, code, label, created_at, last_seen_at, mode, device_token)
         VALUES (?, NULL, ?, ?, ?, 'demo', ?)
         ON CONFLICT(id) DO UPDATE SET
           code = NULL,
           label = excluded.label,
           mode = 'demo',
           device_token = excluded.device_token,
           last_seen_at = excluded.last_seen_at`
      ).bind(deviceId, DEMO_LABEL, now, now, newToken()).run();
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

  // Recuperación: el código está reclamado por otro device, pero el cliente
  // presenta el token de ese device -> es el mismo usuario recuperando.
  if (row.claimed_by && row.claimed_by !== deviceId) {
    if (!deviceToken) return { status: 'used', mode: 'full' };

    const owner = await env.DB.prepare(
      'SELECT device_token FROM devices WHERE id = ?'
    )
      .bind(row.claimed_by)
      .first<{ device_token: string | null }>();

    if (!owner?.device_token || owner.device_token !== deviceToken) {
      return { status: 'used', mode: 'full' };
    }

    // token válido: re-vincular el código a este dispositivo.
    // Se transfieren grabaciones/uso del antiguo device a este.
    const now = Date.now();
    try {
      await env.DB.batch([
        env.DB.prepare(
          'UPDATE recordings SET user_id = ? WHERE user_id = ?'
        ).bind(deviceId, row.claimed_by),
        env.DB.prepare(
          'UPDATE device_usage SET user_id = ? WHERE user_id = ?'
        ).bind(deviceId, row.claimed_by),
        env.DB.prepare('DELETE FROM devices WHERE id = ?').bind(row.claimed_by),
        env.DB.prepare(
          'UPDATE invite_codes SET claimed_by = ?, claimed_at = ? WHERE code = ?'
        ).bind(deviceId, now, normalized),
        env.DB.prepare(
          `INSERT INTO devices (id, code, label, created_at, last_seen_at, mode, device_token)
           VALUES (?, ?, ?, ?, ?, 'full', ?)
           ON CONFLICT(id) DO UPDATE SET
             code = excluded.code,
             label = excluded.label,
             mode = 'full',
             device_token = excluded.device_token,
             last_seen_at = excluded.last_seen_at`
        ).bind(deviceId, normalized, row.label, now, now, deviceToken)
      ]);
    } catch {
      return { status: 'conflict', mode: 'full' };
    }
    return { status: 'ok', mode: 'full', token: deviceToken };
  }

  // Claim normal o re-claim del mismo dispositivo
  const now = Date.now();
  const token = newToken();
  try {
    await env.DB.batch([
      env.DB.prepare(
        'UPDATE invite_codes SET claimed_by = ?, claimed_at = ? WHERE code = ?'
      ).bind(deviceId, now, normalized),
      env.DB.prepare(
        `INSERT INTO devices (id, code, label, created_at, last_seen_at, mode, device_token)
         VALUES (?, ?, ?, ?, ?, 'full', ?)
         ON CONFLICT(id) DO UPDATE SET
           code = excluded.code,
           label = excluded.label,
           mode = 'full',
           device_token = excluded.device_token,
           last_seen_at = excluded.last_seen_at`
      ).bind(deviceId, normalized, row.label, now, now, token)
    ]);
  } catch {
    return { status: 'conflict', mode: 'full' };
  }
  return { status: 'ok', mode: 'full', token };
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
