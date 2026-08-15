# LeXi — Comunicador AAC

![LeXi Comunicador Web CAA](banner.es.svg)

[English](README.en.md) | [Español](README.md)

![Estado: en desarrollo](https://img.shields.io/badge/estado-en%20desarrollo-orange)
![Licencia: AGPL-3.0](https://img.shields.io/badge/licencia-AGPL--3.0-blue)
![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-última-FF3E00?logo=svelte&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-000000?logo=cloudflare&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-habilitada-5A0FC8)
![Español](https://img.shields.io/badge/idioma-es-009150)

> **ESTADO: EN DESARROLLO**
> Este proyecto se encuentra en fase activa de desarrollo. La arquitectura, el
> esquema de datos, las funciones y la interfaz pueden cambiar —a veces de forma
> importante— a lo largo del ciclo. La documentación puede quedar desactualizada
> respecto al código actual. Úsalo bajo tu propia responsabilidad.

LeXi es una **PWA de comunicación aumentativa y alternativa (AAC)**: un tablero
de tarjetas con imágenes que, al pulsarlas, reproducen su sonido en voz
sintetizada o con audio grabado. Está pensado para personas con dificultades de
habla y para el uso por parte de terapeutas y familiares (niños y adultos).

- Web PWA instalable y usable sin conexión (**offline-first**).
- Tarjetas con imagen + sonido (grabación propia o voz sintetizada).
- **Voz personalizada por tarjeta**: graba con el micrófono y la tarjeta la reproduce en lugar del TTS (con indicador visual y disponible sin conexión).
- Teclado virtual para escribir frases y reproducirlas por voz (TTS), con **velocidad ajustable** (1x / 1.5x / 2x) y **teclado físico** en escritorio.
- Editor de tarjetas dentro de la propia app (audio del micrófono) mediante pulsación larga.
- Selección de idioma y de voz TTS.
- Cada dispositivo usa un perfil anónimo (UUID) sin registro ni login, activado con un **código de invitación** (alta manual; modo **demo** de solo lectura).
- Sincronización de datos y audio entre dispositivos vía la nube cuando hay red.

## Estado actual

En desarrollo. Español (`es`) es el único idioma implantado, pero el sistema está
diseñado desde el día 1 para admitir más idiomas (principalmente inglés) con
cambios de datos, no de arquitectura.

## Arquitectura (resumen)

| Capa | Tecnología |
| --- | --- |
| Frontend | Astro (SSG) + islas interactivas **Svelte** |
| PWA | Manifest + Service Worker (`@vite-pwa/astro`) |
| Datos offline | IndexedDB (fuente de verdad del día a día) + cola de sincronización |
| Datos en la nube | Cloudflare **D1** (SQLite serverless) |
| Audio/imágenes | Cloudflare **R2** (lectura vía proxy en el mismo origen) |
| Voz | Web Speech API nativa (SpeechSynthesis), sin coste |
| Micro | MediaRecorder + getUserMedia, 100 % en el cliente, subida a R2 |
| Deploy | Cloudflare Pages (Git integrado) |

Flujo principal: la app trabaja siempre contra IndexedDB y sincroniza a D1/R2
cuando hay conexión (con reintentos diferidos; Background Sync cuando el navegador
lo permite). Los borrados se hacen con *tombstones* y los conflictos se resuelven
con *last-writer-wins* por `updated_at`.

## Cómo empezar (desarrollo local)

Requisitos: Node.js 22+, wrangler.

```bash
git clone https://github.com/LiMPbIzK/lexi.git
cd lexi
npm install
npm run db:local                                 # prepara D1 local (migraciones)
npm run dev                                      # build + wrangler pages dev (http://localhost:8788)
```

Para probar en local necesitas un **código de invitación local** (la BD local es distinta de la remota):

```bash
node scripts/generate-codes.mjs 1 "Mi PC" --local
```

El dispositivo usa un perfil anónimo (UUID) y se activa introduciendo el código. No necesita registro.

## Bot de Telegram (gestión de códigos)

Para generar/revocar/listar códigos de invitación desde el móvil, existe un bot privado (solo responde a tu chat):

1. Crea el bot en [@BotFather](https://t.me/BotFather) y obtén el token.
2. Configura los secrets en Cloudflare Pages:
   ```bash
   npx wrangler pages secret put TELEGRAM_BOT_TOKEN
   npx wrangler pages secret put OWNER_CHAT_ID
   ```
3. Registra el webhook (una vez):
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://lexi-426.pages.dev/telegram/webhook"
   ```

Comandos: `/nuevo [n] [etiqueta]`, `/libres`, `/lista`, `/revocar LEXI-XXXX-XXXX`.

## Puesta en producción

1. Conectar el repo GitHub `LiMPbIzK/lexi` a Cloudflare Pages (build: `npm run build`, salida: `dist`, Node 22) → cada `git push` a `main` despliega automáticamente.
2. Crear la base de datos D1 y aplicar las migraciones en remoto: `npm run db:remote`.
3. Crear el bucket R2 (`lexi-audio`); los bindings D1/R2 se leen del `wrangler.json` del repo.
4. Configurar los secrets del bot de Telegram (`TELEGRAM_BOT_TOKEN`, `OWNER_CHAT_ID`).
5. Generar códigos de invitación para las familias: `node scripts/generate-codes.mjs 5 "Familia García" --remote`.
6. Añadir el dominio `lexi.fmartinezgarcia.com` y verificar el certificado SSL.

## Esquema de datos (D1)

- `users` — perfil anónimo por dispositivo (UUID, locale, voz TTS).
- `devices` — dispositivos registrados (id, código canjeado, modo `full`/`demo`, token de recuperación).
- `invite_codes` — códigos de invitación emitidos manualmente (libre/usado/revocado).
- `device_usage` — acumulados por dispositivo para cuotas de almacenamiento/subidas.
- `categories` — categorías/tableros (id, nombre, color, orden, *tombstone*).
- `cards` — tarjetas (etiqueta, imagen/audio en R2, texto TTS, orden, *tombstone*).
- `recordings` — grabaciones de audio (clave R2, mime webm/aac, duración).
- `events` — estadísticas de uso (tap, hablar, crear, editar).

Diseñado para futuro multiidioma: `label` monolingüe de momento, con camino
previsto hacia `card_translations(card_id, locale, label)` cuando llegue el inglés.

## Hoja de ruta

- [x] Definición de arquitectura y esquema de datos
- [x] Esqueleto Astro + Svelte y primer deploy en Cloudflare Pages
- [x] D1 + R2 vinculados (funciones/API)
- [x] Seed ARASAAC (catálogo base precargado)
- [x] Grid de tarjetas con sonido (audio propio o TTS)
- [x] Teclado virtual en español + TTS
- [x] Editor de tarjetas/tableros
- [x] Sincronización offline-first y estadísticas
- [x] PWA instalable final + verificación del dominio
- [ ] Soporte inicial para inglés

## Licencia y Atribución

- **Código fuente:** El código fuente de LeXi está bajo licencia [AGPL-3.0](LICENSE).
- **Activos visuales (Pictogramas):** Los símbolos pictográficos utilizados son propiedad del Gobierno de Aragón y han sido creados por Sergio Palao para [ARASAAC](http://www.arasaac.org), que los distribuye bajo Licencia Creative Commons [BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).