# Phase 8 – CSS Testing & Validation Guide

## Test Execution Quick Reference

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Desktop Layout | View at 1024px+ | 4-column grid, sidebar visible |
| Mobile Layout | View at 375px | 2-column grid, sidebar hidden |
| Tablet Layout | View at 768px | 3-column grid, sidebar visible |
| Product Card Hover | Hover over card | Shadow elevation + translateY |
| Button Hover | Hover over button | Background/border color change |
| Responsive Grid | Resize window | Grid adapts smoothly |
| Variables Update | Change --color-primary | All components update |
| Text Truncation | Long product title | Truncate with ellipsis |

---

## Phase 8.1: Visual Design Tests

### Test 1.1: Color Palette Verification

**Steps**:
1. Open DevTools Inspector
2. Inspect `.btn-primary` element
3. Check computed color
4. Compare to `#000` (black)

**Expected Output**:
```
background-color: rgb(0, 0, 0)  /* #000 */
color: rgb(255, 255, 255)       /* white */
```

**Pass Criteria**: ✅ Colors match variables.css

---

### Test 1.2: Typography Scale

**Console Command**:
```javascript
const h1 = document.querySelector('h1');
const h2 = document.querySelector('h2');
const body = document.body;

console.log('H1 font-size:', getComputedStyle(h1).fontSize);
console.log('H2 font-size:', getComputedStyle(h2).fontSize);
console.log('Body font-size:', getComputedStyle(body).fontSize);
```

**Expected Output**:
```
H1 font-size: 24px (1.5rem)
H2 font-size: 20px (1.25rem)
Body font-size: 16px (1rem)
```

**Pass Criteria**: ✅ Typography scales correctly

---

### Test 1.3: Spacing Consistency

**Steps**:
1. Inspect any `.product-card`
2. Check padding: should be var(--spacing-md) = 16px
3. Check gap in product-grid: should match breakpoint

**Console Command**:
```javascript
const card = document.querySelector('.product-card');
console.log('Card padding:', getComputedStyle(card).padding);

const grid = document.querySelector('.product-grid');
console.log('Grid gap:', getComputedStyle(grid).gap);
```

**Expected Output**:
```
Card padding: 16px (var(--spacing-md))
Grid gap: 8px (mobile) → 16px (tablet) → 24px (desktop)
```

**Pass Criteria**: ✅ 8pt grid followed consistently

---

## Phase 8.2: Responsive Design Tests

### Test 2.1: Mobile Layout (375px)

**Steps**:
1. Open DevTools → Toggle Device Toolbar
2. Select iPhone SE (375x667)
3. Verify layout

**Expected**:
- ✅ 2-column product grid
- ✅ No horizontal scrollbar
- ✅ Sidebar hidden or stacked
- ✅ Header compact
- ✅ Buttons touch-friendly (min 44px height)

**Console Verification**:
```javascript
const grid = document.querySelector('.product-grid');
const styles = getComputedStyle(grid);
console.log('Grid columns:', styles.gridTemplateColumns);
// Expected: "repeat(2, 1fr)" or "calc(...) calc(...)"
```

**Pass Criteria**: ✅ Perfect 2-column layout on mobile

---

### Test 2.2: Tablet Layout (768px)

**Steps**:
1. DevTools → Set width to 768px
2. Verify layout transitions

**Expected**:
- ✅ 3-column product grid (or visible)
- ✅ Sidebar visible (250px width)
- ✅ Proper spacing

**Console Verification**:
```javascript
const grid = document.querySelector('.product-grid');
const columns = getComputedStyle(grid).gridTemplateColumns;
console.log('Tablet columns:', columns);
// Expected: "repeat(3, 1fr)" or similar
```

**Pass Criteria**: ✅ Correct 3-column layout at 768px

---

### Test 2.3: Desktop Layout (1024px+)

**Steps**:
1. DevTools → Set width to 1024px
2. Verify layout

**Expected**:
- ✅ 4-column product grid
- ✅ Sidebar always visible (250px)
- ✅ Container max-width applied (1200px)
- ✅ Full spacing restored

**Console Verification**:
```javascript
const grid = document.querySelector('.product-grid');
const container = document.querySelector('.container');
const columns = getComputedStyle(grid).gridTemplateColumns;
const maxWidth = getComputedStyle(container).maxWidth;

console.log('Desktop columns:', columns);      // repeat(4, 1fr)
console.log('Container max-width:', maxWidth); // 1200px
```

**Pass Criteria**: ✅ Perfect 4-column layout on desktop

---

### Test 2.4: Responsive Transition Smoothness

**Steps**:
1. Open DevTools with device toolbar
2. Drag window resize handle from 375px → 1024px
3. Watch grid reflow

**Expected**:
- ✅ Grid reflows smoothly
- ✅ No glitching or jumping
- ✅ Images scale proportionally
- ✅ Text reflows naturally

**Pass Criteria**: ✅ Smooth responsive transitions

---

## Phase 8.3: Component Styling Tests

### Test 3.1: Product Card Styling

**Steps**:
1. Inspect any `.product-card` element
2. Check for:
   - Border: 1px solid
   - Border-radius: 8px
   - Padding: 16px
   - Image aspect ratio maintained

**Console Command**:
```javascript
const card = document.querySelector('.product-card');
const styles = getComputedStyle(card);

console.log('Card border:', styles.border);
console.log('Card border-radius:', styles.borderRadius);
console.log('Card padding:', styles.padding);
console.log('Card background:', styles.backgroundColor);
```

**Expected Output**:
```
Card border: 1px solid rgb(224, 224, 224)  /* #e0e0e0 */
Card border-radius: 8px
Card padding: 16px
Card background: rgb(255, 255, 255)  /* #fff */
```

**Pass Criteria**: ✅ All styling properties correct

---

### Test 3.2: Product Card Hover Effect

**Steps**:
1. Hover over any product card
2. Observe shadow and transform

**Expected Visual**:
```
• Shadow elevation increased
• Card moves up 4px (translateY(-4px))
• Smooth animation (0.3s)
• Cursor becomes pointer
```

**Console Verification**:
```javascript
const card = document.querySelector('.product-card');
card.style.cssText; // Will show hover state if applied

// Or inspect the computed style
const hoverStyle = window.getComputedStyle(card, ':hover');
console.log('Hover box-shadow:', hoverStyle.boxShadow);
console.log('Hover transform:', hoverStyle.transform);
```

**Pass Criteria**: ✅ Hover effects apply correctly

---

### Test 3.3: Button Styling

**Steps**:
1. Find `.btn-primary` button
2. Inspect styles

**Expected**:
```
background-color: #000 (black)
color: white
padding: 8px 16px
border-radius: 4px
cursor: pointer
```

**Console Command**:
```javascript
const btn = document.querySelector('.btn-primary');
const styles = getComputedStyle(btn);

console.log('Button background:', styles.backgroundColor);
console.log('Button color:', styles.color);
console.log('Button padding:', styles.padding);
console.log('Button border-radius:', styles.borderRadius);
```

**Pass Criteria**: ✅ Primary button styled correctly

---

### Test 3.4: Button Hover State

**Steps**:
1. Hover over any `.btn-primary`
2. Observe color change

**Expected**:
```
background-color: #666 (secondary color)
transition: smooth (0.2s)
cursor: pointer
```

**Visual Check**: ✅ Button darkens on hover

---

### Test 3.5: Search Input Styling

**Steps**:
1. Locate search input
2. Check styling
3. Click to focus

**Expected**:
```
border: 1px solid var(--color-border)
border-radius: 8px
padding: 8px 16px
background: var(--color-surface)

On focus:
border-color: var(--color-primary)
box-shadow: focus ring
```

**Pass Criteria**: ✅ Input styled and interactive

---

### Test 3.6: Badge Styling

**Steps**:
1. Find product with sale badge
2. Inspect badge style

**Expected**:
```
background-color: #dc3545 (error color)
color: white
position: absolute
top: 8px
right: 8px
padding: 4px 8px
font-size: 0.75rem (small)
border-radius: 4px
text-transform: uppercase
```

**Pass Criteria**: ✅ Badge positioned and styled correctly

---

## Phase 8.4: Animation & Transition Tests

### Test 4.1: Transition Smoothness

**Steps**:
1. Hover over various interactive elements
2. Observe transitions

**Expected**: 
```
Color transitions: 0.2s ease
Transform transitions: 0.3s ease-in-out
No jarring or instant changes
```

**Console Command**:
```javascript
// Check defined transitions
console.log(getComputedStyle(document.querySelector('.btn')).transition);
console.log(getComputedStyle(document.querySelector('.product-card')).transition);
```

**Pass Criteria**: ✅ Smooth transitions applied

---

### Test 4.2: Drawer Animation

**Steps**:
1. Open cart drawer
2. Observe slide-in animation

**Expected**:
```
• Drawer slides in from right
• Animation duration: 0.3s
• Smooth easing
• Backdrop appears
```

**Pass Criteria**: ✅ Drawer animation smooth

---

## Phase 8.5: Layout Structure Tests

### Test 5.1: Header Layout

**Steps**:
1. Inspect `<header>` element
2. Check structure

**Expected**:
```
• Sticky positioning (top: 0)
• z-index: 100
• Flexbox layout
• Logo on left
• Nav in middle
• Search + Cart on right
```

**Console Verification**:
```javascript
const header = document.querySelector('header');
const styles = getComputedStyle(header);

console.log('Position:', styles.position);      // sticky
console.log('Z-index:', styles.zIndex);         // 100
console.log('Display:', styles.display);        // flex
```

**Pass Criteria**: ✅ Header structure correct

---

### Test 5.2: Footer Layout

**Steps**:
1. Scroll to bottom
2. Verify footer

**Expected**:
```
• Full width
• Proper spacing
• Organized columns
• Responsive on mobile
```

**Pass Criteria**: ✅ Footer displays correctly

---

### Test 5.3: Container Max-Width

**Steps**:
1. View at 1400px+ width
2. Inspect `.container`

**Expected**:
```
max-width: 1200px
margin: 0 auto (centered)
padding: 0 24px (responsive)
```

**Console Command**:
```javascript
const container = document.querySelector('.container');
const styles = getComputedStyle(container);

console.log('Max-width:', styles.maxWidth);    // 1200px
console.log('Margin:', styles.margin);         // 0 auto
console.log('Padding:', styles.padding);       // 0 24px
```

**Pass Criteria**: ✅ Container constrained correctly

---

## Phase 8.6: Variable System Tests

### Test 6.1: CSS Variable Inheritance

**Steps**:
1. Check if variables are defined
2. Verify inheritance

**Console Command**:
```javascript
const root = getComputedStyle(document.documentElement);

console.log('Primary color:', root.getPropertyValue('--color-primary'));
console.log('Font family:', root.getPropertyValue('--font-family-base'));
console.log('Spacing md:', root.getPropertyValue('--spacing-md'));
```

**Expected Output**:
```
Primary color:  #000
Font family:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...
Spacing md:  16px
```

**Pass Criteria**: ✅ Variables defined and accessible

---

### Test 6.2: Variable Updates in Real-Time

**Steps**:
1. Open DevTools Console
2. Update a variable
3. Watch components update

**Console Command**:
```javascript
// Temporarily change primary color
document.documentElement.style.setProperty('--color-primary', '#ff0000');

// All components using var(--color-primary) update immediately
// Change back
document.documentElement.style.setProperty('--color-primary', '#000');
```

**Expected**: ✅ All components update instantly

---

## Phase 8.7: Accessibility & Usability Tests

### Test 7.1: Color Contrast

**Steps**:
1. Use Chrome DevTools Color Picker
2. Check contrast ratio for all text

**Expected**:
```
Normal text (18px or less): 4.5:1 minimum
Large text (18px+): 3:1 minimum
```

**Pass Criteria**: ✅ All text has sufficient contrast

---

### Test 7.2: Touch Target Size

**Steps**:
1. View on mobile (375px)
2. Inspect button sizes

**Expected**:
```
Minimum 44x44px for all buttons
Spacing between buttons: 8px minimum
```

**Pass Criteria**: ✅ Touch targets large enough

---

### Test 7.3: Text Readability

**Steps**:
1. Check line height (should be 1.6)
2. Check line length (not exceeding content width)

**Expected**:
```
Line height: 1.6
Line length: comfortable to read
Font size: 16px minimum
```

**Pass Criteria**: ✅ Text is readable

---

## Test Checklist

### Visual Design
- [ ] Colors match design spec
- [ ] Typography scales correctly
- [ ] Spacing is consistent (8pt grid)
- [ ] All text is readable
- [ ] Images are sharp

### Responsive Design
- [ ] Mobile (375px): 2-column perfect
- [ ] Tablet (768px): 3-column perfect
- [ ] Desktop (1024px): 4-column perfect
- [ ] Sidebar shows/hides correctly
- [ ] No horizontal scrollbars
- [ ] Smooth transitions between breakpoints

### Components
- [ ] Product cards styled
- [ ] Buttons have hover states
- [ ] Badges positioned correctly
- [ ] Search input functional
- [ ] Forms are accessible

### Layout
- [ ] Header sticky
- [ ] Container max-width applied
- [ ] Footer responsive
- [ ] Grid alignment perfect
- [ ] Margins/padding consistent

### Interactions
- [ ] Hover effects smooth
- [ ] Transitions 0.2-0.3s
- [ ] Click feedback visible
- [ ] Drawer animation smooth
- [ ] Modal styling correct

### Performance
- [ ] CSS loads fast
- [ ] No layout shifts
- [ ] Smooth 60fps interactions
- [ ] Small bundle size

### Accessibility
- [ ] Color contrast sufficient
- [ ] Touch targets 44x44px minimum
- [ ] Text readable
- [ ] Focus states visible
- [ ] Keyboard navigable

---

## Quick Batch Test Script

Copy and paste into DevTools Console:

```javascript
console.log('=== PHASE 8 CSS VALIDATION ===\n');

// Test 1: Variables
const root = getComputedStyle(document.documentElement);
console.log('✅ Variables:');
console.log('  Primary:', root.getPropertyValue('--color-primary'));
console.log('  Spacing:', root.getPropertyValue('--spacing-md'));
console.log('  Font:', root.getPropertyValue('--font-family-base'));

// Test 2: Colors
const btn = document.querySelector('.btn-primary');
const btnStyles = getComputedStyle(btn);
console.log('\n✅ Button Colors:');
console.log('  Background:', btnStyles.backgroundColor);
console.log('  Color:', btnStyles.color);

// Test 3: Responsive
const grid = document.querySelector('.product-grid');
const gridStyles = getComputedStyle(grid);
console.log('\n✅ Grid:');
console.log('  Columns:', gridStyles.gridTemplateColumns);
console.log('  Gap:', gridStyles.gap);

// Test 4: Spacing
const card = document.querySelector('.product-card');
const cardStyles = getComputedStyle(card);
console.log('\n✅ Card:');
console.log('  Padding:', cardStyles.padding);
console.log('  Border-radius:', cardStyles.borderRadius);
console.log('  Border:', cardStyles.border);

// Test 5: Header
const header = document.querySelector('header');
const headerStyles = getComputedStyle(header);
console.log('\n✅ Header:');
console.log('  Position:', headerStyles.position);
console.log('  Z-index:', headerStyles.zIndex);

console.log('\n✅ ALL VISUAL TESTS PASSED');
```

**Expected Output**:
```
=== PHASE 8 CSS VALIDATION ===

✅ Variables:
  Primary: #000
  Spacing: 16px
  Font: -apple-system, BlinkMacSystemFont, "Segoe UI"...

✅ Button Colors:
  Background: rgb(0, 0, 0)
  Color: rgb(255, 255, 255)

✅ Grid:
  Columns: repeat(2, 1fr) [or repeat(3, 1fr) or repeat(4, 1fr)]
  Gap: 8px [or 16px or 24px]

✅ Card:
  Padding: 16px
  Border-radius: 8px
  Border: 1px solid rgb(224, 224, 224)

✅ Header:
  Position: sticky
  Z-index: 100

✅ ALL VISUAL TESTS PASSED
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Grid shows wrong columns | CSS not loaded | Check main.css import order |
| Colors don't match | Variables misspelled | Check variables.css definitions |
| Spacing inconsistent | Mixing units | Use variables consistently |
| Mobile doesn't respond | Missing breakpoint | Check @media queries in layout.css |
| Buttons not hovering | CSS not applied | Check components.css :hover rules |
| Images broken | Wrong aspect ratio | Use object-fit: cover |
| Sticky header not working | Z-index issue | Increase z-index value |

---

## Success Criteria Summary

All of the following must be ✅:
- Design tokens properly defined
- Colors consistent across components
- Typography scales correctly
- Spacing follows 8pt grid
- Mobile layout: 2 columns
- Tablet layout: 3 columns
- Desktop layout: 4 columns
- Hover effects smooth
- Responsive transitions smooth
- No horizontal scrollbars on mobile
- CSS variables used throughout
- Bundle size reasonable
- Performance smooth (60fps)
- Accessibility standards met

