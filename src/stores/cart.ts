import { atom, computed } from 'nanostores';

// ── Types ──────────────────────────────────────────────────────────

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

// ── Atoms ──────────────────────────────────────────────────────────

export const cartItems = atom<CartItem[]>([]);
export const isCartOpen = atom(false);
export const toastMessage = atom<string | null>(null);

// ── Computed ───────────────────────────────────────────────────────

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);

// ── Actions ────────────────────────────────────────────────────────

export function addToCart(product: CartProduct) {
  const items = cartItems.get();
  const existing = items.find((i) => i.product.id === product.id);

  if (existing) {
    cartItems.set(
      items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  } else {
    cartItems.set([...items, { product, quantity: 1 }]);
  }

  saveCart();
  showToast(`${product.name} agregado al carrito`);
}

export function removeFromCart(productId: string) {
  cartItems.set(cartItems.get().filter((i) => i.product.id !== productId));
  saveCart();
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  cartItems.set(
    cartItems.get().map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    )
  );
  saveCart();
}

export function clearCart() {
  cartItems.set([]);
  saveCart();
}

export function toggleCart() {
  isCartOpen.set(!isCartOpen.get());
}

export function openCart() {
  isCartOpen.set(true);
}

export function closeCart() {
  isCartOpen.set(false);
}

// ── Persistence ────────────────────────────────────────────────────

function saveCart() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chaud-cart', JSON.stringify(cartItems.get()));
  }
}

// Auto-load from localStorage on client
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('chaud-cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cartItems.set(parsed);
      }
    }
  } catch {
    // Invalid data – ignore
  }
}

// ── Toast helper ───────────────────────────────────────────────────

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastMessage.set(message);
  toastTimeout = setTimeout(() => toastMessage.set(null), 3000);
}
