const getMeilisearchHost = () => {
  const host = process.env.MEILISEARCH_HOST || "search.specialneeds.com";
  if (host.startsWith("http")) return host;
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${isLocal ? "http" : "https"}://${host}`;
};

export const getPopularDirectoryCategories = async () => {
  const host = getMeilisearchHost();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${host}/indexes/listings/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        q: "",
        limit: 0,
        facets: ["category_slug"],
        filter: "status = 'published'",
      }),
    });

    const searchResponse = await response.json();
    return searchResponse.facetDistribution?.category_slug || {};
  } catch (error) {
    console.error("Meilisearch getPopularDirectoryCategories error:", error);
    return {};
  } finally {
    clearTimeout(timeoutId);
  }
};

const slugToTitle = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export const getRecentListingsByCategory = async (limitPerCategory = 5) => {
  const host = getMeilisearchHost();
  // thumbnail is not filterable in Meilisearch, so fetch a larger batch and filter in JS
  const fetchLimit = limitPerCategory * 6;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    // Discover all categories dynamically from the index
    const facetResponse = await fetch(`${host}/indexes/listings/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        q: "",
        limit: 0,
        facets: ["category_slug"],
        filter: "status = 'published'",
      }),
    });
    const facetData = await facetResponse.json();
    const categorySlugs = Object.keys(facetData.facetDistribution?.category_slug || {});

    // Build unique parent categories — name comes from the sub-category slug
    // e.g. "recreational-activities/camps" → parentSlug: "recreational-activities", name: "Camps"
    const parentMap = {};
    for (const fullSlug of categorySlugs) {
      const [parentSlug, subSlug] = fullSlug.split('/');
      if (!parentSlug || !subSlug) continue;
      if (!parentMap[parentSlug]) {
        parentMap[parentSlug] = { parentSlug, name: slugToTitle(subSlug) };
      }
    }

    const parentCategories = Object.values(parentMap);
    if (parentCategories.length === 0) return [];

    // Fetch recent listings for each parent category in parallel
    const results = await Promise.all(
      parentCategories.map(async (category) => {
        const response = await fetch(`${host}/indexes/listings/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            q: "",
            limit: fetchLimit,
            filter: `status = 'published' AND parent_category_slug = '${category.parentSlug}'`,
            sort: ["published_at_timestamp:desc"],
            attributesToRetrieve: [
              "title", "slug", "thumbnail", "category_name",
              "city", "state_province", "published_at_timestamp",
            ],
          }),
        });
        const data = await response.json();
        const hits = data.hits || [];
        const withImages = hits.filter((hit) => hit.thumbnail && hit.thumbnail.trim() !== "");
        const withoutImages = hits.filter((hit) => !hit.thumbnail || hit.thumbnail.trim() === "");
        const combined = [...withImages, ...withoutImages].slice(0, limitPerCategory);
        return {
          categorySlug: category.parentSlug,
          categoryName: category.name,
          listings: combined,
        };
      })
    );
    return results.filter((group) => group.listings.length > 0);
  } catch (error) {
    console.error("Meilisearch getRecentListingsByCategory error:", error);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};
