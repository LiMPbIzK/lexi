-- LeXi — Migración 0005: modo de dispositivo (full | demo)
-- Fecha: 2026-08-13
-- El modo demo no permite grabar (solo lectura/exploración).

ALTER TABLE devices ADD COLUMN mode TEXT NOT NULL DEFAULT 'full';
