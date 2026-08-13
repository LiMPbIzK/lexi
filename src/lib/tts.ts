// TTS: Web Speech API nativa (SpeechSynthesis), coste $0.
// Abstrae la selección de voz por idioma y persiste la elección.

import { speaking } from '../stores';

const VOICE_KEY = 'lexi:voice-uri';

export type VoiceInfo = {
  uri: string;
  name: string;
  lang: string;
  local: boolean;
};

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
  utterance.rate = 1;
  const voice = findVoice(voiceUri ?? getSavedVoiceUri());
  if (voice) utterance.voice = voice;

  speaking.set(true);
  utterance.onend = () => speaking.set(false);
  utterance.onerror = () => speaking.set(false);

  synth.speak(utterance);
}

export function cancelSpeech(): void {
  if (isSSRAvailable()) {
    window.speechSynthesis.cancel();
  }
  speaking.set(false);
}
