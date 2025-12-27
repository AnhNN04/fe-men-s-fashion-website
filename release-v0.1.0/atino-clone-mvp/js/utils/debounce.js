/**
 * Debounce Utility
 * Delays function execution until the specified delay has passed since the last call
 */

/**
 * Create a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId;

  return function debounced(...args) {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Create a debounced function with leading edge option
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Configuration options
 * @param {boolean} options.leading - Call function immediately on first call (default: false)
 * @returns {Function} Debounced function
 */
export function debounceWithOptions(func, delay = 300, options = {}) {
  let timeoutId;
  let lastCallTime = 0;
  const { leading = false } = options;

  return function debounced(...args) {
    const now = Date.now();
    const isFirstCall = lastCallTime === 0;

    if (leading && isFirstCall) {
      func.apply(this, args);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    lastCallTime = now;

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      lastCallTime = 0;
    }, delay);
  };
}
