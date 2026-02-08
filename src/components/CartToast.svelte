<script>
  import { toastMessage } from '../stores/cart';
  import { fly, fade } from 'svelte/transition';

  $: message = $toastMessage;
</script>

{#if message}
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-[70] bg-warm-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
    in:fly={{ y: 30, duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <span class="bg-green-500 rounded-full p-1 shrink-0">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
    </span>
    <span class="font-medium text-sm">{message}</span>
  </div>
{/if}
