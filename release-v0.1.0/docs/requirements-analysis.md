# Phase 2: Requirements & Gap Analysis (Rev. 3)

## Project Information
- **Project**: Atino Clone (Static Frontend)  
- **Tech Stack**: Vanilla HTML / CSS / JavaScript (No Frameworks)  
- **Role**: Senior Frontend Architect — Analysis  

---

## 1. Functional & Non-Functional Summary

Based on `requirements.md`, `user-stories.md`, and `tech-stack.md`:

### Functional Requirements (Core Features)

**Navigation**
- Responsive header with **Home**, **Shop**, **Collections**, **About**
- Persistent Cart badge

**Search (NEW)**
- **Input**: Simple text input visible in Header or Sidebar  
- **Logic**: Client-side filtering based on **Product Name only**  
- **Behavior**: Instant Product Grid update (no page reload)

**Product Discovery (PLP)**
- Dynamic Product Grid (fetched from JSON)
- Filtering:
  - Category (Polos, Pants, etc.)
  - Price Ranges
- Sorting:
  - Price Low → High
  - Price High → Low

**Product Interaction (PDP)**
- **Modal View**: Clicking a product opens a modal overlay
- **Variant Selection**: User must select Size & Color before adding to cart

**Cart Management**
- Slide-out Drawer UI
- Add to Cart (merge duplicates by `ID + Size + Color`)
- Update Quantity (`+ / -`) and Remove Item
- Live Total Calculation

**Persistence**
- Cart data saved to `localStorage`

---

### Non-Functional Requirements

**Performance**
- Instant filtering and searching (client-side)

**Responsiveness**
- Mobile-first approach  
  - Mobile: 1–2 Columns  
  - Desktop: 4 Columns (per User Stories)

**Code Quality**
- Semantic HTML5
- CSS Variables for theming
- Modular JavaScript (ES6 Modules)

---

## 2. Gap & Contradiction Analysis (Resolved)

All discrepancies have been reconciled as follows:

| Feature       | Source A            | Source B              | Resolution / Recommendation |
|--------------|---------------------|------------------------|-----------------------------|
| Tech Stack   | Phase 1 (React)     | `tech-stack.md` (Vanilla) | Revert to pure HTML5 / CSS3 / Vanilla JS |
| Grid Layout  | Wireframe (3 Col)   | User Stories (4 Col)   | Follow User Stories (4 Columns) |
| Search       | Wireframe (Sidebar) | Requirements (None)   | Scoped in. Simple text input filter using `name.toLowerCase().includes(query)` |
| Product View | Phase 1 (Page)      | Requirements (Modal)  | Modal Overlay to avoid router complexity |
| Checkout     | Wireframe (Button)  | Stories (None)        | Mock only. Button triggers “Success” alert |

---

## 3. Component & Feature Mapping

### A. UI Components (HTML / CSS)

| Requirement | Component / File            | Responsibility |
|------------|-----------------------------|----------------|
| FR-01 (Nav) | `components/Header.js`     | Renders Logo, Navigation, Cart Badge |
| FR-16 (Search) | `components/SearchInput.js` | Renders `<input>` and listens to input events |
| FR-05 (Grid) | `components/ProductCard.js` | Generates HTML string for product cards |
| FR-06 (Filter) | `components/Sidebar.js`  | Renders Category & Price filters |
| FR-08 (Modal) | `components/ProductModal.js` | Hidden by default, populated on product click |
| FR-11 (Cart) | `components/CartDrawer.js` | Slide-out container rendering CartItem list |

---

### B. Logic Modules (JavaScript)

| Requirement    | Module            | Responsibility |
|----------------|-------------------|----------------|
| Data Fetching  | `core/api.js`     | `fetch('/data/products.json')` |
| State Mgmt     | `core/store.js`   | Manages `products`, `cart`, `filters`, `searchQuery` |
| Search Logic   | `core/filter.js`  | `products.filter(p => p.name.includes(query))` |
| Cart Logic     | `core/cart.js`    | `addToCart`, `removeFromCart`, `updateQty`, `saveToStorage` |
