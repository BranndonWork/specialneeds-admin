import { serveAsset } from "@utils/assetHelpers";

/**
 * Get article image URL with fallback to missing image
 * Handles multiple image source patterns (thumbnail, images array)
 *
 * @param {Object} article - Article object with thumbnail or images array
 * @param {number} width - Optional width transformation
 * @param {number} height - Optional height transformation
 * @returns {string} Image URL with transformations applied
 */
export const getArticleImage = (article, width = null, height = null) => {
  // Check for thumbnail first
  if (article?.thumbnail) {
    return serveAsset(article.thumbnail, width, height);
  }

  // Check for images array
  if (article?.images?.length > 0) {
    return serveAsset(article.images[0].url, width, height);
  }

  // Fallback to missing image
  return serveAsset("missingArticlesImage", width, height);
};
