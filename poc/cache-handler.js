const CACHE_BASE = process.env.NODE_ENV === 'production' ? 'https://api.specialneeds.com' : null;
const CACHE_MGMT_TOKEN = process.env.CACHE_MGMT_TOKEN;

// Only externally cache pages that depend on the Django backend.
// Pages like /404, /, /about, etc. use the default filesystem cache.
const EXTERNAL_CACHE_PREFIXES = ['/articles/', '/directory/', '/authors/', '/virtual-authors/', '/events/'];

const shouldExternalCache = (key) =>
  EXTERNAL_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix));

// Convert Next.js key (/articles/news/research/slug) to KV path (isr/articles/news/research/slug)
// The KV endpoint uses / in URL paths, stored as : internally.
const toKvPath = (key) => 'isr/' + key.replace(/^\/|\/$/g, '');

// In-memory cache for error/notFound responses — DDoS protection without polluting Redis.
// Next.js passes null (~4 bytes) for notFound pages, so memory usage is negligible.
// Max 50k entries with 60s TTL — handles sustained DDoS on unique URLs.
const memoryCache = new Map();
const MEMORY_MAX_ENTRIES = 50000;
const MEMORY_TTL_MS = 60 * 1000;

const memoryGet = (key) => {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry;
};

const memorySet = (key, value, lastModified, revalidate) => {
  if (memoryCache.size >= MEMORY_MAX_ENTRIES) {
    const firstKey = memoryCache.keys().next().value;
    memoryCache.delete(firstKey);
  }
  memoryCache.set(key, {
    value,
    lastModified,
    revalidate,
    expiresAt: Date.now() + MEMORY_TTL_MS,
  });
};

class CacheHandler {
  async get(key) {
    if (!shouldExternalCache(key)) return null;

    // Check in-memory first (cached notFound responses)
    const mem = memoryGet(key);
    if (mem) {
      const revalidateAfter = mem.revalidate
        ? mem.lastModified + mem.revalidate * 1000
        : false;
      const isStale = revalidateAfter !== false && Date.now() > revalidateAfter;
      return { value: mem.value, revalidateAfter, isStale, lastModified: mem.lastModified };
    }

    // Check KV cache
    if (!CACHE_BASE) return null;
    const kvPath = toKvPath(key);
    try {
      const res = await fetch(`${CACHE_BASE}/v1/cache/${kvPath}`);
      if (!res.ok) {
        console.warn('[cache-handler] GET failed:', res.status, kvPath);
        return null;
      }
      console.debug('[cache-handler] HIT', kvPath);
      const entry = await res.json();
      if (!entry || !entry.value) return null;

      const { value, lastModified, revalidate } = entry;
      const revalidateAfter = revalidate ? lastModified + revalidate * 1000 : false;
      const isStale = revalidateAfter !== false && Date.now() > revalidateAfter;

      return { value, revalidateAfter, isStale, lastModified };
    } catch (error) {
      console.warn('[cache-handler] GET error:', error.message, kvPath);
      return null;
    }
  }

  async set(key, data, ctx) {
    if (!shouldExternalCache(key)) return;

    const revalidate = ctx.revalidate ?? 3600;

    // notFound/error pages go to in-memory only — protects Redis from overwriting
    // good cached pages during backend outages.
    if (!data?.html) {
      memorySet(key, data, Date.now(), revalidate);
      return;
    }

    // Good pages go to KV cache
    if (!CACHE_BASE) return;
    const kvPath = toKvPath(key);
    const entry = {
      value: data,
      lastModified: Date.now(),
      revalidate,
    };
    try {
      await fetch(`${CACHE_BASE}/v1/cache/${kvPath}?ttl=${revalidate * 24}`, {
        method: 'PUT',
        headers: {
          'X-Sn-Service-Token': CACHE_MGMT_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.warn('[cache-handler] SET error:', error.message, kvPath);
    }
  }

  async revalidateTag() {
    // no-op
  }
}

module.exports = CacheHandler;
