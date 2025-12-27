/**
 * Atino Clone - E-commerce SPA Entry Point
 * Initializes router, state management, and global event listeners
 */

import { initRouter, navigate } from './core/router.js';
import { initState, getCart, updateCart, addToCart } from './core/state.js';
import { formatPrice } from './utils/format.js';

/**
 * Initialize Application
 */
async function initApp() {
  console.log('[App] Initializing...');
  
  // Initialize state management
  initState();
  
  // Initialize router - must be done before rendering any views
  initRouter();
  
  // Setup global event listeners
  setupGlobalListeners();
  
  // Setup cart drawer
  setupCartDrawer();
  
  // Setup modal close handlers
  setupModalHandlers();
  
  // Setup logo link
  setupLogoLink();
  
  console.log('[App] Ready');
}

/**
 * Setup global event listeners
 */
function setupGlobalListeners() {
  // Header search
  const headerSearchBtn = document.getElementById('headerSearchBtn');
  const headerSearch = document.getElementById('headerSearch');
  
  if (headerSearchBtn && headerSearch) {
    headerSearchBtn.addEventListener('click', performSearch);
    headerSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
  
  // Cart toggle button
  const cartToggle = document.getElementById('cartToggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', toggleCartDrawer);
  }
}

/**
 * Perform search and navigate to shop with search params
 */
function performSearch() {
  const searchInput = document.getElementById('headerSearch');
  const query = searchInput ? searchInput.value.trim() : '';
  
  if (query) {
    // Navigate to shop view with search query
    navigate('/shop', { search: query });
    searchInput.value = '';
  }
}

/**
 * Toggle cart drawer
 */
function toggleCartDrawer() {
  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) {
    cartDrawer.classList.toggle('open');
  }
}

/**
 * Setup cart drawer interactions
 */
function setupCartDrawer() {
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  
  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', () => {
      const cartDrawer = document.getElementById('cartDrawer');
      cartDrawer.classList.remove('open');
    });
  }
  
  // Close cart when clicking outside
  document.addEventListener('click', (e) => {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartToggle = document.getElementById('cartToggle');
    
    if (cartDrawer && cartToggle) {
      if (!cartDrawer.contains(e.target) && !cartToggle.contains(e.target)) {
        cartDrawer.classList.remove('open');
      }
    }
  });
  
  // Update cart display when cart changes
  updateCartDisplay();
}

/**
 * Update cart display (count and items)
 */
export function updateCartDisplay() {
  const cart = getCart();
  const cartCount = document.getElementById('cartCount');
  
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
  
  updateCartDrawerContent();
}

/**
 * Update cart drawer content
 */
function updateCartDrawerContent() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  
  if (!cartItems) return;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty"><p>Giỏ hàng của bạn trống</p></div>';
    if (cartSummary) cartSummary.innerHTML = '';
    return;
  }
  
  // Render cart items with checkbox
  const itemsHTML = cart.map((item, index) => `
    <div class="cart-item" data-product-id="${item.id}">
      <input 
        type="checkbox" 
        class="cart-item-checkbox" 
        data-product-id="${item.id}"
        checked
        id="cart-item-${index}"
      >
      <label for="cart-item-${index}" class="cart-item-checkbox-label"></label>
      <img src="${item.images?.[0] || 'assets/images/placeholder.jpg'}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="cart-item-quantity-controls">
          <div class="cart-quantity-control">
            <button class="cart-quantity-btn cart-quantity-minus" data-product-id="${item.id}">−</button>
            <input 
              type="number" 
              class="cart-quantity-input" 
              value="${item.quantity}" 
              min="1"
              data-product-id="${item.id}"
            >
            <button class="cart-quantity-btn cart-quantity-plus" data-product-id="${item.id}">+</button>
          </div>
          <button class="cart-remove-btn" data-product-id="${item.id}" title="Xóa sản phẩm">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
  
  cartItems.innerHTML = itemsHTML;
  
  // Setup checkbox handlers
  cartItems.querySelectorAll('.cart-item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateCartSummary();
    });
  });
  
  // Setup quantity controls
  cartItems.querySelectorAll('.cart-quantity-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent event bubbling to avoid unwanted side effects
      e.preventDefault();
      e.stopPropagation()
      const productId = btn.getAttribute('data-product-id');
      const input = cartItems.querySelector(`.cart-quantity-input[data-product-id="${productId}"]`);
      if (input) {
        const currentValue = parseInt(input.value) || 1;
        input.value = Math.max(1, currentValue - 1);
        updateCartItemQuantity(productId, parseInt(input.value));
      }
    });
  });
  
  cartItems.querySelectorAll('.cart-quantity-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent event bubbling to avoid unwanted side effects
      e.preventDefault();
      e.stopPropagation()
      const productId = btn.getAttribute('data-product-id');
      const input = cartItems.querySelector(`.cart-quantity-input[data-product-id="${productId}"]`);
      if (input) {
        const currentValue = parseInt(input.value) || 1;
        input.value = currentValue + 1;
        updateCartItemQuantity(productId, parseInt(input.value));
      }
    });
  });
  
  cartItems.querySelectorAll('.cart-quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const productId = input.getAttribute('data-product-id');
      const quantity = parseInt(input.value) || 1;
      updateCartItemQuantity(productId, quantity);
    });
  });
  
  // Setup remove handlers
  cartItems.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.getAttribute('data-product-id');
      removeCartItem(productId);
    });
  });
  
  // Render cart summary
  updateCartSummary();
}

/**
 * Update cart summary based on checked items
 */
function updateCartSummary() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  
  if (!cartItems || !cartSummary) return;
  
  // Get checked items only
  const checkedItems = cart.filter(item => {
    const checkbox = cartItems.querySelector(`.cart-item-checkbox[data-product-id="${item.id}"]`);
    return checkbox ? checkbox.checked : true;
  });
  
  const subtotal = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;
  
  if (cartSummary) {
    cartSummary.innerHTML = `
      <div class="summary-row">
        <span>Tạm tính:</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Vận chuyển:</span>
        <span>${shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
      </div>
      <div class="summary-row">
        <span>Thuế:</span>
        <span>${formatPrice(tax)}</span>
      </div>
      <div class="summary-row summary-total">
        <span>Tổng cộng:</span>
        <span>${formatPrice(total)}</span>
      </div>
      <button class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-lg);">
        Thanh Toán
      </button>
    `;
  }
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  // Handle both string and number IDs
  const item = cart.find(i => {
    if (i.id === productId) return true;
    if (typeof i.id === 'number' && i.id === parseInt(productId)) return true;
    if (String(i.id) === String(productId)) return true;
    return false;
  });
  
  if (item) {
    if (quantity <= 0) {
      removeCartItem(productId);
    } else {
      item.quantity = quantity;
      updateCart(cart);
      updateCartDisplay();
      updateCartSummary();
    }
  }
}

/**
 * Remove item from cart
 */
function removeCartItem(productId) {
  const cart = getCart().filter(item => {
    // Handle both string and number IDs
    if (item.id === productId) return false;
    if (typeof item.id === 'number' && item.id === parseInt(productId)) return false;
    if (String(item.id) === String(productId)) return false;
    return true;
  });
  updateCart(cart);
  updateCartDisplay();
  // updateCartSummary will be called by updateCartDisplay
}

/**
 * Setup modal close handlers
 */
function setupModalHandlers() {
  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/**
 * Setup logo link to go home
 */
function setupLogoLink() {
  const logoLink = document.getElementById('logoLink'); // Đảm bảo ID này khớp với HTML
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault(); // Chặn load lại trang
      
      navigate('/'); // Chuyển về trang chủ
      
      // --- THÊM DÒNG NÀY ĐỂ CUỘN LÊN ĐẦU ---
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Tạo hiệu ứng trượt mượt mà
      });
    });
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
