// Seed del catálogo ARASAAC desde el manifest estático (offline-first).
// Se ejecuta una única vez; se marca con una clave en localStorage.

import { bulkPut } from './db';
import type { ArasaacManifest, Card, Category } from './types';

const SEED_KEY = 'lexi:arasaac-seeded';

export function isSeeded(): boolean {
  return localStorage.getItem(SEED_KEY) === '1';
}

function now(): number {
  return Date.now();
}

export async function seedArasaac(manifest: ArasaacManifest): Promise<void> {
  if (isSeeded()) return;

  const cats: Category[] = [];
  const cards: Card[] = [];

  manifest.categories.forEach((cat, catIndex) => {
    const category: Category = {
      id: `arasaac-cat-${cat.slug}`,
      user_id: null,
      parent_id: null,
      name: cat.label,
      color: cat.color,
      icon_key: cat.emoji,
      sort_order: catIndex,
      created_at: now(),
      updated_at: now(),
      deleted_at: null
    };
    cats.push(category);

    cat.cards.forEach((card, cardIndex) => {
      cards.push({
        id: `arasaac-card-${cat.slug}-${card.id}`,
        user_id: null,
        category_id: category.id,
        label: card.label,
        image_key: `assets/arasaac/${card.id}.png`,
        audio_key: null,
        tts_text: card.label,
        sort_order: cardIndex,
        created_at: now(),
        updated_at: now(),
        deleted_at: null
      });
    });
  });

  await bulkPut('categories', cats);
  await bulkPut('cards', cards);
  localStorage.setItem(SEED_KEY, '1');
}
