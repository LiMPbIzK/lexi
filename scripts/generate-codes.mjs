#!/usr/bin/env node
/**
 * LeXi — Generador de códigos de invitación.
 *
 * Genera códigos, los imprime y opcionalmente los inserta directamente en D1.
 *
 * Uso:
 *   node scripts/generate-codes.mjs                          # 5 códigos
 *   node scripts/generate-codes.mjs 3                        # 3 códigos
 *   node scripts/generate-codes.mjs 3 "Tablet casa García"   # con etiqueta
 *   node scripts/generate-codes.mjs 3 "Familia" --local      # inserta en D1 local
 *   node scripts/generate-codes.mjs 3 "Familia" --remote     # inserta en D1 remoto
 *   node scripts/generate-codes.mjs --sql file.sql           # solo escribe SQL a archivo
 */

import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);

const parseArgs = () => {
  let count = 5;
  let label = 'Dispositivo';
  let target = null; // 'local' | 'remote'
  let sqlFile = null;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--local' || a === '--remote') {
      target = a.slice(2);
    } else if (a === '--sql') {
      sqlFile = argv[++i];
    } else if (/^\d+$/.test(a)) {
      count = Math.min(parseInt(a, 10), 50);
    } else if (!a.startsWith('--')) {
      label = a;
    }
  }
  return { count, label, target, sqlFile };
};

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin I, L, O, 0, 1
function randPart(len) {
  const bytes = randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) {
    s += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return s;
}

async function main() {
  const { count, label, target, sqlFile } = parseArgs();
  const now = Date.now();

  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(`LEXI-${randPart(4)}-${randPart(4)}`);
  }

  console.log('\nCódigos generados:');
  for (const c of codes) {
    console.log(`  ${c}  →  ${label}`);
  }
  console.log();

  if (sqlFile) {
    const sql = codes
      .map(
        (c) =>
          `INSERT OR IGNORE INTO invite_codes (code, label, created_at) VALUES ('${c}', '${label}', ${now});`
      )
      .join('\n');
    writeFileSync(sqlFile, sql + '\n');
    console.log(`✓ SQL guardado en ${sqlFile}`);
  }

  if (target) {
    const values = codes
      .map((c) => `('${c}', '${label}', ${now})`)
      .join(', ');
    const sql = `INSERT OR IGNORE INTO invite_codes (code, label, created_at) VALUES ${values};`;
    console.log(`→ Insertando en D1 (${target})...`);
    const wranglerBin = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
    const res = spawnSync(
      process.execPath,
      [wranglerBin, 'd1', 'execute', 'lexidb', `--${target}`, '--command', sql],
      { encoding: 'utf8' }
    );
    if (res.status === 0) {
      console.log('✓ Códigos insertados en D1.');
    } else {
      console.error('✗ Error al insertar en D1. Revisa que estés autenticado con wrangler.');
      console.error(res.stderr || res.stdout);
      process.exit(1);
    }
  }

  if (!sqlFile && !target) {
    console.log('Consejo: usa --local o --remote para insertarlos directamente en D1.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
