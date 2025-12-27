/**
 * Router Module - Handles view switching and hash-based navigation
 * Supports deep linking with query parameters
 */

import { render as renderHome } from '../views/homeView.js';
import { render as renderShop } from '../views/shopView.js';
import { render as renderAbout } from '../views/aboutView.js';
import { render as renderContact } from '../views/contactView.js';

// Map of view names to their modules
const views = {
  home: { render: renderHome },
  shop: { render: renderShop },
  about: { render: renderAbout },
  contact: { render: renderContact },
};

// Default view when app starts
const DEFAULT_VIEW = 'home';

// Current state
let currentView = null;
let currentParams = {};

/**
 * Initialize router - set up hash change listener
 */
export function initRouter() {
  // Handle initial route on page load
  handleHashChange();
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);
  
  console.log('[Router] Initialized');
}

/**
 * Handle hash change events
 */
function handleHashChange() {
  const hash = window.location.hash.slice(1) || '/'; // Remove # and default to /
  const [route, queryString] = hash.split('?');
  
  // Parse query parameters
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  
  // Extract view name from route (remove leading /)
  const viewName = route === '/' ? 'home' : route.substring(1);
  
  switchView(viewName, params);
}

/**
 * Switch to a different view
 * @param {string} viewName - Name of the view to switch to (home, shop, about, contact)
 * @param {object} params - Optional parameters to pass to the view
 */
export function switchView(viewName, params = {}) {
  // Default to home if view doesn't exist
  const targetView = viewName || 'home';
  
  // Don't switch if already on the same view
  if (currentView === targetView && JSON.stringify(params) === JSON.stringify(currentParams)) {
    return;
  }
  
  // Get the view module
  const viewModule = views[targetView];
  
  // Hide all views
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show target view
  const viewElement = document.getElementById(`${targetView}-view`);
  if (viewElement) {
    viewElement.classList.remove('hidden');
    
    // Render the view if it exists
    if (viewModule && typeof viewModule.render === 'function') {
      const result = viewModule.render(params);
      // Handle async renders
      if (result instanceof Promise) {
        result.catch(err => console.error(`[Router] Error rendering ${targetView}:`, err));
      }
    }
  } else if (!['about', 'contact'].includes(targetView)) {
    // For unknown views, show home
    console.warn(`[Router] View '${targetView}' not found, switching to home`);
    switchView('home', params);
    return;
  }
  
  // Update current state
  currentView = targetView;
  currentParams = params;
  
  // Update document title based on view
  updatePageTitle(targetView);
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  console.log(`[Router] Switched to view: ${targetView}`, params);
}

/**
 * Update page title based on current view
 * @param {string} viewName - Name of the view
 */
function updatePageTitle(viewName) {
  const titles = {
    home: 'Urban Gent - Men\'s Fashion Store',
    shop: 'Shop - Urban Gent',
    about: 'About - Urban Gent',
    contact: 'Contact - Urban Gent',
  };
  
  document.title = titles[viewName] || 'Urban Gent';
}

/**
 * Get current view name
 */
export function getCurrentView() {
  return currentView;
}

/**
 * Get current view parameters
 */
export function getCurrentParams() {
  return { ...currentParams };
}

/**
 * Navigate to a new route
 * @param {string} route - Route path (e.g., '/', '/shop', '/about')
 * @param {object} params - Query parameters to include
 */
export function navigate(route, params = {}) {
  // Build hash URL
  let hash = route.startsWith('#') ? route : `#${route}`;
  
  // Add query parameters
  const queryParts = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  if (queryParts) {
    hash += `?${queryParts}`;
  }
  
  window.location.hash = hash;
}

export default {
  initRouter,
  switchView,
  navigate,
  getCurrentView,
  getCurrentParams,
};
