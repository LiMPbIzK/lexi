import type { Env } from '../env';

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
 * Body: blob de audio bruto (WebM/Opus, MP4/AAC, ...).
 * Header Content-Type debe indicar el mime del audio.
 * Devuelve { key, mime, size } con la clave R2 generada.
 */
export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

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

  const key = `audio/${crypto.randomUUID()}.${extFor(contentType)}`;

  try {
    await env.BUCKET.put(key, request.body, {
      httpMetadata: { contentType }
    });
  } catch (e) {
    return Response.json(
      { error: 'Error al guardar el audio en R2' },
      { status: 500 }
    );
  }

  const body: UploadResponse = { key, mime: contentType, size: contentLength };
  return Response.json(body, { status: 201 });
}
