import type { Env } from '../env';
import { getDeviceId, getDeviceToken, claimCode } from '../lib/auth';

/**
 * POST /api/claim
 * Body: { "code": "LEXI-XXXX" }
 * Cabecera X-Device-Id: UUID del dispositivo (obligatoria).
 * Cabecera X-Device-Token: token de recuperación (opcional, para re-claim).
 * Devuelve { ok, mode, token }.
 */
export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  const deviceId = getDeviceId(request);
  if (!deviceId) {
    return Response.json(
      { error: 'Falta la cabecera X-Device-Id con un UUID válido.' },
      { status: 400 }
    );
  }

  const deviceToken = getDeviceToken(request);

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Body JSON inválido.' }, { status: 400 });
  }

  const code = typeof body.code === 'string' ? body.code : '';
  const { status, mode, token } = await claimCode(env, code, deviceId, deviceToken);

  switch (status) {
    case 'ok':
      return Response.json({ ok: true, mode, token }, { status: 200 });
    case 'invalid':
      return Response.json({ error: 'Código de invitación no válido.' }, { status: 404 });
    case 'used':
      return Response.json(
        { error: 'Este código ya está siendo usado por otro dispositivo.' },
        { status: 409 }
      );
    case 'revoked':
      return Response.json(
        { error: 'Este código de invitación ha sido revocado.' },
        { status: 403 }
      );
    case 'conflict':
      return Response.json({ error: 'Error al registrar el dispositivo.' }, { status: 500 });
  }
}
