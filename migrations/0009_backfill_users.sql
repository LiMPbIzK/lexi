-- LeXi — Migración 0009: backfill de users desde devices (fix sync FK)
-- Fecha: 2026-08-15
--
-- El claim registraba el device en `devices` pero no creaba la fila en `users`,
-- y categories/cards/events tienen FK a `users(id)`. Resultado: el sync POST
-- fallaba con FOREIGN KEY constraint. Esta migración repara los dispositivos
-- existentes creando su fila en `users`.

INSERT OR IGNORE INTO users (id, locale, theme, created_at, last_seen_at)
SELECT d.id, 'es', 'neutral', d.created_at, d.last_seen_at
FROM devices d
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = d.id);

-- Sincroniza last_seen_at de los users existentes con sus devices.
UPDATE users
SET last_seen_at = (SELECT d.last_seen_at FROM devices d WHERE d.id = users.id)
WHERE EXISTS (SELECT 1 FROM devices d WHERE d.id = users.id);
