// Capa de persistencia offline (IndexedDB vía `idb`).
// IndexedDB es la fuente de verdad del día a día; D1 es el backup/sync.

import { openDB, type IDBPDatabase } from 'idb';
import type { Card, Category, RecordItem, User } from './types';

const DB_NAME = 'lexi';
const DB_VERSION = 2;

export interface LexiSchema {
  users: User;
  categories: Category;
  cards: Card;
  events: RecordItem;
}

let dbPromise: Promise<IDBPDatabase<LexiSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<LexiSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<LexiSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, _oldVersion, _newVersion, transaction) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('categories')) {
          const s = db.createObjectStore('categories', { keyPath: 'id' });
          s.createIndex('by_user_sort', ['user_id', 'sort_order']);
        }
        if (!db.objectStoreNames.contains('cards')) {
          const s = db.createObjectStore('cards', { keyPath: 'id' });
          s.createIndex('by_category', 'category_id');
          s.createIndex('by_user', 'user_id');
        } else {
          // v1 usaba índice compuesto ['category_id','sort_order'] que no se
          // puede consultar con clave única; lo sustituimos por índice simple.
          const s = transaction.objectStore('cards');
          if (s.indexNames.contains('by_category')) s.deleteIndex('by_category');
          s.createIndex('by_category', 'category_id');
          if (!s.indexNames.contains('by_user')) s.createIndex('by_user', 'user_id');
        }
        if (!db.objectStoreNames.contains('events')) {
          const s = db.createObjectStore('events', { keyPath: 'id' });
          s.createIndex('by_at', 'at');
        }
      }
    });
  }
  return dbPromise;
}

// ---------------------------------------------------------------
// Helpers genéricos
// ---------------------------------------------------------------

async function all<T>(store: string): Promise<T[]> {
  const db = await getDB();
  return (await db.getAll(store)) as T[];
}

async function put(store: string, value: unknown): Promise<void> {
  const db = await getDB();
  await db.put(store, value);
}

async function bulkPut(store: string, values: unknown[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(store, 'readwrite');
  for (const v of values) await tx.store.put(v);
  await tx.done;
}

async function clear(store: string): Promise<void> {
  const db = await getDB();
  await db.clear(store);
}

// ---------------------------------------------------------------
// API específica
// ---------------------------------------------------------------

export const db = {
  async getCategories(): Promise<Category[]> {
    const all = await dbAll<Category>('categories');
    return all
      .filter((c) => c.deleted_at === null)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getCardsByCategory(categoryId: string): Promise<Card[]> {
    const db = await getDB();
    const cards = await db.getAllFromIndex('cards', 'by_category', categoryId);
    return cards
      .filter((c) => c.deleted_at === null)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async putCategory(category: Category): Promise<void> {
    await put('categories', category);
  },

  async putCard(card: Card): Promise<void> {
    await put('cards', card);
  },

  async recordEvent(event: RecordItem): Promise<void> {
    await put('events', event);
  },

  async getEvents(): Promise<RecordItem[]> {
    return all<RecordItem>('events');
  },

  async clearEvents(): Promise<void> {
    await clear('events');
  }
};

async function dbAll<T>(store: string): Promise<T[]> {
  return all<T>(store);
}

export { bulkPut, clear };
