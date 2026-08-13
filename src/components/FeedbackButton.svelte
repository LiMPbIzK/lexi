<!-- Botón flotante de feedback: abre el cliente de correo con asunto predefinido.
     Es un enlace estático (mailto:) — no necesita JS, funciona sin hidratar. -->

<a
  class="feedback-btn"
  href="mailto:contact@fmartinezgarcia.com?subject=Sugerencia%20para%20LeXi"
  aria-label="Enviar una sugerencia por correo"
  title="Sugerencias"
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
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.38 8.38 0 0 1-.9-3.9 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5Z" />
  </svg>
</a>

<style>
  .feedback-btn {
    position: fixed;
    right: calc(env(safe-area-inset-right, 0px) + 1rem);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
    z-index: 12;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    color: #fff;
    box-shadow: var(--shadow);
    transition: transform 0.1s ease, background 0.2s ease;
  }

  .feedback-btn:hover {
    background: var(--accent);
    transform: scale(1.05);
  }

  .feedback-btn:active {
    transform: scale(0.95);
  }

  .feedback-btn:focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 2px;
  }
</style>
