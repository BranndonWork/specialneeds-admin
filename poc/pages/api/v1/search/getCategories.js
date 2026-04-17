// getCategories.js - STUB VERSION
// Original moved to getCategories.js.old
// Categories now handled by service worker search endpoint

import Utils from "@utils";


export const getCategories = async (req) => {

  try {
    const { index: indexName, filters = {}, filterString = "" } = req.data || {};

    // Build filter string for published content only
    let filter = "status = 'published'";

    // Remove category filters to get all categories
    const nonCategoryFilters = filterString
      .split(" AND ")
      .filter((f) => !f.includes("category"))
      .filter(Boolean);

    if (nonCategoryFilters.length > 0) {
      filter = `${filter} AND ${nonCategoryFilters.join(" AND ")}`;
    }

    const requestBody = {
      q: "",
      facets: ["category_name"],
      limit: 0,
      filter,
    };

    const rawHost = process.env.MEILISEARCH_HOST || "search.specialneeds.com";
    const host = rawHost.startsWith("http") ? rawHost : `https://${rawHost}`;

    const response = await fetch(`${host}/indexes/${indexName}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const meilisearchResponse = await response.json();
    let results = meilisearchResponse?.facetDistribution?.category_name || {};

    const slugToDisplayTitle = (slug) => {
      return Utils.toTitleCase(slug.replace("/", " > ").replace(/-/g, " "));
    };

    // Handle empty category results
    const titleCaseCategorySlug = filters["category_slug"]
      ? slugToDisplayTitle(filters["category_slug"])
      : null;
    const titleCaseParentCategorySlug = filters["parent_category_slug"]
      ? slugToDisplayTitle(filters["parent_category_slug"])
      : null;

    if (titleCaseParentCategorySlug && !results[titleCaseParentCategorySlug]) {
      results = { [titleCaseParentCategorySlug]: 0, ...results };
    } else if (titleCaseCategorySlug && !results[titleCaseCategorySlug]) {
      results = { [titleCaseCategorySlug]: 0, ...results };
    }

    return results;
  } catch (error) {
    return {};
  }
};
