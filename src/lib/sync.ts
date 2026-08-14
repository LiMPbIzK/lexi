// Sincronización offline-first entre IndexedDB (fuente de verdad local) y D1.
// Push: sube los datos del dispositivo (categorías, tarjetas, eventos) con
// last-writer-wins. Pull: restaura los datos del dispositivo en otro navegador.
// El catálogo global ARASAAC (user_id = null) es estático y no se sincroniza.

import { db } from './db';
import { getUserId } from './user';
import { getCachedFingerprint } from './fingerprint';
import { uploadAudio } from './audio';
import type { Card } from './types';

let syncing = false;

function syncHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'X-Device-Id': getUserId() };
  const fp = getCachedFingerprint();
  if (fp) headers['X-Device-Fingerprint'] = fp;
  return headers;
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

/** Sube los datos del dispositivo a D1. Devuelve true si OK. */
export async function pushNow(): Promise<boolean> {
  if (!isOnline()) return false;

  const userId = getUserId();
  const [categories, cards, events] = await Promise.all([
    db.getAllCategories(),
    db.getAllCards(),
    db.getAllEvents()
  ]);

  // Solo los datos del dispositivo (user_id = este device)
  const myCategories = categories.filter((c) => c.user_id === userId);
  const myCards = cards.filter((c) => c.user_id === userId);
  const myEvents = events.filter((e) => e.user_id === userId);

  if (myCategories.length === 0 && myCards.length === 0 && myEvents.length === 0) {
    return true;
  }

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { ...syncHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categories: myCategories,
        cards: myCards,
        events: myEvents
      })
    });
    if (!res.ok) return false;

    // Limpiar eventos ya subidos (no se re-sincronizan)
    if (myEvents.length > 0) {
      await db.clearEvents();
    }
    return true;
  } catch {
    return false;
  }
}

/** Baja y restaura los datos del dispositivo en IndexedDB. Devuelve true si OK. */
export async function pullNow(): Promise<boolean> {
  if (!isOnline()) return false;

  const userId = getUserId();
  try {
    const res = await fetch('/api/sync', { headers: syncHeaders() });
    if (!res.ok) return false;

    const data = (await res.json()) as {
      categories: import('./types').Category[];
      cards: import('./types').Card[];
      events: import('./types').RecordItem[];
    };

    // Restaurar categorías y tarjetas del dispositivo (LWW por updated_at local)
    if (data.categories.length > 0) {
      await db.restoreCategories(data.categories.filter((c) => c.user_id === userId));
    }
    if (data.cards.length > 0) {
      await db.restoreCards(data.cards.filter((c) => c.user_id === userId));
    }

    return true;
  } catch {
    return false;
  }
}

/** Sube los blobs de audio pendientes a R2 y actualiza las tarjetas. */
async function flushPendingUploads(): Promise<void> {
  if (!isOnline()) return;

  const pendings = await db.getPendingUploads();
  for (const p of pendings) {
    try {
      const res = await uploadAudio(p.blob, p.durationMs);
      if (res.ok && res.key) {
        // actualizar la tarjeta que referencia este upload pendiente
        const allCards = await db.getAllCards();
        const card = allCards.find((c) => c.audio_key === p.key);
        if (card) {
          const updated: Card = { ...card, audio_key: res.key, updated_at: Date.now() };
          await db.putCard(updated);
        }
        await db.removePendingUpload(p.id);
      }
    } catch {
      /* reintentar en el siguiente sync */
    }
  }
}

/** Push + pull + subida de audio pendiente. Devuelve true si el push fue OK. */
export async function syncNow(): Promise<boolean> {
  if (syncing) return false;
  syncing = true;
  try {
    await flushPendingUploads();
    const pushed = await pushNow();
    await pullNow();
    return pushed;
  } finally {
    syncing = false;
  }
}

/** Registra el manejo de eventos de red (reintento al volver a estar online). */
export function setupSyncListeners(onSynced?: () => void): void {
  if (typeof window === 'undefined') return;

  const attempt = () => {
    void syncNow().then((ok) => {
      if (ok) onSynced?.();
    });
  };

  window.addEventListener('online', attempt);

  // Background Sync (si el navegador lo soporta)
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    void navigator.serviceWorker.ready.then(async (reg) => {
      try {
        await (reg as unknown as { sync: { register: (t: string) => Promise<void> } }).sync.register('lexi-sync');
      } catch {
        /* no soportado */
      }
    });
  }
}
