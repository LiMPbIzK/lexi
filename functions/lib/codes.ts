// Generación de códigos de invitación (compartida entre scripts y el bot).

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin I, L, O, 0, 1

function randPart(len: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let s = '';
  for (let i = 0; i < len; i++) {
    s += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return s;
}

/** Genera un código con formato LEXI-XXXX-XXXX. */
export function generateCode(): string {
  return `LEXI-${randPart(4)}-${randPart(4)}`;
}

/** Normaliza/valida un código introducido (máscara de cliente). */
export function normalizeCode(raw: string): string {
  const upper = raw.toUpperCase().trim();
  const withoutPrefix = upper.startsWith('LEXI-') ? upper.slice(5) : upper;
  const clean = withoutPrefix.replace(/[^A-HJKMNPQRSTUVWXYZ23456789]/g, '').slice(0, 8);
  const first = clean.slice(0, 4);
  const second = clean.slice(4, 8);
  const body = second ? `${first}-${second}` : first;
  return `LEXI-${body}`;
}

/** Indica si un código está completo (formato exacto LEXI-XXXX-XXXX). */
export function isCodeComplete(code: string): boolean {
  return /^LEXI-[A-HJKMNPQRSTUVWXYZ23456789]{4}-[A-HJKMNPQRSTUVWXYZ23456789]{4}$/.test(code);
}
