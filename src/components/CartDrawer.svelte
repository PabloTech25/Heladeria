<script>
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
  import { fade, fly, slide } from 'svelte/transition';

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
  let paymentMethod = ''; // 'cash' | 'card'
  let customerAddress = '';
  let formError = '';

  // ── Body scroll lock ──
  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // ── Handlers ──
  function handleClose() {
    closeCart();
    step = 'cart';
    formError = '';
  }

  function handleKeydown(e) {
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
    // Validate
    if (!customerName.trim()) {
      formError = 'Por favor ingresa tu nombre';
      return;
    }
    if (!customerPhone.trim()) {
      formError = 'Por favor ingresa tu teléfono';
      return;
    }
    if (deliveryMethod === 'delivery' && !customerAddress.trim()) {
      formError = 'Por favor ingresa tu dirección de entrega';
      return;
    }
    if (!paymentMethod) {
      formError = 'Por favor selecciona tu método de pago';
      return;
    }
    formError = '';

    // Build message
    // Número de WhatsApp del negocio (cambiar si es necesario)
    const phoneNumber = '522451051911';

    let message = `🧁 *Nuevo Pedido - Chaud & Glace*\n\n`;
    message += `👤 *Cliente:* ${customerName.trim()}\n`;
    message += `📱 *Teléfono:* ${customerPhone.trim()}\n`;
    message += `🚗 *Entrega:* ${deliveryMethod === 'pickup' ? 'Recoger en tienda' : 'A domicilio'}\n`;

    if (deliveryMethod === 'delivery' && customerAddress.trim()) {
      message += `📍 *Dirección:* ${customerAddress.trim()}\n`;
    }

    message += `💳 *Pago:* ${paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta (Débito/Crédito)'}\n`;

    message += `\n📋 *Pedido:*\n`;
    items.forEach((item) => {
      const subtotal = item.product.price * item.quantity;
      message += `• ${item.quantity}x ${item.product.name}${item.product.size ? ` (${item.product.size})` : ''} — $${subtotal}\n`;
    });

    message += `\n💰 *Total: $${total}*\n`;

    if (customerNotes.trim()) {
      message += `\n📝 *Notas:* ${customerNotes.trim()}\n`;
    }

    message += `\n¡Gracias por tu pedido! 🎉`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    // Reset everything
    clearCart();
    closeCart();
    step = 'cart';
    customerName = '';
    customerPhone = '';
    customerNotes = '';
    customerAddress = '';
    deliveryMethod = 'pickup';
    paymentMethod = '';

    // Show success toast
    toastMessage.set('¡Pedido enviado! Te redirigimos a WhatsApp');
    setTimeout(() => toastMessage.set(null), 4000);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Overlay container -->
  <div class="fixed inset-0 z-[60]">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      on:click={handleClose}
      on:keydown={() => {}}
      role="button"
      tabindex="-1"
      transition:fade={{ duration: 200 }}
    />

    <!-- Drawer panel -->
    <div
      class="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col"
      transition:fly={{ x: 400, duration: 300 }}
    >
      <!-- ─── Header ─── -->
      <div class="flex items-center justify-between p-4 sm:p-5 border-b border-warm-100">
        {#if step === 'checkout'}
          <button
            on:click={backToCart}
            class="flex items-center gap-1 text-xs sm:text-sm font-semibold text-chaud-600 hover:text-chaud-700 transition-colors"
          >
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h2 class="text-base sm:text-lg font-bold text-warm-900">Finalizar Pedido</h2>
        {:else}
          <h2 class="text-base sm:text-lg font-bold text-warm-900">
            Tu Carrito
            {#if count > 0}
              <span class="text-chaud-600">({count})</span>
            {/if}
          </h2>
        {/if}

        <button
          on:click={handleClose}
          class="p-2 text-warm-400 hover:text-warm-700 transition-colors rounded-lg hover:bg-warm-100"
          aria-label="Cerrar carrito"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- ─── Content ─── -->
      <div class="flex-1 overflow-y-auto">
        {#if step === 'cart'}
          <!-- Cart view -->
          {#if items.length === 0}
            <!-- Empty state -->
            <div class="flex flex-col items-center justify-center h-full text-center px-6 py-16">
              <svg class="w-24 h-24 text-warm-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <h3 class="text-xl font-bold text-warm-700 mb-2">Tu carrito está vacío</h3>
              <p class="text-warm-500 mb-6">Agrega productos de nuestro menú para comenzar</p>
              <button
                on:click={handleClose}
                class="text-chaud-600 font-semibold hover:text-chaud-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver al menú
              </button>
            </div>
          {:else}
            <!-- Items list -->
            <div class="p-4 sm:p-5 space-y-3 sm:space-y-4">
              {#each items as item (item.product.id)}
                <div
                  class="flex gap-3 sm:gap-4 p-3 bg-warm-50 rounded-xl border border-warm-100"
                  transition:slide={{ duration: 200 }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    class="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg shrink-0 bg-white"
                  />
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-warm-900 text-sm sm:text-base leading-tight truncate">
                      {item.product.name}
                    </h4>
                    {#if item.product.size}
                      <p class="text-xs text-warm-500 mt-0.5">{item.product.size}</p>
                    {/if}
                    <p class="text-chaud-600 font-bold text-sm mt-1">${item.product.price}</p>

                    <div class="flex items-center justify-between mt-2">
                      <!-- Quantity controls -->
                      <div class="flex items-center gap-1.5">
                        <button
                          on:click={() => updateQuantity(item.product.id, item.quantity - 1)}
                          class="w-7 h-7 rounded-lg bg-warm-200 hover:bg-warm-300 flex items-center justify-center text-warm-700 font-bold transition-colors text-sm"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span class="w-8 text-center font-bold text-warm-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          on:click={() => updateQuantity(item.product.id, item.quantity + 1)}
                          class="w-7 h-7 rounded-lg bg-chaud-100 hover:bg-chaud-200 flex items-center justify-center text-chaud-700 font-bold transition-colors text-sm"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      <!-- Subtotal + remove -->
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-warm-800">
                          ${item.product.price * item.quantity}
                        </span>
                        <button
                          on:click={() => removeFromCart(item.product.id)}
                          class="text-warm-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Eliminar {item.product.name}"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}

              <!-- Clear cart link -->
              <button
                on:click={clearCart}
                class="text-sm text-warm-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1 mx-auto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Vaciar carrito
              </button>
            </div>
          {/if}

        {:else}
          <!-- Checkout view -->
          <div class="p-4 sm:p-5 space-y-4 sm:space-y-5">
            <h3 class="text-base sm:text-lg font-bold text-warm-900">Datos del pedido</h3>

            {#if formError}
              <div
                class="bg-red-50 text-red-600 p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-red-100"
                transition:slide={{ duration: 200 }}
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formError}
              </div>
            {/if}

            <!-- Name -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-warm-700 mb-1 sm:mb-1.5" for="checkout-name">
                Nombre *
              </label>
              <input
                id="checkout-name"
                type="text"
                bind:value={customerName}
                placeholder="Tu nombre completo"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-warm-200 rounded-xl focus:ring-2 focus:ring-chaud-400 focus:border-chaud-400 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-warm-700 mb-1 sm:mb-1.5" for="checkout-phone">
                Teléfono *
              </label>
              <input
                id="checkout-phone"
                type="tel"
                bind:value={customerPhone}
                placeholder="Tu número de teléfono"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-warm-200 rounded-xl focus:ring-2 focus:ring-chaud-400 focus:border-chaud-400 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

            <!-- Delivery method -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-warm-700 mb-2">
                Método de entrega *
              </label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  class={`p-2.5 sm:p-3 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    deliveryMethod === 'pickup'
                      ? 'border-chaud-500 bg-chaud-50 text-chaud-700'
                      : 'border-warm-200 text-warm-500 hover:border-warm-300'
                  }`}
                  on:click={() => (deliveryMethod = 'pickup')}
                >
                  <span class="text-base sm:text-lg">🏪</span>
                  <span class="text-xs sm:text-sm">Recoger en tienda</span>
                </button>
                <button
                  type="button"
                  class={`p-2.5 sm:p-3 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    deliveryMethod === 'delivery'
                      ? 'border-chaud-500 bg-chaud-50 text-chaud-700'
                      : 'border-warm-200 text-warm-500 hover:border-warm-300'
                  }`}
                  on:click={() => (deliveryMethod = 'delivery')}
                >
                  <span class="text-base sm:text-lg">🛵</span>
                  <span class="text-xs sm:text-sm">A domicilio</span>
                </button>
              </div>
            </div>

            <!-- Payment method -->
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-warm-700 mb-2">
                Método de pago *
              </label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  class={`p-2.5 sm:p-3 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'cash'
                      ? 'border-chaud-500 bg-chaud-50 text-chaud-700'
                      : 'border-warm-200 text-warm-500 hover:border-warm-300'
                  }`}
                  on:click={() => (paymentMethod = 'cash')}
                >
                  <span class="text-lg">💵</span>
                  Efectivo
                </button>
                <button
                  type="button"
                  class={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-chaud-500 bg-chaud-50 text-chaud-700'
                      : 'border-warm-200 text-warm-500 hover:border-warm-300'
                  }`}
                  on:click={() => (paymentMethod = 'card')}
                >
                  <span class="text-lg">💳</span>
                  Tarjeta
                </button>
              </div>
            </div>

            <!-- Address (conditional) -->
            {#if deliveryMethod === 'delivery'}
              <div transition:slide={{ duration: 200 }}>
                <label class="block text-sm font-semibold text-warm-700 mb-1.5" for="checkout-address">
                  Dirección de entrega *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  bind:value={customerAddress}
                  placeholder="Calle, número, colonia"
                  class="w-full px-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-chaud-400 focus:border-chaud-400 outline-none transition text-warm-900 placeholder-warm-400"
                />
              </div>
            {/if}

            <!-- Notes -->
            <div>
              <label class="block text-sm font-semibold text-warm-700 mb-1.5" for="checkout-notes">
                Notas adicionales
              </label>
              <textarea
                id="checkout-notes"
                bind:value={customerNotes}
                placeholder="Instrucciones especiales, alergias, etc."
                rows="3"
                class="w-full px-4 py-3 border border-warm-200 rounded-xl focus:ring-2 focus:ring-chaud-400 focus:border-chaud-400 outline-none transition resize-none text-warm-900 placeholder-warm-400"
              />
            </div>

            <!-- Order summary -->
            <div class="bg-warm-50 rounded-xl p-4 border border-warm-100">
              <h4 class="font-bold text-warm-900 mb-3 text-sm">Resumen del pedido</h4>
              {#each items as item}
                <div class="flex justify-between text-sm text-warm-600 mb-1.5">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span class="font-semibold text-warm-800">${item.product.price * item.quantity}</span>
                </div>
              {/each}
              <div class="border-t border-warm-200 mt-3 pt-3 flex justify-between font-bold text-warm-900">
                <span>Total</span>
                <span class="text-chaud-600 text-lg">${total}</span>
              </div>
            </div>

            <!-- WhatsApp button -->
            <button
              on:click={sendWhatsApp}
              class="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>
          </div>
        {/if}
      </div>

      <!-- ─── Footer (cart step only, when items exist) ─── -->
      {#if step === 'cart' && items.length > 0}
        <div class="border-t border-warm-100 p-4 sm:p-5 bg-white">
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <span class="text-warm-600 font-medium text-sm sm:text-base">Total</span>
            <span class="text-xl sm:text-2xl font-bold text-warm-900">${total}</span>
          </div>
          <button
            on:click={proceedToCheckout}
            class="w-full bg-chaud-600 hover:bg-chaud-700 text-white py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            Proceder al pedido
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
