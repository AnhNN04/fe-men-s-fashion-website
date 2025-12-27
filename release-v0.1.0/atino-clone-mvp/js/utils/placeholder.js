/**
 * Placeholder Image Generator
 * Creates placeholder images for products and banners
 */

/**
 * Generate placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display (optional)
 * @param {string} bgColor - Background color in hex (default: #f0f0f0)
 * @returns {string} Placeholder image URL
 */
export function getPlaceholderImage(width = 300, height = 300, text = 'Image', bgColor = 'f0f0f0') {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/666666?text=${encodeURIComponent(text)}`;
}

/**
 * Generate product image placeholders
 * @param {number} count - Number of images
 * @param {string} productName - Product name for text
 * @returns {array} Array of placeholder URLs
 */
export function generateProductImages(count = 3, productName = 'Product') {
  return Array.from({ length: count }, (_, i) => 
    getPlaceholderImage(500, 600, `${productName} - View ${i + 1}`)
  );
}

/**
 * Get hero banner placeholder
 * @returns {string} Banner placeholder URL
 */
export function getHeroBannerPlaceholder() {
  return getPlaceholderImage(1200, 400, 'Hero Banner', 'e8e8e8');
}

/**
 * Get category placeholder
 * @param {string} categoryName - Category name
 * @returns {string} Category placeholder URL
 */
export function getCategoryPlaceholder(categoryName = 'Category') {
  return getPlaceholderImage(300, 300, categoryName, 'f5f5f5');
}

/**
 * Get featured section placeholder
 * @returns {string} Featured section placeholder URL
 */
export function getFeaturedPlaceholder() {
  return getPlaceholderImage(800, 500, 'Featured Products', 'f0f0f0');
}
