<script>
  import { toastMessage } from '../stores/cart';
  import { fly, fade } from 'svelte/transition';

  $: message = $toastMessage;
</script>

{#if message}
  <div
    class="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-60 flex items-center gap-3 rounded-2xl border border-white/15 bg-espresso-950/95 px-5 py-3.5 text-white shadow-2xl backdrop-blur-xl max-w-sm ml-auto"
    in:fly={{ y: 20, duration: 250 }}
    out:fade={{ duration: 180 }}
    role="status"
    aria-live="polite"
  >
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
    </span>
    <span class="text-xs sm:text-sm font-semibold tracking-wide text-warm-100">{message}</span>
  </div>
{/if}
