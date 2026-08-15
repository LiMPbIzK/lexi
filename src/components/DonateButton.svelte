<!-- Botón flotante de donación (PayPal). Es un enlace estático externo —
     no necesita JS, funciona sin hidratar. -->
<a
  class="donate-btn"
  href="https://www.paypal.com/paypalme/franito"
  rel="noopener noreferrer"
  target="_blank"
  aria-label="Invitar a un café por PayPal"
  title="Invítame a un café"
>
  <svg
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
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
</a>

<style>
  .donate-btn {
    position: fixed;
    left: calc(env(safe-area-inset-left, 0px) + 1rem);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
    z-index: 12;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transition:
      transform 0.1s ease,
      background 0.2s ease,
      border-color 0.2s ease;
  }

  .donate-btn:hover {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
    transform: scale(1.05);
  }

  .donate-btn:active {
    transform: scale(0.95);
  }

  .donate-btn:focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 2px;
  }
</style>
