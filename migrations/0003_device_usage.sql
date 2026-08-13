-- LeXi — Migración 0003: control de uso por dispositivo (anti-abuso)
-- Fecha: 2026-08-13

-- tamaño en bytes por grabación (para cuotas)
ALTER TABLE recordings ADD COLUMN size_bytes INTEGER NOT NULL DEFAULT 0;

-- acumulados por dispositivo para aplicar cuotas sin escanear recordings
CREATE TABLE IF NOT EXISTS device_usage (
  user_id      TEXT PRIMARY KEY,
  audio_count  INTEGER NOT NULL DEFAULT 0,
  audio_bytes  INTEGER NOT NULL DEFAULT 0,
  updated_at   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recordings_user ON recordings(user_id, created_at);
