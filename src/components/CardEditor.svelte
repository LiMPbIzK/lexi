<script lang="ts">
  import { db } from '../lib/db';
  import { uploadAudio, deleteAudio, cacheAudioBlob } from '../lib/audio';
  import { getUserId } from '../lib/user';
  import type { Card } from '../lib/types';
  import RecorderButton from './RecorderButton.svelte';

  interface Props {
    card: Card;
    onClose: () => void;
    onSaved?: () => void;
  }

  let { card, onClose, onSaved }: Props = $props();

  let recording: { blob: Blob; mime: string; durationMs: number } | null = $state(null);
  let saving = $state(false);
  let error = $state<string | null>(null);

  function onRecorded(result: { blob: Blob; mime: string; durationMs: number } | null) {
    recording = result;
  }

  async function save() {
    saving = true;
    error = null;
    try {
      let audioKey: string | null = card.audio_key;

      if (recording) {
        const res = await uploadAudio(recording.blob, recording.durationMs);
        if (res.ok && res.key) {
          audioKey = res.key;
          // cachear el blob localmente para que suene sin conexión desde el minuto 1
          await cacheAudioBlob(res.key, recording.blob);
        } else if (res.status === 401 || res.status === 403) {
          error = res.error ?? 'No se pudo subir el audio.';
          saving = false;
          return;
        } else {
          // sin red o error transitorio: guardar como pendiente (audio_key local)
          audioKey = `pending:${crypto.randomUUID()}`;
          await db.putPendingUpload({
            id: crypto.randomUUID(),
            key: audioKey,
            blob: recording.blob,
            mime: recording.mime,
            durationMs: recording.durationMs,
            user_id: getUserId(),
            created_at: Date.now()
          });
          // reproducible offline desde caché (blob local)
          await cacheAudioBlob(audioKey, recording.blob);
        }
      }

      const updated: Card = {
        ...card,
        // al personalizar, la tarjeta pasa a pertenecer al dispositivo (para sync)
        user_id: getUserId(),
        audio_key: audioKey,
        updated_at: Date.now()
      };
      await db.putCard(updated);
      onSaved?.();
      onClose();
    } catch {
      error = 'Error al guardar el audio.';
    } finally {
      saving = false;
    }
  }

  async function removeAudio() {
    saving = true;
    error = null;
    try {
      if (card.audio_key) {
        // si es un upload pendiente, borrarlo de la cola; si no, de R2
        if (card.audio_key.startsWith('pending:')) {
          const pendings = await db.getPendingUploads();
          for (const p of pendings) {
            if (p.key === card.audio_key) await db.removePendingUpload(p.id);
          }
        } else {
          await deleteAudio(card.audio_key);
        }
      }
      const updated: Card = { ...card, audio_key: null, updated_at: Date.now() };
      await db.putCard(updated);
      onSaved?.();
      onClose();
    } catch {
      error = 'Error al quitar el audio.';
    } finally {
      saving = false;
    }
  }
</script>

<div class="editor-overlay" role="dialog" aria-modal="true" aria-labelledby="editor-title">
  <div class="editor-card">
    <h2 id="editor-title">Voz personalizada</h2>
    <p class="editor-text">
      Tarjeta: <strong>{card.label}</strong>
    </p>

    {#if card.audio_key && !recording}
      <p class="editor-current">Actual: audio personalizado guardado.</p>
    {/if}

    <RecorderButton audioKey={card.audio_key} onrecorded={onRecorded} />

    {#if error}
      <p class="editor-error" role="alert">{error}</p>
    {/if}

    <div class="editor-actions">
      <button type="button" class="btn-cancel" onclick={onClose} disabled={saving}>
        Cancelar
      </button>

      {#if card.audio_key && !recording}
        <button type="button" class="btn-danger" onclick={removeAudio} disabled={saving}>
          Quitar voz personalizada
        </button>
      {/if}

      {#if recording}
        <button
          type="button"
          class="btn-save"
          onclick={save}
          disabled={saving}
        >
          {saving ? 'Guardando…' : 'Guardar audio'}
        </button>
      {:else}
        <button
          type="button"
          class="btn-close"
          onclick={onClose}
          disabled={saving}
        >
          Cerrar
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .editor-overlay {
    position: fixed;
    inset: 0;
    z-index: 45;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    padding: 1rem;
  }

  .editor-card {
    width: 100%;
    max-width: 24rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .editor-card h2 {
    font-size: 1.4rem;
  }

  .editor-text {
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .editor-current {
    font-size: 0.9rem;
    color: var(--success);
    font-weight: 600;
  }

  .editor-error {
    color: var(--error);
    font-size: 0.9rem;
  }

  .editor-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn-cancel {
    padding: 0.6rem 1.1rem;
  }

  .btn-save {
    padding: 0.6rem 1.1rem;
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
    font-weight: 700;
  }

  .btn-close {
    padding: 0.6rem 1.1rem;
    background: var(--surface-alt);
    border-color: var(--border);
    color: var(--text);
    font-weight: 600;
  }

  .btn-danger {
    padding: 0.6rem 1.1rem;
    background: var(--error);
    border-color: var(--error);
    color: #fff;
    font-weight: 700;
  }

  .btn-save:disabled,
  .btn-danger:disabled,
  .btn-close:disabled,
  .btn-cancel:disabled {
    opacity: 0.5;
  }
</style>
