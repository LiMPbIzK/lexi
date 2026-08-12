# AGENTS.md

## Estado del proyecto
- LeXi (AAC communicator) está en fase de planificación: **aún no hay código**
  (sin `package.json`, sin `src/`). READMEs y banners existen.
- La implementación sigue hitos: Hito1 esqueleto Astro+Svelte+temas, Hito2 D1,
  Hito3 R2, Hito4 seed ARASAAC, Hito5 grid+teclado+TTS, Hito6 editor,
  Hito7 sync, Hito8 PWA+dominio. Los comandos de build/dev en README son
  previstos, no reales — no inventar scripts que no existan.

## Convenciones críticas (NO romper)
- **Nunca ejecutar `git commit` ni `git push`.** El usuario los ejecuta siempre.
  Solo sugerir `git add` + mensaje convencional cuando un hito esté completo.
- **Backups:** en cada hito, zip en `J:\Codigo\backups\lexi\lexi-YYYYMMDD-HHMMSS-HitoN.zip`.
- **Idioma de READMEs:** `README.md` = español, `README.en.md` = inglés.
  Mantener la cabecera de alternancia `[English](README.en.md) | [Español](README.md)`
  y respetar el banner `<id>.svg` correspondiente por idioma.

## Arquitectura decidida (por implementar)
- Astro SSG + islas **Svelte** + `@vite-pwa/astro` (SW/manifest en Hito1).
  - **Svelte 5 ESTRICTO:** Utiliza EXCLUSIVAMENTE la nueva sintaxis de Runas de Svelte 5 (`$state`, `$derived`, `$props`, etc.). NUNCA uses la sintaxis antigua de Svelte 4 (como `export let` o declaraciones reactivas con `$:`).
  - **Estado global:** Para compartir estado entre múltiples islas Svelte aisladas dentro de Astro, utiliza exclusivamente `nanostores` (`@nanostores/svelte`), NUNCA los stores internos de Svelte.
- **Offline-first:** IndexedDB es la fuente de verdad del día a día. 
  - Utiliza un wrapper basado en promesas como `idb` o `dexie` para IndexedDB. NO utilices la API nativa `window.indexedDB` directamente.
- Cloudflare **D1** para sync/backend, **R2** para audio/imágenes (lectura vía proxy en el
  mismo origen). Micro 100% cliente (MediaRecorder webm/aac).
  - **Secretos:** Nunca hardcodees credenciales en el código. Las variables de entorno en desarrollo deben leerse exclusivamente del archivo `.dev.vars` según el estándar de Wrangler.
- Sync: cola en IndexedDB + reintentos diferidos; tombstones para borrados;
  conflictos last-writer-wins por `updated_at`.
- **Sin auth en MVP:** `user_id` = UUID de dispositivo; dos dispositivos = dos
  usuarios independientes. Los datos van scoped por `user_id`.
- **Solo español (`es`)** produce actualmente; diseño preparado para i18n
  (schema tiene `locale`/`voice_uri`; camino futuro a `card_translations`).

## Esquema D1 decidido
- `users` (UUID, locale, voice_uri, created_at, last_seen_at)
- `categories` (id, user_id, parent_id, name, color, icon_key, sort_order, tombstones)
- `cards` (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, tombstones)
- `recordings` (id, user_id, card_id, key, mime, duration_ms)
- `events` (id, user_id, card_id, verb, at)
Para consultar/ampliar: README.md → "Esquema de datos".

## Seed ARASAAC (Hito4)
- Vocabulario editable en `data/core-vocab.es.json` (categorías + términos).
- `scripts/seed-arasaac.mjs` con modo `--check` (compara contra el manifest
  commiteado) para detectar cambios y solo regenerar en CI cuando los haya.
- Imágenes desde `https://static.arasaac.org/pictograms/{id}/{id}_500.png`
  (CDN estático; la API `/v1/pictograms/es/search/{term}` sirve metadatos).
- Catálogo con `user_id = NULL` (global). Licencia CC BY-NC-SA 4.0 — atribución
  obligatoria (ya en README).

## Temas CSS (Hito1)
- Sistema vía **CSS custom properties** + `[data-theme="..."]` en `<html>`.
- Temas base: neutro, pastel, alto-contraste, calma, cálido. Extensible (añadir
  un bloque CSS, sin tocar componentes). Selector 🎨 persiste localStorage +
  `users.theme`.