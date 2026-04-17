import SearchPage from "@components/Search/SearchPage";
import { addDistanceToResults } from "@utils/search/addDistanceToResults";
import { convertThumbnailURLs } from "@utils/search/convertThumbnailURLs";

const ArticlesSearch = ({ initialResults, fullCategoryList, initialExpandedParent }) => {
  return (
    <SearchPage
      index="articles"
      pathname="/articles"
      title="Articles"
      subTitle="Discover informative articles and resources tailored to special needs individuals and their families."
      initialResults={initialResults}
      fullCategoryList={fullCategoryList}
      initialExpandedParent={initialExpandedParent}
    />
  );
};

export async function getServerSideProps({ req, res, query }) {
  // Set cache headers: 5 min fresh, 1 month stale-while-revalidate
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=2592000');
  res.setHeader('X-Robots-Tag', 'noindex');

  try {
    const index = "articles";
    const q = query.q || "";
    const perPage = Math.min(parseInt(query.perPage || 12, 10), 1000);
    const pageNumber = parseInt(query.pageNumber || 1, 10);
    const category = query.category;
    const sub_category = query.sub_category;

    const COMMON_ATTRIBUTES = [
      "title", "summary", "thumbnail", "slug", "category_name", "content",
      "status", "published_at_timestamp", "scheduled_publish_at_timestamp",
      "updated_at_timestamp", "objectID", "id", "_geo", "_geoDistance",
    ];

    const ATTRIBUTES_TO_RETRIEVE = {
      listings: [...COMMON_ATTRIBUTES, "city", "state_province"],
      articles: [...COMMON_ATTRIBUTES, "author_name", "author_avatar"],
    };

    // Build search body for Meilisearch
    const searchBody = {
      q: q || "",
      attributesToRetrieve: ATTRIBUTES_TO_RETRIEVE[index] || COMMON_ATTRIBUTES,
      limit: perPage,
      offset: (pageNumber - 1) * perPage,
      attributesToHighlight: ["content", "title", "summary"],
      highlightPreTag: "<em>",
      highlightPostTag: "</em>",
      facets: ["category_name"],
    };

    // Build filters
    const filters = ["status = 'published'"];
    if (category && sub_category) {
      filters.push(`category_slug = '${category}/${sub_category}'`);
    } else if (category) {
      filters.push(`parent_category_slug = '${category}'`);
    }

    if (filters.length > 0) {
      searchBody.filter = filters.join(" AND ");
    }

    // Query Meilisearch
    const rawHost = process.env.MEILISEARCH_HOST || "search.specialneeds.com";
    const host = rawHost.startsWith("http") ? rawHost : `https://${rawHost}`;

    // Fetch filtered search results AND full category list in parallel
    const [searchResponse, fullCategoriesResponse] = await Promise.all([
      // Filtered search results
      fetch(`${host}/indexes/${index}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchBody),
      }).then(res => res.json()),

      // Full unfiltered category list
      fetch(`${host}/indexes/${index}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: "",
          limit: 0,
          facets: ["category_name"],
          filter: "status = 'published'", // Only published, no category filters
        }),
      }).then(res => res.json()),
    ]);

    // Transform results
    let results = (searchResponse.hits || []).map((hit) => {
      const formattedContent = hit._formatted?.content || hit.content || "";
      const formattedTitle = hit._formatted?.title || hit.title || "";
      const formattedSummary = hit._formatted?.summary || hit.summary || "";

      return {
        ...hit,
        objectID: hit.id || hit.objectID,
        _highlightResult: {
          content: { value: formattedContent, matchLevel: formattedContent.includes("<em>") ? "full" : "none" },
          title: { value: formattedTitle, matchLevel: formattedTitle.includes("<em>") ? "full" : "none" },
          summary: { value: formattedSummary, matchLevel: formattedSummary.includes("<em>") ? "full" : "none" },
        },
        _snippetResult: {
          content: { value: formattedContent, matchLevel: formattedContent.includes("<em>") ? "full" : "none" },
        },
      };
    });

    addDistanceToResults(results);
    convertThumbnailURLs(results);

    const totalHits = searchResponse.estimatedTotalHits || 0;
    const categories = searchResponse.facetDistribution?.category_name || {};
    const fullCategoryList = fullCategoriesResponse.facetDistribution?.category_name || {};

    // Calculate which parent category should be expanded based on URL params
    let initialExpandedParent = null;
    if (category && Object.keys(fullCategoryList).length > 0) {
      // Find the parent category display name from the slug
      // e.g., "education" slug -> "Education" display name
      const parentKey = Object.keys(fullCategoryList).find((key) => {
        const [parent] = key.split(" > ");
        return parent.toLowerCase().replace(/\s+/g, "-") === category;
      });
      if (parentKey) {
        initialExpandedParent = parentKey.split(" > ")[0];
      }
    }

    const initialResults = {
      timestamp: new Date().toISOString(),
      results,
      categories,
      pageNumber,
      perPage,
      totalHits,
      totalPages: Math.ceil(totalHits / perPage),
    };

    return {
      props: {
        initialResults,
        fullCategoryList,
        initialExpandedParent,
      },
    };
  } catch (error) {
    console.error("Error fetching initial search results:", error);
    return {
      props: {
        initialResults: null,
      },
    };
  }
}

export default ArticlesSearch;
