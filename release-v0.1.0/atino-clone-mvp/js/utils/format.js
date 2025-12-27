/**
 * Utility functions for formatting data
 */

/**
 * Format number as Vietnamese currency (VND)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price (e.g., "499.000 ₫")
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Vietnamese locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date (e.g., "15/12/2024")
 */
export function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export function truncateText(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format category name for display
 * @param {string} category - Category slug (e.g., 'best-seller')
 * @returns {string} Formatted category name (e.g., 'Best Seller')
 */
export function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}

export default {
  formatPrice,
  formatDate,
  truncateText,
  capitalize,
  formatCategoryName,
};
