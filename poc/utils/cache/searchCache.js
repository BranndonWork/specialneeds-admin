/**
 * Search Cache Utilities
 * Helper functions to read/write search results from Cache API
 */

const SEARCH_CACHE_NAME = 'specialneeds-search-v2';

/**
 * Get cached search results from Cache API
 * @param {string} url - The search URL to look up in cache
 * @returns {Promise<Object|null>} Cached search results or null if not found
 */
export async function getCachedSearchResults(url) {
  try {
    // Check if Cache API is available (won't be in SSR)
    if (typeof caches === 'undefined') {
      return null;
    }

    const cache = await caches.open(SEARCH_CACHE_NAME);
    const response = await cache.match(url);

    if (!response) {
      return null;
    }

    // Check if response is valid JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Cached response is not JSON:', url);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Get cache timestamp for a URL
 * @param {string} url - The search URL to check
 * @returns {Promise<Date|null>} Cache timestamp or null if not found
 */
export async function getCacheTimestamp(url) {
  try {
    if (typeof caches === 'undefined') {
      return null;
    }

    const cache = await caches.open(SEARCH_CACHE_NAME);
    const response = await cache.match(url);

    if (!response) {
      return null;
    }

    const cacheTime = response.headers.get('X-Cache-Time');
    return cacheTime ? new Date(parseInt(cacheTime)) : null;
  } catch (error) {
    console.error('Cache timestamp error:', error);
    return null;
  }
}

/**
 * Check if cache is stale (older than threshold)
 * @param {string} url - The search URL to check
 * @param {number} maxAge - Maximum age in milliseconds (default: 60000 = 1 minute)
 * @returns {Promise<boolean>} True if cache is stale
 */
export async function isCacheStale(url, maxAge = 60000) {
  try {
    const timestamp = await getCacheTimestamp(url);
    if (!timestamp) {
      return true; // No cache = stale
    }

    const age = Date.now() - timestamp.getTime();
    return age > maxAge;
  } catch (error) {
    console.error('Cache staleness check error:', error);
    return true; // On error, assume stale
  }
}
