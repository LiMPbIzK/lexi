# LeXi — Comunicador AAC

[English](README.md) | [Español](README.es.md)

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
- Teclado virtual para escribir frases y reproducirlas por voz (TTS).
- Editor de tarjetas y tableros dentro de la propia app (foto/audio del micrófono).
- Selección de idioma y de voz TTS.
- Cada dispositivo usa un perfil anónimo (UUID) sin registro ni login.
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
npx wrangler d1 migrations apply lexidb --local   # prepara D1 local
npm run dev                                        # Astro dev
npx wrangler pages dev dist                        # simula D1/R2/KV en local
```

Se genera un perfil anónimo en cada dispositivo (UUID). No necesita registro.

## Puesta en producción (resumen)

1. Conectar el repo GitHub `LiMPbIzK/lexi` a Cloudflare Pages (build: `npm run build`, salida: `dist`, Node 22).
2. Crear la base de datos D1 y aplicar las migraciones (`wrangler d1 migrations apply --remote`).
3. Crear el bucket R2 y configurar los secrets `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`.
4. Añadir el dominio `lexi.fmartinezgarcia.com` y verificar el certificado SSL.

## Esquema de datos (D1)

- `users` — perfil anónimo por dispositivo (UUID, locale, voz TTS).
- `categories` — categorías/tableros (id, nombre, color, orden, *tombstone*).
- `cards` — tarjetas (etiqueta, imagen/audio en R2, texto TTS, orden, *tombstone*).
- `recordings` — grabaciones de audio (clave R2, mime webm/aac, duración).
- `events` — estadísticas de uso (tap, hablar, crear, editar).

Diseñado para futuro multiidioma: `label` monolingüe de momento, con camino
previsto hacia `card_translations(card_id, locale, label)` cuando llegue el inglés.

## Hoja de ruta

- [x] Definición de arquitectura y esquema de datos
- [ ] Esqueleto Astro + Svelte y primer deploy en Cloudflare Pages
- [ ] D1 + R2 vinculados (funciones/API)
- [ ] Grid de tarjetas con sonido (audio propio o TTS)
- [ ] Teclado virtual en español + TTS
- [ ] Editor de tarjetas/tableros
- [ ] Sincronización offline-first y estadísticas
- [ ] PWA instalable final + verificación del dominio
- [ ] Soporte inicial para inglés

## Licencia y Atribución

- **Código fuente:** El código fuente de LeXi está bajo licencia [AGPL-3.0](LICENSE).
- **Activos visuales (Pictogramas):** Los símbolos pictográficos utilizados son propiedad del Gobierno de Aragón y han sido creados por Sergio Palao para [ARASAAC](http://www.arasaac.org), que los distribuye bajo Licencia Creative Commons [BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).