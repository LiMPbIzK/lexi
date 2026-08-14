import type { Env } from '../env';
import { getDeviceId, isDeviceRegistered, getDeviceMode } from '../lib/auth';

interface SyncCategory {
  id: string;
  user_id: string | null;
  parent_id: string | null;
  name: string;
  color: string | null;
  icon_key: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

interface SyncCard {
  id: string;
  user_id: string | null;
  category_id: string | null;
  label: string;
  image_key: string | null;
  audio_key: string | null;
  tts_text: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

interface SyncEvent {
  id: string;
  user_id: string | null;
  card_id: string | null;
  verb: string;
  at: number;
}

interface SyncBody {
  categories?: SyncCategory[];
  cards?: SyncCard[];
  events?: SyncEvent[];
}

async function upsertCategory(env: Env, c: SyncCategory): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       parent_id = excluded.parent_id,
       name = excluded.name,
       color = excluded.color,
       icon_key = excluded.icon_key,
       sort_order = excluded.sort_order,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at
     WHERE excluded.updated_at >= categories.updated_at`
  )
    .bind(
      c.id,
      c.user_id,
      c.parent_id,
      c.name,
      c.color,
      c.icon_key,
      c.sort_order,
      c.created_at,
      c.updated_at,
      c.deleted_at
    )
    .run();
}

async function upsertCard(env: Env, c: SyncCard): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       category_id = excluded.category_id,
       label = excluded.label,
       image_key = excluded.image_key,
       audio_key = excluded.audio_key,
       tts_text = excluded.tts_text,
       sort_order = excluded.sort_order,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at
     WHERE excluded.updated_at >= cards.updated_at`
  )
    .bind(
      c.id,
      c.user_id,
      c.category_id,
      c.label,
      c.image_key,
      c.audio_key,
      c.tts_text,
      c.sort_order,
      c.created_at,
      c.updated_at,
      c.deleted_at
    )
    .run();
}

async function upsertEvent(env: Env, e: SyncEvent): Promise<void> {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO events (id, user_id, card_id, verb, at)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(e.id, e.user_id, e.card_id, e.verb, e.at)
    .run();
}

/**
 * POST /api/sync
 * Recibe los cambios del dispositivo (categorías, tarjetas, eventos) y los
 * persiste en D1 con last-writer-wins por updated_at (tombstones incluidos).
 * Solo dispositivos full registrados.
 */
export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  const deviceId = getDeviceId(request);
  if (!deviceId) {
    return Response.json({ error: 'Falta X-Device-Id.' }, { status: 400 });
  }
  if (!(await isDeviceRegistered(env, deviceId))) {
    return Response.json({ error: 'Dispositivo no registrado.' }, { status: 401 });
  }
  if ((await getDeviceMode(env, deviceId)) === 'demo') {
    return Response.json({ error: 'Modo demo: no se sincroniza.' }, { status: 403 });
  }

  let body: SyncBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Body JSON inválido.' }, { status: 400 });
  }

  // Limitar volumen por petición para evitar abusos
  const maxItems = 500;
  const categories = (body.categories ?? []).slice(0, maxItems);
  const cards = (body.cards ?? []).slice(0, maxItems);
  const events = (body.events ?? []).slice(0, maxItems);

  try {
    // La actualización del device en devices la hace el claim; aquí solo datos
    for (const c of categories) await upsertCategory(env, c);
    for (const c of cards) await upsertCard(env, c);
    for (const e of events) await upsertEvent(env, e);
  } catch (e) {
    console.error('sync error:', e);
    return Response.json({ error: 'Error al sincronizar.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}

/**
 * GET /api/sync
 * Devuelve categorías, tarjetas y eventos del dispositivo (restauración).
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
  if (!(await isDeviceRegistered(env, deviceId))) {
    return Response.json({ error: 'Dispositivo no registrado.' }, { status: 401 });
  }

  const categories = await env.DB.prepare(
    'SELECT * FROM categories WHERE user_id = ?'
  ).bind(deviceId).all();
  const cards = await env.DB.prepare(
    'SELECT * FROM cards WHERE user_id = ?'
  ).bind(deviceId).all();
  const events = await env.DB.prepare(
    'SELECT * FROM events WHERE user_id = ?'
  ).bind(deviceId).all();

  return Response.json({
    categories: categories.results,
    cards: cards.results,
    events: events.results
  });
}
