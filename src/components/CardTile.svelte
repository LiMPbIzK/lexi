<script lang="ts">
  import type { Card } from '../lib/types';
  import { speak } from '../lib/tts';
  import { playCardAudio } from '../lib/audio';
  import { sentence } from '../stores';

  interface Props {
    card: Card;
  }

  let { card }: Props = $props();

  async function handleTap() {
    // encolar la palabra en la frase
    sentence.set([...sentence.get(), { text: card.label, source: 'card' }]);

    // Si tiene audio grabado (R2/local), reproducirlo; si no, TTS.
    const played = card.audio_key ? await playCardAudio(card.audio_key) : false;
    if (!played) {
      speak(card.tts_text ?? card.label);
    }
  }
</script>

<button
  type="button"
  class="card-tile"
  onclick={handleTap}
  aria-label={card.label}
>
  {#if card.image_key}
    <img
      class="card-img"
      src={card.image_key}
      alt={card.label}
      loading="lazy"
    />
  {:else}
    <span class="card-emoji" aria-hidden="true">📦</span>
  {/if}
  <span class="card-label">{card.label}</span>
</button>

<style>
  .card-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    min-height: 7rem;
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .card-tile:active {
    transform: scale(0.96);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }

  .card-img {
    width: 100%;
    max-width: 4rem;
    height: auto;
    pointer-events: none;
  }

  .card-emoji {
    font-size: 2.2rem;
  }

  .card-label {
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .card-tile {
      min-height: 8.5rem;
      padding: 1.15rem;
    }

    .card-img {
      max-width: 5rem;
    }

    .card-emoji {
      font-size: 2.8rem;
    }

    .card-label {
      font-size: 1.1rem;
    }
  }
</style>
