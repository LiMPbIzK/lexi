import type { Env } from '../../env';

type Params = { key: string | string[] };

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'Access-Control-Allow-Origin': '*'
};

function joinKey(key: string | string[]): string {
  return Array.isArray(key) ? key.join('/') : key;
}

/**
 * GET /api/audio/*    -> sirve el objeto R2 como stream (mismo origen).
 * DELETE /api/audio/* -> borra el objeto R2.
 */
export async function onRequestGet(context: {
  env: Env;
  params: Params;
}): Promise<Response> {
  const { env, params } = context;
  const object = await env.BUCKET.get(joinKey(params.key));

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
  env: Env;
  params: Params;
}): Promise<Response> {
  const { env, params } = context;
  await env.BUCKET.delete(joinKey(params.key));
  return new Response(null, { status: 204 });
}
