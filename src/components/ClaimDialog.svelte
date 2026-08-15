<script lang="ts">
  import { onMount } from 'svelte';
  import { getInviteCode, getDeviceMode, clearDeviceRegistration, restoreProfileFromBackup, saveUserName, getUserName } from '../lib/user';
  import { claimInviteCode, normalizeDigits, displayValue, buildFullCode, isCodeComplete } from '../lib/claim';
  import { deviceMode, userName } from '../stores';

  let registered = $state(false);
  let demo = $state(false);
  let reRegistering = $state(false);
  let digits = $state('');
  let busy = $state(false);
  let error = $state<string | null>(null);
  let checked = $state(false);
  let inputEl: HTMLInputElement;

  onMount(async () => {
    // si Android limpió localStorage pero IndexedDB conserva el perfil, restaurarlo
    await restoreProfileFromBackup();

    registered = getInviteCode() !== null;
    demo = getDeviceMode() === 'demo';
    deviceMode.set(getDeviceMode());
    userName.set(getUserName());

    // Auto-canjeo desde ?code=
    const urlCode = new URLSearchParams(window.location.search).get('code');
    if (!registered && urlCode) {
      const d = normalizeDigits(urlCode);
      digits = d;
      if (inputEl) inputEl.value = displayValue(d);
      if (isCodeComplete(d)) {
        submit();
      }
    }
    checked = true;
  });

  /** Abandona el modo demo para poder canjear un código real (micrófono). */
  function switchToFull() {
    clearDeviceRegistration();
    registered = false;
    demo = false;
    reRegistering = true;
    digits = '';
    error = null;
    deviceMode.set(null);
    // focus del input tras renderizar el diálogo
    setTimeout(() => inputEl?.focus(), 50);
  }

  /**
   * Input no controlado: manipulamos el value a mano para preservar el caret.
   * Se normalizan los dígitos, se reinserta el guión y se reposiciona el cursor.
   * Si el usuario pega el código completo (LEXI-XXXX-XXXX), se elimina el
   * prefijo del value mostrado (el prefijo LEXI- ya está fuera del input).
   */
  function onInput() {
    const raw = inputEl.value;
    const newDigits = normalizeDigits(raw);
    const showPrefix = raw.toUpperCase().startsWith('LEXI');

    // solo actualizamos si cambió algo que lo merezca
    if (newDigits !== digits) {
      const caret = inputEl.selectionStart ?? raw.length;
      const hadHyphen = digits.length > 4;
      const willHaveHyphen = newDigits.length > 4;

      digits = newDigits;
      const next = displayValue(newDigits);
      inputEl.value = next;

      // reposicionar el caret teniendo en cuenta el guión insertado/quitado
      let pos = Math.min(caret, next.length);
      if (showPrefix) pos = Math.max(0, pos - 5);
      if (willHaveHyphen && !hadHyphen && pos > 4) pos = pos + 1;
      else if (hadHyphen && !willHaveHyphen && pos > 4) pos = pos - 1;
      else if (willHaveHyphen && hadHyphen && pos === 5) pos = pos - 1;
      inputEl.setSelectionRange(pos, pos);
    } else if (inputEl.value !== displayValue(newDigits)) {
      // sin cambio de dígitos pero con formato distinto (p. ej. pegó "XXXX-XXXX")
      const caret = inputEl.selectionStart ?? inputEl.value.length;
      inputEl.value = displayValue(newDigits);
      inputEl.setSelectionRange(Math.min(caret, inputEl.value.length), Math.min(caret, inputEl.value.length));
    }
  }

  async function submit() {
    if (!isCodeComplete(digits) || busy) return;
    busy = true;
    error = null;
    const code = buildFullCode(digits);
    const res = await claimInviteCode(code);
    applyResult(res);
  }

  /** Canjea el código demo público (LEXI-DEMO-CODE): probar sin registro. */
  async function submitDemo() {
    if (busy) return;
    busy = true;
    error = null;
    const res = await claimInviteCode('LEXI-DEMO-CODE');
    applyResult(res);
  }

  function applyResult(res: {
    ok: boolean;
    mode?: 'full' | 'demo';
    user?: string;
    error?: string;
  }) {
    busy = false;
    if (res.ok) {
      registered = true;
      demo = res.mode === 'demo';
      deviceMode.set(res.mode ?? 'full');
      if (res.user) {
        saveUserName(res.user);
        userName.set(res.user);
      }
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      window.history.replaceState({}, '', url);
    } else {
      error = res.error ?? 'Error desconocido.';
    }
  }
</script>

{#if checked && !registered}
  <div class="claim-overlay" role="dialog" aria-modal="true" aria-labelledby="claim-title">
    <div class="claim-card">
      <h2 id="claim-title">Bienvenido a LeXi</h2>
      <p class="claim-text">
        Introduce el código de invitación que te han facilitado para activar este
        dispositivo.
      </p>

      <div class="claim-field" onclick={() => inputEl.focus()}>
        <span class="claim-prefix" aria-hidden="true">LEXI-</span>
        <input
          bind:this={inputEl}
          class="claim-input"
          type="text"
          placeholder="XXXX-XXXX"
          inputmode="text"
          autocomplete="off"
          autocapitalize="characters"
          autocorrect="off"
          spellcheck={false}
          maxlength="14"
          aria-label="Código de invitación (parte después de LEXI-)"
          oninput={onInput}
          onkeydown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
      </div>

      {#if error}
        <p class="claim-error" role="alert">{error}</p>
      {/if}

      <button
        type="button"
        class="claim-btn"
        onclick={submit}
        disabled={busy || !isCodeComplete(digits)}
      >
        {busy ? 'Registrando…' : 'Activar dispositivo'}
      </button>
      <p class="claim-note">El código solo se puede usar en un dispositivo.</p>

      <div class="claim-divider" aria-hidden="true"></div>

      <button
        type="button"
        class="claim-demo"
        onclick={submitDemo}
        disabled={busy}
      >
        <span class="demo-icon" aria-hidden="true">🎧</span>
        Probar la aplicación (demo)
      </button>
      <p class="claim-note">Sin registro: explora el tablero y el teclado. Sin grabación de voz.</p>
    </div>
  </div>
{/if}

{#if checked && registered && demo}
  <div class="demo-bar" role="status">
    <span class="demo-badge">
      <span class="demo-dot" aria-hidden="true"></span>
      Modo demo — no se puede grabar audio
    </span>
    <button type="button" class="demo-switch" onclick={switchToFull}>
      🔓 Usar código completo
    </button>
  </div>
{/if}

<style>
  .claim-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    padding: 1rem;
  }

  .claim-card {
    width: 100%;
    max-width: 22rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .claim-card h2 {
    font-size: 1.4rem;
  }

  .claim-text {
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .claim-field {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) / 2);
    background: var(--surface-alt);
    overflow: hidden;
    cursor: text;
  }

  .claim-field:focus-within {
    outline: 3px solid var(--focus-ring);
    outline-offset: 2px;
  }

  .claim-prefix {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-muted);
    padding-left: 1rem;
    user-select: none;
  }

  .claim-input {
    flex: 1;
    font: inherit;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: var(--text);
    min-width: 0;
  }

  .claim-input:focus {
    outline: none;
  }

  .claim-btn {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
    font-weight: 700;
    padding: 0.75rem 1rem;
  }

  .claim-btn:disabled {
    opacity: 0.5;
  }

  .claim-error {
    color: var(--error);
    font-size: 0.9rem;
  }

  .claim-note {
    color: var(--text-muted);
    font-size: 0.78rem;
  }

  .claim-divider {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin: 0.25rem 0;
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .claim-divider::before,
  .claim-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .claim-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: calc(var(--radius) / 2);
    border: 1px solid var(--border);
    background: var(--surface-alt);
    color: var(--text);
    font-weight: 700;
  }

  .claim-demo:hover:not(:disabled) {
    background: var(--primary-soft);
    border-color: var(--primary);
  }

  .claim-demo:disabled {
    opacity: 0.5;
  }

  .demo-icon {
    font-size: 1.1rem;
  }

  .demo-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin: 0 1rem;
    padding: 0.5rem;
  }

  .demo-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--text);
    font-size: 0.85rem;
    font-weight: 600;
  }

  .demo-dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--accent);
  }

  .demo-switch {
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    border: 1px solid var(--primary);
    background: var(--primary-soft);
    color: var(--text);
    font-size: 0.85rem;
    font-weight: 700;
  }

  .demo-switch:hover {
    background: var(--primary);
    color: #fff;
  }
</style>
