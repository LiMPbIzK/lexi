import type { Env } from '../../env';
import { reduceUsage } from '../../lib/usage';
import { getDeviceId, isDeviceRegistered } from '../../lib/auth';

type Params = { key: string | string[] };

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable'
};

function joinKey(key: string | string[]): string {
  return Array.isArray(key) ? key.join('/') : key;
}

/**
 * Verifica que el dispositivo esté registrado y que el objeto le pertenezca.
 */
async function ownedRecording(
  env: Env,
  deviceId: string | null,
  key: string
): Promise<{ user_id: string; size_bytes: number } | null> {
  if (!deviceId) return null;
  if (!(await isDeviceRegistered(env, deviceId))) return null;
  const rec = await env.DB.prepare(
    'SELECT user_id, size_bytes FROM recordings WHERE key = ?'
  )
    .bind(key)
    .first<{ user_id: string | null; size_bytes: number | null }>();
  if (!rec?.user_id || rec.user_id !== deviceId) return null;
  return { user_id: rec.user_id, size_bytes: rec.size_bytes ?? 0 };
}

/**
 * GET /api/audio/* -> sirve el objeto R2 como stream (solo propietario).
 * DELETE /api/audio/* -> borra el objeto R2 y su registro (solo propietario).
 */
export async function onRequestGet(context: {
  request: Request;
  env: Env;
  params: Params;
}): Promise<Response> {
  const { request, env, params } = context;
  const key = joinKey(params.key);
  const deviceId = getDeviceId(request);

  const rec = await ownedRecording(env, deviceId, key);
  if (!rec) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.BUCKET.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', CACHE_HEADERS['Cache-Control']);

  return new Response(object.body, { headers });
}

export async function onRequestDelete(context: {
  request: Request;
  env: Env;
  params: Params;
}): Promise<Response> {
  const { request, env, params } = context;
  const key = joinKey(params.key);
  const deviceId = getDeviceId(request);

  const rec = await ownedRecording(env, deviceId, key);
  if (!rec || !deviceId) {
    return new Response('Not found', { status: 404 });
  }

  await env.BUCKET.delete(key);
  await env.DB.prepare('DELETE FROM recordings WHERE key = ?').bind(key).run();
  await reduceUsage(env, deviceId, rec.size_bytes);

  return new Response(null, { status: 204 });
}
