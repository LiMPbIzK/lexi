<script lang="ts">
  import { onMount } from 'svelte';
  import { useStore } from '@nanostores/svelte-runes';
  import { db } from '../lib/db';
  import { seedArasaac, isSeeded, hasCatalog } from '../lib/seed';
  import { getDeviceMode, saveDeviceMode, fetchDeviceStatus } from '../lib/user';
  import { warmFingerprint } from '../lib/fingerprint';
  import { syncNow } from '../lib/sync';
  import { activeCategoryId, categories, cards, manifest, sentence, syncSentenceWithCards, deviceMode, userName } from '../stores';
  import type { ArasaacManifest, Card } from '../lib/types';
  import CardTile from './CardTile.svelte';
  import CardEditor from './CardEditor.svelte';

  const cat = useStore(categories);
  const cardList = useStore(cards);
  const activeId = useStore(activeCategoryId);
  const sentenceWords = useStore(sentence);
  const mode = useStore(deviceMode);

  let loading = $state(true);
  let error = $state<string | null>(null);
  let canEdit = $state(false);
  let menuCard: Card | null = $state(null);
  let menuPos = $state<{ x: number; y: number } | null>(null);
  let editingCard: Card | null = $state(null);

  /** Decide si este dispositivo puede editar (grabar voz).
   *  Reacciona al store deviceMode (que ClaimDialog actualiza al canjear).
   */
  async function refreshCanEdit() {
    const localMode = getDeviceMode();

    if (localMode === 'demo') {
      canEdit = false;
      return;
    }

    if (localMode === 'full') {
      // modo full local: permitir editar siempre (offline-first)
      canEdit = true;
      // si hay red, aprovechar para sincronizar la pista local (no bloquea)
      try {
        const status = await fetchDeviceStatus();
        if (status.registered && status.mode === 'full' && getDeviceMode() !== 'full') {
          saveDeviceMode('full');
        } else if (status.mode === 'demo') {
          saveDeviceMode('demo');
        }
        if (status.user) userName.set(status.user);
      } catch {
        /* sin red: mantener estado local */
      }
      return;
    }

    // null: no hay pista local -> preguntar al servidor
    try {
      const status = await fetchDeviceStatus();
      if (status.registered && status.mode === 'full') {
        saveDeviceMode('full');
        deviceMode.set('full');
        canEdit = true;
        if (status.user) userName.set(status.user);
      } else {
        canEdit = false;
      }
    } catch {
      canEdit = false;
    }
  }

  // Reacciona a cambios en el store de modo (p. ej. tras canjear un código)
  $effect(() => {
    const m = mode.current;
    if (m) {
      canEdit = m === 'full';
    } else {
      void refreshCanEdit();
    }
  });

  async function reloadCards() {
    const id = activeCategoryId.get();
    if (id) {
      const cs = await db.getCardsByCategory(id);
      cards.set(cs);
      // re-sincronizar la frase: si una tarjeta perdió su audio, la palabra
      // deja de estar resaltada y se reproducirá con TTS
      syncSentenceWithCards(cs);
    }
    // sincronizar cambios locales con el servidor (best-effort, sin bloquear)
    void syncNow();
  }

  function openMenu(card: Card, x: number, y: number) {
    if (!canEdit) return;
    menuCard = card;
    menuPos = { x, y };
  }

  function closeMenu() {
    menuCard = null;
    menuPos = null;
  }

  function openAudioEditor() {
    if (!menuCard) return;
    editingCard = menuCard;
    closeMenu();
  }

  function closeEditor() {
    editingCard = null;
    void reloadCards();
  }

  async function ensureSeeded() {
    // si el flag está marcado pero IndexedDB quedó vacía (error previo),
    // re-seedear para que las tarjetas nunca desaparezcan para siempre
    if (isSeeded() && (await hasCatalog())) return;

    let m = manifest.get();
    if (!m) {
      const res = await fetch('/arasaac-manifest.json');
      if (!res.ok) throw new Error('No se pudo cargar el catálogo.');
      m = (await res.json()) as ArasaacManifest;
      manifest.set(m);
    }
    await seedArasaac(m);
  }

  function selectCategory(id: string) {
    activeCategoryId.set(id);
  }

  onMount(async () => {
    try {
      warmFingerprint();
      await ensureSeeded();
      // restaurar datos del dispositivo desde la nube + subir cambios/audio pendientes
      await syncNow();
      const cats = await db.getCategories();
      categories.set(cats);
      if (cats.length > 0) {
        const first = cats[0].id;
        activeCategoryId.set(first);
        cards.set(await db.getCardsByCategory(first));
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error al cargar el catálogo.';
    } finally {
      loading = false;
    }
  });

  // react al cambio de categoría
  $effect(() => {
    const id = activeId.current;
    if (id) {
      db.getCardsByCategory(id).then((cs) => {
        cards.set(cs);
        syncSentenceWithCards(cs);
      });
    }
  });
</script>

<div class="grid-view">
  <nav class="cat-bar" aria-label="Categorías">
    {#each cat.current as c}
      <button
        type="button"
        class="cat-chip"
        class:active={c.id === activeId.current}
        onclick={() => selectCategory(c.id)}
      >
        {#if c.icon_key}<span class="cat-icon" aria-hidden="true">{c.icon_key}</span>{/if}
        {c.name}
      </button>
    {/each}
  </nav>

  {#if loading}
    <p class="hint">Cargando…</p>
  {:else if error}
    <p class="hint" role="alert">{error} Recarga la página para reintentar.</p>
  {:else if cardList.current.length === 0}
    <p class="hint">Sin tarjetas en esta categoría.</p>
  {:else}
    <div class="card-grid">
      {#each cardList.current as card (card.id)}
        <CardTile {card} editable={canEdit} onlongpress={openMenu} />
      {/each}
    </div>
  {/if}
</div>

{#if menuCard && menuPos}
  <div
    class="ctx-backdrop"
    onclick={closeMenu}
    oncontextmenu={(e) => e.preventDefault()}
    aria-hidden="true"
  ></div>
  <div
    class="ctx-menu"
    role="menu"
    aria-label="Opciones de la tarjeta"
    style="left: {menuPos.x}px; top: {menuPos.y}px"
  >
    <div class="ctx-title">{menuCard.label}</div>
    <button type="button" class="ctx-option" role="menuitem" onclick={openAudioEditor}>
      <span class="ctx-icon" aria-hidden="true">🎤</span>
      {menuCard.audio_key ? 'Editar audio personalizado' : 'Añadir audio personalizado'}
    </button>
    <button type="button" class="ctx-option" role="menuitem" onclick={closeMenu}>
      Cancelar
    </button>
  </div>
{/if}

{#if editingCard}
  <CardEditor card={editingCard} onClose={closeEditor} />
{/if}

<style>
  .grid-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .cat-bar {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: thin;
  }

  .cat-chip {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 3rem;
    padding: 0.6rem 1.1rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-weight: 600;
    font-size: 1rem;
    white-space: nowrap;
  }

  .cat-chip.active {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
  }

  .cat-icon {
    font-size: 1.2rem;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: var(--tile-gap);
  }

  .ctx-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  .ctx-menu {
    position: fixed;
    z-index: 41;
    min-width: 12rem;
    max-width: 16rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transform: translate(min(8px, 100%), 8px);
  }

  .ctx-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-muted);
    padding: 0.4rem 0.6rem 0.3rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ctx-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    width: 100%;
    border: none;
    background: transparent;
    border-radius: calc(var(--radius) / 2);
    padding: 0.6rem 0.75rem;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .ctx-option:hover {
    background: var(--surface-alt);
  }

  .ctx-icon {
    font-size: 1.1rem;
  }

  .hint {
    color: var(--text-muted);
    text-align: center;
    padding: 2rem 1rem;
  }

  @media (min-width: 768px) {
    .cat-chip {
      font-size: 1.1rem;
      min-height: 3.25rem;
      padding: 0.7rem 1.3rem;
    }

    .card-grid {
      grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
      gap: calc(var(--tile-gap) + 0.25rem);
    }
  }
</style>
