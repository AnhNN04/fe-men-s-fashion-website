/**
 * State Management Module - Central store for application state
 * Manages products, cart, filters, and search
 */

const STORAGE_KEY = 'atino-shop-state';

// Global state object
let globalState = {
  products: [],
  cart: [],
  filters: {
    categories: [],
    priceRanges: [],
    statuses: [],
  },
  search: '',
};

/**
 * Initialize state - load from localStorage if available
 */
export function initState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  
  if (saved) {
    try {
      globalState = JSON.parse(saved);
    } catch (e) {
      console.error('[State] Failed to load saved state', e);
    }
  }
  
  console.log('[State] Initialized');
}

/**
 * Get current state
 */
export function getState() {
  return { ...globalState };
}

/**
 * Update state and persist to localStorage
 */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
}

/**
 * Set products in state
 */
export function setProducts(products) {
  globalState.products = products;
  saveState();
}

/**
 * Get cart items
 */
export function getCart() {
  return [...globalState.cart];
}

/**
 * Add product to cart
 */
export function addToCart(product, quantity = 1) {
  const existingItem = globalState.cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    globalState.cart.push({
      ...product,
      quantity,
    });
  }
  
  saveState();
  console.log('[State] Added to cart:', product.name, 'Qty:', quantity);
}

/**
 * Update cart items
 */
export function updateCart(cartItems) {
  globalState.cart = cartItems;
  saveState();
}

/**
 * Clear cart
 */
export function clearCart() {
  globalState.cart = [];
  saveState();
}

/**
 * Get current filters
 */
export function getFilters() {
  return { ...globalState.filters };
}

/**
 * Set filters
 */
export function setFilters(filters) {
  globalState.filters = {
    categories: filters.categories || [],
    priceRanges: filters.priceRanges || [],
    statuses: filters.statuses || [],
  };
  saveState();
  console.log('[State] Filters updated:', globalState.filters);
}

/**
 * Get search query
 */
export function getSearch() {
  return globalState.search;
}

/**
 * Update search query
 */
export function updateSearch(query) {
  globalState.search = query;
  saveState();
  console.log('[State] Search updated:', query);
}

/**
 * Set search query (alias for updateSearch)
 */
export function setSearchQuery(query) {
  return updateSearch(query);
}

/**
 * Reset filters
 */
export function resetFilters() {
  globalState.filters = {
    categories: [],
    priceRanges: [],
    statuses: [],
  };
  saveState();
}

/**
 * Get total cart value
 */
export function getCartTotal() {
  return globalState.cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
}

/**
 * Get cart item count
 */
export function getCartItemCount() {
  return globalState.cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Clear all state and localStorage
 */
export function clearAllState() {
  globalState = {
    products: [],
    cart: [],
    filters: {
      categories: [],
      priceRanges: [],
      statuses: [],
    },
    search: '',
  };
  localStorage.removeItem(STORAGE_KEY);
}

export default {
  initState,
  getState,
  setProducts,
  getCart,
  addToCart,
  updateCart,
  clearCart,
  getFilters,
  setFilters,
  getSearch,
  updateSearch,
  resetFilters,
  getCartTotal,
  getCartItemCount,
  clearAllState,
};
