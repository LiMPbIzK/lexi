-- LeXi — Migración 0001: esquema base
-- Fecha: 2026-08-12
-- Nota: IDs son UUID generados en el cliente (offline-first).
-- Borrados = tombstones (deleted_at). Sync = last-writer-wins por updated_at.

-- ---------------------------------------------------------------
-- users: perfil anónimo por dispositivo
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  display_name  TEXT,
  locale        TEXT NOT NULL DEFAULT 'es',
  voice_uri     TEXT,
  theme         TEXT NOT NULL DEFAULT 'neutral',
  created_at    INTEGER NOT NULL,
  last_seen_at  INTEGER NOT NULL
);

-- ---------------------------------------------------------------
-- categories: categorías / tableros (user_id NULL = catálogo global)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES users(id),
  parent_id  TEXT REFERENCES categories(id),
  name       TEXT NOT NULL,
  color      TEXT,
  icon_key   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

-- ---------------------------------------------------------------
-- cards: tarjetas con imagen/audio en R2 y texto TTS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cards (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  category_id TEXT REFERENCES categories(id),
  label       TEXT NOT NULL,
  image_key   TEXT,
  audio_key   TEXT,
  tts_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  deleted_at  INTEGER
);

-- ---------------------------------------------------------------
-- recordings: grabaciones de audio subidas a R2
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recordings (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  card_id     TEXT REFERENCES cards(id),
  key         TEXT NOT NULL,
  mime        TEXT NOT NULL DEFAULT 'audio/webm',
  duration_ms INTEGER,
  created_at  INTEGER NOT NULL
);

-- ---------------------------------------------------------------
-- events: estadísticas de uso
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id      TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  card_id TEXT REFERENCES cards(id),
  verb    TEXT NOT NULL,
  at      INTEGER NOT NULL
);

-- ---------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_cards_user ON cards(user_id, category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category_id);
CREATE INDEX IF NOT EXISTS idx_recordings_card ON recordings(card_id);
CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id, at);
