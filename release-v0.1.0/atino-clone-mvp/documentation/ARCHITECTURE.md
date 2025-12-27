## SPA Architecture & Testing Guide

### Architecture Overview

This project has been refactored into a **View-Based Single Page Application (SPA)** with hash-based routing and modular state management.

### Project Structure

```
atino-clone-mvp/
├── css/
│   ├── main.css                 # Orchestrator (@import hub)
│   ├── variables.css            # Design tokens
│   ├── base.css                 # Global resets, typography
│   ├── layout.css               # Header, footer, container, view sections
│   ├── components.css           # Reusable UI components
│   ├── modules/
│   │   ├── cart-drawer.css      # Shopping cart panel
│   │   └── modal.css            # Product quick-view modal
│   └── views/
│       ├── home.css             # Landing page styling
│       └── shop.css             # Shop page styling
├── js/
│   ├── app.js                   # Application entry point
│   ├── core/
│   │   ├── router.js            # View switching & hash routing
│   │   ├── api.js               # JSON Server fetch wrapper
│   │   └── state.js             # Global state management
│   ├── views/
│   │   ├── homeView.js          # Home page (hero + categories)
│   │   └── shopView.js          # Shop page (products + filters)
│   └── utils/
│       ├── format.js            # Number/date formatting
│       └── storage.js           # LocalStorage helpers
├── assets/
│   ├── images/
│   │   ├── tops/                # T-shirt/shirt images
│   │   ├── bottoms/             # Pants/shorts images
│   │   └── accessories/         # Hats/shoes/bags images
│   └── favicon.ico
├── index.html                   # Single-page entry point
├── mock-backend/
│   └── db.json                  # Mock database (JSON Server)
└── README.md
```

### Key Concepts

#### 1. **View-Based Architecture**
- Each view is a separate module (homeView, shopView)
- Each view has a `.render(params)` function
- Views are mounted into corresponding `<section id="*-view">` containers
- Router controls which view is visible

#### 2. **Hash-Based Routing**
- `#/` → Home page
- `#/shop` → Shop page (product listing)
- `#/about` → About page
- `#/contact` → Contact page
- Query params: `#/shop?category=tops&search=query`

#### 3. **Deep Linking**
Users can click a category on the home page and it automatically filters the shop view:
```
Home Page (Hero + Categories)
    ↓ Click "Tops" category
    ↓ Category click handler: router.navigate('/shop', {category: 'tops'})
    ↓ Router changes hash to #/shop?category=tops
    ↓ Hash change listener triggers shopView.render({category: 'tops'})
    ↓ Shop view receives params and pre-selects the "Tops" filter
    ↓ Only top products displayed
```

#### 4. **State Management**
- Centralized in `js/core/state.js`
- Persisted to LocalStorage with key `atino-shop-state`
- Managed properties:
  - `products`: All product data
  - `cart`: Shopping cart items
  - `filters`: Current filter selections
  - `search`: Current search query

#### 5. **Module Communication**
```
app.js (Entry Point)
  ├── Initializes: router, state, event listeners
  └── Imports: router.js, homeView, shopView, state.js
  
router.js (Navigation)
  ├── Listens to: hashchange events
  ├── Controls: View visibility, view rendering
  └── Exports: switchView(), navigate(), getCurrentView()
  
homeView.js (Landing Page)
  ├── Renders: Hero section, category cards
  ├── Listens to: Category card clicks
  └── Exports: render(params)
  
shopView.js (Product Listing)
  ├── Fetches: Products from JSON Server
  ├── Applies: Filters, search, category pre-selection
  ├── Listens to: Filter changes, "View Product", "Add to Cart"
  └── Exports: render(params)
  
state.js (Data Store)
  ├── Manages: Cart, filters, search, products
  ├── Persists to: LocalStorage
  └── Exports: getCart(), addToCart(), setFilters(), etc.
```

---

## Development & Testing

### 1. Start Mock Backend (JSON Server)

```bash
# From project root directory
cd mock-backend
npx json-server --watch db.json --port 3000
```

Expected output:
```
  ✓ Watching db.json...
  ✓ Resources
    http://localhost:3000/products
    http://localhost:3000/categories
```

**Keep this terminal open** while developing.

### 2. Serve Frontend Files

**Option A: VS Code Live Server Extension**
1. Right-click `index.html`
2. Select "Open with Live Server"
3. Browser opens to `http://127.0.0.1:5500/index.html`

**Option B: Python Simple HTTP Server**
```bash
# From project root
python -m http.server 5000

# Then visit: http://localhost:5000
```

**Option C: Node.js HTTP Server**
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Serve from project root
http-server -p 5000

# Then visit: http://localhost:5000
```

### 3. Test Navigation Routes

Open browser Developer Console (F12) to see router logs.

#### Route Tests

| Route | Expected Behavior |
|-------|-------------------|
| `http://localhost:5500/index.html` | Home view loads with hero section & featured categories |
| `http://localhost:5500/index.html#/` | Same as above |
| `http://localhost:5500/index.html#/shop` | Shop view loads with all products |
| `http://localhost:5500/index.html#/shop?category=tops` | Shop view loads with "Tops" pre-filtered |
| `http://localhost:5500/index.html#/about` | About page placeholder |
| `http://localhost:5500/index.html#/contact` | Contact page placeholder |

### 4. Test Deep Linking (Category → Shop Filter)

1. **Navigate to home:** `#/`
2. **Click "Áo" (Tops) category card** on the featured categories section
3. **Browser URL should change to:** `#/shop?category=tops`
4. **Shop page should display only "Tops" products** with checkbox pre-checked
5. **Console should show:**
   ```
   [Router] Switched to view: shop {category: 'tops'}
   [ShopView] Rendered {filtered: 15}
   ```

### 5. Test Cart Functionality

#### Add Product to Cart
1. **Go to shop page** (`#/shop`)
2. **Click "Thêm Giỏ" (Add to Cart) button** on any product
3. **Verify:**
   - Cart icon shows count: (1)
   - Button text changes to "Đã Thêm!" then back
   - Console logs: `[State] Added to cart: [Product Name] Qty: 1`

#### View Cart
1. **Click cart icon** in header
2. **Cart drawer slides in from right**
3. **Verify:**
   - Product shows with image, name, price
   - Subtotal, shipping, tax, total calculated
   - "Thanh Toán" button visible

#### Update Cart Quantity
1. **With cart open, change quantity** in cart item
2. **Cart summary updates immediately**

#### Remove from Cart
1. **Click trash icon** on cart item
2. **Item removed instantly**
3. **Cart count updates**
4. **Cart summary recalculates**

### 6. Test Filters

#### Category Filter
1. **Go to shop** (`#/shop`)
2. **Check "Áo" checkbox** in sidebar
3. **Verify:** Only Tops products display
4. **Check "Quần" checkbox** also
5. **Verify:** Both Tops and Bottoms display

#### Price Filter
1. **Check "Dưới 200k" checkbox**
2. **Verify:** Only products with price < 200,000 VND display

#### Status Filter
1. **Check "Giảm giá" checkbox**
2. **Verify:** Only discounted products display

#### Reset Filters
1. **Click "Xóa bộ lọc" button**
2. **Verify:** All checkboxes unchecked, all products display

### 7. Test Search

#### Header Search
1. **Type product name** in header search box (e.g., "Áo Sơ Mi")
2. **Press Enter or click search button**
3. **Router navigates to:** `#/shop?search=Áo%20Sơ%20Mi`
4. **Shop view filters products** by name/description match

### 8. Test Modal (Quick View)

1. **Click "Xem Chi Tiết" button** on any product
2. **Modal opens with:**
   - Product image (main + thumbnails)
   - Product name, description, price
   - Size and color options (if available)
   - "Thêm Vào Giỏ" button
3. **Click thumbnail images:** Main image updates
4. **Click "Thêm Vào Giỏ":** Product added, modal closes
5. **Click outside modal or X button:** Modal closes

### 9. Test Persistence (LocalStorage)

#### Cart Persistence
1. **Add products to cart**
2. **Close browser tab**
3. **Reopen URL**
4. **Verify:** Cart items still present
5. **Clear browser cache → localStorage cleared**

### 10. Test Responsive Design

#### Mobile (480px)
```bash
# In Chrome DevTools: Ctrl+Shift+M (Windows) or Cmd+Shift+M (Mac)
```

- [ ] Header navigation collapses (search disappears)
- [ ] Sidebar moves above products
- [ ] Product grid shows 2 columns
- [ ] Footer shows 1 column

#### Tablet (768px)
- [ ] Header shows all nav links
- [ ] 2-column layout: sidebar + products
- [ ] Product grid shows 3 columns

### 11. Test API Connectivity

#### Check Products Endpoint
```bash
curl http://localhost:3000/products | jq '.[0]'
```

Expected response (first product):
```json
{
  "id": 1,
  "name": "Áo Phông Nam Basic",
  "category": "tops",
  "price": 150000,
  "originalPrice": 0,
  "images": [
    "assets/images/tops/p-t-shirt-01-white.jpg",
    "assets/images/tops/p-t-shirt-01-black.jpg"
  ],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Trắng", "Đen", "Xanh"],
  ...
}
```

#### Check Categories Endpoint
```bash
curl http://localhost:3000/categories | jq '.[] | {id, name}'
```

Expected: Array of 20 categories

### 12. Test Browser DevTools

#### Console Logs
Open F12 → Console tab and look for:
- `[Router] Initialized`
- `[State] Initialized`
- `[App] Ready`
- `[Router] Switched to view: home`
- `[API] GET /products: [...]`

#### Network Tab
- [ ] All images load from `/assets/images/*`
- [ ] API calls to `http://localhost:3000/products`
- [ ] No failed CORS errors

#### Application Tab → LocalStorage
- [ ] `atino-shop-state` key exists after adding to cart
- [ ] Contains JSON: `{products, cart, filters, search}`

---

## Debugging Checklist

### If Home Page Doesn't Load
1. Check browser console for errors
2. Verify router.js initializes (look for `[Router] Initialized`)
3. Confirm homeView.js renders (look for `[HomeView] Rendered`)
4. Check network tab: no 404s for files

### If Shop Page Blank
1. Verify JSON Server is running (`http://localhost:3000/products`)
2. Check console for API errors
3. Look for `[ShopView] Rendered` message
4. If filters don't show: CSS not loaded (check main.css @imports)

### If Cart Not Persisting
1. Open DevTools → Application → Storage → LocalStorage
2. Look for key: `atino-shop-state`
3. If missing: state.js not calling `saveState()`
4. Check browser privacy settings (might block localStorage)

### If Navigation Doesn't Work
1. Check for JavaScript errors in console
2. Verify router.js hashchange listener attached
3. Check that URLs use `#/` format (not `/`)
4. Try manually changing hash: Press F12, go to console, type:
   ```javascript
   window.location.hash = '#/shop'
   ```
   Should navigate to shop view

---

## Testing Commands Summary

```bash
# Terminal 1: Start JSON Server
cd mock-backend
npx json-server --watch db.json --port 3000

# Terminal 2: Test product API
curl http://localhost:3000/products

# Terminal 3: Test categories API
curl http://localhost:3000/categories

# Test specific product
curl http://localhost:3000/products/1

# Test filter by category
curl "http://localhost:3000/products?category=tops"

# Count products by category
curl http://localhost:3000/products | jq '[.[] | .category] | group_by(.) | map({category: .[0], count: length})'
```

---

## User Flow Walkthrough

### Complete Shopping Journey

1. **User Lands on Home:**
   - URL: `localhost:5500/index.html`
   - Views: Hero banner + 3 featured categories
   - Can scroll to see categories, "Shop Now" button

2. **User Clicks "Tops" Category:**
   - URL changes to: `#/shop?category=tops`
   - Router triggers shopView.render({category: 'tops'})
   - Shop sidebar: "Áo" checkbox pre-checked
   - Products grid: Only 15 Tops products displayed
   - Console: `[Router] Switched to view: shop {category: 'tops'}`

3. **User Filters by Price:**
   - Checks "Dưới 200k" filter
   - Grid updates to show only affordable Tops
   - Console: `[State] Filters updated: {categories: [...], priceRanges: [...]}`

4. **User Searches for Product:**
   - Types "Sơ Mi" in header search
   - Presses Enter
   - URL: `#/shop?search=Sơ%20Mi`
   - Grid shows only matching Tops products

5. **User Views Product Details:**
   - Clicks "Xem Chi Tiết" button
   - Modal opens with full product info
   - Can browse images using thumbnails
   - Clicks "Thêm Vào Giỏ"
   - Modal closes, product in cart

6. **User Checks Cart:**
   - Clicks cart icon
   - Cart drawer opens from right
   - Shows 1 item with subtotal/tax/total
   - Can modify quantity or remove

7. **User Continues Shopping:**
   - Closes cart drawer
   - Adds more products from shop
   - Cart count increases

8. **User Leaves Site:**
   - Closes browser
   - Next day, returns to site
   - Cart items still there (persisted in localStorage)

---

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Semantic structure | - |
| CSS3 | Styling, variables, flexbox, grid | - |
| JavaScript ES6+ | Core logic, modules | - |
| JSON Server | Mock backend | Latest |
| LocalStorage | Cart persistence | Browser native |

## Performance Notes

- **Code Splitting:** Not used (single app.js entry point)
- **Lazy Loading:** Images use `loading="lazy"`
- **CSS Optimization:** Variables reduce bundle size
- **State Caching:** LocalStorage reduces API calls for cart
- **No Frameworks:** Vanilla JS = fast load time

---

*Last Updated: 2024*
