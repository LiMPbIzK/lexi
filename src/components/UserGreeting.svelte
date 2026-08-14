<script lang="ts">
  import { onMount } from 'svelte';
  import { useStore } from '@nanostores/svelte-runes';
  import { userName } from '../stores';
  import { getUserName } from '../lib/user';

  const name = useStore(userName);

  onMount(() => {
    userName.set(getUserName());
  });
</script>

{#if name.current}
  <span class="greeting">Bienvenido, {name.current}</span>
{/if}

<style>
  .greeting {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--primary);
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    .greeting {
      display: none;
    }
  }
</style>
