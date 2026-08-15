<script lang="ts">
  import { onMount } from 'svelte';
  import { useStore } from '@nanostores/svelte-runes';
  import { voices, voiceUri } from '../stores';
  import { getSavedVoiceUri, saveVoiceUri, spanishVoices, waitForVoices, getVoices } from '../lib/tts';

  const v = useStore(voices);
  const vu = useStore(voiceUri);

  let open = $state(false);

  onMount(async () => {
    await waitForVoices();
    const list = spanishVoices(getVoices());
    voices.set(list);
    const saved = getSavedVoiceUri();
    voiceUri.set(saved && list.some((x) => x.uri === saved) ? saved : (list[0]?.uri ?? null));
  });

  function select(uri: string) {
    voiceUri.set(uri);
    saveVoiceUri(uri);
    open = false;
  }

  function currentLabel(): string {
    const found = v.current.find((x) => x.uri === vu.current);
    return found ? found.name : 'Voz';
  }
</script>

<div class="voice-selector">
  <button
    type="button"
    class="voice-trigger"
    onclick={() => (open = !open)}
    aria-label="Seleccionar voz"
    aria-expanded={open}
    title="Seleccionar voz de texto a voz (TTS)"
  >
    🗣️ <span class="voice-name">{currentLabel()}</span>
  </button>

  {#if open}
    <div class="voice-menu" role="menu" aria-label="Voces disponibles">
      {#if v.current.length === 0}
        <p class="no-voices">No hay voces en español disponibles.</p>
      {:else}
        {#each v.current as vc (vc.uri)}
          <button
            type="button"
            role="menuitemradio"
            aria-checked={vu.current === vc.uri}
            class="voice-option"
            class:active={vu.current === vc.uri}
            onclick={() => select(vc.uri)}
          >
            <span class="voice-flag">{vc.lang.toUpperCase()}</span>
            {vc.name}
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .voice-selector {
    position: relative;
  }

  .voice-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
  }

  .voice-name {
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.85rem;
  }

  .voice-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.5rem;
    min-width: 14rem;
    z-index: 30;
    max-height: 16rem;
    overflow-y: auto;
  }

  .voice-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    width: 100%;
    border: none;
    background: transparent;
    border-radius: calc(var(--radius) / 2);
    padding: 0.5rem 0.75rem;
  }

  .voice-option:hover {
    background: var(--surface-alt);
  }

  .voice-option.active {
    background: var(--primary-soft);
  }

  .voice-flag {
    font-size: 0.7rem;
    font-weight: 700;
    background: var(--accent-soft);
    color: var(--text);
    padding: 0.15rem 0.4rem;
    border-radius: 0.35rem;
  }

  .no-voices {
    color: var(--text-muted);
    padding: 0.5rem;
    font-size: 0.9rem;
  }
</style>
