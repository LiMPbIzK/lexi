import type { Env } from '../env';
import { getUsage, bumpUsage, uploadsInLastHour } from '../lib/usage';
import { getDeviceId, isDeviceRegistered, getDeviceMode } from '../lib/auth';

export const config = {
  // límite de cuerpo para evitar peticiones enormes
  body: 15 * 1024 * 1024
};

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIME = new Set([
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/aac',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav'
]);

interface UploadResponse {
  key: string;
  mime: string;
  size: number;
}

function extFor(mime: string): string {
  if (mime.includes('webm')) return 'webm';
  if (mime.includes('mp4') || mime.includes('aac')) return 'm4a';
  if (mime.includes('mpeg') || mime.includes('mp3')) return 'mp3';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('wav')) return 'wav';
  return 'bin';
}

/**
 * POST /api/upload
 * Cabecera X-Device-Id: UUID del dispositivo (obligatoria).
 * Body: blob de audio bruto (WebM/Opus, MP4/AAC, ...).
 * Aplica cuota por dispositivo y rate limit por hora.
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

  // Solo dispositivos registrados (canje de código de invitación)
  if (!(await isDeviceRegistered(env, deviceId))) {
    return Response.json(
      { error: 'Dispositivo no registrado. Introduce un código de invitación.' },
      { status: 401 }
    );
  }

  // El modo demo es solo lectura: no se puede grabar
  if ((await getDeviceMode(env, deviceId)) === 'demo') {
    return Response.json(
      { error: 'Modo demo: no se permite grabar audio.' },
      { status: 403 }
    );
  }

  const contentType = (request.headers.get('content-type') || 'audio/webm')
    .split(';')[0]
    .trim()
    .toLowerCase();

  if (!ALLOWED_MIME.has(contentType)) {
    return Response.json(
      { error: `Tipo de contenido no permitido: ${contentType}` },
      { status: 415 }
    );
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_SIZE) {
    return Response.json(
      { error: 'El archivo supera el tamaño máximo de 15 MB' },
      { status: 413 }
    );
  }

  // Duración máxima por grabación (fallback robusto si la var no llega tipada)
  const durationMs = Number(request.headers.get('x-duration-ms') || 0);
  const maxRecordingMs = Number(env.MAX_RECORDING_MS) > 0 ? Number(env.MAX_RECORDING_MS) : 30000;
  if (durationMs > maxRecordingMs) {
    return Response.json(
      { error: 'La grabación supera la duración máxima permitida.' },
      { status: 413 }
    );
  }

  // Cuota por dispositivo
  const usage = await getUsage(env, deviceId);
  if (usage.audio_count >= env.MAX_AUDIO_PER_DEVICE) {
    return Response.json(
      { error: 'Límite de grabaciones alcanzado para este dispositivo.' },
      { status: 429 }
    );
  }
  if (usage.audio_bytes + contentLength > env.MAX_BYTES_PER_DEVICE) {
    return Response.json(
      { error: 'Almacenamiento máximo alcanzado para este dispositivo.' },
      { status: 429 }
    );
  }

  // Rate limit por hora
  const recent = await uploadsInLastHour(env, deviceId);
  if (recent >= env.MAX_UPLOADS_PER_HOUR) {
    return Response.json(
      { error: 'Demasiadas subidas en la última hora.' },
      { status: 429 }
    );
  }

  const key = `audio/${crypto.randomUUID()}.${extFor(contentType)}`;
  const createdAt = Date.now();

  try {
    await env.BUCKET.put(key, request.body, {
      httpMetadata: { contentType }
    });
  } catch {
    return Response.json(
      { error: 'Error al guardar el audio en R2' },
      { status: 500 }
    );
  }

  // Registrar en D1 (para cuotas y propiedad)
  try {
    // alta/actualización del perfil del dispositivo (FK de recordings)
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO users (id, display_name, locale, voice_uri, theme, created_at, last_seen_at)
       VALUES (?, NULL, 'es', NULL, 'neutral', ?, ?)
       ON CONFLICT(id) DO UPDATE SET last_seen_at = excluded.last_seen_at`
    )
      .bind(deviceId, now, now)
      .run();

    await env.DB.prepare(
      `INSERT INTO recordings (id, user_id, card_id, key, mime, duration_ms, created_at, size_bytes)
       VALUES (?, ?, NULL, ?, ?, ?, ?, ?)`
    )
      .bind(crypto.randomUUID(), deviceId, key, contentType, durationMs || null, createdAt, contentLength)
      .run();
    await bumpUsage(env, deviceId, contentLength);
  } catch {
    // si falla D1, borramos el objeto R2 para no dejar huérfanos
    await env.BUCKET.delete(key);
    return Response.json(
      { error: 'Error al registrar la grabación' },
      { status: 500 }
    );
  }

  const body: UploadResponse = { key, mime: contentType, size: contentLength };
  return Response.json(body, { status: 201 });
}
