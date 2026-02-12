<script lang="ts">
  import { addToCart } from '../stores/cart';

  export let id: string;
  export let name: string;
  export let price: number;
  export let image: string;
  export let size: string | undefined = undefined;

  let added = false;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  function handleClick() {
    addToCart({ id, name, price, image, size });
    added = true;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => (added = false), 1200);
  }
</script>

<button
  on:click={handleClick}
  class={`add-to-cart-btn w-full mt-3 sm:mt-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-bold shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
    added
      ? 'bg-green-500 text-white scale-95'
      : 'bg-chaud-600 hover:bg-chaud-700 text-white hover:shadow-lg hover:scale-[1.02]'
  }`}
>
  {#if added}
    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span class="hidden sm:inline">¡Agregado!</span>
    <span class="inline sm:hidden">✓</span>
  {:else}
    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
    <span class="hidden sm:inline">Agregar al Carrito</span>
    <span class="inline sm:hidden">Agregar</span>
  {/if}
</button>
