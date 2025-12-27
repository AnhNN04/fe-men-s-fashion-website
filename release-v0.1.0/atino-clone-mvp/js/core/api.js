/**
 * API Module - Wrapper for fetching data from mock JSON server
 */

const API_BASE = 'http://localhost:3000';

/**
 * Normalize image paths - convert relative paths to absolute
 * @param {string} imagePath - Image path from db.json
 * @returns {string} Normalized image path relative to index.html
 */
function normalizeImagePath(imagePath) {
  if (!imagePath) return '';
  
  // Nếu đã là URL đầy đủ, giữ nguyên
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Nếu là assets/..., giữ nguyên (already relative to index.html)
  if (imagePath.startsWith('assets/')) {
    return imagePath;
  }
  
  // Nếu là /assets/..., loại bỏ slash ở đầu
  if (imagePath.startsWith('/assets/')) {
    return imagePath.substring(1);
  }
  
  // Nếu chỉ có tên file, thêm folder path
  if (!imagePath.includes('/')) {
    return 'assets/images/' + imagePath;
  }
  
  // Default return as is
  return imagePath;
}

/**
 * Process product data - ensure images have correct paths
 * @param {Object|Array} data - Product(s) data
 * @returns {Object|Array} Processed data with normalized image paths
 */
function processProductData(data) {
  if (Array.isArray(data)) {
    return data.map(product => ({
      ...product,
      images: Array.isArray(product.images) 
        ? product.images.map(img => normalizeImagePath(img))
        : []
    }));
  }
  
  if (data && typeof data === 'object') {
    return {
      ...data,
      images: Array.isArray(data.images)
        ? data.images.map(img => normalizeImagePath(img))
        : []
    };
  }
  
  return data;
}

/**
 * Make GET request to API
 * @param {string} endpoint - API endpoint (e.g., '/products', '/categories')
 * @returns {Promise<array|object>} Response data
 */
export async function getAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process product images if this is a products endpoint
    if (endpoint.includes('products')) {
      const processedData = processProductData(data);
      console.log(`[API] GET ${endpoint}:`, processedData);
      return processedData;
    }
    
    console.log(`[API] GET ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Make POST request to API
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @returns {Promise<object>} Response data
 */
export async function postAPI(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] POST ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error posting to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Make PATCH request to API
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @returns {Promise<object>} Response data
 */
export async function patchAPI(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] PATCH ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error patching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Make DELETE request to API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<object>} Response data
 */
export async function deleteAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[API] DELETE ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error deleting ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch all products from the mock backend
 * Phase 5: Primary API function for product data retrieval
 * 
 * @returns {Promise<Array<Product>>} Array of product objects from db.json
 * @throws {Error} Network error or server error
 * 
 * @example
 * try {
 *   const products = await fetchProducts();
 *   console.log(`Loaded ${products.length} products`);
 * } catch (error) {
 *   console.error('Failed to load products:', error);
 * }
 */
export async function fetchProducts() {
  return getAPI('/products');
}

/**
 * Fetch all categories from the mock backend
 * Phase 5: Primary API function for category data retrieval
 * 
 * @returns {Promise<Array<Category>>} Array of category objects from db.json
 * @throws {Error} Network error or server error
 * 
 * @example
 * try {
 *   const categories = await fetchCategories();
 *   console.log(`Loaded ${categories.length} categories`);
 * } catch (error) {
 *   console.error('Failed to load categories:', error);
 * }
 */
export async function fetchCategories() {
  return getAPI('/categories');
}

export default {
  getAPI,
  postAPI,
  patchAPI,
  deleteAPI,
  fetchProducts,
  fetchCategories,
};
