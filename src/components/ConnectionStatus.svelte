<script lang="ts">
  let online = $state<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  function update() {
    online = navigator.onLine;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
  }
</script>

<span class="conn" class:offline={!online} role="status" aria-live="polite">
  <span class="dot" aria-hidden="true"></span>
  <span class="conn-label">{online ? 'En línea' : 'Sin conexión'}</span>
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

  .conn.offline .dot {
    background: var(--error);
  }

  @media (max-width: 640px) {
    .conn-label {
      display: none;
    }
  }
</style>
