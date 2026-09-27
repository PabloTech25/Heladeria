<script>
  import { cartCount, toggleCart } from '../stores/cart';
  import { scale } from 'svelte/transition';

  $: count = $cartCount;
</script>

<button
  on:click={toggleCart}
  class="relative flex min-h-11 min-w-11 items-center justify-center p-2 text-warm-700 transition-colors hover:text-chaud-600"
  aria-label="Carrito de compras"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
    />
  </svg>

  {#if count > 0}
    {#key count}
      <span
        in:scale={{ duration: 300, start: 0.5 }}
        class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-chaud-600 px-1 text-xs font-bold text-white"
      >
        {count}
      </span>
    {/key}
  {/if}
</button>
