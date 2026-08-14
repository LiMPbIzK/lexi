// Gestión del perfil anónimo por dispositivo (UUID).
// Sin auth en el MVP: cada dispositivo = un user con su UUID.
// Persistencia dual: localStorage (rápido) + IndexedDB (respaldo), para que
// si el navegador limpia localStorage (p. ej. Android) no se pierda el UUID
// y el dispositivo siga siendo reconocido por el servidor.

import { db } from './db';
import type { User } from './types';

const USER_KEY = 'lexi:user-id';
const INVITE_KEY = 'lexi:invite-code';
const MODE_KEY = 'lexi:mode';
const TOKEN_KEY = 'lexi:device-token';

export function uuid(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------
// getters con respaldo en IndexedDB (async)
// ---------------------------------------------------------------

export async function getUserIdAsync(): Promise<string> {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = await db.getMeta(USER_KEY);
    if (id) localStorage.setItem(USER_KEY, id);
  }
  if (!id) {
    id = uuid();
    localStorage.setItem(USER_KEY, id);
    await db.setMeta(USER_KEY, id);
  }
  return id;
}

/** Versión síncrona (para no tocar callers). Usa el valor de localStorage o genera. */
export function getUserId(): string {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(USER_KEY, id);
    // respaldo asíncrono, sin bloquear
    void db.setMeta(USER_KEY, id);
  }
  return id;
}

export async function getInviteCodeAsync(): Promise<string | null> {
  let code = localStorage.getItem(INVITE_KEY);
  if (!code) {
    code = (await db.getMeta(INVITE_KEY)) ?? null;
    if (code) localStorage.setItem(INVITE_KEY, code);
  }
  return code;
}

/** Código de invitación ya canjeado en este dispositivo (o null). */
export function getInviteCode(): string | null {
  return localStorage.getItem(INVITE_KEY);
}

export async function saveInviteCodeAsync(code: string): Promise<void> {
  localStorage.setItem(INVITE_KEY, code);
  await db.setMeta(INVITE_KEY, code);
}

export function saveInviteCode(code: string): void {
  localStorage.setItem(INVITE_KEY, code);
  void db.setMeta(INVITE_KEY, code);
}

export async function getDeviceModeAsync(): Promise<'full' | 'demo' | null> {
  let mode = localStorage.getItem(MODE_KEY);
  if (!mode) {
    mode = (await db.getMeta(MODE_KEY)) ?? null;
    if (mode) localStorage.setItem(MODE_KEY, mode);
  }
  return mode === 'demo' ? 'demo' : mode === 'full' ? 'full' : null;
}

/** Modo del dispositivo: 'full' | 'demo' | null (no registrado). */
export function getDeviceMode(): 'full' | 'demo' | null {
  const mode = localStorage.getItem(MODE_KEY);
  return mode === 'demo' ? 'demo' : mode === 'full' ? 'full' : null;
}

export async function saveDeviceModeAsync(mode: 'full' | 'demo'): Promise<void> {
  localStorage.setItem(MODE_KEY, mode);
  await db.setMeta(MODE_KEY, mode);
}

export function saveDeviceMode(mode: 'full' | 'demo'): void {
  localStorage.setItem(MODE_KEY, mode);
  void db.setMeta(MODE_KEY, mode);
}

// ---------------------------------------------------------------
// Token de recuperación (para re-claim si cambió el UUID)
// ---------------------------------------------------------------

export async function getDeviceTokenAsync(): Promise<string | null> {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = (await db.getMeta(TOKEN_KEY)) ?? null;
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function getDeviceToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function saveDeviceTokenAsync(token: string): Promise<void> {
  localStorage.setItem(TOKEN_KEY, token);
  await db.setMeta(TOKEN_KEY, token);
}

export function saveDeviceToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  void db.setMeta(TOKEN_KEY, token);
}

/** Borra el registro local (código + modo + token) para poder volver a canjear. */
export function clearDeviceRegistration(): void {
  localStorage.removeItem(INVITE_KEY);
  localStorage.removeItem(MODE_KEY);
  void db.removeMeta(INVITE_KEY);
  void db.removeMeta(MODE_KEY);
}

/** Restaura el perfil desde IndexedDB si localStorage quedó vacío. Devuelve true si restauró algo. */
export async function restoreProfileFromBackup(): Promise<boolean> {
  let restored = false;
  if (!localStorage.getItem(USER_KEY)) {
    const id = await db.getMeta(USER_KEY);
    if (id) {
      localStorage.setItem(USER_KEY, id);
      restored = true;
    }
  }
  if (!localStorage.getItem(INVITE_KEY)) {
    const code = await db.getMeta(INVITE_KEY);
    if (code) {
      localStorage.setItem(INVITE_KEY, code);
      restored = true;
    }
  }
  if (!localStorage.getItem(MODE_KEY)) {
    const mode = await db.getMeta(MODE_KEY);
    if (mode) {
      localStorage.setItem(MODE_KEY, mode);
      restored = true;
    }
  }
  if (!localStorage.getItem(TOKEN_KEY)) {
    const token = await db.getMeta(TOKEN_KEY);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      restored = true;
    }
  }
  return restored;
}

export interface DeviceStatus {
  registered: boolean;
  mode: 'full' | 'demo' | null;
}

/**
 * Consulta el estado REAL del dispositivo al servidor (fuente de verdad).
 * No se fía solo de localStorage (que Android puede limpiar).
 */
export async function fetchDeviceStatus(): Promise<DeviceStatus> {
  try {
    const res = await fetch('/api/device/status', {
      headers: { 'X-Device-Id': getUserId() }
    });
    if (!res.ok) return { registered: false, mode: null };
    return (await res.json()) as DeviceStatus;
  } catch {
    return { registered: false, mode: null };
  }
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
