<script lang="ts">
  import { useStore } from '@nanostores/svelte-runes';
  import { rate } from '../stores';
  import { SPEED_OPTIONS, saveRate, setLiveRate } from '../lib/tts';

  const r = useStore(rate);

  let open = $state(false);

  function select(value: number) {
    rate.set(value);
    saveRate(value);
    setLiveRate(value);
    open = false;
  }

  function currentLabel(): string {
    return `${r.current}x`;
  }
</script>

<div class="speed-selector">
  <button
    type="button"
    class="speed-trigger"
    class:active={open}
    onclick={() => (open = !open)}
    aria-label="Velocidad de reproducción"
    aria-expanded={open}
  >
    <svg
      class="speed-icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 13a2 2 0 0 0 2-2c0-.7-.3-1.4-.8-1.9L17 4.5" />
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 6a6 6 0 1 0 6 6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
    <span class="speed-value">{currentLabel()}</span>
  </button>

  {#if open}
    <div class="speed-menu" role="menu" aria-label="Velocidad de reproducción">
      {#each SPEED_OPTIONS as option (option)}
        <button
          type="button"
          role="menuitemradio"
          aria-checked={r.current === option}
          class="speed-option"
          class:active={r.current === option}
          onclick={() => select(option)}
        >
          {option}x
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .speed-selector {
    position: relative;
  }

  .speed-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 4.5rem;
    /* ancho fijo para que el botón no crezca al cambiar el valor y no
       afecte al tamaño del botón Hablar que comparte fila */
    width: 7rem;
    padding: 0.6rem 0.75rem;
    border-radius: calc(var(--radius) / 2);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-weight: 700;
    font-size: 1.05rem;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .speed-trigger:hover {
    background: var(--surface-alt);
  }

  .speed-trigger.active {
    background: var(--primary-soft);
    border-color: var(--primary);
  }

  .speed-icon {
    display: block;
    flex: 0 0 auto;
  }

  .speed-value {
    white-space: nowrap;
  }

  .speed-menu {
    position: absolute;
    bottom: calc(100% + 0.4rem);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.4rem;
    min-width: 5rem;
    z-index: 35;
  }

  .speed-option {
    width: 100%;
    text-align: center;
    border: none;
    background: transparent;
    border-radius: calc(var(--radius) / 2);
    padding: 0.5rem 0.6rem;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .speed-option:hover {
    background: var(--surface-alt);
  }

  .speed-option.active {
    background: var(--primary-soft);
  }
</style>
