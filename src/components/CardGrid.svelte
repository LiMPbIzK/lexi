<script lang="ts">
  import { onMount } from 'svelte';
  import { useStore } from '@nanostores/svelte-runes';
  import { db } from '../lib/db';
  import { seedArasaac, isSeeded, hasCatalog } from '../lib/seed';
  import { activeCategoryId, categories, cards, manifest, sentence } from '../stores';
  import type { ArasaacManifest } from '../lib/types';
  import CardTile from './CardTile.svelte';

  const cat = useStore(categories);
  const cardList = useStore(cards);
  const activeId = useStore(activeCategoryId);
  const sentenceWords = useStore(sentence);

  let loading = $state(true);
  let error = $state<string | null>(null);

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
      await ensureSeeded();
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
      db.getCardsByCategory(id).then((cs) => cards.set(cs));
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
        <CardTile {card} />
      {/each}
    </div>
  {/if}
</div>

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
