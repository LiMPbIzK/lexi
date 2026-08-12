/**
 * Helpers de la API y CDN de ARASAAC.
 * API de metadatos: https://api.arasaac.org/v1/pictograms/{lang}/search/{term}
 * CDN de imágenes:   https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const API = 'https://api.arasaac.org/v1/pictograms';
const CDN = 'https://static.arasaac.org/pictograms';

const REQUEST_DELAY_MS = 120;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Busca un término y devuelve el mejor pictograma o null.
 * Prioridad: keyword exacta normalizada > aac=true > no schematic > _id menor.
 * Si el término no da resultados exactos, intenta un fallback: la forma base
 * del verbo reflexivo (p. ej. "lavarse" -> "lavar").
 */
export async function searchPictograms(term) {
  let hit = await searchRaw(term);
  if (!hit) {
    const base = reflexiveBase(term);
    if (base && base !== term) {
      hit = await searchRaw(base);
      if (hit) hit.keyword = term; // conserva la etiqueta original del usuario
    }
  }
  return hit;
}

function reflexiveBase(term) {
  const match = /^(.*)se$/.exec(term);
  if (!match) return null;
  const root = match[1];
  return root.length > 2 ? root : null;
}

async function searchRaw(term) {
  const url = `${API}/es/search/${encodeURIComponent(term)}`;
  let json = [];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    json = await res.json();
  } catch (e) {
    console.warn(`⚠ Error de red para "${term}": ${e.message}`);
    return null;
  }

  if (!Array.isArray(json) || json.length === 0) return null;

  const norm = normalize(term);

  const scored = json
    .map((item) => {
      const keywords = Array.isArray(item.keywords) ? item.keywords : [];
      const keyword = keywords[0]?.keyword ?? '';
      const exact = normalize(keyword) === norm;
      let score = 0;
      if (exact) score += 100;
      if (item.aac) score += 30;
      if (!item.schematic) score += 10;
      if (keywords.length > 0 && keywords[0]?.type === 2) score += 5;
      return { item, keyword, score };
    })
    .sort((a, b) => b.score - a.score || a.item._id - b.item._id);

  const best = scored[0];
  if (!best) return null;
  return { _id: best.item._id, keyword: best.keyword, exact: best.score >= 100 };
}

/**
 * Descarga el PNG (500px) del CDN y lo guarda en target. Devuelve true si OK.
 */
export async function downloadPng(id, target) {
  const url = `${CDN}/${id}/${id}_500.png`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`⚠ CDN ${res.status} para id ${id}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, buffer);
    return true;
  } catch (e) {
    console.warn(`⚠ Error descargando ${id}: ${e.message}`);
    return false;
  } finally {
    await delay(REQUEST_DELAY_MS);
  }
}

export function wait(ms = REQUEST_DELAY_MS) {
  return delay(ms);
}
