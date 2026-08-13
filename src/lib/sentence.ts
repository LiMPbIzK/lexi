// Reconstrucción del texto hablable desde la frase.
// Las letras/puntuación del teclado se concatenan sin espacios; las tarjetas
// se separan con espacio; los espacios explícitos del teclado se respetan.

import type { SentenceWord } from '../stores';

const LETTER = /[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9]/;
const TIGHT_PUNCT = new Set(['¿', '¡', ',', '.', ';', ':', '-', ')', ']', '}']);

export function sentenceText(words: SentenceWord[]): string {
  let out = '';
  for (const w of words) {
    if (w.source === 'keyboard') {
      if (w.text === ' ') {
        out += ' ';
      } else if (w.text.length === 1 && (LETTER.test(w.text) || TIGHT_PUNCT.has(w.text))) {
        // letra o puntuación "pegada": concatenar sin espacio
        out += w.text;
      } else {
        // token completo (p. ej. palabra cortada del teclado)
        if (out && !out.endsWith(' ')) out += ' ';
        out += w.text;
      }
    } else {
      // tarjeta: palabra completa separada por espacio
      if (out && !out.endsWith(' ')) out += ' ';
      out += w.text;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}
