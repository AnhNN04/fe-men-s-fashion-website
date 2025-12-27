# Phase 7 – Search Feature Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Ensure Search Input Exists (HTML)

In `index.html`, add or verify the search input element:

```html
<header>
  <!-- ... other header content -->
  <input 
    type="text" 
    id="search-input" 
    placeholder="Tìm sản phẩm..." 
    class="search-field"
  />
  <!-- ... rest of header -->
</header>
```

**Key Requirements**:
- ID must be exactly `#search-input`
- Element must exist before Phase 7 functions run
- Can be anywhere in DOM (typically in header)

---

### Step 2: Initialize Search in app.js

```javascript
// app.js
import { initSearchInput } from './js/components/SearchInput.js';

export async function initApp() {
  // ... existing initialization code ...
  
  // Initialize search feature (Phase 7)
  initSearchInput();
  
  console.log('[App] Search feature enabled');
}

// Start app
initApp();
```

**Expected Console Output**:
```
[SearchInput] Initialized
```

---

### Step 3: Listen for Search Events (shopView.js)

Add search event listener to your shop view:

```javascript
// shopView.js
import { selectProducts } from '../core/selectors.js';
import { getState } from '../core/state.js';

// Add this listener when shopView is initialized
export function setupSearchListener(allProducts) {
  document.addEventListener('search', (event) => {
    const state = getState();
    
    // Apply all filters including search
    const filtered = selectProducts(allProducts, {
      search: state.search,
      categories: state.filters.categories,
      priceRanges: state.filters.priceRanges,
      statuses: state.filters.statuses
    });
    
    // Re-render with filtered results
    renderProductList(filtered);
    
    console.log('[ShopView] Rendered', filtered.length, 'results');
  });
}
```

**Add this in shopView.render() function**:
```javascript
export async function render(params = {}) {
  // ... existing code to fetch products ...
  
  const products = await getAPI('/products');
  
  // NEW: Setup search listener
  setupSearchListener(products);
  
  // ... rest of render function ...
}
```

---

### Step 4: Test in Browser

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Open browser** to your shop page

3. **Type in search input**:
   - Type: "Polo"
   - Expected: Grid shows only Polo products
   - Delete text
   - Expected: Grid shows all products again

4. **Check console**:
   - Should see: `[SearchInput] Initialized`
   - When typing: `[SearchInput] Searching for: Polo`

---

## 📋 Verification Checklist

- [ ] `#search-input` element exists in HTML
- [ ] `initSearchInput()` called in app.js
- [ ] Search event listener added to shopView
- [ ] No console errors
- [ ] Typing filters products in real-time
- [ ] Clear search shows all products
- [ ] Debounce works (no lag on rapid typing)

---

## 🔍 Core Functions You Need to Know

### 1. Initialize Search
```javascript
import { initSearchInput } from './js/components/SearchInput.js';
initSearchInput(); // Call once on app start
```

### 2. Filter Products
```javascript
import { selectProducts } from './js/core/selectors.js';

const filtered = selectProducts(allProducts, {
  search: 'Polo',
  categories: ['tops'],
  priceRanges: [],
  statuses: []
});
```

### 3. Get Current Search Query
```javascript
import { getState } from './js/core/state.js';

const state = getState();
console.log('User searched for:', state.search);
```

### 4. Programmatically Set Search
```javascript
import { setSearchInputValue } from './js/components/SearchInput.js';

setSearchInputValue('Sweater'); // Sets input value
```

---

## 📊 Files Created (Summary)

| File | Lines | Purpose |
|------|-------|---------|
| `js/utils/debounce.js` | 60 | Debounce utility for performance |
| `js/core/selectors.js` | 210 | Product filtering logic |
| `js/components/SearchInput.js` | 104 | Search input component |

**Enhanced**:
| File | Addition | Purpose |
|------|----------|---------|
| `js/core/state.js` | `setSearchQuery()` | Set search in global state |

---

## 🧪 Quick Test Commands

Copy and paste into browser DevTools Console:

### Test 1: Search for Polo
```javascript
// Type "Polo" in search input
// Verify grid shows only Polo products
```

### Test 2: Check State
```javascript
import { getState } from './js/core/state.js';
console.log(getState().search); // Should show "Polo"
```

### Test 3: Direct Filter
```javascript
import { selectProductsBySearch } from './js/core/selectors.js';
import { getAPI } from './js/core/api.js';

const products = await getAPI('/products');
const results = selectProductsBySearch(products, 'Polo');
console.log('Found:', results.length, 'Polo products');
```

### Test 4: Verify Debounce
```javascript
// Open DevTools Console
// Type in search quickly: "Sweater"
// Count log messages: [SearchInput] Searching for:
// Expected: Only 1 log (debounced), NOT 7 logs (one per keystroke)
```

---

## 🚨 Troubleshooting

### Issue: "Search input element not found"
**Cause**: #search-input element missing from HTML  
**Fix**: Add to HTML:
```html
<input type="text" id="search-input" placeholder="Tìm sản phẩm..." />
```

### Issue: Typing doesn't filter results
**Cause**: `initSearchInput()` not called  
**Fix**: Ensure in app.js:
```javascript
import { initSearchInput } from './js/components/SearchInput.js';
initSearchInput();
```

### Issue: Search event not triggering
**Cause**: No listener for 'search' event  
**Fix**: Add event listener:
```javascript
document.addEventListener('search', (event) => {
  console.log('Search event fired:', event.detail.query);
});
```

### Issue: Lag when typing
**Cause**: Debounce delay too short  
**Fix**: Increase in SearchInput.js:
```javascript
const debouncedSearch = debounce(handleSearch, 500); // Change 300 to 500
```

---

## 📚 Full Documentation

For complete details, see:
- **PHASE-7-SEARCH-FEATURE.md** - Technical reference
- **PHASE-7-TESTING.md** - Test procedures
- **PHASE-7-SUMMARY.md** - Implementation summary

---

## 🎯 What Happens When User Types

```
User types "Polo"
    ↓
#search-input 'input' event fires
    ↓
debounce waits 300ms (prevents lag)
    ↓
handleSearch() called
    ↓
state.search = "Polo" (updates global state)
    ↓
'search' custom event dispatched
    ↓
shopView listening component catches event
    ↓
selectProducts(allProducts, { search: "Polo", ... })
    ↓
Returns filtered products
    ↓
renderProductList(filtered) [Phase 6 function]
    ↓
#product-grid updates with filtered results
    ↓
User sees only Polo products!
```

---

## ✨ Key Features

✅ **Real-time filtering** as user types  
✅ **Case-insensitive** ("Polo" = "polo" = "POLO")  
✅ **Searches both** name and description  
✅ **Debounced** for performance (300ms default)  
✅ **Combines with** other filters (category, price, status)  
✅ **Persists** search query in localStorage  
✅ **Custom events** for reactive updates  
✅ **Error handling** for missing elements  
✅ **No external dependencies** (pure JavaScript)  

---

## 🔧 Configuration

### Change Debounce Delay (default: 300ms)
```javascript
// SearchInput.js line 28
const debouncedSearch = debounce(handleSearch, 500); // 500ms
```

### Add More Search Fields
```javascript
// In selectors.js, selectProductsBySearch():
const colors = (product.colors || []).join(' ').toLowerCase();
return name.includes(normalizedQuery) || 
       description.includes(normalizedQuery) ||
       colors.includes(normalizedQuery); // Add this
```

### Customize Empty State Message
```javascript
// When no results found:
const message = `Không tìm thấy: "${query}"`;
renderProductList([], message);
```

---

## 🎓 Learning Resources

**Understand Debounce**:
- Every keystroke triggers an event
- Debounce waits for user to stop typing (300ms idle)
- Then executes function once
- Result: Typing "Search" = 1 function call, not 6!

**Understand Selectors**:
- Selectors are "filter functions"
- Take all products and filter criteria
- Return filtered subset
- Can combine multiple filters

**Understand Events**:
- SearchInput dispatches 'search' event
- Other components listen and react
- Pattern: One component sends, others listen
- Decoupled architecture (good design!)

---

## 📞 Support

**Stuck?** Check:
1. Console for errors: `[SearchInput]` prefix logs
2. HTML has `id="search-input"`
3. `initSearchInput()` called in app.js
4. Event listener added to shopView
5. Network tab shows `/products` API call
6. Products loaded successfully

**Still stuck?** See PHASE-7-TESTING.md for detailed debugging steps.

---

## ✅ Success Criteria

You'll know Phase 7 is working when:
- ✅ Typing in search filters products in real-time
- ✅ Grid updates without page refresh
- ✅ No console errors
- ✅ Clearing search shows all products
- ✅ Case-insensitive matching works ("Polo" = "polo")
- ✅ Search persists after page refresh
- ✅ No lag on rapid typing (thanks to debounce!)

---

## 🚀 Next Steps

Once Phase 7 is verified:
1. **Phase 8 (CSS)**: Style search input and results
2. **Phase 9 (Events)**: Add click handlers for filters
3. **Phase 10 (Integration)**: Final polish and deployment

---

## 📖 Import Reference

```javascript
// All Phase 7 imports in one place:

// Debounce (performance optimization)
import { debounce } from './js/utils/debounce.js';

// Filtering logic
import { 
  selectProducts,
  selectProductsBySearch
} from './js/core/selectors.js';

// Search input component
import { initSearchInput } from './js/components/SearchInput.js';

// State management
import { getState, setSearchQuery } from './js/core/state.js';
```

---

**Phase 7 is complete and ready to use!** 🎉

