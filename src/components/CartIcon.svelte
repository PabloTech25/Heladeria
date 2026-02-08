<script>
  import { cartCount, toggleCart } from '../stores/cart';
  import { scale } from 'svelte/transition';

  $: count = $cartCount;
</script>

<button
  on:click={toggleCart}
  class="relative p-2 text-warm-700 hover:text-chaud-600 transition-colors"
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
        class="absolute -top-1 -right-1 bg-chaud-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
      >
        {count}
      </span>
    {/key}
  {/if}
</button>
