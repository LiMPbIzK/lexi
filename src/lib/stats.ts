// Helpers de estadísticas: agregación local (offline) + fetch del servidor.

import { db } from './db';
import { getUserId } from './user';
import type { RecordItem, Card } from './types';

export interface DailyStat {
  day: string; // YYYY-MM-DD
  count: number;
}

export interface TopCardStat {
  card_id: string;
  label: string;
  image_key: string | null;
  category_name: string | null;
  count: number;
}

export interface TopCategoryStat {
  name: string;
  count: number;
}

export interface StatsTotals {
  taps: number;
  customVoice: number;
  tts: number;
  habla: number;
  edita: number;
  totalEvents: number;
}

export interface StorageInfo {
  audio_count: number;
  audio_bytes: number;
}

export interface StatsResult {
  daily: DailyStat[];
  topCards: TopCardStat[];
  topCategories: TopCategoryStat[];
  totals: StatsTotals;
  storage: StorageInfo;
  source: 'server' | 'local';
}

// ---------------------------------------------------------------
// Agregación local (IndexedDB) — fallback offline
// ---------------------------------------------------------------

function msToDay(ts: number): string {
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

function fillMissingDays(daily: DailyStat[], days: number): DailyStat[] {
  const result: DailyStat[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now - i * 86400000).toISOString().slice(0, 10);
    const existing = daily.find((d) => d.day === day);
    result.push(existing ?? { day, count: 0 });
  }
  return result;
}

export async function aggregateLocalEvents(days: number = 14): Promise<StatsResult> {
  const events = await db.getAllEvents();
  const allCards = await db.getAllCards();
  const cardMap = new Map<string, Card>(allCards.map((c) => [c.id, c]));

  const cutoff = Date.now() - days * 86400000;
  const recent = events.filter((e) => e.at >= cutoff);

  // Daily buckets
  const dayMap = new Map<string, number>();
  for (const e of recent) {
    const day = msToDay(e.at);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }
  const daily: DailyStat[] = Array.from(dayMap.entries()).map(([day, count]) => ({ day, count }));
  daily.sort((a, b) => a.day.localeCompare(b.day));

  // Totals by verb
  const verbMap = new Map<string, number>();
  for (const e of recent) {
    verbMap.set(e.verb, (verbMap.get(e.verb) ?? 0) + 1);
  }
  const taps = verbMap.get('tap') ?? 0;
  const habla = verbMap.get('hablar') ?? 0;
  const edita = verbMap.get('editar') ?? 0;

  // Custom voice vs TTS
  let customVoice = 0;
  const tapEvents = recent.filter((e) => e.verb === 'tap' && e.card_id);
  for (const e of tapEvents) {
    const card = cardMap.get(e.card_id!);
    if (card?.audio_key) customVoice++;
  }

  // Top cards
  const cardCount = new Map<string, number>();
  for (const e of tapEvents) {
    if (e.card_id) cardCount.set(e.card_id, (cardCount.get(e.card_id) ?? 0) + 1);
  }
  const topCards: TopCardStat[] = Array.from(cardCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => {
      const card = cardMap.get(id);
      return {
        card_id: id,
        label: card?.label ?? id.slice(0, 8),
        image_key: card?.image_key ?? null,
        category_name: null,
        count
      };
    });

  // Top categories (approximate: count cards per category that were tapped)
  const catCount = new Map<string, number>();
  for (const e of tapEvents) {
    if (e.card_id) {
      const card = cardMap.get(e.card_id);
      if (card?.category_id) {
        catCount.set(card.category_id, (catCount.get(card.category_id) ?? 0) + 1);
      }
    }
  }
  // We don't have category names locally easily without loading categories; use placeholder
  const topCategories: TopCategoryStat[] = Array.from(catCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([_id, count]) => ({ name: '—', count }));

  // Storage: pending uploads count
  const pendings = await db.getPendingUploads();
  const storage: StorageInfo = {
    audio_count: pendings.length,
    audio_bytes: 0
  };

  return {
    daily: fillMissingDays(daily, days),
    topCards,
    topCategories,
    totals: {
      taps,
      customVoice,
      tts: taps - customVoice,
      habla,
      edita,
      totalEvents: recent.length
    },
    storage,
    source: 'local'
  };
}

// ---------------------------------------------------------------
// Fetch desde servidor (D1) — fuente de verdad con historial completo
// ---------------------------------------------------------------

export async function fetchStats(days: number = 14): Promise<StatsResult | null> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return null;

  try {
    const headers: Record<string, string> = { 'X-Device-Id': getUserId() };
    const res = await fetch(`/api/stats?days=${days}`, { headers });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      daily: data.daily ?? [],
      topCards: data.topCards ?? [],
      topCategories: data.topCategories ?? [],
      totals: data.totals ?? { taps: 0, customVoice: 0, tts: 0, habla: 0, edita: 0, totalEvents: 0 },
      storage: data.storage ?? { audio_count: 0, audio_bytes: 0 },
      source: 'server'
    };
  } catch {
    return null;
  }
}

/** Intenta obtener stats del servidor; si falla, usa agregación local. */
export async function getStats(days: number = 14): Promise<StatsResult> {
  const server = await fetchStats(days);
  if (server) return server;
  return aggregateLocalEvents(days);
}

/** Formatea bytes a cadena legible. */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
