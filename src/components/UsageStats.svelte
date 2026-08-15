<script lang="ts">
  import { onMount } from 'svelte';
  import { useStore } from '@nanostores/svelte-runes';
  import { syncState, lastSyncAt } from '../stores';
  import { getStats, formatBytes, type StatsResult } from '../lib/stats';

  let open = $state(false);
  let loading = $state(false);
  let stats = $state<StatsResult | null>(null);
  let error = $state<string | null>(null);

  const s = useStore(syncState);
  const last = useStore(lastSyncAt);

  function toggle() {
    open = !open;
  }

  async function load() {
    if (!open) return;
    loading = true;
    error = null;
    try {
      stats = await getStats(14);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error al cargar estadísticas.';
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (open) load();
  });

  function formatTime(ts: number | null): string {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  // --- Bar chart (actividad diaria) ---
  const BAR_W = 20;
  const BAR_GAP = 6;
  const CHART_H = 100;
  const CHART_PAD = 4;

  let maxCount = $derived(stats?.daily.reduce((m, d) => Math.max(m, d.count), 0) ?? 0);
  let topMax = $derived(stats?.topCards[0]?.count ?? 1);
  let customPct = $derived(stats?.totals.taps > 0 ? stats.totals.customVoice / stats.totals.taps : 0);

  // --- Donut chart (custom vs TTS) ---
  function donutPath(cx: number, cy: number, r: number, startPct: number, endPct: number): string {
    const startAngle = (startPct * 360 - 90) * (Math.PI / 180);
    const endAngle = (endPct * 360 - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = (endPct - startPct) > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }
</script>

<button
  type="button"
  class="stats-btn"
  onclick={toggle}
  aria-label="Estadísticas de uso"
  title="Estadísticas de uso"
>
  <svg
    class="stats-icon"
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
    <line x1="3" y1="20" x2="21" y2="20" />
    <line x1="7" y1="20" x2="7" y2="11" />
    <line x1="12" y1="20" x2="12" y2="5" />
    <line x1="17" y1="20" x2="17" y2="13" />
  </svg>
</button>

{#if open}
  <div class="overlay" onclick={() => (open = false)} aria-hidden="true"></div>
  <div class="modal" role="dialog" aria-modal="true" aria-label="Estadísticas de uso">
    <div class="modal-header">
      <h2>Estadísticas de uso</h2>
      <button type="button" class="close-btn" onclick={() => (open = false)} aria-label="Cerrar">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </div>

    {#if loading}
      <p class="loading">Cargando…</p>
    {:else if error}
      <p class="error" role="alert">{error}</p>
    {:else if stats}
      <!-- Resumen -->
      <div class="summary">
        <div class="stat-card">
          <span class="stat-value">{stats.totals.taps}</span>
          <span class="stat-label">Pulsaciones</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{stats.totals.habla}</span>
          <span class="stat-label">Frases habladas</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{stats.totals.edita}</span>
          <span class="stat-label">Ediciones</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{formatBytes(stats.storage.audio_bytes)}</span>
          <span class="stat-label">Audio ({stats.storage.audio_count})</span>
        </div>
      </div>

      <!-- Gráfico: actividad diaria -->
      <div class="chart-section">
        <h3>Actividad (14 días)</h3>
        {#if stats.daily.some((d) => d.count > 0)}
          <svg class="bar-chart" viewBox="0 0 {stats.daily.length * (BAR_W + BAR_GAP)} {CHART_H + CHART_PAD * 2}" preserveAspectRatio="none">
            {#each stats.daily as d, i}
              {@const barH = maxCount > 0 ? (d.count / maxCount) * (CHART_H - CHART_PAD * 2) : 0}
              <rect
                x={i * (BAR_W + BAR_GAP)}
                y={CHART_H - barH - CHART_PAD}
                width={BAR_W}
                height={barH}
                rx="2"
                class="bar"
                class:bar-zero={d.count === 0}
              />
            {/each}
          </svg>
          <div class="bar-labels">
            <span>{stats.daily[0]?.day.slice(5)}</span>
            <span>{stats.daily[stats.daily.length - 1]?.day.slice(5)}</span>
          </div>
        {:else}
          <p class="no-data">Sin actividad en los últimos 14 días.</p>
        {/if}
      </div>

      <!-- Gráfico: top tarjetas -->
      {#if stats.topCards.length > 0}
        <div class="chart-section">
          <h3>Top tarjetas</h3>
          <div class="h-bars">
          {#each stats.topCards as c}
            <div class="h-bar-row">
              <span class="h-bar-label">{c.label}</span>
              <div class="h-bar-track">
                <div class="h-bar-fill" style="width: {(c.count / topMax) * 100}%"></div>
              </div>
              <span class="h-bar-count">{c.count}</span>
            </div>
          {/each}
        </div>
        </div>
      {/if}

      <!-- Gráfico: voz personalizada vs TTS -->
      {#if stats.totals.taps > 0}
        <div class="chart-section">
          <h3>Voz personalizada vs TTS</h3>
          <div class="donut-wrap">
            <svg viewBox="0 0 100 100" width="120" height="120">
              {#if customPct > 0}
                <path d={donutPath(50, 50, 40, 0, customPct)} class="donut-segment donut-custom" />
              {/if}
              {#if (1 - customPct) > 0}
                <path d={donutPath(50, 50, 40, customPct, 1)} class="donut-segment donut-tts" />
              {/if}
              <circle cx="50" cy="50" r="24" class="donut-hole" />
              <text x="50" y="48" text-anchor="middle" class="donut-pct">{Math.round(customPct * 100)}%</text>
              <text x="50" y="60" text-anchor="middle" class="donut-label">voz</text>
            </svg>
            <div class="donut-legend">
              <span class="legend-item"><span class="legend-dot custom"></span> Voz personalizada ({stats.totals.customVoice})</span>
              <span class="legend-item"><span class="legend-dot tts"></span> TTS ({stats.totals.tts})</span>
            </div>
          </div>
        </div>
      {/if}

      <!-- Fuente y última sync -->
      <div class="meta">
        <span>Fuente: {stats.source === 'server' ? '☁️ Nube' : '📱 Local (sin conexión)'}</span>
        <span>Última sync: {formatTime(last.current)}</span>
        <span>Estado: {s.current === 'ok' ? 'Al día' : s.current === 'syncing' ? 'Sincronizando…' : s.current === 'error' ? 'Pendiente' : '—'}</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .stats-btn {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    padding: 0;
    cursor: pointer;
  }

  .stats-icon {
    display: block;
  }

  .stats-btn:hover {
    background: var(--surface-alt);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--bg) 70%, transparent);
  }

  .modal {
    position: fixed;
    z-index: 51;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(92vw, 32rem);
    max-height: 85vh;
    overflow-y: auto;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius, 12px);
    box-shadow: var(--shadow, 0 4px 24px rgba(0,0,0,0.15));
    padding: 1.25rem;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .modal-header h2 {
    font-size: 1.2rem;
    margin: 0;
  }

  .close-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }

  .close-btn:hover {
    background: var(--surface-alt);
    color: var(--text);
  }

  .loading, .error {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
  }

  .error {
    color: var(--error);
  }

  /* Resumen */
  .summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.6rem 0.4rem;
    background: var(--surface-alt);
    border-radius: calc(var(--radius, 12px) / 2);
    border: 1px solid var(--border);
  }

  .stat-value {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--primary);
  }

  .stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Gráficos */
  .chart-section {
    margin-bottom: 1.25rem;
  }

  .chart-section h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* Barras verticales */
  .bar-chart {
    width: 100%;
    height: 100px;
  }

  .bar {
    fill: var(--primary);
    transition: fill 0.15s;
  }

  .bar-zero {
    fill: var(--border);
  }

  .bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }

  .no-data {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.85rem;
    padding: 1rem;
  }

  /* Barras horizontales */
  .h-bars {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .h-bar-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .h-bar-label {
    width: 7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    flex-shrink: 0;
  }

  .h-bar-track {
    flex: 1;
    height: 0.65rem;
    background: var(--surface-alt);
    border-radius: 999px;
    overflow: hidden;
  }

  .h-bar-fill {
    height: 100%;
    background: var(--primary);
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  .h-bar-count {
    width: 2rem;
    text-align: right;
    font-weight: 700;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  /* Donut */
  .donut-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .donut-segment {
    transition: opacity 0.15s;
  }

  .donut-custom {
    fill: var(--accent, #8b5cf6);
  }

  .donut-tts {
    fill: var(--text-muted);
    opacity: 0.3;
  }

  .donut-hole {
    fill: var(--surface);
  }

  .donut-pct {
    font-size: 16px;
    font-weight: 800;
    fill: var(--text);
  }

  .donut-label {
    font-size: 9px;
    font-weight: 600;
    fill: var(--text-muted);
  }

  .donut-legend {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .legend-item {
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .legend-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-dot.custom {
    background: var(--accent, #8b5cf6);
  }

  .legend-dot.tts {
    background: var(--text-muted);
    opacity: 0.3;
  }

  /* Meta info */
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  @media (max-width: 480px) {
    .summary {
      grid-template-columns: repeat(2, 1fr);
    }

    .h-bar-label {
      width: 5rem;
    }

    .modal {
      width: 96vw;
      max-height: 90vh;
    }
  }
</style>
