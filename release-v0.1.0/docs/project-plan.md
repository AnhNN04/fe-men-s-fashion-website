# Project Plan & Task Distribution (v2)

## Project Overview
- **Project**: Atino Clone MVP  
- **Tech**: Vanilla JS, CSS3  
- **Duration**: 3 Days  

---

## 1. Role Assignment

### 👨‍💻 Developer A — UI & Rendering Lead
- **Focus**: HTML Structure, CSS Styling, DOM Rendering  
- **Key Tasks**: Layouts, Grid, Cart Drawer, Search Input UI  

### 👨‍💻 Developer B — Logic & State Lead
- **Focus**: Data, State Management, Filtering Logic  
- **Key Tasks**: `products.json`, Filtering/Sorting algorithms, Search Logic, Cart Calculations  

---

## 2. Daily Sprint Schedule

### 🗓 Day 1 — Foundation & Core Structure

| Time      | Developer A (UI)                                                                 | Developer B (Logic)                                                        |
|-----------|----------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| Morning   | Setup `index.html`, `variables.css`. Build Header (Nav + Search Input) & Hero.   | Create `products.json`. Write `api.js`. Setup `store.js` (State).          |
| Afternoon | Build Product Grid Layout & Product Card CSS. Sidebar CSS.                      | Write pure JS logic: `filterByCategory`, `filterByPrice`, `searchByName(products, query)`. |

---

### 🗓 Day 2 — Integration & Interaction

| Time      | Developer A (UI)                                                     | Developer B (Logic)                                      |
|-----------|----------------------------------------------------------------------|----------------------------------------------------------|
| Morning   | Dynamic Rendering: Connect `renderProducts()` to Store. Hook up Search Input Event Listener. | Cart Logic Core: `addToCart`, `removeFromCart`. |
| Afternoon | Build Cart Drawer UI (Slide-out). Style Cart Items.                  | Connect "Add to Cart" buttons to Logic. Calculate Totals. |

---

### 🗓 Day 3 — Polish & Persistence

| Time      | Developer A (UI)                                             | Developer B (Logic)                                      |
|-----------|--------------------------------------------------------------|----------------------------------------------------------|
| Morning   | Product Detail Modal UI. Size/Color active states.           | `localStorage` integration (`saveCart`, `loadCart`).     |
| Afternoon | Mobile Responsiveness Check. "No Results" Empty State.       | Refactoring, Comments, Final Testing.                    |

---

## 3. Folder Structure (Strict)

```text
/atino-clone-mvp
│
├── index.html
├── styles/
│   ├── main.css
│   ├── layout.css        # Includes Header/Search styles
│   └── components.css    # Cards, Modal, Drawer
├── js/
│   ├── data/
│   │   └── products.json
│   ├── core/
│   │   ├── api.js
│   │   ├── state.js      # Stores { products, cart, searchQuery }
│   │   └── selectors.js  # Filter logic (Category + Price + Search)
│   └── app.js
