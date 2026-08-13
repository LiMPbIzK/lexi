// Helpers compartidos de las Functions.

import type { Env } from '../env';

export const DEVICE_HEADER = 'x-device-id';

/**
 * Devuelve el UUID del dispositivo o null si la cabecera falta/no es válida.
 * El UUID actúa como credencial débil para cuotas por dispositivo.
 */
export function getDeviceId(request: Request): string | null {
  const id = request.headers.get(DEVICE_HEADER);
  if (!id) return null;
  // formato UUID v4 (validación básica para evitar basura gigante)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }
  return id.toLowerCase();
}

export interface UsageRow {
  audio_count: number;
  audio_bytes: number;
}

/** Lee los acumulados de uso de un dispositivo. */
export async function getUsage(env: Env, deviceId: string): Promise<UsageRow> {
  const row = await env.DB.prepare(
    'SELECT audio_count, audio_bytes FROM device_usage WHERE user_id = ?'
  )
    .bind(deviceId)
    .first<{ audio_count: number; audio_bytes: number }>();
  return {
    audio_count: row?.audio_count ?? 0,
    audio_bytes: row?.audio_bytes ?? 0
  };
}

/** Suma bytes/contador a un dispositivo (para dar de alta o actualizar). */
export async function bumpUsage(env: Env, deviceId: string, bytes: number): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO device_usage (user_id, audio_count, audio_bytes, updated_at)
     VALUES (?, 1, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       audio_count = audio_count + 1,
       audio_bytes = audio_bytes + excluded.audio_bytes,
       updated_at = excluded.updated_at`
  )
    .bind(deviceId, bytes, Date.now())
    .run();
}

/** Resta bytes/contador a un dispositivo (al borrar un audio). */
export async function reduceUsage(env: Env, deviceId: string, bytes: number): Promise<void> {
  await env.DB.prepare(
    `UPDATE device_usage SET
       audio_count = MAX(0, audio_count - 1),
       audio_bytes = MAX(0, audio_bytes - ?),
       updated_at = ?
     WHERE user_id = ?`
  )
    .bind(bytes, Date.now(), deviceId)
    .run();
}

/** Nº de subidas del dispositivo en la última hora. */
export async function uploadsInLastHour(env: Env, deviceId: string): Promise<number> {
  const hourAgo = Date.now() - 3600_000;
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM recordings WHERE user_id = ? AND created_at > ?'
  )
    .bind(deviceId, hourAgo)
    .first<{ n: number }>();
  return row?.n ?? 0;
}
