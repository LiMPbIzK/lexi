# LeXi — AAC Communicator

![LeXi AAC Web Communicator](banner.en.svg)

[English](README.en.md) | [Español](README.md)

![Status: Under development](https://img.shields.io/badge/status-under%20development-orange)
![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)
![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-latest-FF3E00?logo=svelte&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-000000?logo=cloudflare&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8)
![Spanish](https://img.shields.io/badge/language-es-009150)

> **STATUS: UNDER DEVELOPMENT**
> This project is under active development. Architecture, data schema, features
> and UI may change — sometimes significantly — throughout the cycle.
> Documentation may lag behind the current code. Use at your own risk.

LeXi is an **Augmentative and Alternative Communication (AAC) PWA**: a board of
picture cards that play sound when tapped (synthesized speech or recorded audio).
It is designed for people with speech difficulties and for use by therapists and
families (children and adults).

- Installable, **offline-first** PWA.
- Cards with image + sound (own recording or TTS).
- On-screen keyboard to type sentences and have them spoken (TTS).
- In-app card & board editor (camera/photo + microphone audio).
- Language and TTS voice selection.
- Each device uses an anonymous profile (UUID), no sign-up/login.
- Data and audio sync to the cloud whenever a connection is available.

## Current status

Under development. Spanish (`es`) is the only shipped language, but the system is
designed from day one to support additional languages (mainly English) via data
changes rather than architectural changes.

## Architecture (summary)

| Layer | Technology |
| --- | --- |
| Frontend | Astro (SSG) + **Svelte** interactive islands |
| PWA | Manifest + Service Worker (`@vite-pwa/astro`) |
| Offline data | IndexedDB (day-to-day source of truth) + sync queue |
| Cloud data | Cloudflare **D1** (serverless SQLite) |
| Audio/images | Cloudflare **R2** (read through a same-origin proxy) |
| Voice | Native Web Speech API (SpeechSynthesis), $0 cost |
| Microphone | MediaRecorder + getUserMedia, 100 % client-side, upload to R2 |
| Deploy | Cloudflare Pages (Git integration) |

Core flow: the app always works against IndexedDB and syncs to D1/R2 when online
(deferred retries; Background Sync where the browser supports it). Deletes are
tombstones and conflicts resolve with last-writer-wins on `updated_at`.

## Getting started (local dev)

Requirements: Node.js 22+, wrangler.

```bash
git clone https://github.com/LiMPbIzK/lexi.git
cd lexi
npm install
npx wrangler d1 migrations apply lexidb --local   # prepare local D1
npm run dev                                        # Astro dev
npx wrangler pages dev dist                        # emulate D1/R2/KV locally
```

An anonymous profile (UUID) is created per device. No registration needed.

## Production setup (summary)

1. Connect the GitHub repo `LiMPbIzK/lexi` to Cloudflare Pages (build: `npm run build`, output: `dist`, Node 22).
2. Create the D1 database and apply migrations (`wrangler d1 migrations apply --remote`).
3. Create the R2 bucket and set secrets `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`.
4. Add the `lexi.fmartinezgarcia.com` domain and verify the SSL certificate.

## Data model (D1)

- `users` — anonymous per-device profile (UUID, locale, TTS voice).
- `categories` — categories/boards (id, name, color, sort order, tombstone).
- `cards` — cards (label, image/audio in R2, TTS text, sort order, tombstone).
- `recordings` — audio recordings (R2 key, webm/aac mime, duration).
- `events` — usage stats (tap, speak, create, edit).

Built for future i18n: `label` is monolingual for now, with a planned path toward
`card_translations(card_id, locale, label)` when English lands.

## Roadmap

- [x] Architecture & data-schema definition
- [x] Astro + Svelte skeleton and first Cloudflare Pages deploy
- [x] D1 + R2 bindings (Functions/API)
- [x] ARASAAC core seed (preloaded base catalog)
- [ ] Card grid with sound (own audio or TTS)
- [ ] Spanish on-screen keyboard + TTS
- [ ] Card/board editor
- [ ] Offline-first sync and usage stats
- [ ] Final installable PWA + domain verification
- [ ] Initial English support

## License and Attribution

- **Source code:** The LeXi source code is licensed under [AGPL-3.0](LICENSE).
- **Visual assets (Pictograms):** The pictographic symbols used are the property of the Government of Aragon and have been created by Sergio Palao for [ARASAAC](http://www.arasaac.org), distributed under a Creative Commons [BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.