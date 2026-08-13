-- LeXi — Migración 0007: token de recuperación de dispositivo
-- Fecha: 2026-08-13
-- Permite que un dispositivo recupere su vínculo con un código si perdió su
-- UUID local (p. ej. el navegador limpió localStorage en Android).

ALTER TABLE devices ADD COLUMN device_token TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_devices_token ON devices(device_token);
