<script lang="ts">
  import { addToCart } from '../stores/cart';

  export let id: string;
  export let name: string;
  export let price: number;
  export let image: string;
  export let size: string | undefined = undefined;

  let added = false;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    addToCart({ id, name, price, image, size });
    added = true;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => (added = false), 1400);
  }
</script>

<button
  type="button"
  on:click={handleClick}
  class={`group/btn relative w-full overflow-hidden rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 shadow-sm ${
    added
      ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-[0.98]'
      : 'bg-espresso-900 text-white hover:bg-chaud-600 hover:shadow-lg hover:shadow-chaud-900/15 hover:-translate-y-0.5 active:scale-95'
  }`}
  aria-label={`Agregar ${name} al carrito`}
>
  <!-- Background sheen reflection -->
  <span
    class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
    aria-hidden="true"
  ></span>

  {#if added}
    <svg class="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
    </svg>
    <span class="tracking-wide font-bold">¡Agregado al Carrito!</span>
  {:else}
    <svg
      class="w-4 h-4 text-chaud-400 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    <span class="tracking-wide">Agregar al Pedido</span>
  {/if}
</button>
