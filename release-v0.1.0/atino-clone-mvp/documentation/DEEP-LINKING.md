## Deep Linking Implementation - Category to Shop Filter

### How Deep Linking Works

**Deep linking** allows users to navigate from the home page to the shop page with specific filters pre-applied. When a user clicks a category on the home page, they arrive at the shop page with that category already selected.

### Code Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS CATEGORY CARD                    │
│                      (homeView.js)                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EVENT LISTENER TRIGGERED                       │
│  .category-card click → extract data-category attribute        │
│  Example: data-category="tops"                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│         CALL: router.navigate('/shop', {category: 'tops'})      │
│                    (router.js navigate function)                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  BUILD HASH URL: #/shop?category=tops                           │
│  Update window.location.hash with new route                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│         BROWSER TRIGGERS: 'hashchange' EVENT                    │
│        (window addEventListener('hashchange', ...))            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│           handleHashChange() FUNCTION EXECUTES                  │
│  Parse hash: '#/shop?category=tops'                             │
│  Extract route: 'shop'                                          │
│  Extract params: {category: 'tops'}                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│       CALL: switchView('shop', {category: 'tops'})              │
│                    (router.js)                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│      HIDE ALL VIEW SECTIONS, SHOW #shop-view                    │
│  .view-section.hidden { display: none }                         │
│  #shop-view.hidden { remove class }                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│   CALL: shopView.render({category: 'tops'})                     │
│                  (shopView.js render function)                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  IF PARAMS.CATEGORY RECEIVED:                                   │
│  - Call setFilters({categories: ['tops']})                      │
│  - Update global state: state.filters.categories = ['tops']     │
│  - This will pre-select the category filter                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│     FETCH PRODUCTS AND CATEGORIES FROM JSON SERVER              │
│  GET http://localhost:3000/products                             │
│  GET http://localhost:3000/categories                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              APPLY FILTERS TO PRODUCTS                          │
│  if (filters.categories.includes('tops')) {                     │
│    filtered = filtered.filter(p => p.category === 'tops')       │
│  }                                                              │
│  Result: Only 15 Tops products                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│         RENDER SHOP SIDEBAR WITH PRE-CHECKED FILTERS            │
│  Generate HTML for filter checkboxes                            │
│  For category filter:                                           │
│    <input type="checkbox" value="tops" checked>                 │
│  Other category filters are NOT checked                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│           RENDER PRODUCT GRID WITH FILTERED DATA                │
│  Display 15 Tops products with images, names, prices           │
│  Each product card has "Xem Chi Tiết" and "Thêm Giỏ" buttons   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│         USER SEES SHOP PAGE WITH CATEGORY PRE-FILTERED         │
│  - URL shows: #/shop?category=tops                              │
│  - "Áo" checkbox is checked                                     │
│  - Grid shows only Tops products                                │
│  - User can uncheck to see all products or select other filters │
└─────────────────────────────────────────────────────────────────┘
```

### Code Implementation

#### 1. Home View - Category Click Handler

**File: `js/views/homeView.js`**

```javascript
// Setup event listeners for category cards
function setupEventListeners() {
  document.querySelectorAll('.category-card').forEach(card => {
    const categoryBtn = card.querySelector('.category-cta');
    categoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = card.getAttribute('data-category');
      navigate('/shop', { category });  // ← TRIGGER DEEP LINK
    });
  });
}
```

**HTML Structure:**
```html
<div class="category-card" data-category="tops">
  <div class="category-image">...</div>
  <div class="category-info">
    <h3 class="category-name">Áo</h3>
    <button class="btn btn-secondary category-cta">Xem Ngay</button>
  </div>
</div>
```

#### 2. Router - Navigate Function

**File: `js/core/router.js`**

```javascript
/**
 * Navigate to a new route
 * @param {string} route - Route path (e.g., '/shop')
 * @param {object} params - Query parameters: {category: 'tops'}
 */
export function navigate(route, params = {}) {
  // Build hash URL
  let hash = route.startsWith('#') ? route : `#${route}`;
  
  // Add query parameters
  const queryParts = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  if (queryParts) {
    hash += `?${queryParts}`;  // ← Builds: #/shop?category=tops
  }
  
  window.location.hash = hash;  // ← Triggers hashchange event
}
```

#### 3. Router - Hash Change Handler

**File: `js/core/router.js`**

```javascript
function handleHashChange() {
  const hash = window.location.hash.slice(1) || '/';  // Remove #
  const [route, queryString] = hash.split('?');       // Split by ?
  
  // Parse query parameters
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      // Result: {category: 'tops'}
    });
  }
  
  const viewName = route === '/' ? 'home' : route.substring(1);  // 'shop'
  
  switchView(viewName, params);  // Call switchView with params
}

// Add hash change listener
window.addEventListener('hashchange', handleHashChange);
```

#### 4. Shop View - Receive & Apply Params

**File: `js/views/shopView.js`**

```javascript
export async function render(params = {}) {
  // ... (existing code)
  
  // Apply category filter from route parameters
  if (params.category) {
    setFilters({
      categories: [params.category],  // ← Set 'tops' as pre-selected
    });
  }
  
  // ... (fetch products, apply filters)
  
  // Render filter checkboxes with pre-selected state
  function renderCategoryFilters() {
    const { filters } = state;
    const selectedCategories = filters.categories || [];  // ['tops']
    
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
          // ← HTML renders: checked if 'tops' in selectedCategories
        >
        ${cat.label}
      </label>
    `).join('');
  }
}
```

### URL Parameter Encoding

When user clicks "Tops":
- `navigate('/shop', {category: 'tops'})`
- Becomes: `#/shop?category=tops`
- Browser shows: `http://localhost:5500/index.html#/shop?category=tops`

With special characters:
- `navigate('/shop', {search: 'áo sơ mi'})`
- Encodes to: `#/shop?search=%C3%A1o%20s%C6%A1%20mi`
- router.js decodes back to: `{search: 'áo sơ mi'}`

### State Preservation

The state is updated in `state.js`:

```javascript
export function setFilters(filters) {
  globalState.filters = {
    categories: filters.categories || [],
    priceRanges: filters.priceRanges || [],
    statuses: filters.statuses || [],
  };
  saveState();  // ← Save to localStorage
}
```

So if user:
1. Navigates to `#/shop?category=tops` (state.filters.categories = ['tops'])
2. Then checks "Dưới 200k" filter (state.filters.priceRanges = ['0-200000'])
3. Refreshes page
4. localStorage reloads the state
5. Both filters remain applied

### Browser Back/Forward Buttons

When user presses back after deep link navigation:
1. Browser hash changes to `#/` (home)
2. hashchange event fires
3. `handleHashChange()` parses hash
4. `switchView('home', {})` called
5. Home view renders
6. User returns to home page

### Testing Deep Link Flow

```bash
# 1. Start at home
http://localhost:5500/index.html

# 2. Click "Tops" category card
# URL changes to:
http://localhost:5500/index.html#/shop?category=tops

# 3. Verify in browser console:
# You should see logs:
#   [Router] Switched to view: shop {category: 'tops'}
#   [ShopView] Rendered {filtered: 15}

# 4. Verify in UI:
#   - "Áo" checkbox is checked in sidebar
#   - Only 15 products displayed in grid
#   - All products have category: 'tops'

# 5. Test back button:
# Click browser back
# URL changes to: http://localhost:5500/index.html#/
# Home page renders with hero and categories

# 6. Test manual URL entry:
# Type in address bar:
http://localhost:5500/index.html#/shop?category=bottoms
# Shop page loads with only Bottoms filtered
```

### Multiple Parameter Deep Links

The system supports multiple filters in the URL:

```
#/shop?category=tops&priceRange=0-200000&search=somi

Decoded as:
{
  category: 'tops',
  priceRange: '0-200000',
  search: 'somi'
}
```

However, the current implementation only uses `category` for deep linking. To extend:

```javascript
// In shopView.render(params):

if (params.category) {
  setFilters({categories: [params.category]});
}

if (params.priceRange) {
  setFilters({priceRanges: [params.priceRange]});
}

if (params.search) {
  updateSearch(params.search);
}
```

### Performance Considerations

1. **Lazy Route Params:** Only applied if provided (no unnecessary state updates)
2. **Memoization:** State cached in memory, localStorage as backup
3. **Hash-Based (Not Path-Based):** No server-side routing needed, works with any hosting
4. **Client-Side Filtering:** Products filtered in browser after fetch (no second API call)

### Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| User bookmarks deep link | Clicking bookmark directly navigates to filtered shop |
| User shares URL | Link includes filter params, recipient sees filtered page |
| Invalid category in URL | Router still loads shop, empty filters applied |
| Rapid navigation clicks | Browser queues hash changes, router processes in order |
| User clears filters | URL updates to `#/shop` (no query string) |
| Back to home then back to shop | Fresh render, filters reset unless reopening same URL |

This deep linking implementation provides a seamless user experience while keeping the codebase maintainable and performant.
