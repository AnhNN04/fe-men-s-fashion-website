/**
 * Home View Module - Landing page with hero banner and featured categories
 */

import { navigate } from '../core/router.js';
import { getHeroBannerPlaceholder, getCategoryPlaceholder, getPlaceholderImage } from '../utils/placeholder.js';
import { getAPI } from '../core/api.js';
import { formatPrice } from '../utils/format.js';
import { setupProductEvents, setCurrentProducts } from '../components/ProductEvents.js';
import { setupBannerSlider } from '../components/BannerSlider.js';
import { setupProductSlider } from '../components/ProductSlider.js';

/**
 * Render home view
 */
export async function render() {
  const homeSection = document.getElementById('home-view');
  
  // Fetch all products
  let allProducts = [];
  try {
    allProducts = await getAPI('/products');
    console.log('[HomeView] All products loaded:', allProducts.length);
  } catch (error) {
    console.error('[HomeView] Error fetching products:', error);
  }
  
  // Filter products by category (3 products each)
  const topsProducts = allProducts.filter(p => p.category === 'tops').slice(0, 3);
  const bottomsProducts = allProducts.filter(p => p.category === 'bottoms').slice(0, 3);
  const accessoriesProducts = allProducts.filter(p => p.category === 'accessories').slice(0, 3);
  
  // Mix products from 3 categories for featured slider (2 from each)
  const sliderProducts = [
    ...allProducts.filter(p => p.category === 'tops').slice(0, 2),
    ...allProducts.filter(p => p.category === 'bottoms').slice(0, 2),
    ...allProducts.filter(p => p.category === 'accessories').slice(0, 2)
  ];
  
  const banners = [
    'assets/images/banner/banner-1.jpeg',
    'assets/images/banner/banner-2.jpeg',
    'assets/images/banner/banner-3.jpeg'
  ];

  const html = `
    <!-- Hero Banner Slider Section -->
    <section class="hero-section">
      <div class="hero-slider" id="heroSlider">
        ${banners.map((banner, index) => `
          <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('${banner}');">
            <div class="slide-overlay"></div>
          </div>
        `).join('')}
      </div>
      
      <!-- Hero Content Overlay -->
      <div class="hero-content">
        <h1 class="hero-title">Khám Phá Thế Giới Thời Trang Nam</h1>
        <p class="hero-subtitle">Chọn từ những bộ sưu tập độc quyền và phong cách nhất</p>
        <a href="#/shop" class="btn btn-primary hero-cta">Khám Phá Ngay</a>
      </div>

      <!-- Slider Controls -->
      <div class="slider-controls">
        ${banners.map((_, index) => `
          <button class="slider-dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Slide ${index + 1}"></button>
        `).join('')}
      </div>
    </section>

    <!-- Featured Categories Section - 3 Columns -->
    <section class="featured-categories">
      <div class="container">
        <h2 class="section-title">Danh Mục Nổi Bật</h2>
        <div class="categories-wrapper">
          
          <!-- Category 1: Áo (Tops) -->
          <div class="category-section">
            <div class="category-header">
              <h3 class="category-title">Áo</h3>
              <p class="category-subtitle">Áo phông, áo sơ mi, áo khoác</p>
            </div>
            <div class="category-products">
              ${topsProducts.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                  <div class="product-image">
                    <img src="${product.images?.[0]}" alt="${product.name}">
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-price">${formatPrice(product.price)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-secondary category-view-more" data-category="tops">Xem Thêm</button>
          </div>
          
          <!-- Category 2: Quần (Bottoms) -->
          <div class="category-section">
            <div class="category-header">
              <h3 class="category-title">Quần</h3>
              <p class="category-subtitle">Quần jean, quần kaki, quần short</p>
            </div>
            <div class="category-products">
              ${bottomsProducts.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                  <div class="product-image">
                    <img src="${product.images?.[0]}" alt="${product.name}">
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-price">${formatPrice(product.price)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-secondary category-view-more" data-category="bottoms">Xem Thêm</button>
          </div>
          
          <!-- Category 3: Phụ Kiện (Accessories) -->
          <div class="category-section">
            <div class="category-header">
              <h3 class="category-title">Phụ Kiện</h3>
              <p class="category-subtitle">Mũ, giày, túi, đồng hồ</p>
            </div>
            <div class="category-products">
              ${accessoriesProducts.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                  <div class="product-image">
                    <img src="${product.images?.[0]}" alt="${product.name}">
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-price">${formatPrice(product.price)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-secondary category-view-more" data-category="accessories">Xem Thêm</button>
          </div>
          
        </div>
      </div>
    </section>

    <!-- Featured Products Slider Section -->
    <section class="featured-products">
      <div class="container">
        <h2 class="section-title">Sản Phẩm Nổi Bật</h2>
        <div class="featured-slider-wrapper">
          <div class="featured-slider" id="featuredSlider">
            ${sliderProducts.map((product, index) => `
              <div class="featured-slide ${index === 0 ? 'active' : ''}" data-product-id="${product.id}">
                <div class="featured-product-card">
                  <div class="featured-product-image">
                    <img src="${product.images?.[0]}" alt="${product.name}">
                  </div>
                  <div class="featured-product-info">
                    <h4 class="featured-product-name">${product.name}</h4>
                    <p class="featured-product-category">${product.category}</p>
                    <p class="featured-product-price">${formatPrice(product.price)}</p>
                    <button class="btn btn-primary btn-sm" data-action="quick-view" data-product-id="${product.id}">Xem Chi Tiết</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <!-- Featured Slider Controls -->
          <div class="featured-slider-controls">
            ${sliderProducts.map((_, index) => `
              <button class="featured-slider-dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Sản phẩm ${index + 1}"></button>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Hơn 1000+ Sản Phẩm Chính Hãng</h2>
        <p>Tất cả đều được chứng thực và bảo hành chất lượng</p>
        <a href="#/shop" class="btn btn-primary">Bắt Đầu Mua Sắm</a>
      </div>
    </section>
  `;
  
  homeSection.innerHTML = html;
  
  // Setup banner slider
  setupBannerSlider();
  
  // Setup product slider
  setupProductSlider();
  
  // Setup product events
  setCurrentProducts(allProducts);
  setupProductEvents();
  
  // Setup category "Xem Thêm" button handlers
  document.querySelectorAll('.category-view-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.currentTarget.dataset.category;
      navigate(`/shop?category=${category}`);
    });
  });
  
  console.log('[HomeView] Rendered');
}

export default {
  render,
};
