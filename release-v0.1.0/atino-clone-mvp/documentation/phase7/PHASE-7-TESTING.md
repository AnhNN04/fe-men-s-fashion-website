# Phase 7 – Search Feature Testing Guide

## Test Execution Quick Reference

| Test | Command | Expected Result |
|------|---------|-----------------|
| Basic Search | Type "Polo" in #search-input | Grid shows only Polo products |
| Case Insensitive | Type "POLO", then "polo" | Both return same results |
| Empty Search | Type "ZZZZZZZ" | Shows "Không tìm thấy sản phẩm" |
| Clear Search | Type then delete all | Grid shows all products |
| Debounce Check | Type "Sweater" rapidly, count logs | Only 1-2 console logs |
| Description Search | Type "cotton" | Returns products with cotton in description |
| Mixed Filters | Apply category + search | Both filters applied together |
| State Persistence | Search then F5 refresh | Search value retained |

---

## Phase 7.1: Debounce Unit Tests

### Test 1.1: Basic Debounce Function

**Setup**:
```javascript
import { debounce } from './js/utils/debounce.js';

let callCount = 0;
const myFunction = () => { callCount++; };
const debouncedFn = debounce(myFunction, 100);
```

**Steps**:
1. Call `debouncedFn()` three times rapidly
2. Wait 50ms
3. Verify callCount still 0 (not executed)
4. Wait another 60ms (total 110ms)
5. Verify callCount = 1

**Expected Output**:
```
callCount before timeout: 0
callCount after timeout: 1 (executed once, not three times)
```

**Pass Criteria**: ✅ Function executes exactly once after 300ms delay

---

### Test 1.2: Debounce with Multiple Calls

**Setup**: Same as Test 1.1

**Steps**:
1. Call `debouncedFn()` five times with 50ms between each
2. Wait 350ms total
3. Check callCount

**Expected**: callCount = 1 (last call triggers after 300ms idle)

**Pass Criteria**: ✅ Only executes after all calls stop + 300ms

---

## Phase 7.2: Selector Unit Tests

### Test 2.1: Search by Name (Case Insensitive)

**Console Command**:
```javascript
import { selectProductsBySearch } from './js/core/selectors.js';
import { getAPI } from './js/core/api.js';

const products = await getAPI('/products');
const results = selectProductsBySearch(products, 'Polo');
console.log('Found:', results.length, 'products');
console.log('Results:', results.map(p => p.name));
```

**Expected Output**:
```
Found: 3 products (example)
Results: [
  "Áo Polo Cổ Trắng",
  "Áo Polo Tay Dài",
  "Áo Polo Sport"
]
```

**Pass Criteria**: ✅ Returns products with "polo" in name (case-insensitive)

---

### Test 2.2: Search Returns Empty Array

**Console Command**:
```javascript
const results = selectProductsBySearch(products, 'NONEXISTENT');
console.log('Found:', results.length, 'products');
```

**Expected Output**:
```
Found: 0 products
```

**Pass Criteria**: ✅ Returns empty array for non-matching query

---

### Test 2.3: Search with Empty Query

**Console Command**:
```javascript
const results = selectProductsBySearch(products, '');
console.log('Found:', results.length, 'products');
```

**Expected Output**:
```
Found: 44 products (or total count)
```

**Pass Criteria**: ✅ Returns all products when query is empty

---

### Test 2.4: Category Filter

**Console Command**:
```javascript
import { selectProductsByCategory } from './js/core/selectors.js';

const results = selectProductsByCategory(products, ['tops']);
console.log('Tops products:', results.length);
console.log('Sample:', results[0]?.category);
```

**Expected Output**:
```
Tops products: 15 (example)
Sample: tops
```

**Pass Criteria**: ✅ Returns only products in specified category

---

### Test 2.5: Combined Filter (Search + Category)

**Console Command**:
```javascript
import { selectProducts } from './js/core/selectors.js';

const results = selectProducts(products, {
  search: 'Áo',
  categories: ['tops'],
  priceRanges: [],
  statuses: []
});
console.log('Filtered:', results.length);
```

**Expected Output**:
```
Filtered: 8 (example - tops named with "Áo")
```

**Pass Criteria**: ✅ Combines multiple filters correctly

---

### Test 2.6: Sort Products

**Console Command**:
```javascript
import { selectProductsSorted } from './js/core/selectors.js';

const sorted = selectProductsSorted(products, 'price-asc');
console.log('Cheapest:', sorted[0]?.price);
console.log('Most expensive:', sorted[sorted.length-1]?.price);
```

**Expected Output**:
```
Cheapest: 150000
Most expensive: 750000
```

**Pass Criteria**: ✅ Products sorted by selected criteria

---

## Phase 7.3: SearchInput Component Tests

### Test 3.1: Initialize Search Input

**HTML Prerequisite**:
```html
<input type="text" id="search-input" placeholder="Tìm sản phẩm..." />
```

**Console Command**:
```javascript
import { initSearchInput } from './js/components/SearchInput.js';

initSearchInput();
```

**Expected Console Output**:
```
[SearchInput] Initialized
```

**Pass Criteria**: ✅ No errors, initialization log appears

---

### Test 3.2: Type in Search Input

**Steps**:
1. Focus on #search-input
2. Type "Polo" character by character
3. Wait 300ms after last keystroke
4. Check console logs

**Expected Console Output**:
```
[SearchInput] Searching for: P
[SearchInput] Searching for: Po
[SearchInput] Searching for: Pol
[SearchInput] Searching for: Polo
```

**Actual with Debounce (Expected)**:
```
(wait 300ms after typing completes)
[SearchInput] Searching for: Polo
```

**Pass Criteria**: ✅ Only logs once after debounce delay

---

### Test 3.3: Get Current Search Query

**Console Command**:
```javascript
import { getSearchQuery } from './js/components/SearchInput.js';

const searchInput = document.getElementById('search-input');
searchInput.value = 'Sweater';

const query = getSearchQuery();
console.log('Current query:', query);
```

**Expected Output**:
```
Current query: Sweater
```

**Pass Criteria**: ✅ Returns current input value

---

### Test 3.4: Clear Search Input

**Console Command**:
```javascript
import { clearSearchInput } from './js/components/SearchInput.js';

clearSearchInput();
console.log('Input value:', document.getElementById('search-input').value);
```

**Expected Output**:
```
Input value: (empty string)
```

**Pass Criteria**: ✅ Input cleared and event dispatched

---

### Test 3.5: Set Search Value Programmatically

**Console Command**:
```javascript
import { setSearchInputValue } from './js/components/SearchInput.js';

setSearchInputValue('Jeans');
console.log('Input value:', document.getElementById('search-input').value);
```

**Expected Output**:
```
Input value: Jeans
```

**Pass Criteria**: ✅ Input value updated programmatically

---

## Phase 7.4: Integration Tests

### Test 4.1: Search → State Update → Event Dispatch

**Console Setup**:
```javascript
import { initSearchInput } from './js/components/SearchInput.js';
import { getState } from './js/core/state.js';

// Listen for search events
let lastSearchEvent = null;
document.addEventListener('search', (event) => {
  lastSearchEvent = event;
  console.log('[Test] Search event received:', event.detail.query);
});

initSearchInput();
```

**Steps**:
1. Type "Shirt" in #search-input
2. Wait 300ms
3. Check state and event

**Console Commands**:
```javascript
console.log('State search:', getState().search);
console.log('Event query:', lastSearchEvent?.detail.query);
```

**Expected Output**:
```
[Test] Search event received: Shirt
State search: Shirt
Event query: Shirt
```

**Pass Criteria**: ✅ State updates and event fires

---

### Test 4.2: Full Integration: Type → Filter → Render

**Setup** (In DevTools):
```javascript
import { initSearchInput } from './js/components/SearchInput.js';
import { getAPI } from './js/core/api.js';
import { selectProducts } from './js/core/selectors.js';
import { getState } from './js/core/state.js';

// Load products
const products = await getAPI('/products');
console.log('Total products:', products.length);

// Listen for search
document.addEventListener('search', (event) => {
  const state = getState();
  const filtered = selectProducts(products, {
    search: state.search,
    categories: state.filters.categories,
    priceRanges: state.filters.priceRanges,
    statuses: state.filters.statuses
  });
  console.log('[Integration] Filtered results:', filtered.length);
});

// Initialize search
initSearchInput();
```

**Steps**:
1. Type "Áo Nỉ"
2. Wait 300ms
3. Check console output

**Expected Output**:
```
Total products: 44
[Integration] Filtered results: 3 (example)
```

**Pass Criteria**: ✅ End-to-end flow works correctly

---

### Test 4.3: Search with Existing Filters

**Setup**:
```javascript
import { setFilters } from './js/core/state.js';
import { selectProducts } from './js/core/selectors.js';

// Apply category filter first
setFilters({ categories: ['tops'] });
console.log('Category filter applied: tops only');
```

**Steps**:
1. Type "Len" in search
2. Verify it combines with category filter

**Console Command**:
```javascript
const state = getState();
const results = selectProducts(products, {
  search: 'Len',
  categories: state.filters.categories
});
console.log('Tops with "Len":', results.length);
```

**Expected Output**:
```
Tops with "Len": 4 (example - sweaters/cardigans in tops category)
```

**Pass Criteria**: ✅ Filters combine correctly

---

## Phase 7.5: Performance Tests

### Test 5.1: Debounce Performance

**Console Command**:
```javascript
import { debounce } from './js/utils/debounce.js';

let executions = [];
const testFn = () => { 
  executions.push(Date.now());
  console.log('Executed at:', executions[executions.length - 1]);
};
const debouncedFn = debounce(testFn, 300);

// Simulate typing "Search" (6 keystrokes)
for (let i = 0; i < 6; i++) {
  setTimeout(() => debouncedFn(), i * 50);
}

setTimeout(() => {
  console.log('Total executions:', executions.length);
  console.log('Delay between first keystroke and execution:', 
    executions[0] - Date.now());
}, 500);
```

**Expected Output**:
```
Total executions: 1 (not 6)
Delay: ~300-350ms
```

**Pass Criteria**: ✅ Executes once instead of 6 times

---

### Test 5.2: Filter Performance with Large List

**Console Command**:
```javascript
import { selectProducts } from './js/core/selectors.js';

const startTime = performance.now();
const filtered = selectProducts(products, {
  search: 'Áo',
  categories: ['tops', 'bottoms'],
  priceRanges: ['100000-500000'],
  statuses: ['sale']
});
const endTime = performance.now();

console.log('Filter time:', (endTime - startTime).toFixed(2) + 'ms');
console.log('Results:', filtered.length);
```

**Expected Output**:
```
Filter time: 2-5ms (should be very fast)
Results: 12 (example)
```

**Pass Criteria**: ✅ Filter completes in < 50ms

---

## Phase 7.6: Edge Case Tests

### Test 6.1: Special Characters in Search

**Console Command**:
```javascript
const results = selectProductsBySearch(products, '@#$%');
console.log('Special char search:', results.length);
```

**Expected Output**:
```
Special char search: 0
```

**Pass Criteria**: ✅ Handles special characters safely

---

### Test 6.2: Very Long Search Query

**Console Command**:
```javascript
const longQuery = 'A'.repeat(100);
const results = selectProductsBySearch(products, longQuery);
console.log('Long query results:', results.length);
```

**Expected Output**:
```
Long query results: 0
```

**Pass Criteria**: ✅ No errors with long strings

---

### Test 6.3: Whitespace Handling

**Console Command**:
```javascript
const results1 = selectProductsBySearch(products, '  Polo  ');
const results2 = selectProductsBySearch(products, 'Polo');
console.log('Match:', results1.length === results2.length);
```

**Expected Output**:
```
Match: true
```

**Pass Criteria**: ✅ Trim whitespace correctly

---

### Test 6.4: Missing Search Input Element

**Console Command** (simulate missing element):
```javascript
// Temporarily remove search input
const searchInput = document.getElementById('search-input');
if (searchInput) searchInput.remove();

import { initSearchInput } from './js/components/SearchInput.js';
initSearchInput();
```

**Expected Console Output**:
```
[SearchInput] Search input element not found (#search-input)
```

**Pass Criteria**: ✅ Graceful error handling

---

## Test Checklist

### Pre-Test Setup
- [ ] JSON Server running (`npm run dev`)
- [ ] Frontend app loaded in browser
- [ ] DevTools Console open
- [ ] Network tab showing `/products` API calls

### Unit Tests (Debounce)
- [ ] Test 1.1: Basic debounce execution
- [ ] Test 1.2: Multiple calls debounce

### Unit Tests (Selectors)
- [ ] Test 2.1: Search by name (case-insensitive)
- [ ] Test 2.2: Empty search results
- [ ] Test 2.3: Empty query returns all
- [ ] Test 2.4: Category filter
- [ ] Test 2.5: Combined filters
- [ ] Test 2.6: Sort products

### Unit Tests (SearchInput)
- [ ] Test 3.1: Initialize
- [ ] Test 3.2: Type to search
- [ ] Test 3.3: Get query
- [ ] Test 3.4: Clear search
- [ ] Test 3.5: Set value programmatically

### Integration Tests
- [ ] Test 4.1: Search → State → Event
- [ ] Test 4.2: Full pipeline
- [ ] Test 4.3: Combined with other filters

### Performance Tests
- [ ] Test 5.1: Debounce reduces calls
- [ ] Test 5.2: Filter is fast

### Edge Cases
- [ ] Test 6.1: Special characters
- [ ] Test 6.2: Long queries
- [ ] Test 6.3: Whitespace
- [ ] Test 6.4: Missing elements

### UI/Integration Validation
- [ ] Search input appears in UI
- [ ] Typing triggers filter
- [ ] Results update in real-time
- [ ] Empty state shows when no results
- [ ] Clearing search shows all products
- [ ] Search persists after page refresh

---

## Quick Batch Test Script

Copy and paste into DevTools Console:

```javascript
async function runAllTests() {
  console.log('=== PHASE 7 TEST SUITE ===\n');
  
  // Import modules
  const { debounce } = await import('./js/utils/debounce.js');
  const { selectProducts, selectProductsBySearch } = await import('./js/core/selectors.js');
  const { initSearchInput, getSearchQuery } = await import('./js/components/SearchInput.js');
  const { getAPI } = await import('./js/core/api.js');
  const { getState } = await import('./js/core/state.js');
  
  // Load products
  const products = await getAPI('/products');
  
  console.log('✅ Modules imported');
  console.log('✅ Products loaded:', products.length);
  
  // Test debounce
  let callCount = 0;
  const debouncedFn = debounce(() => callCount++, 100);
  debouncedFn();
  debouncedFn();
  debouncedFn();
  
  setTimeout(() => {
    console.log('✅ Debounce test: called 3x, executed', callCount, 'time(s)');
  }, 150);
  
  // Test selectors
  const searchResults = selectProductsBySearch(products, 'Polo');
  console.log('✅ Search "Polo":', searchResults.length, 'results');
  
  // Test empty search
  const emptyResults = selectProductsBySearch(products, 'NONEXISTENT');
  console.log('✅ Search "NONEXISTENT":', emptyResults.length, 'results');
  
  // Test filter combination
  const combined = selectProducts(products, {
    search: 'Áo',
    categories: ['tops']
  });
  console.log('✅ Combined filter (Áo + tops):', combined.length, 'results');
  
  // Initialize search input
  initSearchInput();
  console.log('✅ SearchInput initialized');
  
  // Test search query getter
  const input = document.getElementById('search-input');
  if (input) {
    input.value = 'TestQuery';
    const query = getSearchQuery();
    console.log('✅ Search query getter:', query);
  }
  
  console.log('\n✅ ALL TESTS COMPLETED');
}

// Run tests
runAllTests().catch(console.error);
```

**Expected Console Output**:
```
=== PHASE 7 TEST SUITE ===

✅ Modules imported
✅ Products loaded: 44
✅ Debounce test: called 3x, executed 1 time(s)
✅ Search "Polo": 3 results
✅ Search "NONEXISTENT": 0 results
✅ Combined filter (Áo + tops): 8 results
✅ SearchInput initialized
✅ Search query getter: TestQuery

✅ ALL TESTS COMPLETED
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "[SearchInput] not found" | Missing #search-input element | Add to HTML: `<input id="search-input" />` |
| No console logs on type | initSearchInput() not called | Call `initSearchInput()` in app initialization |
| Debounce not working | Multiple debouncedFn instances | Use single debounced function instance |
| Search returns all products | Empty query after trim | Check query.trim() in console |
| Filter results wrong count | Wrong filter combination | Check filters object structure |
| Performance slow | Large product list | Increase debounce delay to 500ms |

---

## Manual UI Testing

### Scenario 1: Basic Search
1. Navigate to shop page
2. Type "Polo" in search
3. Verify: Only Polo products show
4. Delete text
5. Verify: All products return

### Scenario 2: Search + Filter
1. Select category filter: "Tops"
2. Type search: "Áo"
3. Verify: Shows only tops with "Áo"
4. Clear search
5. Verify: Shows all tops

### Scenario 3: Responsive Search
1. Open on mobile/tablet view
2. Type in search (test debounce)
3. Verify: Smooth performance, no lag

### Scenario 4: Search with No Results
1. Type "ZZZZ"
2. Verify: Empty state message shows
3. Type valid product name
4. Verify: Results appear

---

## Success Criteria Summary

All of the following must be ✅:
- Debounce executes searched function only once per 300ms
- Search is case-insensitive
- Empty query shows all products
- Special characters handled safely
- Filters combine with search correctly
- State updates on search
- Custom 'search' event fires
- No console errors
- Performance < 50ms for filter
- localStorage persists search query

