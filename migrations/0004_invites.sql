-- LeXi — Migración 0004: códigos de invitación y dispositivos registrados
-- Fecha: 2026-08-13
-- Reemplaza el UUID libre como credencial: la API solo acepta dispositivos
-- que hayan canjeado un código emitido manualmente.

CREATE TABLE IF NOT EXISTS invite_codes (
  code       TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  claimed_by TEXT,
  claimed_at INTEGER
);

CREATE TABLE IF NOT EXISTS devices (
  id           TEXT PRIMARY KEY,
  code         TEXT UNIQUE,
  label        TEXT,
  created_at   INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_devices_code ON devices(code);
