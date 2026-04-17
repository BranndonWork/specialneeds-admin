// SpecialNeeds.com - Unified Service Worker
// Simple PWA with offline support + Search & Asset Handling

const VERSION = "v2.0.4";
const CACHE_NAMES = {
  static: `specialneeds-static-${VERSION}`,
  images: `specialneeds-images-${VERSION}`,
  api: `specialneeds-api-${VERSION}`,
  search: `specialneeds-search-${VERSION}`,
  pages: `specialneeds-pages-${VERSION}`,
  offline: `specialneeds-offline-${VERSION}`,
};

// Critical assets to precache on install (app shell)
// Note: CSS files are bundled by Next.js and served from /_next/static/css/
// so they don't need to be precached here
const PRECACHE_URLS = [
  "/offline/",
  "/",
  "/articles/",
  "/directory/",
];

// App shell pages (cache-first for instant load)
const APP_SHELL_PAGES = ["/", "/articles/", "/directory/"];

// Missing image fallback
const MISSING_IMAGE_URL = "https://imagedelivery.net/iQbJNjrNARW2nbQ489hjzg/missing/public";

// Cloudflare Images configuration
const CLOUDFLARE_IMAGES_BASE = "https://imagedelivery.net/iQbJNjrNARW2nbQ489hjzg";

// Dev mode detection — disable caching to avoid conflicts with HMR/Fast Refresh
const IS_DEV = self.location.hostname === 'specialneeds.localhost'
  || self.location.hostname === 'localhost';

// ============================================================================
// INSTALL - Precache critical assets
// ============================================================================
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  if (IS_DEV) {
    console.log("[SW] Dev mode — skipping precache");
    return self.skipWaiting();
  }

  event.waitUntil(
    caches
      .open(CACHE_NAMES.offline)
      .then(async (cache) => {
        console.log("[SW] Precaching critical assets");

        // Cache each URL individually, skipping failures
        const cachePromises = PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
              console.log("[SW] Cached:", url);
            } else {
              console.warn("[SW] Skipping (not found):", url);
            }
          } catch (error) {
            console.warn("[SW] Failed to cache:", url, error.message);
          }
        });

        await Promise.all(cachePromises);
        console.log("[SW] Installation complete");
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error("[SW] Installation failed:", error);
      })
  );
});

// ============================================================================
// ACTIVATE - Clean up old caches
// ============================================================================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        const validCaches = Object.values(CACHE_NAMES);
        return Promise.all(
          cacheNames
            .filter((cacheName) => !validCaches.includes(cacheName))
            .map((cacheName) => {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("[SW] Activation complete");
        return self.clients.claim(); // Take control immediately
      })
  );
});

// ============================================================================
// FETCH - Handle all requests with appropriate caching strategies
// ============================================================================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Route requests to appropriate handlers
  // In dev, only handle asset URL transformation — skip all caching to avoid HMR conflicts
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/wp-content/") ||
    url.pathname.startsWith("/images/")
  ) {
    event.respondWith(handleAssets(request, url));
  } else if (IS_DEV) {
    return; // Let all other requests pass through uncached in dev
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(handleStaticAssets(request));
  } else if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleAPI(request));
  } else if (isAppShellRequest(url) && request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(handleAppShell(request));
  } else if (isDetailPage(url) && request.headers.get("accept")?.includes("text/html")) {
    // Detail pages (articles/directory) use stale-while-revalidate
    event.respondWith(handlePages(request));
  } else if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(handlePages(request));
  }
  // All other requests go through normally (no caching)
});

// ============================================================================
// HELPER: Check if request is for app shell page
// ============================================================================
function isAppShellRequest(url) {
  return APP_SHELL_PAGES.includes(url.pathname);
}

// ============================================================================
// HELPER: Check if request is for detail page (articles/listings)
// ============================================================================
function isDetailPage(url) {
  // Check if path starts with /articles/ or /directory/ and has additional segments
  const pathname = url.pathname;
  const isArticleDetail = pathname.startsWith('/articles/') && pathname !== '/articles/';
  const isDirectoryDetail = pathname.startsWith('/directory/') && pathname !== '/directory/';
  return isArticleDetail || isDirectoryDetail;
}

// ============================================================================
// HANDLER: App Shell (/, /articles/, /listings/)
// Cache-first for instant load: Show cached shell immediately, update in background
// ============================================================================
async function handleAppShell(request) {
  const cache = await caches.open(CACHE_NAMES.pages);
  const cachedResponse = await cache.match(request);

  // Always serve cached shell immediately if available
  if (cachedResponse) {
    // Update in background (don't await)
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {
        // Ignore network errors - cached version is good enough
      });

    return cachedResponse;
  }

  // No cache yet, fetch from network and cache for next time
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("[SW] App shell fetch failed:", error);
    // Return offline page as fallback
    const offlineCache = await caches.open(CACHE_NAMES.offline);
    const offlinePage = await offlineCache.match("/offline/");
    if (offlinePage) {
      return offlinePage;
    }
    return new Response("Offline - App shell not cached", { status: 503 });
  }
}

// ============================================================================
// HANDLER: Static Assets (CSS, JS, Fonts)
// Cache-first: Next.js static assets are versioned, so cache indefinitely
// ============================================================================
async function handleStaticAssets(request) {
  const cache = await caches.open(CACHE_NAMES.static);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("[SW] Static asset fetch failed:", error);
    return new Response("Offline - Asset not cached", { status: 503 });
  }
}

// ============================================================================
// HANDLER: Assets (renamed from handleImages)
// Transform asset URLs to Cloudflare Images and cache
// ============================================================================
async function handleAssets(request, url) {
  const cache = await caches.open(CACHE_NAMES.images);

  // Transform URL to Cloudflare Images
  const cloudflareUrl = convertToCloudflareImages(url.pathname + url.search);

  // Check if transformation is needed
  if (cloudflareUrl.startsWith("http")) {
    const transformedRequest = new Request(cloudflareUrl);
    const cachedResponse = await cache.match(transformedRequest);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(transformedRequest);
      if (networkResponse.ok) {
        cache.put(transformedRequest, networkResponse.clone());
        return networkResponse;
      }
      // Image failed to load, return missing image
      return fetch(MISSING_IMAGE_URL);
    } catch (error) {
      const missingImageCache = await cache.match(MISSING_IMAGE_URL);
      if (missingImageCache) {
        return missingImageCache;
      }
      return fetch(MISSING_IMAGE_URL).catch(() => {
        return new Response("Image not available", { status: 404 });
      });
    }
  }

  // Fallback to original handleImages logic for non-transformed URLs
  return handleImages(request);
}

// ============================================================================
// HANDLER: Images (original - kept for backward compatibility)
// Stale-while-revalidate with TTL: Cache images, revalidate in background, clear on 404
// ============================================================================
async function handleImages(request) {
  const cache = await caches.open(CACHE_NAMES.images);
  const cachedResponse = await cache.match(request);
  const cacheTTL = 86400000; // 24 hours for images

  // Check if cache is stale
  let isStale = false;
  if (cachedResponse) {
    const cacheTime = cachedResponse.headers.get("X-Cache-Time");
    if (cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      isStale = age > cacheTTL;
    }
  }

  // Background revalidation
  if (cachedResponse && !isStale) {
    // Fresh cache - serve immediately, optionally revalidate in background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.status === 404) {
          // Image deleted - clear cache
          cache.delete(request);
        } else if (networkResponse.ok) {
          // Clone first, then create new response with timestamp header from clone's body
          const clonedResponse = networkResponse.clone();
          const headers = new Headers(clonedResponse.headers);
          headers.set("X-Cache-Time", Date.now().toString());
          const responseToCache = new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers,
          });
          cache.put(request, responseToCache);
        }
      })
      .catch(() => {}); // Ignore errors in background revalidation
    return cachedResponse;
  }

  // Stale cache or no cache - fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 404) {
      // Image deleted - clear cache and return missing image
      cache.delete(request);
      return fetch(MISSING_IMAGE_URL);
    }
    if (networkResponse.ok) {
      // Clone first, then create new response with timestamp header from clone's body
      const clonedResponse = networkResponse.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set("X-Cache-Time", Date.now().toString());
      const responseToCache = new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: headers,
      });
      cache.put(request, responseToCache);
      return networkResponse;
    }
    // Image failed to load, return missing image
    return fetch(MISSING_IMAGE_URL);
  } catch (error) {
    // Network failed - serve stale cache if available
    if (cachedResponse) {
      return cachedResponse;
    }
    // No cache, try to return missing image
    const missingImageCache = await cache.match(MISSING_IMAGE_URL);
    if (missingImageCache) {
      return missingImageCache;
    }
    return fetch(MISSING_IMAGE_URL).catch(() => {
      return new Response("Image not available", { status: 404 });
    });
  }
}

// ============================================================================
// HANDLER: API Calls
// Network-first with 30s cache fallback (based on old apiSearchServiceWorker)
// ============================================================================
async function handleAPI(request) {
  const url = new URL(request.url);
  const cache = await caches.open(CACHE_NAMES.api);

  // Determine cache TTL based on endpoint
  let cacheTTL = 30000; // Default 30s (search pattern)
  if (url.pathname.includes("/listings/")) {
    cacheTTL = 60000; // 60s for listings
  } else if (url.pathname.includes("/articles/")) {
    cacheTTL = 300000; // 5min for articles
  }

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response with timestamp
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set("X-Cache-Time", Date.now().toString());
      headers.set("X-SW-Cache", "MISS");

      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, cachedResponse);

      // Return original response
      return networkResponse;
    }

    // Network response not OK, try cache
    return getCachedAPIResponse(cache, request, cacheTTL);
  } catch (error) {
    // Network failed, try cache
    return getCachedAPIResponse(cache, request, cacheTTL);
  }
}

// Helper: Get cached API response if still valid
async function getCachedAPIResponse(cache, request, cacheTTL) {
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const cacheTime = cachedResponse.headers.get("X-Cache-Time");
    if (cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      if (age < cacheTTL) {
        // Cache is still valid
        const headers = new Headers(cachedResponse.headers);
        headers.set("X-SW-Cache", "HIT");

        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: headers,
        });
      }
    }
  }

  // No valid cache, return error
  return new Response(JSON.stringify({ error: "Offline - No cached data available" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

// ============================================================================
// HANDLER: HTML Pages
// Stale-while-revalidate with TTL: Show cached page, update in background, clear on 404
// ============================================================================
async function handlePages(request) {
  const cache = await caches.open(CACHE_NAMES.pages);
  const cachedResponse = await cache.match(request);
  const cacheTTL = 300000; // 5 minutes

  // Check if cache is stale
  let isStale = false;
  if (cachedResponse) {
    const cacheTime = cachedResponse.headers.get("X-Cache-Time");
    if (cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      isStale = age > cacheTTL;
    }
  }

  // Cache a successful page response (fire-and-forget, errors don't affect the returned response)
  const cachePageResponse = (networkResponse) => {
    if (!networkResponse) return;
    if (networkResponse.status === 404) {
      cache.delete(request);
      return;
    }
    if (!networkResponse.ok) return;
    try {
      const clonedResponse = networkResponse.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set("X-Cache-Time", Date.now().toString());
      const responseToCache = new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: headers
      });
      cache.put(request, responseToCache);
    } catch (e) {
      // Caching failed - ignore, the response itself is still valid
    }
  };

  // Network fetch - separated from caching so caching errors can't swallow the response
  const fetchPromise = fetch(request).catch(() => null);

  // Serve cached version if available, even if stale
  if (cachedResponse && !isStale) {
    // Fresh cache - serve immediately, revalidate in background
    fetchPromise.then(cachePageResponse).catch(() => {});
    return cachedResponse;
  }

  if (cachedResponse && isStale) {
    // Stale cache - try network first, fall back to stale cache
    const networkResponse = await fetchPromise;
    if (networkResponse && networkResponse.ok) {
      cachePageResponse(networkResponse);
      return networkResponse;
    }
    // Network failed or returned error, serve stale cache
    return cachedResponse;
  }

  // No cache - wait for network
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    // Return any real network response (200, 404, 500, etc.) - don't show offline page for online errors
    cachePageResponse(networkResponse);
    return networkResponse;
  }
  // fetchPromise resolved to null - fetch itself failed (likely offline)
  return getCachedPage(cache, request);
}

// Helper: Get cached page or offline fallback
async function getCachedPage(cache, request) {
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // No cache, return offline page
  const offlineCache = await caches.open(CACHE_NAMES.offline);
  const offlinePage = await offlineCache.match("/offline/");

  if (offlinePage) {
    return offlinePage;
  }

  // Offline page not cached (shouldn't happen), return basic response
  return new Response(
    "<html><body><h1>Offline</h1><p>You are currently offline and this page is not cached.</p></body></html>",
    {
      status: 503,
      headers: { "Content-Type": "text/html" },
    }
  );
}

// ============================================================================
// HELPER: Convert thumbnail URLs to Cloudflare Images
// ============================================================================
function convertToCloudflareImages(thumbnailUrl) {
  if (!thumbnailUrl) return thumbnailUrl;

  // Already Cloudflare Images - return as is
  if (thumbnailUrl.includes("imagedelivery.net")) {
    return thumbnailUrl;
  }

  // CloudImg CDN - convert to Cloudflare Images
  if (thumbnailUrl.includes("cylgfffnta.cloudimg.io")) {
    // Extract the path after the environment alias
    const match = thumbnailUrl.match(/cylgfffnta\.cloudimg\.io\/[^/]+\/(.+)/);
    if (match) {
      const imagePath = match[1];
      // Extract filename for Cloudflare Images ID (simplified - may need lookup table)
      const filename = imagePath.split("/").pop().split("?")[0];
      return `${CLOUDFLARE_IMAGES_BASE}/${filename}/public`;
    }
  }

  // Relative asset paths - convert to Cloudflare Images
  if (
    thumbnailUrl.startsWith("/assets/") ||
    thumbnailUrl.startsWith("/images/") ||
    thumbnailUrl.startsWith("/wp-content/")
  ) {
    // Extract filename from path
    const cleanPath = thumbnailUrl.replace(/^\//, "");
    const filename = cleanPath.split("?")[0];

    // Determine variant based on query params
    let variant = "public";
    if (thumbnailUrl.includes("width=200") || thumbnailUrl.includes("width=300")) {
      variant = "thumbnail";
    } else if (thumbnailUrl.includes("width=800")) {
      variant = "medium";
    }

    return `${CLOUDFLARE_IMAGES_BASE}/${filename}/${variant}`;
  }

  // Legacy assets.specialneeds.com - convert to Cloudflare Images
  if (thumbnailUrl.includes("assets.specialneeds.com")) {
    const parts = thumbnailUrl.split("assets.specialneeds.com");
    if (parts[1]) {
      const filename = parts[1].replace(/^\//, "");
      return `${CLOUDFLARE_IMAGES_BASE}/${filename}/public`;
    }
  }

  // Return original URL if no transformation applied
  return thumbnailUrl;
}

// ============================================================================
// MESSAGE HANDLER - Receive config and handle cleanup
// ============================================================================
self.addEventListener("message", (event) => {
  if (!event.data) return;

  // Cleanup cache entries
  if (event.data.type === "CLEANUP_CACHE") {
    event.waitUntil(cleanupCaches());
  }

  // Prefetch URL (for article/listing pages)
  if (event.data.type === "PREFETCH_URL") {
    const url = event.data.url;
    if (url) {
      event.waitUntil(prefetchPage(url));
    }
  }

  // Prefetch image
  if (event.data.type === "PREFETCH_IMAGE") {
    const imageUrl = event.data.url;
    if (imageUrl) {
      event.waitUntil(prefetchImage(imageUrl));
    }
  }
});

async function cleanupCaches() {
  const currentTime = Date.now();
  let apiDeletedCount = 0;
  let searchDeletedCount = 0;
  let pagesDeletedCount = 0;
  let imagesDeletedCount = 0;

  // Cleanup API cache (10 minutes)
  const apiCache = await caches.open(CACHE_NAMES.api);
  const apiRequests = await apiCache.keys();

  for (const request of apiRequests) {
    const response = await apiCache.match(request);
    if (response) {
      const cacheTime = response.headers.get("X-Cache-Time");
      if (cacheTime) {
        const age = currentTime - parseInt(cacheTime);
        if (age > 600000) {
          await apiCache.delete(request);
          apiDeletedCount++;
        }
      }
    }
  }

  // Cleanup search cache (5 minutes)
  const searchCache = await caches.open(CACHE_NAMES.search);
  const searchRequests = await searchCache.keys();

  for (const request of searchRequests) {
    const response = await searchCache.match(request);
    if (response) {
      const cacheTime = response.headers.get("X-Cache-Time");
      if (cacheTime) {
        const age = currentTime - parseInt(cacheTime);
        if (age > 300000) {
          await searchCache.delete(request);
          searchDeletedCount++;
        }
      }
    }
  }

  // Cleanup pages cache (1 hour - stale but keep for offline)
  const pagesCache = await caches.open(CACHE_NAMES.pages);
  const pagesRequests = await pagesCache.keys();

  for (const request of pagesRequests) {
    const response = await pagesCache.match(request);
    if (response) {
      const cacheTime = response.headers.get("X-Cache-Time");
      if (cacheTime) {
        const age = currentTime - parseInt(cacheTime);
        // Delete if older than 1 hour
        if (age > 3600000) {
          await pagesCache.delete(request);
          pagesDeletedCount++;
        }
      }
    }
  }

  // Cleanup images cache (7 days)
  const imagesCache = await caches.open(CACHE_NAMES.images);
  const imagesRequests = await imagesCache.keys();

  for (const request of imagesRequests) {
    const response = await imagesCache.match(request);
    if (response) {
      const cacheTime = response.headers.get("X-Cache-Time");
      if (cacheTime) {
        const age = currentTime - parseInt(cacheTime);
        // Delete if older than 7 days
        if (age > 604800000) {
          await imagesCache.delete(request);
          imagesDeletedCount++;
        }
      }
    }
  }

  if (apiDeletedCount > 0 || searchDeletedCount > 0 || pagesDeletedCount > 0 || imagesDeletedCount > 0) {
    console.log(
      `[SW] Cleaned up ${apiDeletedCount} API + ${searchDeletedCount} search + ${pagesDeletedCount} pages + ${imagesDeletedCount} images cache entries`
    );
  }
}

// ============================================================================
// PREFETCH: Prefetch pages as user scrolls
// ============================================================================
async function prefetchPage(url) {
  try {
    const cache = await caches.open(CACHE_NAMES.pages);
    const cachedResponse = await cache.match(url);

    // Check if cache is stale
    let shouldPrefetch = true;
    if (cachedResponse) {
      const cacheTime = cachedResponse.headers.get("X-Cache-Time");
      if (cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        const cacheTTL = 300000; // 5 minutes
        shouldPrefetch = age > cacheTTL;
      }
    }

    // Only prefetch if not cached or stale
    if (shouldPrefetch) {
      const response = await fetch(url, { priority: 'low' });
      if (response.status === 404) {
        // Page deleted - clear cache
        await cache.delete(url);
      } else if (response.ok) {
        // Clone first, then create new response with timestamp header from clone's body
        const clonedResponse = response.clone();
        const headers = new Headers(clonedResponse.headers);
        headers.set("X-Cache-Time", Date.now().toString());
        const responseToCache = new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers: headers,
        });
        await cache.put(url, responseToCache);
        console.log('[SW] Prefetched page:', url);
      }
    }
  } catch (error) {
    console.log('[SW] Prefetch failed for:', url);
  }
}

// ============================================================================
// PREFETCH: Prefetch images as they become visible
// ============================================================================
async function prefetchImage(imageUrl) {
  try {
    const cache = await caches.open(CACHE_NAMES.images);
    const cachedResponse = await cache.match(imageUrl);

    // Check if cache is stale
    let shouldPrefetch = true;
    if (cachedResponse) {
      const cacheTime = cachedResponse.headers.get("X-Cache-Time");
      if (cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        const cacheTTL = 86400000; // 24 hours
        shouldPrefetch = age > cacheTTL;
      }
    }

    // Only prefetch if not cached or stale
    if (shouldPrefetch) {
      const response = await fetch(imageUrl, { priority: 'low' });
      if (response.status === 404) {
        // Image deleted - clear cache
        await cache.delete(imageUrl);
      } else if (response.ok) {
        // Clone first, then create new response with timestamp header from clone's body
        const clonedResponse = response.clone();
        const headers = new Headers(clonedResponse.headers);
        headers.set("X-Cache-Time", Date.now().toString());
        const responseToCache = new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers: headers,
        });
        await cache.put(imageUrl, responseToCache);
        console.log('[SW] Prefetched image:', imageUrl);
      }
    }
  } catch (error) {
    console.log('[SW] Image prefetch failed for:', imageUrl);
  }
}

console.log("[SW] Service worker loaded");
