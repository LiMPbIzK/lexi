import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = join(root, 'public', 'favicon.svg');
const outDir = join(root, 'public', 'icons');

mkdirSync(outDir, { recursive: true });

const sizes = [
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
  { size: 512, file: 'icon-maskable-512.png', maskable: true }
];

for (const { size, file, maskable } of sizes) {
  const buffer = await sharp(svg).resize(size, size).png().toBuffer();

  let final = buffer;
  if (maskable) {
    const canvas = await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } }
    })
      .composite([
        {
          input: buffer,
          gravity: 'center'
        }
      ])
      .png()
      .toBuffer();
    final = canvas;
  }

  await sharp(final).toFile(join(outDir, file));
  console.log(`✓ ${file} (${size}x${size})`);
}
