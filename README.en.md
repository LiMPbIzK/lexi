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
- **Per-card custom voice**: record with the microphone and the card plays it instead of TTS (with a visual indicator, available offline).
- On-screen keyboard to type sentences and have them spoken (TTS), with **adjustable speed** (1x / 1.5x / 2x) and **physical keyboard** support on desktop.
- In-app card editor (microphone audio) via long-press.
- Language and TTS voice selection.
- Each device uses an anonymous profile (UUID), activated with an **invite code** (manual issuance; **demo** read-only mode).
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
npm run db:local                                 # prepare local D1 (migrations)
npm run dev                                      # build + wrangler pages dev (http://localhost:8788)
```

For local testing you need a **local invite code** (the local DB is separate from the remote one):

```bash
node scripts/generate-codes.mjs 1 "My PC" --local
```

Each device uses an anonymous profile (UUID) and is activated by entering the code. No registration needed.

## Telegram bot (invite-code management)

To generate/revoke/list invite codes from your phone, there is a private bot (only replies to your chat):

1. Create the bot via [@BotFather](https://t.me/BotFather) and get the token.
2. Configure the secrets in Cloudflare Pages:
   ```bash
   npx wrangler pages secret put TELEGRAM_BOT_TOKEN
   npx wrangler pages secret put OWNER_CHAT_ID
   ```
3. Register the webhook (once):
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://lexi-426.pages.dev/telegram/webhook"
   ```

Commands: `/nuevo [n] [label]`, `/libres`, `/lista`, `/revocar LEXI-XXXX-XXXX`.

## Production setup

1. Connect the GitHub repo `LiMPbIzK/lexi` to Cloudflare Pages (build: `npm run build`, output: `dist`, Node 22) → every `git push` to `main` deploys automatically.
2. Create the D1 database and apply migrations remotely: `npm run db:remote`.
3. Create the R2 bucket (`lexi-audio`); D1/R2 bindings are read from the repo's `wrangler.json`.
4. Configure the Telegram bot secrets (`TELEGRAM_BOT_TOKEN`, `OWNER_CHAT_ID`).
5. Generate invite codes for families: `node scripts/generate-codes.mjs 5 "García family" --remote`.
6. Add the `lexi.fmartinezgarcia.com` domain and verify the SSL certificate.

## Data model (D1)

- `users` — anonymous per-device profile (UUID, locale, TTS voice).
- `devices` — registered devices (id, claimed code, mode `full`/`demo`, recovery token).
- `invite_codes` — manually issued invite codes (free/used/revoked).
- `device_usage` — per-device totals for storage/upload quotas.
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
- [x] Card grid with sound (own audio or TTS)
- [x] Spanish on-screen keyboard + TTS
- [x] Card/board editor
- [ ] Offline-first sync and usage stats
- [ ] Final installable PWA + domain verification
- [ ] Initial English support

## License and Attribution

- **Source code:** The LeXi source code is licensed under [AGPL-3.0](LICENSE).
- **Visual assets (Pictograms):** The pictographic symbols used are the property of the Government of Aragon and have been created by Sergio Palao for [ARASAAC](http://www.arasaac.org), distributed under a Creative Commons [BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.