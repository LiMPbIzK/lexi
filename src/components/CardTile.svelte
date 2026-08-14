<script lang="ts">
  import type { Card } from '../lib/types';
  import { speak } from '../lib/tts';
  import { playCardAudio } from '../lib/audio';
  import { sentence } from '../stores';
  import { db } from '../lib/db';
  import { getUserId } from '../lib/user';

  interface Props {
    card: Card;
    editable?: boolean;
    onlongpress?: (card: Card, x: number, y: number) => void;
  }

  let { card, editable = true, onlongpress }: Props = $props();

  const LONG_PRESS_MS = 500;
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressed = $state(false);

  function startLongPress(event: PointerEvent) {
    if (!editable) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    longPressed = false;
    longPressTimer = setTimeout(() => {
      longPressed = true;
      onlongpress?.(card, event.clientX, event.clientY);
    }, LONG_PRESS_MS);
  }

  function cancelLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handleContextMenu(event: MouseEvent) {
    // también abre el menú con clic derecho (útil en escritorio)
    if (!editable) return;
    event.preventDefault();
    onlongpress?.(card, event.clientX, event.clientY);
  }

  async function handleTap() {
    if (longPressed) {
      longPressed = false;
      return;
    }
    // encolar la palabra en la frase (marcando si es voz personalizada)
    sentence.set([
      ...sentence.get(),
      {
        text: card.label,
        source: 'card',
        customVoice: !!card.audio_key,
        audioKey: card.audio_key,
        cardId: card.id
      }
    ]);

    // registrar evento de uso (local; se sincroniza con pushNow)
    try {
      await db.recordEvent({
        id: crypto.randomUUID(),
        user_id: getUserId(),
        card_id: card.id,
        verb: 'tap',
        at: Date.now()
      });
    } catch {
      /* no crítico */
    }

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
  class:has-audio={!!card.audio_key}
  onclick={handleTap}
  oncontextmenu={handleContextMenu}
  onpointerdown={startLongPress}
  onpointerup={cancelLongPress}
  onpointerleave={cancelLongPress}
  onpointercancel={cancelLongPress}
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

  {#if card.audio_key}
    <span class="card-badge" aria-label="Voz personalizada" title="Voz personalizada">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
        <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 11h-2Z" />
      </svg>
    </span>
  {/if}
</button>

<style>
  .card-tile {
    position: relative;
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
    -webkit-touch-callout: none;
  }

  .card-tile:active {
    transform: scale(0.96);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }

  /* tarjeta con voz personalizada: leve tinte para diferenciarla del TTS */
  .card-tile.has-audio {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent), var(--shadow);
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

  .card-badge {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--accent);
    color: #fff;
    box-shadow: var(--shadow);
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
