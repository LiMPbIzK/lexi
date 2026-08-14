import type { Env } from '../../env';
import { getDeviceId, isDeviceRegistered, getDeviceMode } from '../../lib/auth';

/**
 * GET /api/device/status
 * Cabecera X-Device-Id: UUID del dispositivo.
 * Devuelve el estado real del dispositivo según el servidor:
 * { registered: boolean, mode: 'full' | 'demo' | null }
 * El cliente usa esto para saber si puede grabar, sin fiarse solo de localStorage.
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
  const mode = registered ? await getDeviceMode(env, deviceId) : null;

  return Response.json({ registered, mode });
}
