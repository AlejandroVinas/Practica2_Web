// Gestión del carrito de compras con persistencia en localStorage

const CART_KEY = "shopping_cart";

/**
 * Obtiene el carrito desde localStorage
 */
export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Guarda el carrito en localStorage
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Añade un producto al carrito
 */
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  
  // Buscar si el producto ya está en el carrito
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    // Incrementar cantidad
    cart[existingIndex].quantity += quantity;
  } else {
    // Añadir nuevo producto
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity
    });
  }
  
  saveCart(cart);
  return cart;
}

/**
 * Actualiza la cantidad de un producto
 */
export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === productId);
  
  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    saveCart(cart);
  }
  
  return cart;
}

/**
 * Elimina un producto del carrito
 */
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

/**
 * Calcula el total del carrito
 */
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Obtiene el número de items en el carrito
 */
export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Vacía el carrito
 */
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/**
 * Convierte el carrito a formato para GraphQL
 */
export function getCartForOrder() {
  const cart = getCart();
  return cart.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));
}