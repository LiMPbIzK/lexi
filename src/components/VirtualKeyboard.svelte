<script lang="ts">
  import { useStore } from '@nanostores/svelte-runes';
  import { keyboardOpen, sentence } from '../stores';

  const kbOpen = useStore(keyboardOpen);

  const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const SYMBOL_ROW = ['¿', '?', '¡', '!', ';', ':'];
  const LOWER_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-']
  ];

  const ACCENTS: Record<string, string[]> = {
    a: ['á', 'à'],
    e: ['é', 'è'],
    i: ['í', 'ì'],
    o: ['ó', 'ò'],
    u: ['ú', 'ü', 'ù']
  };

  const LONG_PRESS_MS = 350;

  let shift = $state(false);
  let accentPopup = $state<{ key: string; variants: string[]; x: number; y: number } | null>(null);
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  let activeKey = $state<string | null>(null);

  function keyLabel(key: string): string {
    // shift solo afecta a letras, no a números/símbolos
    return shift && /^[a-zñ]$/.test(key) ? key.toUpperCase() : key;
  }

  function displayRows(): string[][] {
    return LOWER_ROWS.map((row) =>
      shift ? row.map((k) => (/^[a-zñ]$/.test(k) ? k.toUpperCase() : k)) : row
    );
  }

  function push(text: string) {
    sentence.set([...sentence.get(), { text, source: 'keyboard' }]);
  }

  function pressKey(key: string) {
    push(keyLabel(key));
    if (shift) shift = false;
  }

  function pressSpace() {
    push(' ');
  }

  function pressBackspace() {
    const cur = sentence.get();
    sentence.set(cur.slice(0, -1));
  }

  function toggleShift() {
    shift = !shift;
  }

  function close() {
    keyboardOpen.set(false);
  }

  // Long-press: mostrar acentos de una vocal
  function onKeyDown(event: PointerEvent, key: string) {
    activeKey = key;
    const accents = ACCENTS[key.toLowerCase()];
    if (accents) {
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      pressTimer = setTimeout(() => {
        accentPopup = {
          key,
          variants: accents,
          x: rect.left + rect.width / 2,
          y: rect.top
        };
        activeKey = null;
      }, LONG_PRESS_MS);
    }
  }

  function onKeyUp(key: string) {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    // si no se abrió popup, es un toque normal -> insertar la tecla
    if (!accentPopup && activeKey === key) {
      pressKey(key);
    }
    activeKey = null;
  }

  function onKeyLeave() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    activeKey = null;
  }

  function selectAccent(ch: string) {
    push(ch);
    accentPopup = null;
    if (shift) shift = false;
  }

  function dismissPopup() {
    accentPopup = null;
  }
</script>

{#if kbOpen.current}
  <div class="keyboard">
    {#each [NUMBER_ROW, SYMBOL_ROW, ...displayRows()] as row, rowIndex (rowIndex)}
      <div class="kb-row">
        {#each row as key}
          {@const hasAccents = ACCENTS[key.toLowerCase()] !== undefined}
          <button
            type="button"
            class="key"
            class:accent-key={hasAccents}
            onpointerdown={(e) => onKeyDown(e, key)}
            onpointerup={() => onKeyUp(key)}
            onpointerleave={onKeyLeave}
          >
            {keyLabel(key)}
          </button>
        {/each}
      </div>
    {/each}

    <div class="kb-row kb-actions">
      <button type="button" class="key key-action" onclick={toggleShift} aria-label="Mayúsculas">
        <span class="key-icon">⇧</span>
        <span class="key-caption">Mayús</span>
      </button>
      <button type="button" class="key key-action key-space" onclick={pressSpace} aria-label="Espacio">
        <span class="key-icon">␣</span>
        <span class="key-caption">Espacio</span>
      </button>
      <button type="button" class="key key-action" onclick={pressBackspace} aria-label="Borrar carácter">
        <span class="key-icon">⌫</span>
        <span class="key-caption">Borrar</span>
      </button>
      <button type="button" class="key key-action key-done" onclick={close} aria-label="Cerrar teclado">
        <span class="key-icon">✓</span>
        <span class="key-caption">Listo</span>
      </button>
    </div>
  </div>
{/if}

{#if accentPopup}
  <div
    class="accent-popup"
    role="menu"
    aria-label="Acentos"
    style="left: {accentPopup.x}px; top: {accentPopup.y}px; transform: translate(-50%, -100%)"
    onpointerleave={dismissPopup}
  >
    {#each accentPopup.variants as ch}
      <button type="button" role="menuitem" class="accent-option" onclick={() => selectAccent(ch)}>
        {ch}
      </button>
    {/each}
  </div>
{/if}

<style>
  .keyboard {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 0.5rem;
    padding-bottom: 0.35rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .kb-row {
    display: flex;
    gap: 0.35rem;
    justify-content: center;
  }

  .key {
    flex: 1;
    min-width: 2.2rem;
    height: 2.6rem;
    font-size: 1.15rem;
    font-weight: 600;
    padding: 0;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    user-select: none;
    touch-action: manipulation;
  }

  .key:hover {
    background: var(--surface-alt);
  }

  .key:active,
  .key.accent-key:active {
    background: var(--primary-soft);
  }

  .key-space {
    flex: 3;
  }

  .key-done {
    background: var(--success);
    border-color: var(--success);
    color: #fff;
  }

  .accent-key {
    position: relative;
  }

  .kb-actions {
    margin-top: 0.1rem;
  }

  .key-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    height: 3.2rem;
    font-size: 1rem;
  }

  .key-icon {
    font-size: 1.3rem;
    line-height: 1;
  }

  .key-caption {
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    opacity: 0.9;
  }

  .accent-popup {
    position: fixed;
    z-index: 40;
    display: flex;
    gap: 0.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.35rem;
  }

  .accent-option {
    min-width: 2.4rem;
    height: 2.6rem;
    font-size: 1.2rem;
    font-weight: 600;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    background: var(--surface);
    color: var(--text);
  }

  .accent-option:hover {
    background: var(--accent-soft);
  }

  /* Tablet: teclas más grandes y cómodas */
  @media (min-width: 768px) {
    .key {
      height: 3.2rem;
      min-width: 2.8rem;
      font-size: 1.4rem;
      border-radius: 0.7rem;
    }

    .key-action {
      height: 4rem;
      font-size: 1.2rem;
    }

    .key-icon {
      font-size: 1.6rem;
    }

    .key-caption {
      font-size: 0.75rem;
    }

    .accent-option {
      min-width: 3rem;
      height: 3.2rem;
      font-size: 1.5rem;
    }
  }
</style>
