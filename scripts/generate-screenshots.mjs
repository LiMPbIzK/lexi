import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Genera screenshots placeholder del manifest (form_factor narrow/wide).
// Son representaciones estilizadas de la app; sustituir por capturas reales
// cuando haya un entorno de preview estable.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'screenshots');
mkdirSync(outDir, { recursive: true });

const CARDS = [
  ['#4ade80', 'Comer'],
  ['#fde047', 'Agua'],
  ['#fb923c', 'Dormir'],
  ['#60a5fa', 'Jugar'],
  ['#f472b6', 'Casa'],
  ['#a3e635', 'Sí'],
  ['#f87171', 'No'],
  ['#c084fc', 'Ayuda'],
  ['#34d399', 'Gracias'],
  ['#facc15', 'Abrir'],
  ['#38bdf8', 'Quiero'],
  ['#fb7185', 'Para']
];

function appSvg(w, h, cols) {
  const gap = 14;
  const pad = 18;
  const cardW = (w - pad * 2 - gap * (cols - 1)) / cols;
  const cardH = (cardW * 0.82) | 0;

  const topH = 56;
  const bottomH = 92;

  const cards = CARDS.map(([color, label], i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = pad + col * (cardW + gap);
    const y = topH + pad + row * (cardH + gap);
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="12" fill="${color}"/>
        <circle cx="${x + cardW * 0.5}" cy="${y + cardH * 0.38}" r="${cardW * 0.16}" fill="rgba(255,255,255,0.85)"/>
        <text x="${x + cardW * 0.5}" y="${y + cardH * 0.72}" font-family="system-ui, sans-serif" font-size="${Math.min(20, cardW * 0.16)}" font-weight="700" fill="#1f2937" text-anchor="middle">${label}</text>
      </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#f8fafc"/>
    <rect width="${w}" height="${topH}" fill="#0f172a"/>
    <text x="${pad}" y="${(topH / 2) + 6}" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">LeXi</text>
    ${cards}
    <rect x="0" y="${h - bottomH}" width="${w}" height="${bottomH}" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="${pad}" y="${h - bottomH + 14}" width="${w - pad * 2}" height="40" rx="8" fill="#f1f5f9"/>
    <rect x="${w - pad - 170}" y="${h - bottomH + 66}" width="170" height="18" rx="9" fill="#2563eb"/>
  </svg>`;
}

const targets = [
  { file: 'lexi-mobile.png', w: 750, h: 1334, cols: 3, form: 'narrow' },
  { file: 'lexi-desktop.png', w: 1280, h: 720, cols: 8, form: 'wide' }
];

for (const t of targets) {
  const svg = appSvg(t.w, t.h, t.cols);
  await sharp(Buffer.from(svg)).png().toFile(join(outDir, t.file));
  console.log(`✓ ${t.file} (${t.w}x${t.h}, ${t.form})`);
}
