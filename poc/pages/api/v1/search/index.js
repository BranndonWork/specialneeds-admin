// ./pages/api/v1/search/index.js
// Main search endpoint - proxies to Meilisearch server-side (host never exposed to browser)

import { addDistanceToResults } from "@utils/search/addDistanceToResults";
import { convertThumbnailURLs } from "@utils/search/convertThumbnailURLs";

const searchCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

const COMMON_ATTRIBUTES = [
  "title",
  "summary",
  "thumbnail",
  "slug",
  "category_name",
  "content",
  "status",
  "published_at_timestamp",
  "scheduled_publish_at_timestamp",
  "updated_at_timestamp",
  "objectID",
  "id",
  "_geo",
  "_geoDistance",
];

const ATTRIBUTES_TO_RETRIEVE = {
  listings: [...COMMON_ATTRIBUTES, "city", "state_province"],
  articles: [...COMMON_ATTRIBUTES, "author_name", "author_avatar"],
};

const searchHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      index,
      q = "",
      perPage = 12,
      pageNumber = 1,
      category,
      sub_category,
      lat,
      lon,
      radius = "25",
    } = req.query;

    if (!index) {
      return res.status(400).json({ error: "Missing index parameter" });
    }

    const parsedPerPage = Math.min(parseInt(perPage, 10), 1000);
    const parsedPageNumber = parseInt(pageNumber, 10);

    // Build search body for Meilisearch
    const searchBody = {
      q: q || "",
      attributesToRetrieve: ATTRIBUTES_TO_RETRIEVE[index] || COMMON_ATTRIBUTES,
      limit: parsedPerPage,
      offset: (parsedPageNumber - 1) * parsedPerPage,
      attributesToHighlight: ["content", "title", "summary"],
      highlightPreTag: "<em>",
      highlightPostTag: "</em>",
      facets: ["category_name"],
    };

    // Build filters (public only - always filter for published status)
    const filters = ["status = 'published'"];

    // Add category filters
    if (category && sub_category) {
      filters.push(`category_slug = '${category}/${sub_category}'`);
    } else if (category) {
      filters.push(`parent_category_slug = '${category}'`);
    }

    // Add geo filter and/or sort
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    const parsedRadius = parseFloat(radius);
    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      // Always sort by proximity when coords are present
      searchBody.sort = [`_geoPoint(${parsedLat}, ${parsedLon}):asc`];
      // Only filter by radius if radius < 1000 (nationwide = 1000 = no filter, just sort)
      if (radius !== 'nationwide' && !isNaN(parsedRadius)) {
        const radiusMeters = Math.round(parsedRadius * 1609.34);
        filters.push(`_geoRadius(${parsedLat}, ${parsedLon}, ${radiusMeters})`);
      }
    }

    if (filters.length > 0) {
      searchBody.filter = filters.join(" AND ");
    }

    const cacheKey = JSON.stringify({ index, q, perPage: parsedPerPage, pageNumber: parsedPageNumber, category, sub_category, lat, lon, radius });
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return res.status(200).json(cached.data);
    }

    // Query Meilisearch
    const rawHost = process.env.MEILISEARCH_HOST || "search.specialneeds.com";
    const host = rawHost.startsWith("http") ? rawHost : `https://${rawHost}`;
    console.log('[Search API] host:', host, 'index:', index, 'q:', q);

    const response = await fetch(`${host}/indexes/${index}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchBody),
    });

    const searchResponse = await response.json();

    // Transform results to Algolia-compatible format
    let results = (searchResponse.hits || []).map((hit) => {
      const formattedContent = hit._formatted?.content || hit.content || "";
      const formattedTitle = hit._formatted?.title || hit.title || "";
      const formattedSummary = hit._formatted?.summary || hit.summary || "";

      return {
        ...hit,
        objectID: hit.id || hit.objectID,
        _highlightResult: {
          content: {
            value: formattedContent,
            matchLevel: formattedContent.includes("<em>") ? "full" : "none",
          },
          title: {
            value: formattedTitle,
            matchLevel: formattedTitle.includes("<em>") ? "full" : "none",
          },
          summary: {
            value: formattedSummary,
            matchLevel: formattedSummary.includes("<em>") ? "full" : "none",
          },
        },
        _snippetResult: {
          content: {
            value: formattedContent,
            matchLevel: formattedContent.includes("<em>") ? "full" : "none",
          },
        },
      };
    });

    // Add distance calculations
    addDistanceToResults(results);

    // Convert thumbnail URLs
    convertThumbnailURLs(results);

    const totalHits = searchResponse.estimatedTotalHits || 0;
    const categories = searchResponse.facetDistribution?.category_name || {};

    const finalResults = {
      timestamp: new Date().toISOString(),
      results,
      categories,
      pageNumber: parsedPageNumber,
      perPage: parsedPerPage,
      totalHits,
      totalPages: Math.ceil(totalHits / parsedPerPage),
    };

    searchCache.set(cacheKey, { data: finalResults, ts: Date.now() });
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json(finalResults);
  } catch (error) {
    console.error("Search error:", error.message, 'cause:', error.cause?.message, 'code:', error.cause?.code);
    res.status(500).json({
      error: "Search execution failed",
      message: error.message,
    });
  }
};

export default searchHandler;
