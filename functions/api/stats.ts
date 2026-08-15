import type { Env } from '../env';
import { getDeviceId, isDeviceRegistered } from '../lib/auth';

/**
 * GET /api/stats?days=14
 * Devuelve estadísticas agregadas del dispositivo desde D1:
 * - daily: actividad por día (últimos N días)
 * - topCards: top 10 tarjetas más pulsadas
 * - topCategories: categorías más usadas
 * - totals: contadores por verbo, custom vs TTS
 * - storage: uso de audio (device_usage)
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

  // Parsear parámetros
  const url = new URL(request.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '14', 10), 1), 90);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  // --- Actividad diaria (últimos N días) ---
  // Usamos strftime para agrupar por fecha UTC
  const dailyRes = await env.DB.prepare(
    `SELECT strftime('%Y-%m-%d', datetime(at/1000, 'unixepoch')) AS day,
            COUNT(*) AS count
     FROM events
     WHERE user_id = ? AND at >= ?
     GROUP BY day
     ORDER BY day`
  ).bind(deviceId, cutoff).all();

  const daily: { day: string; count: number }[] = (dailyRes.results as { day: string; count: number }[]) ?? [];

  // --- Totales por verbo ---
  const verbRes = await env.DB.prepare(
    `SELECT verb, COUNT(*) AS count
     FROM events
     WHERE user_id = ? AND at >= ?
     GROUP BY verb`
  ).bind(deviceId, cutoff).all();

  const verbTotals: Record<string, number> = {};
  for (const row of (verbRes.results as { verb: string; count: number }[] ?? [])) {
    verbTotals[row.verb] = row.count;
  }

  // --- Custom voice vs TTS (solo taps) ---
  // Un tap es "custom" si la tarjeta tiene audio_key != null
  const customRes = await env.DB.prepare(
    `SELECT COUNT(*) AS custom_count
     FROM events e
     JOIN cards c ON e.card_id = c.id
     WHERE e.user_id = ? AND e.verb = 'tap' AND e.at >= ? AND c.audio_key IS NOT NULL`
  ).bind(deviceId, cutoff).first<{ custom_count: number }>();

  const customCount = customRes?.custom_count ?? 0;
  const tapCount = verbTotals['tap'] ?? 0;
  const ttsCount = tapCount - customCount;

  // --- Top 10 tarjetas más pulsadas ---
  const topCardsRes = await env.DB.prepare(
    `SELECT e.card_id, c.label, c.image_key, c.category_id, cat.name AS category_name, cat.color AS category_color,
            COUNT(*) AS count
     FROM events e
     JOIN cards c ON e.card_id = c.id
     LEFT JOIN categories cat ON c.category_id = cat.id
     WHERE e.user_id = ? AND e.verb = 'tap' AND e.at >= ?
     GROUP BY e.card_id
     ORDER BY count DESC
     LIMIT 10`
  ).bind(deviceId, cutoff).all();

  const topCards: { card_id: string; label: string; image_key: string | null; category_id: string | null; category_name: string | null; category_color: string | null; count: number }[] =
    (topCardsRes.results as unknown as typeof topCards) ?? [];

  // --- Top categorías por uso ---
  const topCatsRes = await env.DB.prepare(
    `SELECT cat.id, cat.name, cat.color, COUNT(*) AS count
     FROM events e
     JOIN cards c ON e.card_id = c.id
     JOIN categories cat ON c.category_id = cat.id
     WHERE e.user_id = ? AND e.verb = 'tap' AND e.at >= ?
     GROUP BY cat.id
     ORDER BY count DESC
     LIMIT 10`
  ).bind(deviceId, cutoff).all();

  const topCategories: { id: string; name: string; color: string | null; count: number }[] =
    (topCatsRes.results as { id: string; name: string; color: string | null; count: number }[]) ?? [];

  // --- Almacenamiento (device_usage) ---
  const usageRes = await env.DB.prepare(
    'SELECT audio_count, audio_bytes FROM device_usage WHERE user_id = ?'
  ).bind(deviceId).first<{ audio_count: number; audio_bytes: number }>();

  const storage = {
    audio_count: usageRes?.audio_count ?? 0,
    audio_bytes: usageRes?.audio_bytes ?? 0
  };

  return Response.json({
    daily,
    verbTotals,
    topCards,
    topCategories,
    totals: {
      taps: tapCount,
      customVoice: customCount,
      tts: ttsCount,
      habla: verbTotals['hablar'] ?? 0,
      edita: verbTotals['editar'] ?? 0,
      totalEvents: daily.reduce((sum, d) => sum + d.count, 0)
    },
    storage,
    period: { days, cutoff }
  });
}
