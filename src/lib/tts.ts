// TTS: Web Speech API nativa (SpeechSynthesis), coste $0.
// Abstrae la selección de voz por idioma y persiste la elección.

import { speaking } from '../stores';

const VOICE_KEY = 'lexi:voice-uri';
const RATE_KEY = 'lexi:rate';

export type VoiceInfo = {
  uri: string;
  name: string;
  lang: string;
  local: boolean;
};

/** Velocidades de reproducción TTS disponibles. */
export const SPEED_OPTIONS: number[] = [1, 1.5, 2];
export const DEFAULT_RATE = 1.5;

export function getSavedRate(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_RATE;
  const raw = Number(localStorage.getItem(RATE_KEY));
  return SPEED_OPTIONS.includes(raw) ? raw : DEFAULT_RATE;
}

export function saveRate(rate: number): void {
  localStorage.setItem(RATE_KEY, String(rate));
}

function isSSRAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Lista de voces disponibles (puede cargarse de forma asíncrona). */
export function getVoices(): SpeechSynthesisVoice[] {
  if (!isSSRAvailable()) return [];
  return window.speechSynthesis.getVoices();
}

/** Espera a que las voces estén cargadas (getVoices es async en algunos navegadores). */
export function waitForVoices(timeoutMs = 3000): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const timeout = setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onChange);
      resolve(getVoices());
    }, timeoutMs);
    const onChange = () => {
      clearTimeout(timeout);
      window.speechSynthesis.removeEventListener('voiceschanged', onChange);
      resolve(getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', onChange);
  });
}

/** Voces en español, priorizando es-ES y voces locales. */
export function spanishVoices(voices: SpeechSynthesisVoice[]): VoiceInfo[] {
  return voices
    .filter((v) => v.lang.toLowerCase().startsWith('es'))
    .map((v) => ({ uri: v.voiceURI, name: v.name, lang: v.lang, local: v.localService }))
    .sort((a, b) => {
      // preferir es-ES, luego locales, luego nombre
      const langScore = (x: VoiceInfo) => (x.lang.toLowerCase().startsWith('es-es') ? 0 : 1);
      return langScore(a) - langScore(b) || Number(b.local) - Number(a.local) || a.name.localeCompare(b.name);
    });
}

export function getSavedVoiceUri(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(VOICE_KEY);
}

export function saveVoiceUri(uri: string): void {
  localStorage.setItem(VOICE_KEY, uri);
}

export function findVoice(uri: string | null): SpeechSynthesisVoice | null {
  if (!isSSRAvailable()) return null;
  const voices = getVoices();
  if (uri) {
    const match = voices.find((v) => v.voiceURI === uri);
    if (match) return match;
  }
  // fallback: primera voz es-ES local, luego cualquier es
  const es = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
  return es.find((v) => v.localService) ?? es[0] ?? null;
}

/** Reproduce texto con la voz indicada (o la guardada/fallback). */
export function speak(text: string, voiceUri?: string | null): void {
  if (!isSSRAvailable() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = getSavedRate();
  const voice = findVoice(voiceUri ?? getSavedVoiceUri());
  if (voice) utterance.voice = voice;

  liveUtterance = null;
  speaking.set(true);
  utterance.onend = () => {
    liveUtterance = null;
    speaking.set(false);
  };
  utterance.onerror = () => {
    liveUtterance = null;
    speaking.set(false);
  };

  synth.speak(utterance);
}

export function cancelSpeech(): void {
  if (isSSRAvailable()) {
    window.speechSynthesis.cancel();
  }
  speaking.set(false);
}

// Referencia al utterance TTS actualmente en reproducción (para cambiar la
// velocidad en caliente re-creándolo con el nuevo rate).
let liveUtterance: { text: string; voiceUri: string | null } | null = null;

/**
 * Cambia la velocidad de reproducción TTS en caliente: guarda el nuevo rate y,
 * si hay un utterance en reproducción, lo re-crea con la nueva velocidad.
 * No aplica a audios grabados (playCardAudioEnd), solo al TTS.
 */
export function setLiveRate(rate: number): void {
  saveRate(rate);
  if (!isSSRAvailable()) return;
  const synth = window.speechSynthesis;
  if (liveUtterance) {
    const { text, voiceUri } = liveUtterance;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = rate;
    const voice = findVoice(voiceUri ?? getSavedVoiceUri());
    if (voice) u.voice = voice;
    u.onend = () => {
      liveUtterance = null;
      speaking.set(false);
    };
    u.onerror = () => {
      liveUtterance = null;
      speaking.set(false);
    };
    liveUtterance = { text, voiceUri };
    synth.speak(u);
  }
}

/**
 * Reproduce texto con TTS y resuelve cuando termina (o falla).
 * Se usa para encadenar la reproducción palabra a palabra en la frase.
 */
export function speakEnd(text: string, voiceUri?: string | null): Promise<void> {
  return new Promise((resolve) => {
    if (!isSSRAvailable() || !text.trim()) {
      resolve();
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = getSavedRate();
    const voice = findVoice(voiceUri ?? getSavedVoiceUri());
    if (voice) utterance.voice = voice;

    speaking.set(true);
    liveUtterance = { text, voiceUri: voiceUri ?? getSavedVoiceUri() };

    const finish = () => {
      if (liveUtterance && liveUtterance.text === text) liveUtterance = null;
      speaking.set(false);
      resolve();
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    synth.speak(utterance);
  });
}
