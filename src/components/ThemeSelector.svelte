<script lang="ts">
  import { onMount } from 'svelte';

  const themes = [
    { id: 'neutral', label: 'Neutro', emoji: '🎨' },
    { id: 'pastel', label: 'Pastel', emoji: '🌸' },
    { id: 'calm', label: 'Calma', emoji: '🌿' },
    { id: 'warm', label: 'Cálido', emoji: '☀️' },
    { id: 'high-contrast', label: 'Alto contraste', emoji: '🔆' }
  ];

  let open = $state(false);
  let current = $state<string>('neutral');

  const STORAGE_KEY = 'lexi:theme';

  onMount(() => {
    current = localStorage.getItem(STORAGE_KEY) ?? 'neutral';
  });

  function apply(themeId: string) {
    current = themeId;
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem(STORAGE_KEY, themeId);
    open = false;
  }

  function toggle() {
    open = !open;
  }
</script>

<div class="theme-selector">
  <button
    type="button"
    class="theme-trigger"
    onclick={toggle}
    aria-label="Cambiar tema"
    aria-expanded={open}
  >
    🎨
  </button>

  {#if open}
    <div class="theme-menu" role="menu" aria-label="Seleccionar tema">
      {#each themes as theme}
        <button
          type="button"
          role="menuitemradio"
          aria-checked={current === theme.id}
          class="theme-option"
          class:active={current === theme.id}
          onclick={() => apply(theme.id)}
        >
          <span aria-hidden="true">{theme.emoji}</span>
          {theme.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .theme-selector {
    position: relative;
  }

  .theme-trigger {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 1.25rem;
    display: grid;
    place-items: center;
    border: 1px solid var(--border);
    background: var(--surface);
  }

  .theme-menu {
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
    min-width: 12rem;
    z-index: 20;
  }

  .theme-option {
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

  .theme-option:hover {
    background: var(--surface-alt);
  }

  .theme-option.active {
    background: var(--primary-soft);
    color: var(--text);
  }
</style>
