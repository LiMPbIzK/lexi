<script lang="ts">
  import { useStore } from '@nanostores/svelte-runes';
  import { sentence, keyboardOpen, speaking } from '../stores';
  import { speak, cancelSpeech } from '../lib/tts';
  import { sentenceText } from '../lib/sentence';

  const s = useStore(sentence);
  const kbOpen = useStore(keyboardOpen);
  const isSpeaking = useStore(speaking);

  function speakSentence() {
    const text = sentenceText(sentence.get());
    if (text) speak(text);
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
      <span class="sentence-text">{sentenceText(s.current)}</span>
    {/if}
  </div>

  <div class="sentence-actions">
    <button
      type="button"
      class="btn btn-speak"
      onclick={speakSentence}
      aria-label="Reproducir la frase"
      disabled={s.current.length === 0}
    >
      <span class="btn-icon">🔊</span>
      <span class="btn-caption">Hablar</span>
    </button>

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
        onclick={cancelSpeech}
        aria-label="Detener la reproducción"
        disabled={!isSpeaking.current}
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
  }

  .sentence-actions {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
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
    width: 100%;
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
