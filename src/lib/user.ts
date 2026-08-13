// Gestión del perfil anónimo por dispositivo (UUID).
// Sin auth en el MVP: cada dispositivo = un user con su UUID.

import type { User } from './types';

const USER_KEY = 'lexi:user-id';
const INVITE_KEY = 'lexi:invite-code';
const MODE_KEY = 'lexi:mode';

export function uuid(): string {
  return crypto.randomUUID();
}

export function getUserId(): string {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

/** Código de invitación ya canjeado en este dispositivo (o null). */
export function getInviteCode(): string | null {
  return localStorage.getItem(INVITE_KEY);
}

export function saveInviteCode(code: string): void {
  localStorage.setItem(INVITE_KEY, code);
}

/** Modo del dispositivo: 'full' | 'demo' | null (no registrado). */
export function getDeviceMode(): 'full' | 'demo' | null {
  const mode = localStorage.getItem(MODE_KEY);
  return mode === 'demo' ? 'demo' : mode === 'full' ? 'full' : null;
}

export function saveDeviceMode(mode: 'full' | 'demo'): void {
  localStorage.setItem(MODE_KEY, mode);
}

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: getUserId(),
    display_name: null,
    locale: 'es',
    voice_uri: null,
    theme: 'neutral',
    created_at: Date.now(),
    last_seen_at: Date.now(),
    ...overrides
  };
}
