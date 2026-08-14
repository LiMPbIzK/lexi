<script lang="ts">
  import { db } from '../lib/db';
  import { uploadAudio, deleteAudio } from '../lib/audio';
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
        } else {
          error = res.error ?? 'No se pudo subir el audio.';
          saving = false;
          return;
        }
      }

      const updated: Card = { ...card, audio_key: audioKey, updated_at: Date.now() };
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
      if (card.audio_key) await deleteAudio(card.audio_key);
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

      <button
        type="button"
        class="btn-save"
        onclick={save}
        disabled={saving || (!recording && card.audio_key !== null)}
      >
        {saving ? 'Guardando…' : 'Guardar audio'}
      </button>
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

  .btn-danger {
    padding: 0.6rem 1.1rem;
    background: var(--error);
    border-color: var(--error);
    color: #fff;
    font-weight: 700;
  }

  .btn-save:disabled,
  .btn-danger:disabled {
    opacity: 0.5;
  }
</style>
