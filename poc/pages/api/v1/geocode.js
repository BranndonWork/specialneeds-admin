// ./pages/api/v1/geocode.js
// Geocodes a location string to lat/lon using Nominatim (OSM).
// Results are cached indefinitely in the shared cache service — a city name never changes coords.

const CACHE_BASE = "https://api.specialneeds.com";

const cacheKey = (q) => `geocode/${q.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;

const getFromCache = async (key) => {
  try {
    const res = await fetch(`${CACHE_BASE}/v1/cache/${key}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      console.warn(`[geocode-cache] GET failed: ${res.status} ${key}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.warn(`[geocode-cache] GET error: ${error.message} ${key}`);
    return null;
  }
};

const setInCache = async (key, value) => {
  try {
    await fetch(`${CACHE_BASE}/v1/cache/${key}`, {
      method: "PUT",
      headers: {
        "X-Sn-Service-Token": process.env.CACHE_MGMT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
  } catch (error) {
    console.warn(`[geocode-cache] SET error: ${error.message} ${key}`);
  }
};

const geocodeHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }

  const key = cacheKey(q.trim());

  try {
    // Check shared cache first
    const cached = await getFromCache(key);
    if (cached) {
      res.setHeader("X-Cache-Status", "HIT");
      return res.status(200).json({ ...cached, cached: true });
    }

    res.setHeader("X-Cache-Status", "MISS");

    // Call Nominatim — rate limit is 1 req/sec; caching ensures we never hammer it
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q.trim())}&format=json&limit=1&addressdetails=1&countrycodes=us`;
    const nominatimRes = await fetch(url, {
      headers: {
        "User-Agent": "SpecialNeeds.com/1.0 (contact@specialneeds.com)",
        "Accept-Language": "en",
      },
    });

    if (!nominatimRes.ok) {
      throw new Error(`Nominatim responded with ${nominatimRes.status}`);
    }

    const results = await nominatimRes.json();

    if (!results.length) {
      return res.status(404).json({ error: "Location not found", query: q });
    }

    const { lat, lon, display_name } = results[0];
    const geocoded = { lat: parseFloat(lat), lon: parseFloat(lon), display_name };

    // Cache indefinitely — coordinates for a city name don't change
    await setInCache(key, geocoded);

    return res.status(200).json({ ...geocoded, cached: false });
  } catch (error) {
    console.error("Geocode error:", error);
    res.setHeader("X-Cache-Status", "BYPASS");
    return res.status(500).json({ error: "Geocoding failed", message: error.message });
  }
};

export default geocodeHandler;
