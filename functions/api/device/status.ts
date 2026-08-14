import type { Env } from '../../env';
import { getDeviceId, isDeviceRegistered, getDeviceMode } from '../../lib/auth';

/**
 * GET /api/device/status
 * Cabecera X-Device-Id: UUID del dispositivo.
 * Cabecera X-Device-Fingerprint: huella del dispositivo (opcional).
 * Devuelve el estado real del dispositivo según el servidor:
 * { registered: boolean, mode: 'full' | 'demo' | null, user?: string }
 * El cliente usa esto para saber si puede grabar y para mostrar el usuario.
 */
export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;
  const deviceId = getDeviceId(request);
  if (!deviceId) {
    return Response.json({ error: 'Falta X-Device-Id.' }, { status: 400 });
  }

  const registered = await isDeviceRegistered(env, deviceId);
  if (!registered) {
    return Response.json({ registered: false, mode: null, user: '' });
  }

  const mode = await getDeviceMode(env, deviceId);
  const device = await env.DB.prepare(
    'SELECT code FROM devices WHERE id = ?'
  )
    .bind(deviceId)
    .first<{ code: string | null }>();

  let user = '';
  if (device?.code) {
    const invite = await env.DB.prepare('SELECT user FROM invite_codes WHERE code = ?')
      .bind(device.code)
      .first<{ user: string }>();
    user = invite?.user ?? '';
  }

  return Response.json({ registered, mode, user });
}
