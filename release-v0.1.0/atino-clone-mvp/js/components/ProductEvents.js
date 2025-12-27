/**
 * Product Event Handlers
 * Handles add-to-cart, quick view, and other product interactions
 */

import { addToCart, getCart } from '../core/state.js';
import { formatPrice } from '../utils/format.js';
import { updateCartDisplay } from '../app.js';
import { getPlaceholderImage } from '../utils/placeholder.js';

/**
 * Setup product event listeners
 * Called after product list is rendered
 */
export function setupProductEvents() {
  // Add to cart buttons
  document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
  });
  
  // Quick view buttons
  document.querySelectorAll('[data-action="quick-view"]').forEach(btn => {
    btn.addEventListener('click', handleQuickView);
  });
  
  // Color selection in product cards
  document.querySelectorAll('[data-color-select]').forEach(colorBtn => {
    colorBtn.addEventListener('click', handleColorSelect);
  });
  
  console.log('[ProductEvents] Setup complete');
}

/**
 * Handle add to cart action
 * @param {Event} e - Click event
 */
function handleAddToCart(e) {
  e.preventDefault();
  
  const productId = e.currentTarget.dataset.productId;
  const quantity = parseInt(e.currentTarget.dataset.quantity || 1);
  
  // Fetch product from state or reconstruct - handle both string and number IDs
  const product = window.currentProducts?.find(p => {
    // Try exact match first (for string IDs like "p-len-01")
    if (p.id === productId) return true;
    // Try number comparison (for numeric IDs)
    if (typeof p.id === 'number' && p.id === parseInt(productId)) return true;
    // Try string comparison (for string IDs that might be numbers)
    if (String(p.id) === String(productId)) return true;
    return false;
  });
  
  if (product) {
    addToCart(product, quantity);
    
    // Show feedback
    const btn = e.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = '✓ Đã thêm vào giỏ';
    btn.disabled = true;
    
    // Update cart display
    updateCartDisplay();
    
    // Reset button after 2 seconds
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
    
    console.log('[ProductEvents] Added to cart:', product.name);
  } else {
    console.warn('[ProductEvents] Product not found:', productId, 'Available products:', window.currentProducts?.length || 0);
  }
}

/**
 * Handle quick view action
 * @param {Event} e - Click event
 */
function handleQuickView(e) {
  e.preventDefault();
  
  const productId = e.currentTarget.dataset.productId;
  // Handle both string and number productId
  const product = window.currentProducts?.find(p => {
    // Try exact match first (for string IDs like "p-len-01")
    if (p.id === productId) return true;
    // Try number comparison (for numeric IDs)
    if (typeof p.id === 'number' && p.id === parseInt(productId)) return true;
    // Try string comparison (for string IDs that might be numbers)
    if (String(p.id) === String(productId)) return true;
    return false;
  });
  
  if (!product) {
    console.warn('[ProductEvents] Product not found:', productId, 'Available products:', window.currentProducts?.length || 0);
    return;
  }
  
  // Use the same modal structure as shopView.js
  showProductModalInEvents(product);
}

/**
 * Show product modal (shared function for ProductEvents)
 * @param {Object} product - Product object
 */
function showProductModalInEvents(product) {
  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  if (!modal || !modalTitle || !modalBody) {
    console.error('[ProductEvents] Modal elements not found');
    return;
  }
  
  modalTitle.textContent = product.name;
  
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  // Get product images (handle both array and single image)
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : (product.images ? [product.images] : [getPlaceholderImage(500, 600, product.name)]);
  
  modalBody.innerHTML = `
    <div class="product-modal-grid">
      <!-- Left: Product Images -->
      <div class="product-modal-images">
        <div class="product-modal-main-image">
          <img id="modalMainImage" src="${productImages[0]}" alt="${product.name}">
        </div>
        ${productImages.length > 1 ? `
          <div class="product-modal-thumbnails">
            ${productImages.map((img, idx) => `
              <div class="product-modal-thumbnail ${idx === 0 ? 'active' : ''}" data-image="${img}">
                <img src="${img}" alt="Thumbnail ${idx + 1}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <!-- Right: Product Details -->
      <div class="product-modal-details">
        <h2 class="product-modal-title">${product.name}</h2>
        
        ${product.shortDescription ? `
          <p class="product-modal-description">${product.shortDescription}</p>
        ` : ''}
        
        <div class="product-modal-price-section">
          <span class="product-modal-price-current">${formatPrice(product.price)}</span>
          ${hasDiscount ? `
            <span class="product-modal-price-original">${formatPrice(product.originalPrice)}</span>
            <span class="product-modal-discount-badge">-${discountPercent}%</span>
          ` : ''}
        </div>
        
        ${product.sizes && product.sizes.length > 0 ? `
          <div class="product-modal-section">
            <h4 class="product-modal-section-title">Kích thước</h4>
            <div class="product-modal-sizes">
              ${product.sizes.map((size, idx) => `
                <button class="product-modal-size-option ${idx === 0 ? 'active' : ''}" data-size="${size}">
                  ${size}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${product.colors && product.colors.length > 0 ? `
          <div class="product-modal-section">
            <h4 class="product-modal-section-title">Màu sắc</h4>
            <div class="product-modal-colors">
              ${product.colors.map((color, idx) => {
                // Handle both string and object color formats
                const colorName = typeof color === 'string' ? color : (color.name || color);
                const colorHex = typeof color === 'object' && color.hex ? color.hex : '#ccc';
                return `
                  <div class="product-modal-color-option ${idx === 0 ? 'active' : ''}" data-color="${colorName}" title="${colorName}">
                    <div class="product-modal-color-swatch" style="background-color: ${colorHex};"></div>
                    <span class="product-modal-color-name">${colorName}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="product-modal-section">
          <h4 class="product-modal-section-title">Số lượng</h4>
          <div class="product-modal-quantity">
            <div class="product-modal-quantity-control">
              <button class="quantity-btn" id="modalQuantityMinus">−</button>
              <input type="number" id="modalQuantityInput" value="1" min="1" max="${product.inventoryQuantity || 99}">
              <button class="quantity-btn" id="modalQuantityPlus">+</button>
            </div>
          </div>
        </div>
        
        <div class="product-modal-actions">
          <button class="btn btn-primary btn-lg modal-add-to-cart" data-product-id="${product.id}" style="width: 100%;">
            Thêm Vào Giỏ Hàng
          </button>
        </div>
        
        ${product.tags && product.tags.length > 0 ? `
          <div class="product-modal-tags">
            ${product.tags.map(tag => `
              <span class="tag">${tag}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Setup image gallery thumbnails
  document.querySelectorAll('.product-modal-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      const thumbnail = e.currentTarget;
      const imageSrc = thumbnail.getAttribute('data-image');
      
      // Update main image
      document.getElementById('modalMainImage').src = imageSrc;
      
      // Update active thumbnail
      document.querySelectorAll('.product-modal-thumbnail').forEach(t => t.classList.remove('active'));
      thumbnail.classList.add('active');
    });
  });
  
  // Setup quantity controls
  const quantityMinus = document.getElementById('modalQuantityMinus');
  const quantityPlus = document.getElementById('modalQuantityPlus');
  const quantityInput = document.getElementById('modalQuantityInput');
  
  if (quantityMinus && quantityInput) {
    quantityMinus.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      quantityInput.value = Math.max(1, currentValue - 1);
    });
  }
  
  if (quantityPlus && quantityInput) {
    quantityPlus.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      const maxValue = parseInt(quantityInput.getAttribute('max')) || 99;
      quantityInput.value = Math.min(maxValue, currentValue + 1);
    });
  }
  
  // Setup size selection
  document.querySelectorAll('.product-modal-size-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.product-modal-size-option').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
  
  // Setup color selection
  document.querySelectorAll('.product-modal-color-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.product-modal-color-option').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
  
  // Setup add to cart in modal
  const addToCartBtn = document.querySelector('.modal-add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value) || 1;
      addToCart(product, quantity);
      closeModal();
      
      // Show toast notification
      showToastNotification('success', `Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      
      // Update cart display
      updateCartDisplay();
    });
  }
  
  // Show modal
  modal.classList.add('active');
}

/**
 * Handle color selection
 * @param {Event} e - Click event
 */
function handleColorSelect(e) {
  const selectedColor = e.currentTarget.dataset.color;
  
  // Remove active from all colors in this product card
  const productCard = e.currentTarget.closest('[data-product-id]');
  if (productCard) {
    productCard.querySelectorAll('[data-color-select]').forEach(btn => {
      btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
  }
  
  console.log('[ProductEvents] Selected color:', selectedColor);
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * Store current products for reference
 * @param {array} products - List of products
 */
export function setCurrentProducts(products) {
  window.currentProducts = products;
}

/**
 * Show toast notification (simple version for ProductEvents)
 */
function showToastNotification(type = 'success', message = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const titles = {
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    info: 'Thông tin'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.success}</span>
    <div class="toast-content">
      <div class="toast-title">${titles[type] || titles.success}</div>
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
  
  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'fadeOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  });
}
