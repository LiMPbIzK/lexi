-- LeXi — Migración 0006: códigos revocados
-- Fecha: 2026-08-13
-- revoked_at distingue "libre", "usado" y "revocado" conservando el histórico.

ALTER TABLE invite_codes ADD COLUMN revoked_at INTEGER;
