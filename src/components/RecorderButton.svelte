<script lang="ts">
  import { canRecord, startRecording, MAX_DURATION_MS } from '../lib/recorder';

  interface Props {
    audioKey: string | null;
    onrecorded?: (result: { blob: Blob; mime: string; durationMs: number } | null) => void;
  }

  let { audioKey, onrecorded }: Props = $props();

  let recording = $state(false);
  let elapsed = $state(0);
  let blob: Blob | null = $state(null);
  let mime = $state('');
  let durationMs = $state(0);
  let error = $state<string | null>(null);
  let unsupported = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;
  let recorderHandle: { stop: () => Promise<{ blob: Blob; mime: string; durationMs: number } | null>; cancel: () => void } | null = null;

  function tick() {
    elapsed += 1;
  }

  async function toggleRecord() {
    if (recording) {
      await stopRecording();
      return;
    }
    error = null;
    if (!canRecord()) {
      unsupported = true;
      error = 'Tu navegador no soporta grabación de micrófono.';
      return;
    }
    try {
      recorderHandle = await startRecording();
      recording = true;
      elapsed = 0;
      timer = setInterval(tick, 1000);
    } catch {
      error = 'No se pudo acceder al micrófono. Comprueba los permisos.';
    }
  }

  async function stopRecording() {
    if (!recorderHandle) return;
    if (timer) clearInterval(timer);
    const result = await recorderHandle.stop();
    recorderHandle = null;
    recording = false;
    if (result) {
      blob = result.blob;
      mime = result.mime;
      durationMs = result.durationMs;
      onrecorded?.({ blob: result.blob, mime: result.mime, durationMs: result.durationMs });
    } else {
      error = 'La grabación no capturó audio.';
      onrecorded?.(null);
    }
  }

  function playPreview() {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
  }

  function clearRecording() {
    blob = null;
    mime = '';
    durationMs = 0;
    onrecorded?.(null);
  }
</script>

<div class="recorder">
  <div class="recorder-status">
    {#if recording}
      <span class="rec-dot" aria-hidden="true"></span>
      <span class="rec-timer">Grabando… {elapsed}s</span>
    {:else if blob}
      <span class="rec-ok">✓ Audio grabado ({Math.round(durationMs / 1000)}s)</span>
    {:else if audioKey}
      <span class="rec-has">Audio guardado</span>
    {:else}
      <span class="rec-idle">Grabar la palabra o frase (máx. {MAX_DURATION_MS / 1000}s)</span>
    {/if}
  </div>

  <div class="recorder-actions">
    <button
      type="button"
      class="rec-btn"
      class:recording
      onclick={toggleRecord}
      disabled={unsupported}
      aria-label={recording ? 'Parar grabación' : 'Grabar audio'}
    >
      {recording ? '■ Parar' : '● Grabar'}
    </button>

    {#if blob && !recording}
      <button type="button" class="rec-btn" onclick={playPreview} aria-label="Escuchar grabación">
        ▶ Escuchar
      </button>
      <button type="button" class="rec-btn" onclick={clearRecording} aria-label="Descartar grabación">
        ✕ Descartar
      </button>
    {/if}
  </div>

  {#if error}
    <p class="rec-error" role="alert">{error}</p>
  {/if}
</div>

<style>
  .recorder {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.75rem;
    border: 1px dashed var(--border);
    border-radius: var(--radius);
    background: var(--surface-alt);
  }

  .recorder-status {
    font-size: 0.9rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .rec-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--error);
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .rec-ok {
    color: var(--success);
    font-weight: 600;
  }

  .rec-has {
    color: var(--primary);
    font-weight: 600;
  }

  .recorder-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .rec-btn {
    padding: 0.6rem 1.1rem;
    font-weight: 700;
    border-radius: 999px;
  }

  .rec-btn.recording {
    background: var(--error);
    border-color: var(--error);
    color: #fff;
  }

  .rec-error {
    color: var(--error);
    font-size: 0.85rem;
  }
</style>
