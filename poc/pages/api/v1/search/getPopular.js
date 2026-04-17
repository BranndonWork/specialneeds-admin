// getPopular.js - STUB VERSION (Algolia disabled, returns empty results)
// Real Meilisearch queries live in getDirectoryData.js

export { getPopularDirectoryCategories } from "./getDirectoryData";

// Stub: Return empty results (Algolia was already disabled in original)
const performSearch = async (index, settings) => {
  return { timestamp: new Date().toISOString(), results: [] };
};

export const getPopularArticles = async (limit = 12) => {
  return await performSearch("articles", { limit });
};

export const getPopularListings = async (limit = 12) => {
  return await performSearch("listings", { limit });
};

export const getPopularNews = async (limit = 12) => {
  return await performSearch("articles", { limit });
};

export const getPopular = async (index = "listings") => {
  return await performSearch(index, {});
};
