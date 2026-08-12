-- LeXi — Migración 0002: seed ARASAAC (generado por scripts/seed-arasaac.mjs)
-- NO editar a mano: se regenera con el script.

-- Categorías (catálogo global, user_id = NULL)
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-animales', NULL, NULL, 'Animales', '#8B5E3C', NULL, 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-comida', NULL, NULL, 'Comida y bebida', '#E67E22', NULL, 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-acciones', NULL, NULL, 'Acciones', '#27AE60', NULL, 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-personas', NULL, NULL, 'Personas', '#8E44AD', NULL, 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-objetos', NULL, NULL, 'Objetos cotidianos', '#2980B9', NULL, 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-lugares', NULL, NULL, 'Lugares', '#16A085', NULL, 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-descriptores', NULL, NULL, 'Descriptores', '#F39C12', NULL, 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-cat-funcionales', NULL, NULL, 'Palabras funcionales', '#7F8C8D', NULL, 7, 1786561022664, 1786561022664, NULL);

-- Tarjetas (catálogo global)
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-perro', NULL, 'arasaac-cat-animales', 'perro', 'arasaac/7202.png', NULL, 'perro', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-gato', NULL, 'arasaac-cat-animales', 'gato', 'arasaac/7114.png', NULL, 'gato', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-pajaro', NULL, 'arasaac-cat-animales', 'pájaro', 'arasaac/2490.png', NULL, 'pájaro', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-pez', NULL, 'arasaac-cat-animales', 'pez', 'arasaac/2520.png', NULL, 'pez', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-caballo', NULL, 'arasaac-cat-animales', 'caballo', 'arasaac/2294.png', NULL, 'caballo', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-vaca', NULL, 'arasaac-cat-animales', 'vaca', 'arasaac/2609.png', NULL, 'vaca', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-cerdo', NULL, 'arasaac-cat-animales', 'cerdo', 'arasaac/24972.png', NULL, 'cerdo', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-oveja', NULL, 'arasaac-cat-animales', 'oveja', 'arasaac/2489.png', NULL, 'oveja', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-gallina', NULL, 'arasaac-cat-animales', 'gallina', 'arasaac/2403.png', NULL, 'gallina', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-conejo', NULL, 'arasaac-cat-animales', 'conejo', 'arasaac/2351.png', NULL, 'conejo', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-raton', NULL, 'arasaac-cat-animales', 'ratón', 'arasaac/2820.png', NULL, 'ratón', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-elefante', NULL, 'arasaac-cat-animales', 'elefante', 'arasaac/2372.png', NULL, 'elefante', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-leon', NULL, 'arasaac-cat-animales', 'león', 'arasaac/25187.png', NULL, 'león', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-jirafa', NULL, 'arasaac-cat-animales', 'jirafa', 'arasaac/2437.png', NULL, 'jirafa', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-mono', NULL, 'arasaac-cat-animales', 'mono', 'arasaac/2477.png', NULL, 'mono', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-tigre', NULL, 'arasaac-cat-animales', 'tigre', 'arasaac/2590.png', NULL, 'tigre', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-oso', NULL, 'arasaac-cat-animales', 'oso', 'arasaac/2488.png', NULL, 'oso', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-rana', NULL, 'arasaac-cat-animales', 'rana', 'arasaac/28473.png', NULL, 'rana', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-tortuga', NULL, 'arasaac-cat-animales', 'tortuga', 'arasaac/26503.png', NULL, 'tortuga', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-serpiente', NULL, 'arasaac-cat-animales', 'serpiente', 'arasaac/2568.png', NULL, 'serpiente', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-mariposa', NULL, 'arasaac-cat-animales', 'mariposa', 'arasaac/26200.png', NULL, 'mariposa', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-abeja', NULL, 'arasaac-cat-animales', 'abeja', 'arasaac/24823.png', NULL, 'abeja', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-arana', NULL, 'arasaac-cat-animales', 'araña', 'arasaac/2254.png', NULL, 'araña', 22, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-animales-hormiga', NULL, 'arasaac-cat-animales', 'hormiga', 'arasaac/2425.png', NULL, 'hormiga', 23, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-manzana', NULL, 'arasaac-cat-comida', 'manzana', 'arasaac/2462.png', NULL, 'manzana', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-pan', NULL, 'arasaac-cat-comida', 'pan', 'arasaac/2494.png', NULL, 'pan', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-leche', NULL, 'arasaac-cat-comida', 'leche', 'arasaac/2445.png', NULL, 'leche', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-agua', NULL, 'arasaac-cat-comida', 'agua', 'arasaac/32464.png', NULL, 'agua', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-queso', NULL, 'arasaac-cat-comida', 'queso', 'arasaac/2541.png', NULL, 'queso', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-huevo', NULL, 'arasaac-cat-comida', 'huevo', 'arasaac/2427.png', NULL, 'huevo', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-carne', NULL, 'arasaac-cat-comida', 'carne', 'arasaac/2316.png', NULL, 'carne', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-pescado', NULL, 'arasaac-cat-comida', 'pescado', 'arasaac/6502.png', NULL, 'pescado', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-arroz', NULL, 'arasaac-cat-comida', 'arroz', 'arasaac/6911.png', NULL, 'arroz', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-pasta', NULL, 'arasaac-cat-comida', 'pasta', 'arasaac/8652.png', NULL, 'pasta', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-sopa', NULL, 'arasaac-cat-comida', 'sopa', 'arasaac/2573.png', NULL, 'sopa', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-zanahoria', NULL, 'arasaac-cat-comida', 'zanahoria', 'arasaac/2619.png', NULL, 'zanahoria', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-platano', NULL, 'arasaac-cat-comida', 'plátano', 'arasaac/2530.png', NULL, 'plátano', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-naranja', NULL, 'arasaac-cat-comida', 'naranja', 'arasaac/2483.png', NULL, 'naranja', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-uva', NULL, 'arasaac-cat-comida', 'uva', 'arasaac/3247.png', NULL, 'uva', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-pera', NULL, 'arasaac-cat-comida', 'pera', 'arasaac/2561.png', NULL, 'pera', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-fresa', NULL, 'arasaac-cat-comida', 'fresa', 'arasaac/2400.png', NULL, 'fresa', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-tomate', NULL, 'arasaac-cat-comida', 'tomate', 'arasaac/2594.png', NULL, 'tomate', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-patata', NULL, 'arasaac-cat-comida', 'patata', 'arasaac/2503.png', NULL, 'patata', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-cebolla', NULL, 'arasaac-cat-comida', 'cebolla', 'arasaac/2323.png', NULL, 'cebolla', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-aceite', NULL, 'arasaac-cat-comida', 'aceite', 'arasaac/2246.png', NULL, 'aceite', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-sal', NULL, 'arasaac-cat-comida', 'sal', 'arasaac/25576.png', NULL, 'sal', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-azucar', NULL, 'arasaac-cat-comida', 'azúcar', 'arasaac/25560.png', NULL, 'azúcar', 22, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-miel', NULL, 'arasaac-cat-comida', 'miel', 'arasaac/2911.png', NULL, 'miel', 23, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-chocolate', NULL, 'arasaac-cat-comida', 'chocolate', 'arasaac/25940.png', NULL, 'chocolate', 24, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-galleta', NULL, 'arasaac-cat-comida', 'galleta', 'arasaac/8312.png', NULL, 'galleta', 25, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-helado', NULL, 'arasaac-cat-comida', 'helado', 'arasaac/35209.png', NULL, 'helado', 26, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-yogur', NULL, 'arasaac-cat-comida', 'yogur', 'arasaac/2618.png', NULL, 'yogur', 27, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-zumo', NULL, 'arasaac-cat-comida', 'zumo', 'arasaac/11461.png', NULL, 'zumo', 28, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-cafe', NULL, 'arasaac-cat-comida', 'café', 'arasaac/24479.png', NULL, 'café', 29, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-te', NULL, 'arasaac-cat-comida', 'té', 'arasaac/7284.png', NULL, 'té', 30, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-comida-tarta', NULL, 'arasaac-cat-comida', 'tarta', 'arasaac/8706.png', NULL, 'tarta', 31, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-comer', NULL, 'arasaac-cat-acciones', 'comer', 'arasaac/6456.png', NULL, 'comer', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-beber', NULL, 'arasaac-cat-acciones', 'beber', 'arasaac/6061.png', NULL, 'beber', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-dormir', NULL, 'arasaac-cat-acciones', 'dormir', 'arasaac/6479.png', NULL, 'dormir', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-jugar', NULL, 'arasaac-cat-acciones', 'jugar', 'arasaac/6537.png', NULL, 'jugar', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-leer', NULL, 'arasaac-cat-acciones', 'leer', 'arasaac/7141.png', NULL, 'leer', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-escribir', NULL, 'arasaac-cat-acciones', 'escribir', 'arasaac/2380.png', NULL, 'escribir', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-cantar', NULL, 'arasaac-cat-acciones', 'cantar', 'arasaac/6960.png', NULL, 'cantar', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-bailar', NULL, 'arasaac-cat-acciones', 'bailar', 'arasaac/6052.png', NULL, 'bailar', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-correr', NULL, 'arasaac-cat-acciones', 'correr', 'arasaac/6465.png', NULL, 'correr', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-saltar', NULL, 'arasaac-cat-acciones', 'saltar', 'arasaac/6607.png', NULL, 'saltar', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-nadar', NULL, 'arasaac-cat-acciones', 'nadar', 'arasaac/6568.png', NULL, 'nadar', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-caminar', NULL, 'arasaac-cat-acciones', 'caminar', 'arasaac/6044.png', NULL, 'caminar', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-sentarse', NULL, 'arasaac-cat-acciones', 'sentarse', 'arasaac/6611.png', NULL, 'sentarse', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-levantarse', NULL, 'arasaac-cat-acciones', 'levantarse', 'arasaac/6548.png', NULL, 'levantarse', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-abrir', NULL, 'arasaac-cat-acciones', 'abrir', 'arasaac/24825.png', NULL, 'abrir', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-cerrar', NULL, 'arasaac-cat-acciones', 'cerrar', 'arasaac/24976.png', NULL, 'cerrar', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-dar', NULL, 'arasaac-cat-acciones', 'dar', 'arasaac/28431.png', NULL, 'dar', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-tomar', NULL, 'arasaac-cat-acciones', 'tomar', 'arasaac/10148.png', NULL, 'tomar', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-poner', NULL, 'arasaac-cat-acciones', 'poner', 'arasaac/6989.png', NULL, 'poner', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-quitar', NULL, 'arasaac-cat-acciones', 'quitar', 'arasaac/11751.png', NULL, 'quitar', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-lavar', NULL, 'arasaac-cat-acciones', 'lavar', 'arasaac/8977.png', NULL, 'lavar', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-lavarse', NULL, 'arasaac-cat-acciones', 'lavarse', 'arasaac/8977.png', NULL, 'lavarse', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-vestirse', NULL, 'arasaac-cat-acciones', 'vestirse', 'arasaac/6627.png', NULL, 'vestirse', 22, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-banarse', NULL, 'arasaac-cat-acciones', 'bañarse', 'arasaac/6058.png', NULL, 'bañarse', 23, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-cepillarse', NULL, 'arasaac-cat-acciones', 'cepillarse', 'arasaac/5425.png', NULL, 'cepillarse', 24, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-peinarse', NULL, 'arasaac-cat-acciones', 'peinarse', 'arasaac/26947.png', NULL, 'peinarse', 25, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-mirar', NULL, 'arasaac-cat-acciones', 'mirar', 'arasaac/6564.png', NULL, 'mirar', 26, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-escuchar', NULL, 'arasaac-cat-acciones', 'escuchar', 'arasaac/6572.png', NULL, 'escuchar', 27, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-hablar', NULL, 'arasaac-cat-acciones', 'hablar', 'arasaac/6517.png', NULL, 'hablar', 28, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-esperar', NULL, 'arasaac-cat-acciones', 'esperar', 'arasaac/16697.png', NULL, 'esperar', 29, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-ayudar', NULL, 'arasaac-cat-acciones', 'ayudar', 'arasaac/32648.png', NULL, 'ayudar', 30, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-querer', NULL, 'arasaac-cat-acciones', 'querer', 'arasaac/5441.png', NULL, 'querer', 31, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-poder', NULL, 'arasaac-cat-acciones', 'poder', 'arasaac/35949.png', NULL, 'poder', 32, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-tener', NULL, 'arasaac-cat-acciones', 'tener', 'arasaac/7271.png', NULL, 'tener', 33, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-hacer', NULL, 'arasaac-cat-acciones', 'hacer', 'arasaac/11749.png', NULL, 'hacer', 34, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-ir', NULL, 'arasaac-cat-acciones', 'ir', 'arasaac/8142.png', NULL, 'ir', 35, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-venir', NULL, 'arasaac-cat-acciones', 'venir', 'arasaac/32669.png', NULL, 'venir', 36, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-ver', NULL, 'arasaac-cat-acciones', 'ver', 'arasaac/6564.png', NULL, 'ver', 37, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-oir', NULL, 'arasaac-cat-acciones', 'oír', 'arasaac/6572.png', NULL, 'oír', 38, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-llorar', NULL, 'arasaac-cat-acciones', 'llorar', 'arasaac/7147.png', NULL, 'llorar', 39, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-acciones-reir', NULL, 'arasaac-cat-acciones', 'reír', 'arasaac/13354.png', NULL, 'reír', 40, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-mama', NULL, 'arasaac-cat-personas', 'mamá', 'arasaac/2458.png', NULL, 'mamá', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-papa', NULL, 'arasaac-cat-personas', 'papá', 'arasaac/31146.png', NULL, 'papá', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-hermano', NULL, 'arasaac-cat-personas', 'hermano', 'arasaac/2423.png', NULL, 'hermano', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-hermana', NULL, 'arasaac-cat-personas', 'hermana', 'arasaac/2422.png', NULL, 'hermana', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-abuelo', NULL, 'arasaac-cat-personas', 'abuelo', 'arasaac/23718.png', NULL, 'abuelo', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-abuela', NULL, 'arasaac-cat-personas', 'abuela', 'arasaac/23710.png', NULL, 'abuela', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-tio', NULL, 'arasaac-cat-personas', 'tío', 'arasaac/30255.png', NULL, 'tío', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-tia', NULL, 'arasaac-cat-personas', 'tía', 'arasaac/30271.png', NULL, 'tía', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-primo', NULL, 'arasaac-cat-personas', 'primo', 'arasaac/30340.png', NULL, 'primo', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-bebe', NULL, 'arasaac-cat-personas', 'bebé', 'arasaac/6060.png', NULL, 'bebé', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-nino', NULL, 'arasaac-cat-personas', 'niño', 'arasaac/7176.png', NULL, 'niño', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-nina', NULL, 'arasaac-cat-personas', 'niña', 'arasaac/27509.png', NULL, 'niña', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-hombre', NULL, 'arasaac-cat-personas', 'hombre', 'arasaac/4665.png', NULL, 'hombre', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-mujer', NULL, 'arasaac-cat-personas', 'mujer', 'arasaac/24621.png', NULL, 'mujer', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-amigo', NULL, 'arasaac-cat-personas', 'amigo', 'arasaac/25790.png', NULL, 'amigo', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-amiga', NULL, 'arasaac-cat-personas', 'amiga', 'arasaac/8486.png', NULL, 'amiga', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-profesor', NULL, 'arasaac-cat-personas', 'profesor', 'arasaac/7796.png', NULL, 'profesor', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-medico', NULL, 'arasaac-cat-personas', 'médico', 'arasaac/6561.png', NULL, 'médico', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-enfermera', NULL, 'arasaac-cat-personas', 'enfermera', 'arasaac/2375.png', NULL, 'enfermera', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-policia', NULL, 'arasaac-cat-personas', 'policía', 'arasaac/37367.png', NULL, 'policía', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-personas-bombero', NULL, 'arasaac-cat-personas', 'bombero', 'arasaac/6066.png', NULL, 'bombero', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-cama', NULL, 'arasaac-cat-objetos', 'cama', 'arasaac/25900.png', NULL, 'cama', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-silla', NULL, 'arasaac-cat-objetos', 'silla', 'arasaac/3155.png', NULL, 'silla', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-mesa', NULL, 'arasaac-cat-objetos', 'mesa', 'arasaac/3129.png', NULL, 'mesa', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-puerta', NULL, 'arasaac-cat-objetos', 'puerta', 'arasaac/3244.png', NULL, 'puerta', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-ventana', NULL, 'arasaac-cat-objetos', 'ventana', 'arasaac/2611.png', NULL, 'ventana', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-casa', NULL, 'arasaac-cat-objetos', 'casa', 'arasaac/6964.png', NULL, 'casa', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-escuela', NULL, 'arasaac-cat-objetos', 'escuela', 'arasaac/32446.png', NULL, 'escuela', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-coche', NULL, 'arasaac-cat-objetos', 'coche', 'arasaac/2339.png', NULL, 'coche', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-autobus', NULL, 'arasaac-cat-objetos', 'autobús', 'arasaac/2262.png', NULL, 'autobús', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-tren', NULL, 'arasaac-cat-objetos', 'tren', 'arasaac/2603.png', NULL, 'tren', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-avion', NULL, 'arasaac-cat-objetos', 'avión', 'arasaac/2264.png', NULL, 'avión', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-barco', NULL, 'arasaac-cat-objetos', 'barco', 'arasaac/6932.png', NULL, 'barco', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-bicicleta', NULL, 'arasaac-cat-objetos', 'bicicleta', 'arasaac/6935.png', NULL, 'bicicleta', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-pelota', NULL, 'arasaac-cat-objetos', 'pelota', 'arasaac/3241.png', NULL, 'pelota', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-libro', NULL, 'arasaac-cat-objetos', 'libro', 'arasaac/25191.png', NULL, 'libro', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-lapiz', NULL, 'arasaac-cat-objetos', 'lápiz', 'arasaac/2440.png', NULL, 'lápiz', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-boligrafo', NULL, 'arasaac-cat-objetos', 'bolígrafo', 'arasaac/2282.png', NULL, 'bolígrafo', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-papel', NULL, 'arasaac-cat-objetos', 'papel', 'arasaac/8349.png', NULL, 'papel', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-tijeras', NULL, 'arasaac-cat-objetos', 'tijeras', 'arasaac/2591.png', NULL, 'tijeras', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-mochila', NULL, 'arasaac-cat-objetos', 'mochila', 'arasaac/2475.png', NULL, 'mochila', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-zapatos', NULL, 'arasaac-cat-objetos', 'zapatos', 'arasaac/2622.png', NULL, 'zapatos', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-calcetines', NULL, 'arasaac-cat-objetos', 'calcetines', 'arasaac/2298.png', NULL, 'calcetines', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-camiseta', NULL, 'arasaac-cat-objetos', 'camiseta', 'arasaac/2309.png', NULL, 'camiseta', 22, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-pantalon', NULL, 'arasaac-cat-objetos', 'pantalón', 'arasaac/2565.png', NULL, 'pantalón', 23, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-abrigo', NULL, 'arasaac-cat-objetos', 'abrigo', 'arasaac/2242.png', NULL, 'abrigo', 24, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-gorro', NULL, 'arasaac-cat-objetos', 'gorro', 'arasaac/2412.png', NULL, 'gorro', 25, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-gafas', NULL, 'arasaac-cat-objetos', 'gafas', 'arasaac/3329.png', NULL, 'gafas', 26, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-reloj', NULL, 'arasaac-cat-objetos', 'reloj', 'arasaac/2549.png', NULL, 'reloj', 27, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-telefono', NULL, 'arasaac-cat-objetos', 'teléfono', 'arasaac/26479.png', NULL, 'teléfono', 28, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-ordenador', NULL, 'arasaac-cat-objetos', 'ordenador', 'arasaac/7190.png', NULL, 'ordenador', 29, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-television', NULL, 'arasaac-cat-objetos', 'televisión', 'arasaac/25498.png', NULL, 'televisión', 30, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-lampara', NULL, 'arasaac-cat-objetos', 'lámpara', 'arasaac/4936.png', NULL, 'lámpara', 31, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-cepillo', NULL, 'arasaac-cat-objetos', 'cepillo', 'arasaac/2694.png', NULL, 'cepillo', 32, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-peine', NULL, 'arasaac-cat-objetos', 'peine', 'arasaac/2852.png', NULL, 'peine', 33, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-jabon', NULL, 'arasaac-cat-objetos', 'jabón', 'arasaac/8094.png', NULL, 'jabón', 34, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-toalla', NULL, 'arasaac-cat-objetos', 'toalla', 'arasaac/2593.png', NULL, 'toalla', 35, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-panal', NULL, 'arasaac-cat-objetos', 'pañal', 'arasaac/22017.png', NULL, 'pañal', 36, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-biberon', NULL, 'arasaac-cat-objetos', 'biberón', 'arasaac/4577.png', NULL, 'biberón', 37, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-cuchara', NULL, 'arasaac-cat-objetos', 'cuchara', 'arasaac/2362.png', NULL, 'cuchara', 38, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-tenedor', NULL, 'arasaac-cat-objetos', 'tenedor', 'arasaac/2588.png', NULL, 'tenedor', 39, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-plato', NULL, 'arasaac-cat-objetos', 'plato', 'arasaac/16857.png', NULL, 'plato', 40, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-vaso', NULL, 'arasaac-cat-objetos', 'vaso', 'arasaac/2610.png', NULL, 'vaso', 41, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-objetos-taza', NULL, 'arasaac-cat-objetos', 'taza', 'arasaac/2582.png', NULL, 'taza', 42, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-casa', NULL, 'arasaac-cat-lugares', 'casa', 'arasaac/6964.png', NULL, 'casa', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-colegio', NULL, 'arasaac-cat-lugares', 'colegio', 'arasaac/32446.png', NULL, 'colegio', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-parque', NULL, 'arasaac-cat-lugares', 'parque', 'arasaac/2859.png', NULL, 'parque', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-hospital', NULL, 'arasaac-cat-lugares', 'hospital', 'arasaac/3116.png', NULL, 'hospital', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-farmacia', NULL, 'arasaac-cat-lugares', 'farmacia', 'arasaac/6497.png', NULL, 'farmacia', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-tienda', NULL, 'arasaac-cat-lugares', 'tienda', 'arasaac/35695.png', NULL, 'tienda', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-supermercado', NULL, 'arasaac-cat-lugares', 'supermercado', 'arasaac/3389.png', NULL, 'supermercado', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-biblioteca', NULL, 'arasaac-cat-lugares', 'biblioteca', 'arasaac/6063.png', NULL, 'biblioteca', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-cine', NULL, 'arasaac-cat-lugares', 'cine', 'arasaac/30387.png', NULL, 'cine', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-piscina', NULL, 'arasaac-cat-lugares', 'piscina', 'arasaac/30516.png', NULL, 'piscina', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-playa', NULL, 'arasaac-cat-lugares', 'playa', 'arasaac/30518.png', NULL, 'playa', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-montana', NULL, 'arasaac-cat-lugares', 'montaña', 'arasaac/2909.png', NULL, 'montaña', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-campo', NULL, 'arasaac-cat-lugares', 'campo', 'arasaac/2683.png', NULL, 'campo', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-ciudad', NULL, 'arasaac-cat-lugares', 'ciudad', 'arasaac/2704.png', NULL, 'ciudad', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-pueblo', NULL, 'arasaac-cat-lugares', 'pueblo', 'arasaac/2823.png', NULL, 'pueblo', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-calle', NULL, 'arasaac-cat-lugares', 'calle', 'arasaac/2299.png', NULL, 'calle', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-jardin', NULL, 'arasaac-cat-lugares', 'jardín', 'arasaac/2434.png', NULL, 'jardín', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-bosque', NULL, 'arasaac-cat-lugares', 'bosque', 'arasaac/2666.png', NULL, 'bosque', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-rio', NULL, 'arasaac-cat-lugares', 'río', 'arasaac/2811.png', NULL, 'río', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-mar', NULL, 'arasaac-cat-lugares', 'mar', 'arasaac/2925.png', NULL, 'mar', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-restaurante', NULL, 'arasaac-cat-lugares', 'restaurante', 'arasaac/32408.png', NULL, 'restaurante', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-lugares-panaderia', NULL, 'arasaac-cat-lugares', 'panadería', 'arasaac/6576.png', NULL, 'panadería', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-grande', NULL, 'arasaac-cat-descriptores', 'grande', 'arasaac/4658.png', NULL, 'grande', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-pequeno', NULL, 'arasaac-cat-descriptores', 'pequeño', 'arasaac/4716.png', NULL, 'pequeño', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-largo', NULL, 'arasaac-cat-descriptores', 'largo', 'arasaac/26162.png', NULL, 'largo', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-corto', NULL, 'arasaac-cat-descriptores', 'corto', 'arasaac/26002.png', NULL, 'corto', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-alto', NULL, 'arasaac-cat-descriptores', 'alto', 'arasaac/25782.png', NULL, 'alto', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-bajo', NULL, 'arasaac-cat-descriptores', 'bajo', 'arasaac/7047.png', NULL, 'bajo', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-gordo', NULL, 'arasaac-cat-descriptores', 'gordo', 'arasaac/25133.png', NULL, 'gordo', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-delgado', NULL, 'arasaac-cat-descriptores', 'delgado', 'arasaac/25048.png', NULL, 'delgado', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-pesado', NULL, 'arasaac-cat-descriptores', 'pesado', 'arasaac/27025.png', NULL, 'pesado', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-ligero', NULL, 'arasaac-cat-descriptores', 'ligero', 'arasaac/4679.png', NULL, 'ligero', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-caliente', NULL, 'arasaac-cat-descriptores', 'caliente', 'arasaac/4583.png', NULL, 'caliente', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-frio', NULL, 'arasaac-cat-descriptores', 'frío', 'arasaac/4652.png', NULL, 'frío', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-limpio', NULL, 'arasaac-cat-descriptores', 'limpio', 'arasaac/26172.png', NULL, 'limpio', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-sucio', NULL, 'arasaac-cat-descriptores', 'sucio', 'arasaac/4750.png', NULL, 'sucio', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-nuevo', NULL, 'arasaac-cat-descriptores', 'nuevo', 'arasaac/11316.png', NULL, 'nuevo', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-viejo', NULL, 'arasaac-cat-descriptores', 'viejo', 'arasaac/11394.png', NULL, 'viejo', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-joven', NULL, 'arasaac-cat-descriptores', 'joven', 'arasaac/4673.png', NULL, 'joven', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-bonito', NULL, 'arasaac-cat-descriptores', 'bonito', 'arasaac/11194.png', NULL, 'bonito', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-feo', NULL, 'arasaac-cat-descriptores', 'feo', 'arasaac/26090.png', NULL, 'feo', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-bueno', NULL, 'arasaac-cat-descriptores', 'bueno', 'arasaac/4581.png', NULL, 'bueno', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-malo', NULL, 'arasaac-cat-descriptores', 'malo', 'arasaac/4690.png', NULL, 'malo', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-facil', NULL, 'arasaac-cat-descriptores', 'fácil', 'arasaac/4645.png', NULL, 'fácil', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-dificil', NULL, 'arasaac-cat-descriptores', 'difícil', 'arasaac/4629.png', NULL, 'difícil', 22, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-rapido', NULL, 'arasaac-cat-descriptores', 'rápido', 'arasaac/5306.png', NULL, 'rápido', 23, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-lento', NULL, 'arasaac-cat-descriptores', 'lento', 'arasaac/4676.png', NULL, 'lento', 24, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-fuerte', NULL, 'arasaac-cat-descriptores', 'fuerte', 'arasaac/25121.png', NULL, 'fuerte', 25, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-debil', NULL, 'arasaac-cat-descriptores', 'débil', 'arasaac/25044.png', NULL, 'débil', 26, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-lleno', NULL, 'arasaac-cat-descriptores', 'lleno', 'arasaac/26176.png', NULL, 'lleno', 27, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-vacio', NULL, 'arasaac-cat-descriptores', 'vacío', 'arasaac/26527.png', NULL, 'vacío', 28, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-abierto', NULL, 'arasaac-cat-descriptores', 'abierto', 'arasaac/36309.png', NULL, 'abierto', 29, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-cerrado', NULL, 'arasaac-cat-descriptores', 'cerrado', 'arasaac/4596.png', NULL, 'cerrado', 30, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-duro', NULL, 'arasaac-cat-descriptores', 'duro', 'arasaac/4637.png', NULL, 'duro', 31, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-blando', NULL, 'arasaac-cat-descriptores', 'blando', 'arasaac/4578.png', NULL, 'blando', 32, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-rojo', NULL, 'arasaac-cat-descriptores', 'rojo', 'arasaac/2808.png', NULL, 'rojo', 33, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-azul', NULL, 'arasaac-cat-descriptores', 'azul', 'arasaac/4869.png', NULL, 'azul', 34, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-verde', NULL, 'arasaac-cat-descriptores', 'verde', 'arasaac/4887.png', NULL, 'verde', 35, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-amarillo', NULL, 'arasaac-cat-descriptores', 'amarillo', 'arasaac/2648.png', NULL, 'amarillo', 36, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-naranja', NULL, 'arasaac-cat-descriptores', 'naranja', 'arasaac/2483.png', NULL, 'naranja', 37, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-rosa', NULL, 'arasaac-cat-descriptores', 'rosa', 'arasaac/3151.png', NULL, 'rosa', 38, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-morado', NULL, 'arasaac-cat-descriptores', 'morado', 'arasaac/2907.png', NULL, 'morado', 39, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-marron', NULL, 'arasaac-cat-descriptores', 'marrón', 'arasaac/2923.png', NULL, 'marrón', 40, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-negro', NULL, 'arasaac-cat-descriptores', 'negro', 'arasaac/2886.png', NULL, 'negro', 41, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-blanco', NULL, 'arasaac-cat-descriptores', 'blanco', 'arasaac/8043.png', NULL, 'blanco', 42, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-descriptores-gris', NULL, 'arasaac-cat-descriptores', 'gris', 'arasaac/3340.png', NULL, 'gris', 43, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-si', NULL, 'arasaac-cat-funcionales', 'sí', 'arasaac/5584.png', NULL, 'sí', 0, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-no', NULL, 'arasaac-cat-funcionales', 'no', 'arasaac/5526.png', NULL, 'no', 1, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-mas', NULL, 'arasaac-cat-funcionales', 'más', 'arasaac/3220.png', NULL, 'más', 2, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-otra-vez', NULL, 'arasaac-cat-funcionales', 'otra vez', 'arasaac/37162.png', NULL, 'otra vez', 3, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-ayuda', NULL, 'arasaac-cat-funcionales', 'ayuda', 'arasaac/19524.png', NULL, 'ayuda', 4, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-bano', NULL, 'arasaac-cat-funcionales', 'baño', 'arasaac/15905.png', NULL, 'baño', 5, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-hambre', NULL, 'arasaac-cat-funcionales', 'hambre', 'arasaac/35559.png', NULL, 'hambre', 6, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-sed', NULL, 'arasaac-cat-funcionales', 'sed', 'arasaac/7273.png', NULL, 'sed', 7, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-dolor', NULL, 'arasaac-cat-funcionales', 'dolor', 'arasaac/2367.png', NULL, 'dolor', 8, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-cansado', NULL, 'arasaac-cat-funcionales', 'cansado', 'arasaac/35537.png', NULL, 'cansado', 9, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-contento', NULL, 'arasaac-cat-funcionales', 'contento', 'arasaac/35547.png', NULL, 'contento', 10, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-triste', NULL, 'arasaac-cat-funcionales', 'triste', 'arasaac/35545.png', NULL, 'triste', 11, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-enfadado', NULL, 'arasaac-cat-funcionales', 'enfadado', 'arasaac/35539.png', NULL, 'enfadado', 12, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-asustado', NULL, 'arasaac-cat-funcionales', 'asustado', 'arasaac/35535.png', NULL, 'asustado', 13, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-sorprendido', NULL, 'arasaac-cat-funcionales', 'sorprendido', 'arasaac/35529.png', NULL, 'sorprendido', 14, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-aburrido', NULL, 'arasaac-cat-funcionales', 'aburrido', 'arasaac/35531.png', NULL, 'aburrido', 15, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-feliz', NULL, 'arasaac-cat-funcionales', 'feliz', 'arasaac/35533.png', NULL, 'feliz', 16, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-bien', NULL, 'arasaac-cat-funcionales', 'bien', 'arasaac/5397.png', NULL, 'bien', 17, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-mal', NULL, 'arasaac-cat-funcionales', 'mal', 'arasaac/5504.png', NULL, 'mal', 18, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-gracias', NULL, 'arasaac-cat-funcionales', 'gracias', 'arasaac/8129.png', NULL, 'gracias', 19, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-por-favor', NULL, 'arasaac-cat-funcionales', 'por favor', 'arasaac/8195.png', NULL, 'por favor', 20, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-perdon', NULL, 'arasaac-cat-funcionales', 'perdón', 'arasaac/11625.png', NULL, 'perdón', 21, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-hola', NULL, 'arasaac-cat-funcionales', 'hola', 'arasaac/6522.png', NULL, 'hola', 22, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-adios', NULL, 'arasaac-cat-funcionales', 'adiós', 'arasaac/6028.png', NULL, 'adiós', 23, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-buenos-dias', NULL, 'arasaac-cat-funcionales', 'buenos días', 'arasaac/6944.png', NULL, 'buenos días', 24, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-buenas-tardes', NULL, 'arasaac-cat-funcionales', 'buenas tardes', 'arasaac/6943.png', NULL, 'buenas tardes', 25, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-buenas-noches', NULL, 'arasaac-cat-funcionales', 'buenas noches', 'arasaac/6942.png', NULL, 'buenas noches', 26, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-que', NULL, 'arasaac-cat-funcionales', '¿qué?', 'arasaac/22620.png', NULL, '¿qué?', 27, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-quien', NULL, 'arasaac-cat-funcionales', '¿quién?', 'arasaac/9853.png', NULL, '¿quién?', 28, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-donde', NULL, 'arasaac-cat-funcionales', '¿dónde?', 'arasaac/7764.png', NULL, '¿dónde?', 29, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-cuando', NULL, 'arasaac-cat-funcionales', '¿cuándo?', 'arasaac/32874.png', NULL, '¿cuándo?', 30, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-por-que', NULL, 'arasaac-cat-funcionales', '¿por qué?', 'arasaac/11348.png', NULL, '¿por qué?', 31, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-como', NULL, 'arasaac-cat-funcionales', '¿cómo?', 'arasaac/22619.png', NULL, '¿cómo?', 32, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-yo', NULL, 'arasaac-cat-funcionales', 'yo', 'arasaac/6632.png', NULL, 'yo', 33, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-tu', NULL, 'arasaac-cat-funcionales', 'tú', 'arasaac/6625.png', NULL, 'tú', 34, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-el', NULL, 'arasaac-cat-funcionales', 'él', 'arasaac/6480.png', NULL, 'él', 35, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-ella', NULL, 'arasaac-cat-funcionales', 'ella', 'arasaac/7028.png', NULL, 'ella', 36, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-nosotros', NULL, 'arasaac-cat-funcionales', 'nosotros', 'arasaac/7185.png', NULL, 'nosotros', 37, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-ellos', NULL, 'arasaac-cat-funcionales', 'ellos', 'arasaac/7032.png', NULL, 'ellos', 38, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-mi', NULL, 'arasaac-cat-funcionales', 'mi', 'arasaac/12264.png', NULL, 'mi', 39, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-tu', NULL, 'arasaac-cat-funcionales', 'tu', 'arasaac/6625.png', NULL, 'tu', 40, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-su', NULL, 'arasaac-cat-funcionales', 'su', 'arasaac/12272.png', NULL, 'su', 41, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-este', NULL, 'arasaac-cat-funcionales', 'este', 'arasaac/7095.png', NULL, 'este', 42, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-ese', NULL, 'arasaac-cat-funcionales', 'ese', 'arasaac/7091.png', NULL, 'ese', 43, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-aquel', NULL, 'arasaac-cat-funcionales', 'aquel', 'arasaac/6906.png', NULL, 'aquel', 44, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-aqui', NULL, 'arasaac-cat-funcionales', 'aquí', 'arasaac/5382.png', NULL, 'aquí', 45, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-alli', NULL, 'arasaac-cat-funcionales', 'allí', 'arasaac/5375.png', NULL, 'allí', 46, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-ahora', NULL, 'arasaac-cat-funcionales', 'ahora', 'arasaac/32747.png', NULL, 'ahora', 47, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-despues', NULL, 'arasaac-cat-funcionales', 'después', 'arasaac/32749.png', NULL, 'después', 48, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-antes', NULL, 'arasaac-cat-funcionales', 'antes', 'arasaac/32745.png', NULL, 'antes', 49, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-hoy', NULL, 'arasaac-cat-funcionales', 'hoy', 'arasaac/7131.png', NULL, 'hoy', 50, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-manana', NULL, 'arasaac-cat-funcionales', 'mañana', 'arasaac/25704.png', NULL, 'mañana', 51, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-ayer', NULL, 'arasaac-cat-funcionales', 'ayer', 'arasaac/6926.png', NULL, 'ayer', 52, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-siempre', NULL, 'arasaac-cat-funcionales', 'siempre', 'arasaac/17322.png', NULL, 'siempre', 53, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-nunca', NULL, 'arasaac-cat-funcionales', 'nunca', 'arasaac/5527.png', NULL, 'nunca', 54, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-todo', NULL, 'arasaac-cat-funcionales', 'todo', 'arasaac/5596.png', NULL, 'todo', 55, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-nada', NULL, 'arasaac-cat-funcionales', 'nada', 'arasaac/29839.png', NULL, 'nada', 56, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-alguien', NULL, 'arasaac-cat-funcionales', 'alguien', 'arasaac/37779.png', NULL, 'alguien', 57, 1786561022664, 1786561022664, NULL);
INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)
VALUES ('arasaac-card-funcionales-nadie', NULL, 'arasaac-cat-funcionales', 'nadie', 'arasaac/11314.png', NULL, 'nadie', 58, 1786561022664, 1786561022664, NULL);
