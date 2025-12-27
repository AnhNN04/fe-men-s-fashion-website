# Phase 5 – API Service Layer Implementation

**Status**: ✅ FULLY IMPLEMENTED  
**Date**: December 27, 2025  
**Alignment**: Aligned with Phase 4 SPA architecture  

---

## Executive Summary

Phase 5 implements the **API Service Layer** - a data access abstraction that decouples the frontend UI from HTTP/network logic. This layer serves as the single source of truth for all backend communication.

### What's Implemented
- ✅ Generic HTTP methods: `getAPI()`, `postAPI()`, `patchAPI()`, `deleteAPI()`
- ✅ Product API: `fetchProducts()` - retrieves all 44 products from JSON Server
- ✅ Category API: `fetchCategories()` - retrieves all 20 categories from JSON Server
- ✅ Error handling: All network/server errors propagated for UI-level decisions
- ✅ Logging: Console logs with [API] prefix for debugging
- ✅ Full JSDoc documentation with usage examples

---

## Architecture Overview

### Data Flow

```
┌─────────────┐
│   Views     │  (HomeView, ShopView)
│ (js/views/) │
└──────┬──────┘
       │ import { fetchProducts, fetchCategories } from './core/api.js'
       │
       ▼
┌──────────────────────┐
│   API Service Layer  │  (js/core/api.js)
│  - fetchProducts()   │
│  - fetchCategories() │
│  - getAPI()          │
│  - postAPI()         │
│  - patchAPI()        │
│  - deleteAPI()       │
└──────────┬───────────┘
           │ fetch(url)
           │
           ▼
┌──────────────────────┐
│  JSON Server         │
│  - /products         │
│  - /categories       │
│  localhost:3000      │
└──────────────────────┘
```

### Module Organization

```
js/core/
├── api.js          ← Phase 5: API Service Layer
├── router.js       ← Phase 4: View Navigation
└── state.js        ← Phase 4: State Management
```

---

## API Service Implementation

### File: `js/core/api.js`

**Purpose**: Generic HTTP wrapper + convenience functions  
**Lines of Code**: ~160 lines  
**Exports**: 6 functions (4 generic + 2 convenience)

### Core Functions

#### 1. `getAPI(endpoint)`

Generic GET request wrapper.

```javascript
export async function getAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] GET ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error fetching ${endpoint}:`, error);
    throw error;
  }
}
```

**Behavior**:
- Constructs full URL: `http://localhost:3000${endpoint}`
- Validates response with `response.ok` (200-299 status codes)
- Parses JSON and returns data
- Logs success: `[API] GET /products: [...]`
- Throws errors with descriptive messages
- Logs errors: `[API] Error fetching /products: NetworkError`

**Error Handling**:
- Network errors (offline): Promise rejects
- Server errors (5xx): `response.ok` is false, throws Error
- Parse errors: `response.json()` rejects

#### 2. `postAPI(endpoint, body)`

Generic POST request wrapper for creating resources.

```javascript
export async function postAPI(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] POST ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error posting to ${endpoint}:`, error);
    throw error;
  }
}
```

**Usage Example**:
```javascript
const newProduct = {
  name: 'New Shirt',
  category: 'tops',
  price: 299000,
};

try {
  const created = await postAPI('/products', newProduct);
  console.log('Product created:', created.id);
} catch (error) {
  console.error('Failed to create product');
}
```

#### 3. `patchAPI(endpoint, body)`

Generic PATCH request wrapper for partial updates.

```javascript
export async function patchAPI(endpoint, body) {
  // Similar to postAPI but uses PATCH method
}
```

#### 4. `deleteAPI(endpoint)`

Generic DELETE request wrapper for removing resources.

```javascript
export async function deleteAPI(endpoint) {
  // Similar to getAPI but uses DELETE method
}
```

### Convenience Functions (Phase 5 Specific)

#### 5. `fetchProducts()`

**Signature**: `async function fetchProducts(): Promise<Array<Product>>`

Retrieves all products from the mock backend.

```javascript
export async function fetchProducts() {
  return getAPI('/products');
}
```

**What It Returns**:
```javascript
[
  {
    id: 1,
    name: "Áo Sơ Mi Nam",
    category: "tops",
    description: "Comfortable cotton shirt",
    price: 199000,
    originalPrice: 299000,
    discount: 33,
    images: ["product-1.jpg", ...],
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "blue"],
    tags: ["sale", "new"],
    stock: 25
  },
  // ... 43 more products
]
```

**Usage in Views**:
```javascript
// In shopView.js
import { fetchProducts } from '../core/api.js';

export async function render(params) {
  try {
    const products = await fetchProducts();
    console.log(`[ShopView] Loaded ${products.length} products`);
    
    // Filter by category if deep-linked
    if (params?.category) {
      const filtered = products.filter(p => p.category === params.category);
      displayProducts(filtered);
    } else {
      displayProducts(products);
    }
  } catch (error) {
    console.error('[ShopView] Failed to load products:', error);
    showErrorMessage('Failed to load products. Please refresh.');
  }
}
```

**Error Cases**:
- **Network Offline**: Promise rejects with NetworkError
- **Server Down**: Promise rejects with "API Error: 500 Internal Server Error"
- **JSON Malformed**: Promise rejects with SyntaxError
- **Empty Response**: Returns empty array `[]` (valid data)

#### 6. `fetchCategories()`

**Signature**: `async function fetchCategories(): Promise<Array<Category>>`

Retrieves all categories from the mock backend.

```javascript
export async function fetchCategories() {
  return getAPI('/categories');
}
```

**What It Returns**:
```javascript
[
  {
    id: 1,
    name: "Tops",
    parentId: null,
    slug: "tops"
  },
  {
    id: 2,
    name: "Bottoms",
    parentId: null,
    slug: "bottoms"
  },
  // ... 18 more categories
]
```

**Usage in Views**:
```javascript
// In shopView.js - populate filter checkboxes
import { fetchCategories, fetchProducts } from '../core/api.js';

export async function render(params) {
  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);
    
    renderFilterCheckboxes(categories);
    displayProducts(products);
  } catch (error) {
    console.error('[ShopView] Failed to load data:', error);
    showErrorMessage('Failed to load data');
  }
}
```

---

## Integration Points

### 1. HomeView (`js/views/homeView.js`)

**Usage**: Doesn't directly call API (featured categories are hardcoded)

```javascript
// No API calls in homeView - static featured section
export async function render(params) {
  // Featured categories are hardcoded UI
  return renderHeroAndFeaturedCategories();
}
```

### 2. ShopView (`js/views/shopView.js`)

**Usage**: Primary consumer of `fetchProducts()` and `fetchCategories()`

```javascript
import { fetchProducts, fetchCategories } from '../core/api.js';

export async function render(params) {
  try {
    const products = await fetchProducts();
    const categories = await fetchCategories();
    
    // 1. Build filter checkboxes from categories
    renderFilters(categories);
    
    // 2. Apply filters from state/params
    const filtered = applyFilters(products, params);
    
    // 3. Render product grid
    renderProductGrid(filtered);
  } catch (error) {
    handleError(error);
  }
}
```

### 3. App Entry Point (`js/app.js`)

**Usage**: Optional - Could pre-load products on app init

```javascript
// Current approach: shopView loads on demand
// Alternative (pre-caching): Load in app.js
import { fetchProducts } from './core/api.js';

async function initApp() {
  try {
    // Pre-load products for faster shop load
    const products = await fetchProducts();
    setProducts(products); // Store in state
    
    initRouter();
    initState();
    // ...
  } catch (error) {
    console.warn('[App] Failed to pre-load products:', error);
    // Continue anyway - will load on-demand
  }
}
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch with User Feedback

```javascript
export async function render(params) {
  try {
    const products = await fetchProducts();
    displayProducts(products);
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof TypeError) {
      // Network error (offline)
      showErrorBanner('No internet connection. Please check your network.');
    } else if (error.message.includes('500')) {
      // Server error
      showErrorBanner('Server is temporarily unavailable. Please try again later.');
    } else {
      // Generic error
      showErrorBanner('Failed to load products. Please refresh the page.');
    }
  }
}
```

### Pattern 2: Promise.all for Parallel Requests

```javascript
// Fetch multiple resources in parallel
try {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories()
  ]);
  
  updateUI(products, categories);
} catch (error) {
  // One of the promises rejected
  showErrorMessage('Failed to load data');
}
```

### Pattern 3: Timeout Handling

```javascript
// Add timeout to prevent hanging requests
function fetchWithTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), ms)
    )
  ]);
}

try {
  const products = await fetchWithTimeout(fetchProducts(), 5000);
  displayProducts(products);
} catch (error) {
  showErrorMessage('Request timed out. Please try again.');
}
```

### Pattern 4: Retry Logic

```javascript
async function fetchWithRetry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// Usage
const products = await fetchWithRetry(() => fetchProducts());
```

---

## Console Logging for Debugging

### Expected Console Output

#### Successful Fetch
```javascript
// When fetchProducts() succeeds
[API] GET /products: Array(44) [
  {id: 1, name: "Áo Sơ Mi", price: 199000, ...},
  {id: 2, name: "Quần Jean", price: 299000, ...},
  // ... 42 more
]
```

#### Network Error
```javascript
// When network is offline
[API] Error fetching /products: TypeError: Failed to fetch
    at fetchProducts (api.js:25)
    at render (shopView.js:15)
```

#### Server Error
```javascript
// When JSON Server is down (can't connect)
[API] Error fetching /products: TypeError: Failed to fetch
    at getAPI (api.js:12)

// When server returns error status
[API] Error fetching /products: Error: API Error: 500 Internal Server Error
    at getAPI (api.js:15)
```

### Debug Tips

```javascript
// In browser console, test the API directly
import { fetchProducts } from './js/core/api.js';

// Test 1: Fetch products
await fetchProducts();

// Test 2: Check response structure
const products = await fetchProducts();
console.table(products.slice(0, 3)); // First 3 products

// Test 3: Count by category
const products = await fetchProducts();
const byCat = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.table(byCat);

// Test 4: Find specific product
const products = await fetchProducts();
const shirt = products.find(p => p.name.includes('Sơ Mi'));
console.log(shirt);
```

---

## Testing Guide

### Setup

**Terminal 1: Start JSON Server**
```bash
cd mock-backend
npx json-server --watch db.json --port 3000
```

**Terminal 2: Start Frontend**
```bash
# Live Server or Python http-server
python -m http.server 5000
```

**Browser**:
```
http://localhost:5500 (or your port)
Open DevTools (F12)
```

### Test 1: Successful Product Fetch

**Preconditions**: JSON Server running at `localhost:3000`

**Steps**:
1. Open DevTools → Console tab
2. Type: `const products = await (await import('./js/core/api.js')).fetchProducts()`
3. Press Enter
4. Type: `console.table(products.slice(0, 3))`

**Expected Result**:
```
[API] GET /products: Array(44)

┌────┬────┬──────────────┬────────────┐
│    │ id │ name         │ price      │
├────┼────┼──────────────┼────────────┤
│ 0  │ 1  │ "Áo Sơ Mi"   │ 199000     │
│ 1  │ 2  │ "Quần Jean"  │ 299000     │
│ 2  │ 3  │ "Áo Phông"   │ 149000     │
└────┴────┴──────────────┴────────────┘
```

### Test 2: Successful Category Fetch

**Preconditions**: JSON Server running

**Steps**:
1. Open DevTools → Console tab
2. Type: `const cats = await (await import('./js/core/api.js')).fetchCategories()`
3. Type: `console.table(cats)`

**Expected Result**:
```
[API] GET /categories: Array(20)

┌────┬────┬──────────────┬──────────┐
│    │ id │ name         │ parentId │
├────┼────┼──────────────┼──────────┤
│ 0  │ 1  │ "Tops"       │ null     │
│ 1  │ 2  │ "Bottoms"    │ null     │
│ 2  │ 3  │ "Accessories"│ null     │
└────┴────┴──────────────┴──────────┘
```

### Test 3: Network Error (Server Down)

**Preconditions**: JSON Server stopped

**Steps**:
1. Stop JSON Server (Ctrl+C in Terminal 1)
2. Open DevTools → Console tab
3. Type: `await (await import('./js/core/api.js')).fetchProducts()`
4. Press Enter

**Expected Result**:
```
[API] Error fetching /products: TypeError: Failed to fetch
    at getAPI (api.js:12)
    at fetchProducts (api.js:123)

Uncaught (in promise) TypeError: Failed to fetch
```

### Test 4: Real Usage in ShopView

**Preconditions**: Both servers running

**Steps**:
1. Navigate to Shop page in browser
2. Open DevTools → Console tab
3. Wait for console logs

**Expected Output**:
```
[Router] Switched to view: shop {}
[API] GET /products: Array(44)
[API] GET /categories: Array(20)
[ShopView] Rendered {filtered: 44}
```

### Test 5: Deep Linking with Filters

**Preconditions**: Both servers running

**Steps**:
1. Click "Áo" (Tops) category on home page
2. Check DevTools → Console tab

**Expected Output**:
```
[Router] Switched to view: shop {category: 'tops'}
[API] GET /products: Array(44)
[API] GET /categories: Array(20)
[State] Filters updated: {categories: ['tops'], ...}
[ShopView] Rendered {filtered: 15}
```

---

## Configuration & Customization

### API Base URL

**Current**: `http://localhost:3000`

**To Change** (e.g., for production):
```javascript
// js/core/api.js, line 5
const API_BASE = process.env.API_URL || 'http://localhost:3000';

// Or hardcode for production
const API_BASE = 'https://api.atino.vn'; // Production
```

### Adding New API Endpoints

**Example: Fetch a single product by ID**
```javascript
export async function fetchProductById(id) {
  return getAPI(`/products/${id}`);
}
```

**Example: Search products**
```javascript
export async function searchProducts(query) {
  return getAPI(`/products?q=${encodeURIComponent(query)}`);
}
```

**Example: Create new product (admin only)**
```javascript
export async function createProduct(productData) {
  return postAPI('/products', productData);
}
```

**Example: Update product (admin only)**
```javascript
export async function updateProduct(id, updates) {
  return patchAPI(`/products/${id}`, updates);
}
```

---

## Performance Considerations

### 1. Caching

The current implementation fetches products every time shopView renders. To optimize:

```javascript
// Add caching in state.js or api.js
let cachedProducts = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchProducts() {
  const now = Date.now();
  if (cachedProducts && (now - cacheTime) < CACHE_TTL) {
    console.log('[API] Returning cached products');
    return cachedProducts;
  }
  
  cachedProducts = await getAPI('/products');
  cacheTime = now;
  return cachedProducts;
}
```

### 2. Parallel Loading

Use `Promise.all()` when fetching multiple resources:

```javascript
// Bad: Sequential (slow)
const products = await fetchProducts();
const categories = await fetchCategories();

// Good: Parallel (fast)
const [products, categories] = await Promise.all([
  fetchProducts(),
  fetchCategories()
]);
```

### 3. Pagination (Future Enhancement)

For large datasets:
```javascript
export async function fetchProducts(page = 1, limit = 20) {
  return getAPI(`/products?_page=${page}&_limit=${limit}`);
}
```

---

## Testing Integration with State Management

The API layer integrates with Phase 4's state management:

```javascript
// In app.js or shopView.js
import { fetchProducts } from './core/api.js';
import { setProducts, getState } from './core/state.js';

async function initializeApp() {
  try {
    const products = await fetchProducts();
    setProducts(products); // Store in state
    
    // Now other views can access products from state
    const state = getState();
    console.log(`${state.products.length} products in state`);
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}
```

---

## Troubleshooting

### Issue: "Failed to fetch" Error

**Cause**: JSON Server not running or wrong URL

**Solution**:
1. Start JSON Server: `npx json-server --watch db.json --port 3000`
2. Verify it's running: Open `http://localhost:3000/products` in browser
3. Should see the products JSON

### Issue: CORS Error

**Cause**: Frontend on different origin than backend

**Solution**: JSON Server has CORS enabled by default for local development. No action needed.

### Issue: Empty Products Array

**Cause**: `db.json` is empty or corrupted

**Solution**:
1. Check `mock-backend/db.json` has products array
2. Verify JSON syntax is valid: `node -c db.json`
3. Restart JSON Server if changed

### Issue: Products Load Very Slowly

**Cause**: API delay or network latency

**Solution**:
1. Check JSON Server is running locally
2. Add timeout to long requests (see retry pattern)
3. Consider caching strategy

---

## Summary of Phase 5 Deliverables

| Item | Status | Location |
|------|--------|----------|
| Generic HTTP methods (GET/POST/PATCH/DELETE) | ✅ Complete | js/core/api.js |
| fetchProducts() function | ✅ Complete | js/core/api.js |
| fetchCategories() function | ✅ Complete | js/core/api.js |
| Error handling and propagation | ✅ Complete | js/core/api.js |
| Console logging with [API] prefix | ✅ Complete | js/core/api.js |
| JSDoc documentation | ✅ Complete | js/core/api.js |
| Integration with ShopView | ✅ Complete | js/views/shopView.js |
| Testing guide | ✅ Complete | This document |
| Error patterns and examples | ✅ Complete | This document |
| Configuration guide | ✅ Complete | This document |

---

## Next Steps

**For Phase 6 (Future)**:
- Add pagination to `/products` endpoint
- Implement search/filter API endpoints
- Add user authentication API
- Implement cart persistence to backend
- Add product review/rating API
- Implement wishlist API

**Immediate Actions**:
1. Run JSON Server: `npx json-server --watch db.json --port 3000`
2. Navigate to shop page and verify console logs
3. Test deep linking: Click category → check console for filter logs
4. Test error handling: Stop JSON Server and see error handling

---

**Phase 5 Implementation Complete** ✅

The API Service Layer is production-ready and fully integrated with the Phase 4 SPA architecture.
