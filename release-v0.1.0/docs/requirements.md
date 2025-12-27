
# Functional & Non-Functional Requirements (v2)

**Project:** Atino Clone - Men's Fashion Store MVP

## 1. Project Overview

The goal is to build a frontend web application replicating the core shopping experience of **Atino.vn**. The application will simulate a real e-commerce site using Vanilla JavaScript and a Mock API for data retrieval.

## 2. Functional Requirements

### 2.1. Navigation & Header

-   **FR-01:** The website must have a responsive navigation bar including: Home, Shop, Collections, and About Us.
    
-   **FR-02:** A persistent "Cart" icon must be visible in the header, displaying a badge with the current number of items.
    

### 2.2. Homepage & Discovery

-   **FR-03:** **Hero Section:** Display a large banner image.
    
-   **FR-04:** **Featured Section:** Display "New Arrival" products fetched from the Mock API.
    

### 2.3. Product Browsing (PLP)

-   **FR-05:** **Product Grid:** Render a list of products dynamically. Each card shows: Image, Name, Price (VND), "Add to Cart".
    
-   **FR-06:** **Filtering:** Users must be able to filter by Category (e.g., Polo, Pants) and Price Range.
    
-   **FR-07:** **Sorting:** Sort by "Price: Low to High" and "High to Low".
    
-   **FR-08 (NEW): Search:** Users can type a product name into a search bar. The grid must instantly filter to show only products matching the text (case-insensitive).
    

### 2.4. Product Detail (Modal)

-   **FR-09:** Clicking a product card opens a **Modal Overlay** showing details.
    
-   **FR-10:** Users must select a Size and Color before adding to the cart.
    

### 2.5. Shopping Cart

-   **FR-11:** **Add to Cart:** Adds item to global state. Merges duplicates (same ID+Size+Color).
    
-   **FR-12:** **Cart View:** Slide-out drawer displaying added items.
    
-   **FR-13:** **Update Quantity:** Increase/Decrease quantity.
    
-   **FR-14:** **Remove Item:** Delete item from cart.
    
-   **FR-15:** **Total Calculation:** Total price updates dynamically.
    

### 2.6. Data Persistence

-   **FR-16:** Save Cart state to `localStorage`.
    

## 3. Technical Constraints

-   **Stack:** HTML5, CSS3, Vanilla JS (ES6+).
    
-   **No Frameworks:** No React, Vue, Tailwind, etc.
    
-   **Data:** Mock `products.json`.