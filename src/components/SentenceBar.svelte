<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { useStore } from '@nanostores/svelte-runes';
  import { sentence, keyboardOpen, speaking, cards, syncSentenceWithCards, playbackStop, reproducing } from '../stores';
  import { speakEnd, cancelSpeech } from '../lib/tts';
  import { playCardAudioEnd, stopActiveAudio } from '../lib/audio';
  import { sentenceChunks } from '../lib/sentence';
  import { db } from '../lib/db';
  import { getUserId } from '../lib/user';
  import SpeedSelector from './SpeedSelector.svelte';

  const s = useStore(sentence);
  const kbOpen = useStore(keyboardOpen);
  const isSpeaking = useStore(speaking);
  const isReproducing = useStore(reproducing);

  // -------------------------------------------------------------
  // Teclado físico (solo escritorio): permite escribir directamente
  // en la frase sin usar el teclado virtual (que se mantiene intacto).
  // -------------------------------------------------------------
  function isDesktop(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches;
  }

  function isEditableTarget(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  function pushPhysical(text: string) {
    sentence.set([...sentence.get(), { text, source: 'keyboard' }]);
  }

  function onPhysicalKeyDown(event: KeyboardEvent) {
    if (!isDesktop()) return;
    if (isEditableTarget(event.target)) return;
    // no interferir con atajos del navegador ni acciones del editor
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === 'Enter') {
      // Enter habla la frase (equivalente a pulsar Hablar)
      event.preventDefault();
      void speakSentence();
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      const cur = sentence.get();
      sentence.set(cur.slice(0, -1));
      return;
    }
    if (event.key.length === 1) {
      // carácter imprimible: añadirlo a la frase
      pushPhysical(event.key);
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onPhysicalKeyDown);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', onPhysicalKeyDown);
    }
  });

  async function speakSentence() {
    // registrar evento de uso (local; se sincroniza con pushNow)
    try {
      await db.recordEvent({
        id: crypto.randomUUID(),
        user_id: getUserId(),
        card_id: null,
        verb: 'hablar',
        at: Date.now()
      });
    } catch {
      /* no crítico */
    }

    // re-sincronizar contra el estado actual de las tarjetas antes de reproducir:
    // si un audio personalizado se quitó, la palabra sonará con TTS
    syncSentenceWithCards(cards.get());

    const chunks = sentenceChunks(sentence.get());
    if (chunks.length === 0) return;

    playbackStop.set(false);
    reproducing.set(true);

    // Recorrer los chunks agrupando las palabras TTS consecutivas en un solo
    // utterance (elimina micro-pausas y sensación de robot). Solo se separa
    // cuando hay un audio personalizado en medio.
    let ttsBuffer = '';

    const flushTts = async () => {
      const text = ttsBuffer.trim();
      ttsBuffer = '';
      if (!text) return;
      await speakEnd(text);
    };

    for (const chunk of chunks) {
      if (playbackStop.get()) break;

      if (chunk.customVoice && chunk.audioKey) {
        await flushTts();
        if (playbackStop.get()) break;
        const played = await playCardAudioEnd(chunk.audioKey);
        if (!played && chunk.text.trim()) {
          // fallback: audio no disponible (sin red/caché) -> TTS
          await speakEnd(chunk.text);
        }
      } else if (chunk.text.trim()) {
        ttsBuffer += (ttsBuffer ? ' ' : '') + chunk.text.trim();
      }
    }

    if (!playbackStop.get()) {
      await flushTts();
    }

    speaking.set(false);
    playbackStop.set(false);
    reproducing.set(false);
  }

  function stopAll() {
    playbackStop.set(true);
    cancelSpeech();
    stopActiveAudio();
    speaking.set(false);
    reproducing.set(false);
  }

  /** Botón protagonista: alterna entre Hablar y Parar según si está reproduciendo. */
  function togglePlay() {
    if (isReproducing.current) {
      stopAll();
    } else {
      void speakSentence();
    }
  }

  function clear() {
    sentence.set([]);
  }

  function removeLast() {
    const cur = sentence.get();
    sentence.set(cur.slice(0, -1));
  }

  function toggleKeyboard() {
    keyboardOpen.set(!keyboardOpen.get());
  }
</script>

<div class="sentence-bar">
  <div class="sentence-display" aria-label="Frase">
    {#if s.current.length === 0}
      <span class="placeholder">Toca tarjetas o escribe…</span>
    {:else}
      <span class="sentence-text">
        {#each sentenceChunks(s.current) as chunk, i (i)}
          <span class="word" class:custom-voice={chunk.customVoice}>{chunk.text}</span>{' '}
        {/each}
      </span>
    {/if}
  </div>

  <div class="sentence-actions">
    <div class="primary-row">
      <button
        type="button"
        class="btn btn-speak"
        class:reproducing={isReproducing.current}
        onclick={togglePlay}
        aria-label={isReproducing.current ? 'Detener la reproducción' : 'Reproducir la frase'}
        disabled={s.current.length === 0}
      >
        <span class="btn-icon">{isReproducing.current ? '⏹️' : '🔊'}</span>
        <span class="btn-caption">{isReproducing.current ? 'Parar' : 'Hablar'}</span>
      </button>

      <SpeedSelector />
    </div>

    <div class="secondary-row">
      <button
        type="button"
        class="btn btn-secondary"
        class:active={kbOpen.current}
        onclick={toggleKeyboard}
        aria-label="Abrir o cerrar teclado"
      >
        <span class="btn-icon">⌨️</span>
        <span class="btn-caption">Teclado</span>
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        onclick={removeLast}
        aria-label="Quitar última palabra"
        disabled={s.current.length === 0}
      >
        <span class="btn-icon">⌫</span>
        <span class="btn-caption">Borrar</span>
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        onclick={clear}
        aria-label="Vaciar la frase"
        disabled={s.current.length === 0}
      >
        <span class="btn-icon">🗑️</span>
        <span class="btn-caption">Vaciar</span>
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        onclick={stopAll}
        aria-label="Detener la reproducción"
        disabled={!isReproducing.current}
      >
        <span class="btn-icon">⏹️</span>
        <span class="btn-caption">Parar</span>
      </button>
    </div>
  </div>
</div>

<style>
  .sentence-bar {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 0.75rem 1rem;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: var(--shadow);
  }

  .sentence-display {
    min-height: 2.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    padding: 0.35rem 0.6rem;
    border: 1px dashed var(--border);
    border-radius: calc(var(--radius) / 2);
  }

  .placeholder {
    color: var(--text-muted);
  }

  .sentence-text {
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* palabra de tarjeta con voz personalizada: resaltada según el tema */
  .word.custom-voice {
    color: var(--voice-custom);
    font-weight: 800;
  }

  .sentence-actions {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .primary-row {
    display: flex;
    gap: 0.5rem;
  }

  .primary-row .btn-speak {
    flex: 1;
  }

  .secondary-row {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;
    padding: 0.4rem 0.5rem;
    border-radius: calc(var(--radius) / 2);
  }

  .btn-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  .btn-caption {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .btn.active {
    background: var(--primary-soft);
    border-color: var(--primary);
  }

  /* Botón protagonista: Hablar */
  .btn-speak {
    min-height: 4.5rem;
    flex-direction: row;
    gap: 0.6rem;
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
    font-size: 1.4rem;
    box-shadow: var(--shadow);
  }

  .btn-speak .btn-icon {
    font-size: 1.8rem;
  }

  .btn-speak .btn-caption {
    font-size: 1.1rem;
    color: #fff;
  }

  .btn-speak:active:not(:disabled) {
    background: var(--primary-soft);
    color: var(--text);
    border-color: var(--primary);
  }

  /* Estado "reproduciendo": el botón protagonista actúa como Parar */
  .btn-speak.reproducing {
    background: var(--error);
    border-color: var(--error);
  }

  .btn-speak:disabled {
    opacity: 0.45;
  }

  /* Botones secundarios compactos */
  .btn-secondary {
    flex: 1;
    min-width: 4rem;
    font-size: 0.9rem;
  }

  .btn-secondary .btn-icon {
    font-size: 1.05rem;
  }

  .btn-secondary:disabled {
    opacity: 0.4;
  }
</style>
