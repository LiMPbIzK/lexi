/// <reference types="@cloudflare/workers-types" />

// Tipos compartidos de las Functions de Cloudflare Pages.
// Env incluye los bindings definidos en wrangler.json.

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}
