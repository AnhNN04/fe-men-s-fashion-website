/**
 * Shop View Module - Product listing with filters and grid
 */

import { getAPI } from '../core/api.js';
import { getState, addToCart, setFilters, updateSearch, resetFilters } from '../core/state.js';
import { formatPrice } from '../utils/format.js';
import { updateCartDisplay } from '../app.js';

let state = null;
let allProducts = []; // Store all products for filtering

/**
 * Render shop view
 * @param {object} params - Route parameters (e.g., {category: 'tops', search: 'query'})
 */
export async function render(params = {}) {
  const shopSection = document.getElementById('shop-view');
  
  // Initialize state if needed
  if (!state) {
    state = getState();
  }
  
  // Reset filters and search if no params (user navigated to shop directly)
  if (!params.category && !params.search) {
    resetFilters();
    updateSearch('');
    state = getState(); // Refresh state after reset
  }
  
  // Apply category filter from route parameters (only if category param exists)
  if (params.category) {
    setFilters({
      categories: [params.category],
      priceRanges: state.filters.priceRanges || [],
      statuses: state.filters.statuses || [],
    });
    state = getState(); // Refresh state
  }
  
  // Apply search filter from route parameters (only if search param exists)
  if (params.search) {
    updateSearch(params.search);
    state = getState(); // Refresh state
  }
  
  // Render loading state
  shopSection.innerHTML = `
    <div class="container">
      <div class="loading-message">
        <div class="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    </div>
  `;
  
  // Fetch products
  const products = await getAPI('/products');
  allProducts = products; // Store for filtering
  
  // Fetch categories
  const categories = await getAPI('/categories');
  
  // DEBUG: Log products data
  console.log('[ShopView] Products loaded:', products.length);
  if (products[0]) {
    console.log('[ShopView] First product:', products[0]);
    console.log('[ShopView] First product images:', products[0].images);
  }
  
  // Get current filters from state (refresh state)
  state = getState();
  const { filters, search } = state;
  
  // Apply filters
  let filtered = products;
  
  // Filter by category
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => 
      filters.categories.includes(p.category)
    );
  }
  
  // Filter by price range
  if (filters.priceRanges && filters.priceRanges.length > 0) {
    filtered = filtered.filter(p => {
      return filters.priceRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return p.price >= min && p.price <= max;
      });
    });
  }
  
  // Filter by status
  if (filters.statuses && filters.statuses.length > 0) {
    filtered = filtered.filter(p => {
      return filters.statuses.some(status => {
        if (status === 'sale' && p.originalPrice > p.price) return true;
        if (status === 'new' && p.tags.includes('new')) return true;
        if (status === 'best-seller' && p.tags.includes('best-seller')) return true;
        return false;
      });
    });
  }
  
  // Filter by search
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Render the view
  const html = `
    <div class="container">
      <div class="shop-wrapper">
        <!-- Sidebar Filters -->
        <aside id="sidebar" class="shop-sidebar">
          <h3>Bộ Lọc</h3>
          
          <div class="filter-group">
            <h4>Danh mục</h4>
            ${renderCategoryFilters()}
          </div>

          <div class="filter-group">
            <h4>Giá</h4>
            ${renderPriceFilters()}
          </div>

          <div class="filter-group">
            <h4>Tình trạng</h4>
            ${renderStatusFilters()}
          </div>

          <button id="resetFilters" class="btn btn-secondary" style="width: 100%; margin-top: var(--spacing-lg);">
            Xóa bộ lọc
          </button>
        </aside>

        <!-- Products Container -->
        <div class="shop-products">
          ${filtered.length === 0 ? `
            <div class="no-products">
              <p>Không tìm thấy sản phẩm phù hợp</p>
            </div>
          ` : `
            <div id="productGrid" class="product-grid">
              ${renderProductGrid(filtered)}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
  
  shopSection.innerHTML = html;
  
  // Setup event listeners
  setupEventListeners(products);
  
  // Setup product event listeners (for view product and add to cart buttons)
  setupProductEventListeners(products);
  
  console.log('[ShopView] Rendered', { filtered: filtered.length, total: products.length });
}

/**
 * Setup product-specific event listeners (for add to cart, view product)
 */
function setupProductEventListeners(products) {
  // View product modal - use currentTarget to handle clicks on button text/icon
  document.querySelectorAll('.view-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.getAttribute('data-product-id') || e.target.closest('.view-product')?.getAttribute('data-product-id');
      if (productId) {
        // Handle both string and number IDs
        const product = products.find(p => {
          // Try exact match first (for string IDs like "p-len-01")
          if (p.id === productId) return true;
          // Try number comparison (for numeric IDs)
          if (typeof p.id === 'number' && p.id === parseInt(productId)) return true;
          // Try string comparison (for string IDs that might be numbers)
          if (String(p.id) === String(productId)) return true;
          return false;
        });
        
        if (product) {
          showProductModal(product);
        } else {
          console.warn('[ShopView] Product not found:', productId, 'Available IDs:', products.map(p => p.id).slice(0, 5));
        }
      }
    });
  });
  
  // Add to cart - use currentTarget to handle clicks on button text/icon
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.getAttribute('data-product-id') || e.target.closest('.add-to-cart')?.getAttribute('data-product-id');
      if (productId) {
        // Handle both string and number IDs
        const product = products.find(p => {
          // Try exact match first (for string IDs like "p-len-01")
          if (p.id === productId) return true;
          // Try number comparison (for numeric IDs)
          if (typeof p.id === 'number' && p.id === parseInt(productId)) return true;
          // Try string comparison (for string IDs that might be numbers)
          if (String(p.id) === String(productId)) return true;
          return false;
        });
        
        if (product) {
          // Show add to cart modal instead of directly adding
          showAddToCartModal(product);
        } else {
          console.warn('[ShopView] Product not found for cart:', productId, 'Available IDs:', products.map(p => p.id).slice(0, 5));
        }
      }
    });
  });
  
  console.log('[ShopView] Product event listeners setup', { 
    viewButtons: document.querySelectorAll('.view-product').length,
    cartButtons: document.querySelectorAll('.add-to-cart').length,
    totalProducts: products.length
  });
}

/**
 * Render category filter checkboxes
 */
function renderCategoryFilters() {
  const { filters } = state;
  const selectedCategories = filters.categories || [];
  
  const categories = [
    { value: 'tops', label: 'Áo' },
    { value: 'bottoms', label: 'Quần' },
    { value: 'accessories', label: 'Phụ kiện' },
  ];
  
  return categories.map(cat => `
    <label>
      <input 
        type="checkbox" 
        class="category-filter" 
        value="${cat.value}"
        ${selectedCategories.includes(cat.value) ? 'checked' : ''}
      >
      ${cat.label}
    </label>
  `).join('');
}

/**
 * Render price range filter checkboxes
 */
function renderPriceFilters() {
  const { filters } = state;
  const selectedRanges = filters.priceRanges || [];
  
  const ranges = [
    { value: '0-200000', label: 'Dưới 200k' },
    { value: '200000-500000', label: '200k - 500k' },
    { value: '500000-1000000', label: '500k - 1m' },
    { value: '1000000-999999999', label: 'Trên 1m' },
  ];
  
  return ranges.map(range => `
    <label>
      <input 
        type="checkbox" 
        class="price-filter" 
        value="${range.value}"
        ${selectedRanges.includes(range.value) ? 'checked' : ''}
      >
      ${range.label}
    </label>
  `).join('');
}

/**
 * Render status filter checkboxes
 */
function renderStatusFilters() {
  const { filters } = state;
  const selectedStatuses = filters.statuses || [];
  
  const statuses = [
    { value: 'sale', label: 'Giảm giá' },
    { value: 'new', label: 'Hàng mới' },
    { value: 'best-seller', label: 'Bán chạy' },
  ];
  
  return statuses.map(status => `
    <label>
      <input 
        type="checkbox" 
        class="status-filter" 
        value="${status.value}"
        ${selectedStatuses.includes(status.value) ? 'checked' : ''}
      >
      ${status.label}
    </label>
  `).join('');
}

/**
 * Render product grid
 */
function renderProductGrid(products) {
  return products.map(product => {
    const hasDiscount = product.originalPrice > product.price;
    const discountPercent = hasDiscount 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    
    return `
      <div class="product-card">
        ${hasDiscount ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
        ${product.inventoryQuantity === 0 ? `<span class="stock-badge">Hết hàng</span>` : ''}
        
        <div class="product-image">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        </div>
        
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.shortDescription}</p>
          
          <div class="product-price">
            <span class="price-current">${formatPrice(product.price)}</span>
            ${hasDiscount ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          
          <div class="product-actions">
            <button class="btn btn-primary btn-sm view-product" data-product-id="${product.id}">
              Xem Chi Tiết
            </button>
            <button class="btn btn-secondary btn-sm add-to-cart" data-product-id="${product.id}">
              Thêm Giỏ
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners(products) {
  // Category filter
  document.querySelectorAll('.category-filter').forEach(checkbox => {
    checkbox.addEventListener('change', updateFilters);
  });
  
  // Price filter
  document.querySelectorAll('.price-filter').forEach(checkbox => {
    checkbox.addEventListener('change', updateFilters);
  });
  
  // Status filter
  document.querySelectorAll('.status-filter').forEach(checkbox => {
    checkbox.addEventListener('change', updateFilters);
  });
  
  // Reset filters
  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetFilters();
      updateSearch('');
      state = getState();
      // Update checkboxes
      document.querySelectorAll('.category-filter, .price-filter, .status-filter').forEach(cb => {
        cb.checked = false;
      });
      // Re-render with all products
      updateProductGrid();
    });
  }
  
  // Setup product event listeners
  setupProductEventListeners(products);
}

/**
 * Update filters and re-render product grid only
 */
function updateFilters() {
  const categories = Array.from(
    document.querySelectorAll('.category-filter:checked')
  ).map(cb => cb.value);
  
  const priceRanges = Array.from(
    document.querySelectorAll('.price-filter:checked')
  ).map(cb => cb.value);
  
  const statuses = Array.from(
    document.querySelectorAll('.status-filter:checked')
  ).map(cb => cb.value);
  
  setFilters({
    categories,
    priceRanges,
    statuses,
  });
  
  // Update state and re-render product grid only
  state = getState();
  updateProductGrid();
}

/**
 * Update product grid without full re-render
 */
function updateProductGrid() {
  const { filters, search } = getState();
  
  // Apply filters
  let filtered = allProducts;
  
  // Filter by category
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => 
      filters.categories.includes(p.category)
    );
  }
  
  // Filter by price range
  if (filters.priceRanges && filters.priceRanges.length > 0) {
    filtered = filtered.filter(p => {
      return filters.priceRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return p.price >= min && p.price <= max;
      });
    });
  }
  
  // Filter by status
  if (filters.statuses && filters.statuses.length > 0) {
    filtered = filtered.filter(p => {
      return filters.statuses.some(status => {
        if (status === 'sale' && p.originalPrice > p.price) return true;
        if (status === 'new' && p.tags && p.tags.includes('new')) return true;
        if (status === 'best-seller' && p.tags && p.tags.includes('best-seller')) return true;
        return false;
      });
    });
  }
  
  // Filter by search
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  // Update product grid
  const productGrid = document.getElementById('productGrid');
  const shopProducts = document.querySelector('.shop-products');
  
  if (filtered.length === 0) {
    if (shopProducts) {
      shopProducts.innerHTML = `
        <div class="no-products">
          <p>Không tìm thấy sản phẩm phù hợp</p>
        </div>
      `;
    }
  } else {
    if (productGrid) {
      productGrid.innerHTML = renderProductGrid(filtered);
    } else if (shopProducts) {
      shopProducts.innerHTML = `
        <div id="productGrid" class="product-grid">
          ${renderProductGrid(filtered)}
        </div>
      `;
    }
    
    // Re-setup event listeners for new products
    setupProductEventListeners(allProducts);
  }
  
  console.log('[ShopView] Product grid updated', { filtered: filtered.length, total: allProducts.length });
}

/**
 * Show add to cart modal (simplified version without images)
 */
function showAddToCartModal(product) {
  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Thêm vào giỏ hàng';
  
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  modalBody.innerHTML = `
    <div class="product-modal-grid add-to-cart-modal">
      <!-- Right: Product Details Only (No Images) -->
      <div class="product-modal-details" style="grid-column: 1 / -1; max-width: 600px; margin: 0 auto;">
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
              <button class="quantity-btn" id="addToCartQuantityMinus">−</button>
              <input type="number" id="addToCartQuantityInput" value="1" min="1" max="${product.inventoryQuantity || 99}">
              <button class="quantity-btn" id="addToCartQuantityPlus">+</button>
            </div>
          </div>
        </div>
        
        <div class="product-modal-actions">
          <button class="btn btn-primary btn-lg add-to-cart-confirm" data-product-id="${product.id}" style="width: 100%;">
            Xác Nhận Thêm Vào Giỏ
          </button>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
  
  // Setup quantity controls
  const quantityMinus = document.getElementById('addToCartQuantityMinus');
  const quantityPlus = document.getElementById('addToCartQuantityPlus');
  const quantityInput = document.getElementById('addToCartQuantityInput');
  
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
  
  // Setup confirm add to cart
  const confirmBtn = document.querySelector('.add-to-cart-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value) || 1;
      addToCart(product, quantity);
      modal.classList.remove('active');
      
      // Show toast notification
      showToast('success', `Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      
      // Update cart display
      updateCartDisplay();
    });
  }
}

/**
 * Show product modal
 */
function showProductModal(product) {
  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = product.name;
  
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  // Get product images (handle both array and single image)
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : (product.images ? [product.images] : ['assets/images/placeholder.jpg']);
  
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
  
  modal.classList.add('active');
  
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
      modal.classList.remove('active');
      
      // Show toast notification
      showToast('success', `Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      
      // Update cart display
      updateCartDisplay();
    });
  }
}

/**
 * Show toast notification
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} message - Message to display
 */
export function showToast(type = 'success', message = '') {
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

export default {
  render,
  showToast,
};
