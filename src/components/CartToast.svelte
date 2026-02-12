<script>
  import { toastMessage } from '../stores/cart';
  import { fly, fade } from 'svelte/transition';

  $: message = $toastMessage;
</script>

{#if message}
  <div
    class="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto md:left-auto md:translate-x-0 md:right-6 z-[70] bg-warm-900 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 max-w-sm mx-auto sm:mx-0"
    in:fly={{ y: 30, duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <span class="bg-green-500 rounded-full p-1 shrink-0">
      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
    </span>
    <span class="font-medium text-xs sm:text-sm">{message}</span>
  </div>
{/if}
