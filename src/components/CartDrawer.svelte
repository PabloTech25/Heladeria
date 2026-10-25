<script lang="ts">
  import {
    cartItems,
    isCartOpen,
    cartCount,
    cartTotal,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toastMessage,
  } from '../stores/cart';
  import { getCloudinaryUrl } from '../lib/cloudinary';
  import { fade, fly, slide } from 'svelte/transition';
  
  // ── WhatsApp Phone ──
  const WHATSAPP_PHONE = import.meta.env.PUBLIC_WHATSAPP_PHONE || '522451099498';

  // ── Reactive subscriptions ──
  $: items = $cartItems;
  $: open = $isCartOpen;
  $: total = $cartTotal;
  $: count = $cartCount;

  // ── Step state ──
  let step = 'cart'; // 'cart' | 'checkout'

  // ── Form fields ──
  let customerName = '';
  let customerPhone = '';
  let customerNotes = '';
  let deliveryMethod = 'pickup'; // 'pickup' | 'delivery'
  let paymentMethod = ''; // 'cash' | 'card' | 'transfer'
  let customerAddress = '';
  let formError = '';

  // ── Constants ──
  const DELIVERY_FEE = 30;
  const CARD_MINIMUM = 100;
  const RATE_LIMIT_MS = 5000;

  // ── Rate limiting ──
  let lastSubmitTime = 0;

  function validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(cleaned);
  }

  function sanitizeInput(text: string, maxLength: number = 200): string {
    return text
      .trim()
      .substring(0, maxLength)
      .replace(/[<>"'`]/g, '');
  }

  function canSubmitOrder(): boolean {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    return timeSinceLastSubmit >= RATE_LIMIT_MS;
  }

  // ── Reactive calculations ──
  $: subtotal = total;
  $: deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
  $: finalTotal = subtotal + deliveryFee;

  $: if (deliveryMethod === 'delivery' && paymentMethod === 'card') {
    paymentMethod = '';
  }

  $: availablePaymentMethods = deliveryMethod === 'pickup' 
    ? ['cash', 'card', 'transfer'] 
    : ['cash', 'transfer'];

  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // ── Handlers ──
  function handleClose() {
    closeCart();
    step = 'cart';
    formError = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) handleClose();
  }

  function proceedToCheckout() {
    step = 'checkout';
    formError = '';
  }

  function backToCart() {
    step = 'cart';
    formError = '';
  }

  function sendWhatsApp() {
    if (!canSubmitOrder()) {
      const secondsLeft = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSubmitTime)) / 1000);
      formError = `Por favor espera ${secondsLeft} segundos antes de enviar otro pedido`;
      return;
    }

    if (!customerName.trim()) {
      formError = 'Por favor ingresa tu nombre completo';
      return;
    }
    if (customerName.trim().length < 2) {
      formError = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    if (!customerPhone.trim()) {
      formError = 'Por favor ingresa tu número telefónico';
      return;
    }
    if (!validatePhone(customerPhone)) {
      formError = 'Teléfono inválido. Ingresa entre 10 y 15 dígitos';
      return;
    }

    if (deliveryMethod === 'delivery' && !customerAddress.trim()) {
      formError = 'Por favor ingresa la dirección de entrega';
      return;
    }
    if (deliveryMethod === 'delivery' && customerAddress.trim().length < 5) {
      formError = 'La dirección debe ser más específica (mínimo 5 caracteres)';
      return;
    }

    if (!paymentMethod) {
      formError = 'Por favor selecciona el método de pago deseado';
      return;
    }
    if (paymentMethod === 'card' && subtotal < CARD_MINIMUM) {
      formError = `El pago con tarjeta requiere un consumo mínimo de $${CARD_MINIMUM}`;
      return;
    }

    formError = '';

    const sanitizedName = sanitizeInput(customerName, 100);
    const sanitizedPhone = customerPhone.replace(/\D/g, '');
    const sanitizedAddress = sanitizeInput(customerAddress, 150);
    const sanitizedNotes = sanitizeInput(customerNotes, 500);

    const phoneNumber = WHATSAPP_PHONE;

    let message = `☕ *Nuevo Pedido en Línea — Chaud & Glace*\n\n`;
    message += `👤 *Cliente:* ${sanitizedName}\n`;
    message += `📱 *Teléfono:* ${sanitizedPhone}\n`;
    message += `🚗 *Tipo de entrega:* ${deliveryMethod === 'pickup' ? 'Recoger en tienda (Pick-up)' : 'Envío a domicilio'}\n`;

    if (deliveryMethod === 'delivery' && sanitizedAddress) {
      message += `📍 *Dirección:* ${sanitizedAddress}\n`;
    }

    message += `💳 *Método de pago:* ${paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta (Terminal)' : 'Transferencia Bancaria'}\n`;

    message += `\n🛒 *Detalle de la orden:*\n`;
    items.forEach((item) => {
      const itemSubtotal = item.product.price * item.quantity;
      message += `• ${item.quantity}x ${item.product.name}${item.product.size ? ` (${item.product.size})` : ''} — $${itemSubtotal} MXN\n`;
    });

    message += `\n💰 *Total a pagar:*\n`;
    message += `Subtotal: $${subtotal} MXN\n`;
    if (deliveryMethod === 'delivery') {
      message += `Costo de envío: $${deliveryFee} MXN\n`;
    }
    message += `*TOTAL FINAL: $${finalTotal} MXN*\n`;

    if (sanitizedNotes) {
      message += `\n📝 *Notas o detalles especiales:* ${sanitizedNotes}\n`;
    }

    message += `\n✨ _¡Gracias por elegir Chaud & Glace Ciudad Serdán!_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    lastSubmitTime = Date.now();

    clearCart();
    closeCart();
    step = 'cart';
    customerName = '';
    customerPhone = '';
    customerNotes = '';
    customerAddress = '';
    deliveryMethod = 'pickup';
    paymentMethod = '';

    toastMessage.set('¡Tu pedido ha sido preparado y enviado a WhatsApp!');
    setTimeout(() => toastMessage.set(null), 4000);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Overlay Backdrop -->
  <div class="fixed inset-0 z-50 overflow-hidden">
    <div
      class="absolute inset-0 bg-espresso-950/60 backdrop-blur-sm transition-opacity duration-300"
      on:click={handleClose}
      on:keydown={() => {}}
      role="button"
      tabindex="-1"
      aria-label="Cerrar panel de pedido"
      transition:fade={{ duration: 220 }}
    ></div>

    <!-- Slide-in Drawer Container (Full-width on mobile, max-w-md on desktop) -->
    <div class="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 pointer-events-none">
      <div
        class="pointer-events-auto flex h-full w-full sm:w-screen max-w-full sm:max-w-md flex-col bg-[#fdfbf7] shadow-2xl border-l border-warm-200/80 transition-all"
        transition:fly={{ x: 420, duration: 320 }}
      >
        <!-- ─── Header ─── -->
        <div class="flex items-center justify-between border-b border-warm-200/80 bg-white/90 px-4 sm:px-5 py-3.5 sm:py-4 backdrop-blur-md">
          <div class="flex items-center gap-2.5">
            {#if step === 'checkout'}
              <button
                type="button"
                on:click={backToCart}
                class="flex h-10 w-10 items-center justify-center rounded-full bg-warm-100 text-warm-700 transition-colors hover:bg-chaud-100 hover:text-chaud-700 active:scale-95"
                aria-label="Regresar a revisar productos"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            {/if}
            <div>
              <h2 class="store-display text-lg sm:text-xl font-bold text-espresso-950">
                {step === 'checkout' ? 'Finalizar Pedido' : 'Tu Pedido'}
              </h2>
              <p class="text-xs text-warm-600 font-medium">
                {count > 0 ? `${count} ${count === 1 ? 'producto' : 'productos'} seleccionados` : 'Bolsa vacía'}
              </p>
            </div>
          </div>

          <button
            type="button"
            on:click={handleClose}
            class="flex h-10 w-10 items-center justify-center rounded-full text-warm-600 transition-colors hover:bg-warm-100 hover:text-espresso-950 active:scale-95"
            aria-label="Cerrar carrito"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- ─── Content ─── -->
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {#if step === 'cart'}
            {#if items.length === 0}
              <!-- Empty State -->
              <div class="flex flex-col items-center justify-center h-full text-center py-16 px-4">
                <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-warm-100 text-3xl shadow-inner">
                  🍨
                </div>
                <h3 class="store-display text-xl font-bold text-espresso-950 mb-2">Tu pedido está vacío</h3>
                <p class="text-sm text-warm-600 max-w-xs mb-6">
                  Descubre nuestra carta artesanal: helados, crepas, frappes y café de especialidad.
                </p>
                <button
                  type="button"
                  on:click={handleClose}
                  class="rounded-full bg-espresso-900 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-chaud-600 hover:-translate-y-0.5"
                >
                  Explorar la Carta
                </button>
              </div>
            {:else}
              <!-- Cart Items List -->
              <div class="space-y-3">
                {#each items as item (item.product.id)}
                  <div
                    class="group relative flex gap-3.5 rounded-2xl border border-warm-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-chaud-200 hover:shadow-md"
                    transition:slide={{ duration: 200 }}
                  >
                    <div class="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-warm-100/70 p-1 flex items-center justify-center">
                      <img
                        src={getCloudinaryUrl(item.product.image, { width: 120, quality: 'auto', format: 'auto' })}
                        alt={item.product.name}
                        class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div class="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div class="flex items-start justify-between gap-2">
                          <h4 class="font-bold text-sm text-espresso-950 leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            on:click={() => removeFromCart(item.product.id)}
                            class="text-warm-400 hover:text-red-500 transition-colors p-1"
                            aria-label={`Eliminar ${item.product.name}`}
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {#if item.product.size}
                          <span class="inline-block rounded-md bg-warm-100 px-2 py-0.5 text-[0.68rem] font-medium text-warm-700">
                            {item.product.size}
                          </span>
                        {/if}
                      </div>

                      <div class="flex items-center justify-between pt-2">
                        <!-- Quantity Controller -->
                        <div class="flex items-center rounded-lg border border-warm-200 bg-warm-50/80 p-0.5">
                          <button
                            type="button"
                            on:click={() => updateQuantity(item.product.id, item.quantity - 1)}
                            class="flex h-7 w-7 items-center justify-center rounded-md text-warm-700 transition-colors hover:bg-white hover:text-espresso-950"
                            aria-label="Reducir una unidad"
                          >
                            −
                          </button>
                          <span class="w-6 text-center text-xs font-bold text-espresso-950">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            on:click={() => updateQuantity(item.product.id, item.quantity + 1)}
                            class="flex h-7 w-7 items-center justify-center rounded-md text-warm-700 transition-colors hover:bg-white hover:text-espresso-950"
                            aria-label="Aumentar una unidad"
                          >
                            +
                          </button>
                        </div>

                        <!-- Subtotal -->
                        <span class="font-bold text-sm text-chaud-700">
                          ${item.product.price * item.quantity} MXN
                        </span>
                      </div>
                    </div>
                  </div>
                {/each}

                <!-- Clear Cart -->
                <div class="pt-2 text-center">
                  <button
                    type="button"
                    on:click={clearCart}
                    class="text-xs font-semibold text-warm-400 hover:text-red-500 transition-colors"
                  >
                    Vaciar todo el pedido
                  </button>
                </div>
              </div>
            {/if}

          {:else}
            <!-- ─── Checkout Step ─── -->
            <div class="space-y-4">
              {#if formError}
                <div
                  class="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 flex items-center gap-2"
                  transition:slide={{ duration: 180 }}
                >
                  <svg class="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formError}</span>
                </div>
              {/if}

              <!-- Name Field -->
              <div>
                <label for="checkout-name" class="block text-xs font-bold text-espresso-950 mb-1.5">
                  ¿A nombre de quién registramos el pedido? *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  bind:value={customerName}
                  placeholder="Tu nombre y apellido"
                  maxlength="100"
                  class="w-full rounded-xl border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-espresso-950 placeholder-warm-400 shadow-sm focus:border-chaud-500 focus:outline-none focus:ring-2 focus:ring-chaud-200 transition-all"
                />
              </div>

              <!-- Phone Field -->
              <div>
                <label for="checkout-phone" class="block text-xs font-bold text-espresso-950 mb-1.5">
                  Número de WhatsApp * <span class="text-[0.68rem] font-normal text-warm-500">(10 dígitos)</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputmode="numeric"
                  bind:value={customerPhone}
                  placeholder="Ej. 2451099498"
                  maxlength="20"
                  class="w-full rounded-xl border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-espresso-950 placeholder-warm-400 shadow-sm focus:border-chaud-500 focus:outline-none focus:ring-2 focus:ring-chaud-200 transition-all"
                />
              </div>

              <!-- Delivery Method -->
              <div>
                <span class="block text-xs font-bold text-espresso-950 mb-2">
                  Modalidad de entrega *
                </span>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    on:click={() => (deliveryMethod = 'pickup')}
                    class={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-xs font-bold transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-chaud-600 bg-chaud-50 text-chaud-700 shadow-sm'
                        : 'border-warm-200 bg-white text-warm-600 hover:border-warm-300'
                    }`}
                  >
                    <span>🏪 Recoger en tienda</span>
                    <span class="text-[0.68rem] font-normal text-warm-500">Sin costo extra</span>
                  </button>

                  <button
                    type="button"
                    on:click={() => (deliveryMethod = 'delivery')}
                    class={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-xs font-bold transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'border-chaud-600 bg-chaud-50 text-chaud-700 shadow-sm'
                        : 'border-warm-200 bg-white text-warm-600 hover:border-warm-300'
                    }`}
                  >
                    <span>🛵 A domicilio</span>
                    <span class="text-[0.68rem] font-normal text-warm-500">+$30 Ciudad Serdán</span>
                  </button>
                </div>
              </div>

              <!-- Address if delivery -->
              {#if deliveryMethod === 'delivery'}
                <div transition:slide={{ duration: 180 }} class="space-y-1.5">
                  <label for="checkout-address" class="block text-xs font-bold text-espresso-950">
                    Dirección de entrega completa *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    bind:value={customerAddress}
                    placeholder="Calle, número, colonia y referencias"
                    maxlength="150"
                    class="w-full rounded-xl border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-espresso-950 placeholder-warm-400 shadow-sm focus:border-chaud-500 focus:outline-none focus:ring-2 focus:ring-chaud-200 transition-all"
                  />
                </div>
              {/if}

              <!-- Payment Method -->
              <div>
                <span class="block text-xs font-bold text-espresso-950 mb-2">
                  Forma de pago *
                </span>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    on:click={() => (paymentMethod = 'cash')}
                    class={`rounded-xl border-2 p-2.5 text-xs font-semibold transition-all text-center ${
                      paymentMethod === 'cash'
                        ? 'border-chaud-600 bg-chaud-50 text-chaud-700'
                        : 'border-warm-200 bg-white text-warm-600 hover:border-warm-300'
                    }`}
                  >
                    💵 Efectivo
                  </button>

                  {#if deliveryMethod === 'pickup'}
                    <button
                      type="button"
                      on:click={() => (paymentMethod = 'card')}
                      class={`rounded-xl border-2 p-2.5 text-xs font-semibold transition-all text-center ${
                        paymentMethod === 'card'
                          ? 'border-chaud-600 bg-chaud-50 text-chaud-700'
                          : 'border-warm-200 bg-white text-warm-600 hover:border-warm-300'
                      }`}
                    >
                      💳 Tarjeta (mín $100)
                    </button>
                  {/if}

                  <button
                    type="button"
                    on:click={() => (paymentMethod = 'transfer')}
                    class={`rounded-xl border-2 p-2.5 text-xs font-semibold transition-all text-center ${
                      paymentMethod === 'transfer'
                        ? 'border-chaud-600 bg-chaud-50 text-chaud-700'
                        : 'border-warm-200 bg-white text-warm-600 hover:border-warm-300'
                    }`}
                  >
                    📲 Transferencia
                  </button>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label for="checkout-notes" class="block text-xs font-bold text-espresso-950 mb-1.5">
                  Indicaciones especiales <span class="text-warm-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  bind:value={customerNotes}
                  placeholder="Sin azúcar, extra servilletas, tocar timbre..."
                  rows="2"
                  maxlength="500"
                  class="w-full resize-none rounded-xl border border-warm-200 bg-white px-3.5 py-2 text-sm text-espresso-950 placeholder-warm-400 shadow-sm focus:border-chaud-500 focus:outline-none focus:ring-2 focus:ring-chaud-200 transition-all"
                ></textarea>
              </div>

              <!-- Order Summary Breakdown -->
              <div class="rounded-2xl border border-warm-200/90 bg-white p-4 shadow-sm space-y-2 text-xs">
                <div class="flex justify-between text-warm-600">
                  <span>Subtotal productos ({count})</span>
                  <span class="font-bold text-espresso-950">${subtotal} MXN</span>
                </div>
                {#if deliveryMethod === 'delivery'}
                  <div class="flex justify-between text-warm-600">
                    <span>Costo de envío local</span>
                    <span class="font-bold text-chaud-700">+${deliveryFee} MXN</span>
                  </div>
                {/if}
                <div class="border-t border-warm-200 pt-2 flex justify-between items-baseline font-bold">
                  <span class="text-sm text-espresso-950">Total a Pagar</span>
                  <span class="store-display text-xl text-chaud-700">${finalTotal} MXN</span>
                </div>
              </div>

              <!-- WhatsApp Submit Button -->
              <button
                type="button"
                on:click={sendWhatsApp}
                class="w-full rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 text-base"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Enviar Pedido a WhatsApp</span>
              </button>
            </div>
          {/if}
        </div>

        <!-- ─── Drawer Bottom Bar (Cart Step Only) ─── -->
        {#if step === 'cart' && items.length > 0}
          <div class="border-t border-warm-200/80 bg-white/90 p-5 backdrop-blur-md">
            <div class="flex items-baseline justify-between mb-3.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-warm-600">Total estimado</span>
              <span class="store-display text-2xl font-bold text-espresso-950">${total} MXN</span>
            </div>
            <button
              type="button"
              on:click={proceedToCheckout}
              class="w-full rounded-2xl bg-espresso-900 py-3.5 px-6 font-bold text-white shadow-lg transition-all duration-300 hover:bg-chaud-600 hover:shadow-chaud-900/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>Continuar al Pedido</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
