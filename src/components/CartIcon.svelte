<script lang="ts">
  import { cartCount, cartTotal, toggleCart } from '../stores/cart';
  import { scale } from 'svelte/transition';

  $: count = $cartCount;
  $: total = $cartTotal;
</script>

<button
  type="button"
  on:click={toggleCart}
  class="group relative flex min-h-11 items-center gap-2 rounded-full border border-warm-200/80 bg-white/80 px-3 py-2 text-warm-800 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-chaud-300 hover:bg-chaud-50/60 hover:text-chaud-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chaud-500"
  aria-label={`Ver carrito de compras, ${count} productos por $${total} pesos`}
>
  <div class="relative flex items-center justify-center">
    <svg class="h-5 w-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.8"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>

    {#if count > 0}
      {#key count}
        <span
          in:scale={{ duration: 250, start: 0.4 }}
          class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-chaud-600 px-1 text-[0.68rem] font-bold text-white shadow-sm ring-2 ring-white"
        >
          {count}
        </span>
      {/key}
    {/if}
  </div>

  {#if total > 0}
    <span class="hidden font-bold text-xs text-espresso-900 sm:inline-block">
      ${total}
    </span>
  {/if}
</button>
