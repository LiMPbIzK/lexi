-- LeXi — Migración 0008: usuario en códigos + fingerprint de dispositivo
-- Fecha: 2026-08-14
-- user: destinatario/dueño del código (obligatorio al generar) para trazabilidad
-- device_fingerprint: huella estable del dispositivo para recuperar el acceso
-- aunque el navegador limpie todo el storage.

ALTER TABLE invite_codes ADD COLUMN user TEXT NOT NULL DEFAULT '';
ALTER TABLE devices ADD COLUMN device_fingerprint TEXT;
