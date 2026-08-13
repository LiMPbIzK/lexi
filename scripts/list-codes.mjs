#!/usr/bin/env node
/**
 * LeXi — Listado de códigos de invitación.
 *
 * Consulta D1 y muestra el estado de cada código.
 *
 * Uso:
 *   node scripts/list-codes.mjs           # D1 local
 *   node scripts/list-codes.mjs --remote  # D1 remoto
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const target = process.argv.includes('--remote') ? '--remote' : '--local';

const sql = `SELECT code, label, created_at, claimed_by, claimed_at, revoked_at
FROM invite_codes
ORDER BY created_at DESC LIMIT 100;`;

console.log(`→ Consultando D1 (${target === '--remote' ? 'remoto' : 'local'})...\n`);

// Binario de wrangler sin pasar por .cmd (evita problemas de shell en Windows)
const wranglerBin = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const res = spawnSync(process.execPath, [wranglerBin, 'd1', 'execute', 'lexidb', target, '--json', '--command', sql], {
  encoding: 'utf8'
});

if (res.status !== 0) {
  console.error('✗ Error al consultar D1. Revisa wrangler (autenticación/BD).');
  console.error(res.stderr || res.stdout);
  process.exit(1);
}

const start = res.stdout.indexOf('[');
if (start === -1) {
  console.error('✗ Salida inesperada de wrangler.');
  process.exit(1);
}

const rows = JSON.parse(res.stdout.slice(start))[0]?.results ?? [];
if (rows.length === 0) {
  console.log('No hay códigos en la base de datos.');
  process.exit(0);
}

console.log(`Códigos (${rows.length}):\n`);
for (const r of rows) {
  const alta = new Date(r.created_at).toLocaleString('es-ES');
  let state = '🟢 Libre';
  if (r.revoked_at) state = '🔴 Revocado';
  else if (r.claimed_by) state = '🔵 Usado';

  console.log(`  ${r.code}`);
  console.log(`    Etiqueta: ${r.label}`);
  console.log(`    Alta: ${alta} · ${state}`);
  if (r.claimed_by) {
    console.log(`    UUID: ${r.claimed_by}`);
    console.log(`    Uso: ${new Date(r.claimed_at).toLocaleString('es-ES')}`);
  }
  console.log();
}
