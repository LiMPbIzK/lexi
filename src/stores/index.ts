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
