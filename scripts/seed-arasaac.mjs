#!/usr/bin/env node
/**
 * LeXi — Seed ARASAAC
 *
 * Genera el catálogo base de pictogramas desde la API y CDN de ARASAAC:
 *   - Busca cada término en /v1/pictograms/es/search/{term}
 *   - Elige el mejor match (keyword exacta, aac, no schematic)
 *   - Genera public/arasaac-manifest.json
 *   - Genera migrations/0002_seed_arasaac.sql (idempotente, user_id = NULL)
 *   - Con --download: descarga PNGs del CDN a public/assets/arasaac/
 *
 * Uso:
 *   node scripts/seed-arasaac.mjs            # solo manifest + SQL
 *   node scripts/seed-arasaac.mjs --download # además descarga PNGs
 *   node scripts/seed-arasaac.mjs --check    # exit 1 si hubo cambios
 *
 * Detección de cambios: --check regenera el manifest en memoria (sin el campo
 * `generated`) y lo compara con el public/arasaac-manifest.json commiteado.
 * Si difieren -> exit 1 (hay cambios). No escribe nada.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchPictograms, downloadPng } from './lib/arasaac.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vocabPath = join(root, 'data', 'core-vocab.es.json');
const manifestPath = join(root, 'public', 'arasaac-manifest.json');
const seedSqlPath = join(root, 'migrations', '0002_seed_arasaac.sql');
const assetsDir = join(root, 'public', 'assets', 'arasaac');

const FLAG_CHECK = process.argv.includes('--check');
const FLAG_DOWNLOAD = process.argv.includes('--download');

// Construye el objeto manifest (determinista, sin `generated`).
function buildManifest(vocab, results) {
  return {
    version: vocab.version,
    updated: vocab.updated,
    categories: vocab.categories.map((cat) => ({
      slug: cat.slug,
      label: cat.label,
      color: cat.color,
      emoji: cat.emoji,
      cards: cat.terms
        .filter((t) => results[cat.slug]?.[t])
        .map((t) => ({
          label: t,
          id: results[cat.slug][t].id,
          image: results[cat.slug][t].imageKey,
          keyword: results[cat.slug][t].keyword
        }))
    }))
  };
}

async function main() {
  const vocab = JSON.parse(readFileSync(vocabPath, 'utf-8'));

  // 1. Resolver términos -> pictograma (con caché para no repetir búsquedas)
  const results = {}; // slug -> { term -> {id, keyword, imageKey, exact} }
  const overrides = vocab.overrides ?? {};
  for (const cat of vocab.categories) {
    const catMap = {};
    for (const term of cat.terms) {
      const searchTerm = overrides[term] ?? term;
      const hit = await searchPictograms(searchTerm);
      if (hit) {
        catMap[term] = {
          id: hit._id,
          keyword: hit.keyword,
          exact: hit.exact ?? false,
          imageKey: `arasaac/${hit._id}.png`
        };
        if (!hit.exact && !overrides[term]) {
          console.warn(`⚠ Match aproximado para "${term}": pictograma "${hit.keyword}" (id ${hit._id})`);
        }
      } else {
        console.warn(`⚠ Sin pictograma para: "${term}"`);
      }
    }
    results[cat.slug] = catMap;
  }

  // 2. Check: comparar manifest regenerado (sin `generated`) con el commiteado
  const currentManifest = buildManifest(vocab, results);

  if (FLAG_CHECK) {
    let changed = true;
    let note = 'manifest no encontrado';
    if (existsSync(manifestPath)) {
      const committed = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      // descarta el campo `generated` (timestamp) del commiteado
      delete committed.generated;
      changed = JSON.stringify(currentManifest) !== JSON.stringify(committed);
      note = changed ? 'hay cambios respecto al commiteado' : 'sin cambios';
    }
    console.log(changed ? `✏ ${note}.` : `✓ ${note}.`);
    process.exit(changed ? 1 : 0);
  }

  // 3. Descargar PNGs si se pide
  if (FLAG_DOWNLOAD) {
    mkdirSync(assetsDir, { recursive: true });
    const ids = new Set();
    for (const cat of Object.values(results)) {
      for (const t of Object.values(cat)) ids.add(t.id);
    }
    console.log(`Descargando ${ids.size} pictogramas a ${assetsDir} ...`);
    let ok = 0;
    for (const id of ids) {
      const target = join(assetsDir, `${id}.png`);
      if (existsSync(target)) { ok++; continue; }
      const saved = await downloadPng(id, target);
      if (saved) ok++;
    }
    console.log(`✓ ${ok}/${ids.size} imágenes listas.`);
  }

  // 4. Manifest para la app
  const manifest = {
    ...currentManifest,
    generated: new Date().toISOString()
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  // 5. SQL de seed idempotente
  const now = Date.now();
  const sqlLines = [
    `-- LeXi — Migración 0002: seed ARASAAC (generado por scripts/seed-arasaac.mjs)`,
    `-- NO editar a mano: se regenera con el script.`,
    ``,
    `-- Categorías (catálogo global, user_id = NULL)`
  ];

  const catId = (slug) => `arasaac-cat-${slug}`;
  const slugTerm = (term) =>
    term
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  const cardId = (slug, term) => `arasaac-card-${slug}-${slugTerm(term)}`;

  for (const cat of vocab.categories) {
    const slug = cat.slug;
    if (!results[slug]) continue;
    const hasCards = Object.keys(results[slug]).length > 0;
    if (!hasCards) continue;
    sqlLines.push(
      `INSERT OR IGNORE INTO categories (id, user_id, parent_id, name, color, icon_key, sort_order, created_at, updated_at, deleted_at)`,
      `VALUES ('${catId(slug)}', NULL, NULL, '${cat.label}', '${cat.color}', NULL, ${vocab.categories.indexOf(cat)}, ${now}, ${now}, NULL);`
    );
  }

  sqlLines.push(``, `-- Tarjetas (catálogo global)`);
  for (const cat of vocab.categories) {
    const slug = cat.slug;
    const entries = Object.entries(results[slug] ?? {});
    for (let i = 0; i < entries.length; i++) {
      const [term, hit] = entries[i];
      // label = término del vocabulario (lo que ve y oye el usuario);
      // tts_text también = término. El keyword de ARASAAC queda solo en el manifest.
      sqlLines.push(
        `INSERT OR IGNORE INTO cards (id, user_id, category_id, label, image_key, audio_key, tts_text, sort_order, created_at, updated_at, deleted_at)`,
        `VALUES ('${cardId(slug, term)}', NULL, '${catId(slug)}', '${term}', '${hit.imageKey}', NULL, '${term}', ${i}, ${now}, ${now}, NULL);`
      );
    }
  }

  writeFileSync(seedSqlPath, sqlLines.join('\n') + '\n');
  console.log(`✓ Manifest: ${manifestPath}`);
  console.log(`✓ Seed SQL: ${seedSqlPath}`);
}

main().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
