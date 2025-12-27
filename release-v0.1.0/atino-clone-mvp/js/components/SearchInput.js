/**
 * SearchInput Component
 * Handles search input interactions and triggers product filtering
 */

import { debounce } from '../utils/debounce.js';
import { getState, setSearchQuery } from '../core/state.js';
import { selectProducts } from '../core/selectors.js';

/**
 * Initialize search input component
 * Attaches event listeners and sets up debounced search handler
 */
export function initSearchInput() {
  const searchInput = document.getElementById('search-input');

  if (!searchInput) {
    console.warn('[SearchInput] Search input element not found (#search-input)');
    return;
  }

  // Create debounced search handler
  const debouncedSearch = debounce(handleSearch, 300);

  // Attach event listener
  searchInput.addEventListener('input', (event) => {
    debouncedSearch(event);
  });

  console.log('[SearchInput] Initialized');
}

/**
 * Handle search input changes
 * @param {Event} event - Input event
 */
function handleSearch(event) {
  const searchQuery = event.target.value.trim();

  // Update search query in state
  setSearchQuery(searchQuery);

  // Get updated state
  const state = getState();

  // Log search action
  console.log('[SearchInput] Searching for:', searchQuery || '(all products)');

  // Dispatch custom event for search results update
  // Components can listen for this event to update UI
  const searchEvent = new CustomEvent('search', {
    detail: {
      query: searchQuery,
      filters: state.filters,
    },
  });

  document.dispatchEvent(searchEvent);
}

/**
 * Clear search input
 */
export function clearSearchInput() {
  const searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.value = '';
    setSearchQuery('');
    
    // Dispatch search event to clear results
    const searchEvent = new CustomEvent('search', {
      detail: {
        query: '',
        filters: getState().filters,
      },
    });

    document.dispatchEvent(searchEvent);
  }
}

/**
 * Get current search query from input
 * @returns {string} Current search query
 */
export function getSearchQuery() {
  const searchInput = document.getElementById('search-input');
  return searchInput ? searchInput.value.trim() : '';
}

/**
 * Set search input value
 * @param {string} query - Search query to set
 */
export function setSearchInputValue(query) {
  const searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.value = query;
    setSearchQuery(query);
  }
}
