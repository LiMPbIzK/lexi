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

export interface SentenceChunk {
  text: string;
  customVoice: boolean;
  audioKey: string | null;
}

/**
 * Segmenta la frase en palabras individuales (para render con resaltado y
 * reproducción palabra a palabra). Las letras del teclado se agrupan en una
 * palabra; los espacios explícitos se conservan como separadores entre
 * palabras (no generan chunk propio).
 */
export function sentenceChunks(words: SentenceWord[]): SentenceChunk[] {
  const chunks: SentenceChunk[] = [];
  let buffer = '';
  let bufferCustom = false;
  let bufferAudioKey: string | null = null;

  function flush() {
    if (buffer) {
      chunks.push({ text: buffer, customVoice: bufferCustom, audioKey: bufferAudioKey });
      buffer = '';
      bufferCustom = false;
      bufferAudioKey = null;
    }
  }

  for (const w of words) {
    if (w.source === 'keyboard') {
      if (w.text === ' ') {
        // espacio: separa la palabra actual
        flush();
        continue;
      }
      if (w.text.length === 1 && (LETTER.test(w.text) || TIGHT_PUNCT.has(w.text))) {
        // letra suelta: se agrupa con la palabra en construcción
        buffer += w.text;
        continue;
      }
      // token completo (pega a la palabra actual con un espacio previo si hay)
      if (buffer && !buffer.endsWith(' ')) {
        flush();
      }
      buffer += w.text;
    } else {
      // tarjeta: nueva palabra
      flush();
      buffer = w.text;
      bufferCustom = !!w.customVoice;
      bufferAudioKey = w.audioKey ?? null;
    }
  }
  flush();
  return chunks;
}
