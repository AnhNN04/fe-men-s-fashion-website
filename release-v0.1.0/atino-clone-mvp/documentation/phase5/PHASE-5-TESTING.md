# Phase 5 - API Service Layer Testing Guide

**Purpose**: Validate API service layer functionality in isolation and integration with the SPA  
**Duration**: ~30 minutes  
**Requirements**: JSON Server running on localhost:3000, Frontend on localhost:5500+

---

## Quick Test Reference

| Test Case | Command | Expected Result |
|-----------|---------|-----------------|
| **Test 1A** | `await fetchProducts()` | Returns array of 44 products |
| **Test 2A** | `await fetchCategories()` | Returns array of 20 categories |
| **Test 3A** | Stop server, `await fetchProducts()` | Throws "Failed to fetch" error |
| **Test 4A** | Navigate to shop page | Logs `[API] GET /products:` in console |
| **Test 5A** | Click category on home | Logs API calls + filter state |

---

## Test Execution Steps

### Phase 5.1: Unit Testing - fetchProducts()

#### Test 1.1: Successful Fetch

**Setup**:
```bash
# Terminal 1
cd mock-backend
npx json-server --watch db.json --port 3000
```

**Execution**:
1. Open browser DevTools (F12)
2. Navigate to Console tab
3. Type:
```javascript
import { fetchProducts } from './js/core/api.js';
const products = await fetchProducts();
```

**Expected Output**:
```
[API] GET /products: Array(44)
```

**Verification**:
```javascript
// In console, verify structure
console.log(products.length); // Should be 44
console.log(products[0].id); // Should be 1 or higher
console.log(products[0].name); // Should be string
console.log(products[0].price); // Should be number
console.table(products.slice(0, 3)); // View first 3
```

**Success Criteria**:
- ✅ Console log shows `[API] GET /products:`
- ✅ Array contains 44 items
- ✅ Each item has: id, name, category, price, originalPrice, images[], sizes[], colors[], tags[], stock
- ✅ No errors in console

---

#### Test 1.2: Verify Product Data Structure

**Execution**:
```javascript
const products = await fetchProducts();
const product = products[0];

// Check required fields
console.log('ID:', product.id, typeof product.id === 'number' ? '✓' : '✗');
console.log('Name:', product.name, typeof product.name === 'string' ? '✓' : '✗');
console.log('Category:', product.category, typeof product.category === 'string' ? '✓' : '✗');
console.log('Price:', product.price, typeof product.price === 'number' ? '✓' : '✗');
console.log('Images:', Array.isArray(product.images) ? '✓' : '✗');
console.log('Stock:', product.stock, typeof product.stock === 'number' ? '✓' : '✗');
```

**Expected Output**:
```
ID: 1 ✓
Name: "Áo Sơ Mi Nam" ✓
Category: "tops" ✓
Price: 199000 ✓
Images: ✓
Stock: 25 ✓
```

**Success Criteria**:
- ✅ All required fields present
- ✅ All fields have correct types
- ✅ Images is an array with URLs
- ✅ Stock is a positive number

---

#### Test 1.3: Verify Price Calculations

**Execution**:
```javascript
const products = await fetchProducts();
const discountedProduct = products.find(p => p.discount > 0);

if (discountedProduct) {
  const calculated = discountedProduct.originalPrice * (1 - discountedProduct.discount / 100);
  console.log('Original:', discountedProduct.originalPrice);
  console.log('Discount:', discountedProduct.discount + '%');
  console.log('Calculated Price:', Math.round(calculated));
  console.log('Actual Price:', discountedProduct.price);
  console.log('Match?', Math.abs(calculated - discountedProduct.price) < 1 ? '✓' : '✗');
}
```

**Expected Output**:
```
Original: 299000
Discount: 33%
Calculated Price: 200330
Actual Price: 199000
Match? ✓
```

**Success Criteria**:
- ✅ Discount calculation is correct
- ✅ All products with discount have price < originalPrice
- ✅ No negative prices

---

### Phase 5.2: Unit Testing - fetchCategories()

#### Test 2.1: Successful Fetch

**Execution**:
```javascript
import { fetchCategories } from './js/core/api.js';
const categories = await fetchCategories();
```

**Expected Output**:
```
[API] GET /categories: Array(20)
```

**Verification**:
```javascript
console.log('Count:', categories.length); // Should be 20
console.table(categories.slice(0, 5));
```

**Expected Table Output**:
```
┌─────┬────┬─────────────┬──────────┬──────┐
│ (index) │ id │ name      │ parentId │ slug │
├─────┼────┼─────────────┼──────────┼──────┤
│ 0   │ 1  │ "Tops"      │ null     │ "tops" │
│ 1   │ 2  │ "Bottoms"   │ null     │ "bottoms" │
│ 2   │ 3  │ "Accessories"│null     │ "accessories" │
└─────┴────┴─────────────┴──────────┴──────┘
```

**Success Criteria**:
- ✅ Console log shows `[API] GET /categories:`
- ✅ Array contains 20 items
- ✅ Each item has: id, name, parentId, slug
- ✅ No errors in console

---

#### Test 2.2: Verify Category Data Structure

**Execution**:
```javascript
const categories = await fetchCategories();
const category = categories[0];

console.log('ID:', typeof category.id === 'number' ? '✓' : '✗');
console.log('Name:', typeof category.name === 'string' ? '✓' : '✗');
console.log('Slug:', typeof category.slug === 'string' ? '✓' : '✗');
console.log('Has parentId field:', 'parentId' in category ? '✓' : '✗');

// Check all categories have required fields
const allValid = categories.every(c => c.id && c.name && c.slug);
console.log('All categories valid:', allValid ? '✓' : '✗');
```

**Expected Output**:
```
ID: ✓
Name: ✓
Slug: ✓
Has parentId field: ✓
All categories valid: ✓
```

**Success Criteria**:
- ✅ All required fields present
- ✅ All fields have correct types
- ✅ No missing or null values (except parentId which can be null)

---

### Phase 5.3: Error Handling - Network Errors

#### Test 3.1: Server Offline

**Setup**:
1. Stop JSON Server (Ctrl+C in Terminal 1)

**Execution**:
```javascript
import { fetchProducts } from './js/core/api.js';

try {
  await fetchProducts();
} catch (error) {
  console.log('Error caught:', error.message);
  console.log('Error type:', error.constructor.name);
}
```

**Expected Output**:
```
[API] Error fetching /products: TypeError: Failed to fetch
Error caught: TypeError: Failed to fetch
Error type: TypeError
```

**Success Criteria**:
- ✅ Error is caught (not hanging)
- ✅ Console shows `[API] Error` log
- ✅ Error message is descriptive
- ✅ Promise rejects (not silent failure)

---

#### Test 3.2: Timeout Behavior

**Execution**:
```javascript
// Artificially slow network - change API_BASE to wrong port
const slowAPI = 'http://localhost:9999'; // Non-existent port

const timeoutFetch = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  
  try {
    const response = await fetch(`${slowAPI}/products`, { signal: controller.signal });
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request timed out after 3s');
    }
    throw error;
  }
};

await timeoutFetch();
```

**Expected Output**:
```
Request timed out after 3s
Uncaught (in promise) Error: Aborted
```

**Success Criteria**:
- ✅ Request times out after set duration
- ✅ AbortError caught and handled
- ✅ No infinite hanging

---

### Phase 5.4: Integration Testing - ShopView Integration

#### Test 4.1: ShopView Loads Products

**Setup**:
1. Start both servers
2. Navigate to `http://localhost:5500` (your frontend URL)
3. Open DevTools Console

**Execution**:
1. Click "Shop" or "Khám Phá Ngay" button
2. Wait for shop page to load
3. Check console output

**Expected Console Output** (in order):
```
[Router] Switched to view: shop {}
[API] GET /products: Array(44)
[API] GET /categories: Array(20)
[ShopView] Rendered {filtered: 44}
```

**Verification** (in browser):
```javascript
// In console, verify shop state
import { getState } from './js/core/state.js';
const state = getState();
console.log('Products in state:', state.products.length); // Should be 44
console.log('Filters applied:', state.filters); // Should show current filters
```

**Visual Verification**:
- ✅ Page displays product grid (4 columns on desktop)
- ✅ Each product shows: image, name, price, buttons
- ✅ Filter sidebar shows checkboxes with categories
- ✅ "44 Products" or similar count displays
- ✅ No loading spinner after initial load

**Success Criteria**:
- ✅ Both API calls appear in console
- ✅ No errors in console
- ✅ Products display correctly
- ✅ Filters populate from categories API
- ✅ State contains loaded products

---

#### Test 4.2: Deep Linking with API

**Setup**: Both servers running, on home page

**Execution**:
1. Click "Áo" (Tops) category card on home page
2. Observe URL change to `#/shop?category=tops`
3. Check console output
4. Verify product grid updates

**Expected Console Output**:
```
[Router] Switched to view: shop {category: 'tops'}
[API] GET /products: Array(44)
[API] GET /categories: Array(20)
[State] Filters updated: {categories: ['tops'], ...}
[ShopView] Rendered {filtered: 15}
```

**Visual Verification**:
- ✅ URL is `#/shop?category=tops`
- ✅ "Áo" checkbox is checked in filter sidebar
- ✅ Product grid shows only ~15 Tops products (not all 44)
- ✅ All displayed products have `category: 'tops'`

**Verify in Console**:
```javascript
import { getState } from './js/core/state.js';
const state = getState();
console.log('Filtered categories:', state.filters.categories); // ['tops']
const displayedCount = document.querySelectorAll('.product-card').length;
console.log('Displayed products:', displayedCount); // Should be ~15
```

**Success Criteria**:
- ✅ API called on navigation
- ✅ Filter state updated correctly
- ✅ Only filtered products display
- ✅ Checkbox reflects selected filter
- ✅ Browser back button returns to home

---

#### Test 4.3: Filter Combinations

**Execution**:
1. On shop page, check multiple filters:
   - Category: "Áo" (Tops)
   - Price: "Dưới 200k"
2. Observe results update
3. Check console

**Expected Console Output** (for each change):
```
[State] Filters updated: {categories: ['tops'], priceRanges: ['0-200000'], ...}
[ShopView] Rendered {filtered: 8}
```

**Visual Verification**:
- ✅ Product count decreases with each filter
- ✅ All displayed products match criteria:
  - Have `category: 'tops'`
  - Have `price < 200000`
- ✅ "Reset Filters" button visible and functional

**Verify in Console**:
```javascript
// Verify filter logic
const products = document.querySelectorAll('.product-card');
const productPrices = Array.from(products).map(card => 
  parseInt(card.querySelector('.price').textContent.replace(/[^0-9]/g, ''))
);
console.log('Prices displayed:', productPrices);
console.log('All under 200k?', productPrices.every(p => p < 200000)); // Should be true
```

**Success Criteria**:
- ✅ Filters combine with AND logic
- ✅ Product count updates correctly
- ✅ All displayed products match all filters
- ✅ Reset button works

---

### Phase 5.5: Error Handling in Integration

#### Test 5.1: Network Error During ShopView

**Setup**:
1. Navigate to shop page successfully
2. Stop JSON Server (Ctrl+C)
3. Try to navigate away and back to shop

**Execution**:
1. Click "Home" link
2. Click "Shop" link
3. Observe error handling

**Expected Behavior**:
- Option A: Shows error message: "Failed to load products"
- Option B: Shows loading spinner, eventually times out
- Option C: Uses cached products from previous load

**Console Output**:
```
[Router] Switched to view: shop {}
[API] Error fetching /products: TypeError: Failed to fetch
[ShopView] Error: Failed to load products
```

**Success Criteria**:
- ✅ Error doesn't crash the app
- ✅ User sees feedback (message, spinner, or cached data)
- ✅ Console shows descriptive error
- ✅ Can still navigate to other pages

---

#### Test 5.2: Partial Failure (one API call fails)

**Advanced Test**: Simulate selective endpoint failure

```javascript
// Monkey-patch fetch to fail on categories
const originalFetch = window.fetch;
let fetchAttempts = 0;

window.fetch = function(url, options) {
  fetchAttempts++;
  
  if (url.includes('/categories') && fetchAttempts > 2) {
    return Promise.reject(new Error('Categories API temporarily down'));
  }
  
  return originalFetch.call(this, url, options);
};

// Navigate to shop - should handle partial failure gracefully
```

**Expected Behavior**:
- ✅ Products still load
- ✅ Filter sidebar doesn't populate (or shows cached categories)
- ✅ Error is logged but not fatal
- ✅ User can still browse products

---

### Phase 5.6: Performance Testing

#### Test 6.1: API Response Time

**Execution**:
```javascript
// Measure fetch time
import { fetchProducts } from './js/core/api.js';

const start = performance.now();
const products = await fetchProducts();
const end = performance.now();

console.log(`Fetch time: ${(end - start).toFixed(2)}ms`);
console.log(`Product count: ${products.length}`);
console.log(`Time per product: ${((end - start) / products.length).toFixed(3)}ms`);
```

**Expected Output**:
```
Fetch time: 45.23ms
Product count: 44
Time per product: 1.028ms
```

**Success Criteria**:
- ✅ Initial load < 100ms (local JSON Server)
- ✅ Subsequent loads cached/fast
- ✅ No timeout errors

---

#### Test 6.2: Parallel API Calls

**Execution**:
```javascript
import { fetchProducts, fetchCategories } from './js/core/api.js';

// Sequential (slow)
const start1 = performance.now();
const p1 = await fetchProducts();
const c1 = await fetchCategories();
const time1 = performance.now() - start1;

// Parallel (fast)
const start2 = performance.now();
const [p2, c2] = await Promise.all([fetchProducts(), fetchCategories()]);
const time2 = performance.now() - start2;

console.log(`Sequential: ${time1.toFixed(2)}ms`);
console.log(`Parallel: ${time2.toFixed(2)}ms`);
console.log(`Speedup: ${(time1 / time2).toFixed(2)}x`);
```

**Expected Output**:
```
Sequential: 90.45ms
Parallel: 50.23ms
Speedup: 1.80x
```

**Success Criteria**:
- ✅ Parallel is faster than sequential
- ✅ No errors in either approach
- ✅ Data integrity maintained

---

## Test Summary Checklist

| Phase | Test | Status |
|-------|------|--------|
| **5.1** | fetchProducts() returns 44 items | [ ] ✓ |
| **5.1** | Product data structure valid | [ ] ✓ |
| **5.1** | Price calculations correct | [ ] ✓ |
| **5.2** | fetchCategories() returns 20 items | [ ] ✓ |
| **5.2** | Category data structure valid | [ ] ✓ |
| **5.3** | Server offline error handled | [ ] ✓ |
| **5.3** | Timeout behavior correct | [ ] ✓ |
| **5.4** | ShopView loads API data | [ ] ✓ |
| **5.4** | Deep linking with filters works | [ ] ✓ |
| **5.4** | Filter combinations apply correctly | [ ] ✓ |
| **5.5** | Network error shows feedback | [ ] ✓ |
| **5.5** | Partial failure handled gracefully | [ ] ✓ |
| **5.6** | API response time < 100ms | [ ] ✓ |
| **5.6** | Parallel requests faster than sequential | [ ] ✓ |

---

## Debugging Commands

Quick reference for console debugging:

```javascript
// Test 1: Verify API base URL
import { getAPI } from './js/core/api.js';
console.log('Testing API...');
const result = await getAPI('/products');

// Test 2: Check if both APIs work
const [p, c] = await Promise.all([
  (await import('./js/core/api.js')).fetchProducts(),
  (await import('./js/core/api.js')).fetchCategories()
]);
console.log(`Products: ${p.length}, Categories: ${c.length}`);

// Test 3: Inspect state
import { getState } from './js/core/state.js';
console.table(getState());

// Test 4: Test filter logic
const products = await (await import('./js/core/api.js')).fetchProducts();
const tops = products.filter(p => p.category === 'tops');
console.log(`Tops: ${tops.length}`);

// Test 5: Verify localStorage persistence
console.log('Stored state:', localStorage.getItem('atino-shop-state'));
```

---

## Expected Results Summary

✅ **All tests passing** indicates:
- API service layer is fully functional
- Integration with ShopView works correctly
- Error handling is robust
- Performance is acceptable
- Data integrity maintained
- Deep linking works as expected

🚀 **Ready for Phase 6**: User interaction layer (add to cart, modal, etc.)

---

*Phase 5 Testing Complete*
