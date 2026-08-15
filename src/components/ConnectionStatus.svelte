<script lang="ts">
  import { useStore } from '@nanostores/svelte-runes';
  import { syncState, lastSyncAt } from '../stores';

  let online = $state<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const s = useStore(syncState);
  const last = useStore(lastSyncAt);

  function update() {
    online = navigator.onLine;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
  }

  function formatTime(ts: number | null): string {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  let label = $derived(
    !online ? 'Sin conexión'
    : s.current === 'syncing' ? 'Sincronizando…'
    : s.current === 'error' ? 'Pendiente de sincronizar'
    : s.current === 'ok' ? `Al día · ${formatTime(last.current)}`
    : ''
  );

  let dotClass = $derived(
    !online ? 'offline'
    : s.current === 'error' ? 'error'
    : s.current === 'syncing' ? 'syncing'
    : 'online'
  );
</script>

<span class="conn" role="status" aria-live="polite">
  <span class="dot {dotClass}" aria-hidden="true"></span>
  <span class="conn-label">{label}</span>
</span>

<style>
  .conn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface-alt);
    white-space: nowrap;
  }

  .dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--success);
  }

  .dot.offline {
    background: var(--error);
  }

  .dot.error {
    background: var(--warning, #f59e0b);
    animation: pulse-error 2s ease-in-out infinite;
  }

  .dot.syncing {
    background: var(--info, #3b82f6);
    animation: pulse-sync 1s ease-in-out infinite;
  }

  @keyframes pulse-error {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes pulse-sync {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @media (max-width: 640px) {
    .conn-label {
      display: none;
    }
  }
</style>
