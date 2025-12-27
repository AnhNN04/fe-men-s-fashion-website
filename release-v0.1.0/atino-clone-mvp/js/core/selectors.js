/**
 * Selectors Module - Product filtering and selection logic
 * Provides functions to filter products based on various criteria
 */

/**
 * Search products by name (case-insensitive)
 * @param {Array} allProducts - Array of all products
 * @param {string} query - Search query
 * @returns {Array} Filtered products
 */
export function selectProductsBySearch(allProducts, query) {
  if (!query || typeof query !== 'string') {
    return allProducts;
  }

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return allProducts;
  }

  return allProducts.filter(product => {
    const name = (product.name || '').toLowerCase();
    const description = (product.shortDescription || '').toLowerCase();
    
    return name.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
}

/**
 * Filter products by category
 * @param {Array} allProducts - Array of all products
 * @param {Array} categories - Array of category IDs to filter by
 * @returns {Array} Filtered products
 */
export function selectProductsByCategory(allProducts, categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return allProducts;
  }

  return allProducts.filter(product => 
    categories.includes(product.category)
  );
}

/**
 * Filter products by price range
 * @param {Array} allProducts - Array of all products
 * @param {Array} priceRanges - Array of price range strings (e.g., ['0-100000', '100000-500000'])
 * @returns {Array} Filtered products
 */
export function selectProductsByPrice(allProducts, priceRanges) {
  if (!Array.isArray(priceRanges) || priceRanges.length === 0) {
    return allProducts;
  }

  return allProducts.filter(product => {
    return priceRanges.some(range => {
      const [min, max] = range.split('-').map(Number);
      return product.price >= min && product.price <= max;
    });
  });
}

/**
 * Filter products by status tags
 * @param {Array} allProducts - Array of all products
 * @param {Array} statuses - Array of status tags ('sale', 'new', 'best-seller')
 * @returns {Array} Filtered products
 */
export function selectProductsByStatus(allProducts, statuses) {
  if (!Array.isArray(statuses) || statuses.length === 0) {
    return allProducts;
  }

  return allProducts.filter(product => {
    return statuses.some(status => {
      if (status === 'sale' && product.originalPrice && product.originalPrice > product.price) {
        return true;
      }
      if (status === 'new' && product.tags && product.tags.includes('new')) {
        return true;
      }
      if (status === 'best-seller' && product.tags && product.tags.includes('best-seller')) {
        return true;
      }
      return false;
    });
  });
}

/**
 * Apply multiple filters to products
 * @param {Array} allProducts - Array of all products
 * @param {Object} filters - Filter object
 * @param {string} filters.search - Search query
 * @param {Array} filters.categories - Category IDs
 * @param {Array} filters.priceRanges - Price ranges
 * @param {Array} filters.statuses - Status tags
 * @returns {Array} Filtered products
 */
export function selectProducts(allProducts, filters = {}) {
  if (!Array.isArray(allProducts) || allProducts.length === 0) {
    return [];
  }

  let filtered = allProducts;

  // Apply search filter
  if (filters.search) {
    filtered = selectProductsBySearch(filtered, filters.search);
  }

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = selectProductsByCategory(filtered, filters.categories);
  }

  // Apply price filter
  if (filters.priceRanges && filters.priceRanges.length > 0) {
    filtered = selectProductsByPrice(filtered, filters.priceRanges);
  }

  // Apply status filter
  if (filters.statuses && filters.statuses.length > 0) {
    filtered = selectProductsByStatus(filtered, filters.statuses);
  }

  return filtered;
}

/**
 * Get unique tags from products
 * @param {Array} products - Array of products
 * @returns {Array} Array of unique tag objects
 */
export function selectUniqueTags(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  const tagMap = new Map();

  products.forEach(product => {
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            id: tag,
            name: capitalizeTag(tag),
            count: 0,
          });
        }
        tagMap.get(tag).count += 1;
      });
    }
  });

  return Array.from(tagMap.values());
}

/**
 * Capitalize tag name for display
 * @param {string} tag - Tag string (e.g., 'best-seller')
 * @returns {string} Capitalized tag (e.g., 'Best Seller')
 */
function capitalizeTag(tag) {
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Sort products
 * @param {Array} products - Array of products
 * @param {string} sortBy - Sort criteria ('name-asc', 'name-desc', 'price-asc', 'price-desc', 'newest')
 * @returns {Array} Sorted products
 */
export function selectProductsSorted(products, sortBy = '') {
  if (!Array.isArray(products) || !sortBy) {
    return products;
  }

  const sorted = [...products];

  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'name-desc':
      sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    default:
      return products;
  }

  return sorted;
}
