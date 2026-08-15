// Stores globales (nanostores) compartidos entre islas Svelte.
// NOTA: en Svelte 5 el prefijo `$` está reservado; los stores se nombran sin él.

import { atom } from 'nanostores';
import type { ArasaacManifest, Card, Category } from '../lib/types';

// Manifest ARASAAC cargado (para el seed de primera vez)
export const manifest = atom<ArasaacManifest | null>(null);

// Categorías del catálogo (globales + del usuario)
export const categories = atom<Category[]>([]);

// Categoría activa en el grid
export const activeCategoryId = atom<string | null>(null);

// Tarjetas de la categoría activa
export const cards = atom<Card[]>([]);

// --- Frase / teclado ---

export interface SentenceWord {
  text: string;
  source: 'card' | 'keyboard';
  /** true si la palabra proviene de una tarjeta con voz personalizada grabada */
  customVoice?: boolean;
  /** clave R2 del audio grabado (si la tarjeta tiene voz personalizada) */
  audioKey?: string | null;
  /** id de la tarjeta de la que proviene (solo si source === 'card') */
  cardId?: string | null;
}

// Palabras encoladas para reproducir
export const sentence = atom<SentenceWord[]>([]);

// Panel de teclado visible
export const keyboardOpen = atom<boolean>(false);

// Reproducción de voz en curso (para activar/desactivar el botón Parar)
export const speaking = atom<boolean>(false);

// --- Voz TTS ---

export const voices = atom<{ uri: string; name: string; lang: string; local: boolean }[]>([]);
export const voiceUri = atom<string | null>(null);

// Velocidad de reproducción TTS (1 | 1.5 | 2)
export const rate = atom<number>(1.5);

// Flag de cancelación de la reproducción de frase (botón Parar)
export const playbackStop = atom<boolean>(false);

// Reproducción de frase EN CURSO (true desde que se pulsa Hablar hasta que
// termina o se para). El botón Parar se habilita según esto, no según
// `speaking` (que parpadea entre utterances y causa el botón deshabilitado).
export const reproducing = atom<boolean>(false);

// --- Estado de dispositivo (compartido entre islas) ---
// 'full' | 'demo' | null. Lo escriben ClaimDialog (al canjear) y CardGrid
// (al refrescar), para que el grid reaccione al cambio de modo sin re-montar.
export const deviceMode = atom<'full' | 'demo' | null>(null);

// Nombre de usuario del código canjeado (para "Bienvenido, {user}")
export const userName = atom<string | null>(null);

// --- Estado de sincronización ---

export const syncState = atom<'idle' | 'syncing' | 'ok' | 'error'>('idle');
export const lastSyncAt = atom<number | null>(null);

/**
 * Re-sincroniza las palabras de la frase contra el estado actual de las tarjetas.
 * Si una tarjeta perdió su audio personalizado, la palabra deja de estar marcada
 * como custom y se reproducirá con TTS. Se usa tras cargar/editar tarjetas.
 */
export function syncSentenceWithCards(cards: Card[]): void {
  const cur = sentence.get();
  const byId = new Map(cards.map((c) => [c.id, c]));
  let changed = false;

  const next = cur.map((w) => {
    if (w.source !== 'card' || !w.cardId) return w;
    const card = byId.get(w.cardId);
    if (!card) return w;
    const customVoice = !!card.audio_key;
    const audioKey = card.audio_key ?? null;
    if (w.customVoice !== customVoice || w.audioKey !== audioKey) {
      changed = true;
      return { ...w, customVoice, audioKey };
    }
    return w;
  });

  if (changed) sentence.set(next);
}
