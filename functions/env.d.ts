/// <reference types="@cloudflare/workers-types" />

// Tipos compartidos de las Functions de Cloudflare Pages.
// Env incluye los bindings y vars definidos en wrangler.json.

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  MAX_AUDIO_PER_DEVICE: number;
  MAX_BYTES_PER_DEVICE: number;
  MAX_UPLOADS_PER_HOUR: number;
  MAX_RECORDING_MS: number;
  TELEGRAM_BOT_TOKEN?: string;
  OWNER_CHAT_ID?: number;
}
