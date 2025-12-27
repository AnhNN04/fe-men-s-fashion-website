# Phase 3: Project Architecture Proposal

**Project:** Atino Clone (Static Frontend MVP)  
**Stack:** Vanilla HTML5, CSS3, JavaScript (ES6 Modules)  
**Role:** Senior Frontend Architect

---

## 1. Project Folder Structure

We will use a **Modular Component-Based Structure** adapted for Vanilla JS.  
Even without frameworks like React, we can organize code by **logical components** to keep it maintainable.

```text
/atino-clone-mvp
│
├── mock-backend/
│   └── db.json                 # JSON Server Database
│
├── index.html                  # Single Entry Point (SPA-like shell)
│
├── assets/
│   ├── images/                 # Static banners, placeholders
│   └── icons/                  # SVG icons or sprite.svg
│
├── data/
│   └── products.json           # Mock Database (The "Backend")
│
├── css/
│   ├── main.css                # The "Orchestrator" (imports all others)
│   ├── variables.css           # Design Tokens (Colors, Fonts, Spacing)
│   ├── base.css                # Resets, Typography, Global styles
│   ├── layout.css              # Header, Footer, Grid, Sidebar
│   ├── components.css          # Cards, Buttons, Inputs, Badges
│   └── modules/                # Complex UI specific styles
│       ├── cart-drawer.css
│       └── modal.css
│
└── js/
    ├── app.js                  # Main Application Entry (Bootstrapper)
    │
    ├── core/                   # Business Logic (No DOM code here)
    │   ├── api.js              # Fetch Wrapper & Data Loading
    │   ├── state.js            # Central State Store (Products, Cart, Search)
    │   └── selectors.js        # Logic for Filtering & Searching
    │
    ├── components/             # UI Rendering (DOM Manipulation)
    │   ├── Header.js           # Updates Cart Badge, Nav
    │   ├── SearchInput.js      # Handles Search Bar Events
    │   ├── ProductList.js      # Renders Grid of Product Cards
    │   ├── Sidebar.js          # Renders Filters
    │   ├── ProductModal.js     # Handles Quick View Overlay
    │   └── CartDrawer.js       # Handles Side-Cart Rendering
    │
    └── utils/
        ├── format.js           # Currency (VND) formatter
        └── storage.js          # LocalStorage wrappers
```


### Key Folder Explanations

- **js/core/**  
  This is the **"brain"** of the application.  
  It handles data and business logic and has **no knowledge of HTML**, making it easy to test and maintain.

- **js/components/**  
  This is the **"view"** layer.  
  It receives data from the Core layer and generates HTML strings to inject into the DOM.

- **css/variables.css**  
  The **single source of truth** for the Design System (colors, spacing, fonts).

---

## 2. Mock Backend Strategy

Since there is no real server, `data/products.json` will act as the mock database.

---

### Data Schema (`products.json`)

The data structure is intentionally **flat**, optimized for client-side filtering and searching.

```json
{
  "products": [
    {
      "id": "p_001",
      "name": "Áo Polo Basic Slimfit - Black",
      "category": "polo",
      "price": 350000,
      "original_price": 450000,
      "image": "https://placehold.co/600x800/333/fff?text=Polo+Black",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "Navy", "White"],
      "tags": ["new", "best-seller"]
    },
    {
      "id": "p_002",
      "name": "Quần Jeans Slim Fit - Blue",
      "category": "jeans",
      "price": 550000,
      "original_price": null,
      "image": "https://placehold.co/600x800/2980b9/fff?text=Jeans+Blue",
      "sizes": ["29", "30", "31", "32"],
      "colors": ["Blue"],
      "tags": []
    }
  ]
}
```

### Assets Strategy

-   **Images**  
    Use `placehold.co` URL strings in the JSON to ensure consistent image dimensions (`600x800`).
    
-   **Icons**  
    Use **Phosphor Icons** (via CDN in `index.html`) or **FontAwesome** to keep the repository lightweight.

## 3. Separation of Responsibilities

To avoid **"Spaghetti Code"**, strict boundaries are defined between layers.

---

### A. HTML (`index.html`)

**Responsibility:**  
Provides the **semantic skeleton** of the application.

**Contains:**
- `<header>` with empty containers for badges
- `<main>` with an empty `<div id="product-grid">`
- `<aside>` for filters
- Dialog / modal containers (hidden by default)

**Rule:**  
HTML does **not** contain product data.  
It only defines layout and semantic containers.

---

### B. CSS

**Responsibility:**  
Visual representation and layout.

**Contains:**
- Responsive logic (`@media`)
- Visual states (`.hidden`, `.active`, `:hover`)
- Design System variables

**Rule:**  
CSS classes define animations and visual states (e.g. `.cart-open`).  
JavaScript is only responsible for toggling class names.

---

### C. JavaScript

**Responsibility:**  
Interactivity and data binding.

**Flow:**
1. **Fetch** → `api.js` loads JSON data
2. **Store** → `state.js` saves application state
3. **Render** → `ProductList.js` generates HTML

**Example rendering logic:**

```js
container.innerHTML = products.map(p => `
  <div class="card">
    <img src="${p.image}">
    <h3>${p.name}</h3>
  </div>
`).join('');
```


**Listen:**  
`SearchInput.js` listens for user input, filters the state, and triggers a re-render.

----------

## 4. Why This Architecture?

### MVP-Oriented

-   No build step (Webpack / Vite) required
    
-   Runs directly using **Live Server**
    

### Separation of Concerns

-   Core logic is isolated from UI components
    
-   Core can be largely reused if migrating to React or Vue
    

### Extensibility

-   Add a **Checkout** feature →  
    `js/components/Checkout.js` + `css/modules/checkout.css`
    
-   Switch to a real API →  
    Update `js/core/api.js` only
    

### Search & Filter Friendly

-   Centralized state management (`state.js`)
    
-   Filtering by category and searching by name operate on the same data source before rendering
    

----------

## Next Steps

The project is ready for implementation.

**Recommended execution order:**

1.  **Setup** → Create folder tree and dummy files
    
2.  **Mock Data** → Create `products.json`
    
3.  **Core Logic** → Implement `api.js` and `state.js`
    
4.  **UI Foundation** → Build HTML skeleton and CSS variables