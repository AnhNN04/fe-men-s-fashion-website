
# User Stories & Acceptance Criteria (v2)

**Project:** Atino Clone - Men's Fashion Store MVP

## Epic 1: Browsing & Discovery

### US-01: View Product List

**As a** customer, **I want** to see a grid of latest fashion products, **So that** I can browse the store's collection.

-   **Acceptance Criteria:**
    
    -   Responsive grid (4 cols desktop, 2 cols mobile).
        
    -   Price formatted in VND.
        

### US-02: Filter Products

**As a** customer, **I want** to filter by category and price, **So that** I find relevant items.

-   **Acceptance Criteria:**
    
    -   Clicking "Polo" hides non-polo items.
        
    -   Price range slider/checkbox updates grid.
        

### US-03: Search Products (NEW)

**As a** customer, **I want** to search for a product by name, **So that** I can find a specific item quickly.

-   **Acceptance Criteria:**
    
    -   Search input is visible in the Sidebar or Header.
        
    -   Typing "jeans" immediately shows only products containing "jeans" in the name.
        
    -   If no results found, show "No products found" message.
        

## Epic 2: Product Interaction

### US-04: View Product Details

**As a** customer, **I want** to see details in a popup, **So that** I stay on the same page.

-   **Acceptance Criteria:**
    
    -   Clicking product opens Modal.
        
    -   Must select Size/Color to enable "Add to Cart".
        

## Epic 3: Cart Management

### US-05: Add & Manage Cart

**As a** customer, **I want** to add items and manage quantities, **So that** I can buy exactly what I want.

-   **Acceptance Criteria:**
    
    -   "Add to Cart" updates badge count.
        
    -   Drawer slides out.
        
    -   Duplicate items merge quantities.
        
    -   `LocalStorage` saves cart on reload.