import algoliasearch from "algoliasearch/lite";
import { useEffect, useMemo, useState } from "react";

const searchClient = algoliasearch("RN48EWIWLS", "3b6dbad05a3c9e0aaed0cf843b0401cc");
const index = searchClient.initIndex("dev_listings");

export const useAlgoliaSearch = ({
  searchTerm = "",
  filters = {},
  sortBy = [],
  perPage = 10,
  pageNumber = 1,
}) => {
  const [results, setResults] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const memoizedSortBy = useMemo(() => sortBy, [JSON.stringify(sortBy)]);

  const filterString = useMemo(() => {
    return Object.keys(filters)
      .map((key) => (isNaN(filters[key]) ? `${key}:'${filters[key]}'` : `${key}:${filters[key]}`))
      .join(" AND ");
  }, [filters]);

  const fetchResults = async () => {
    // ALGOLIA DISABLED: Return empty response immediately
    console.warn("ALGOLIA DISABLED - RETURNING EMPTY RESULTS");
    setResults([]);
    setTotalHits(0);
    return;

    let fetchedResults = [];
    let startingPage = Math.floor(((pageNumber - 1) * perPage) / 1000);
    let resultsToFetch = perPage;

    console.log("Fetching Algolia results...", {
      searchTerm,
      filters,
      sortBy,
      perPage,
      pageNumber,
      filterString,
      startingPage,
      resultsToFetch,
    });

    while (resultsToFetch > 0) {
      const settings = {
        hitsPerPage: Math.min(resultsToFetch, 1000),
        page: startingPage,
        filters: filterString,
      };

      try {
        const { hits, nbHits } = await index.search(searchTerm, settings);
        fetchedResults = [...fetchedResults, ...hits];
        if (fetchedResults.length >= perPage || fetchedResults.length >= nbHits) {
          break;
        }
        resultsToFetch -= hits.length;
        startingPage++;
      } catch (err) {
        console.error("Error fetching Algolia results:", err);
        break;
      }
    }

    setResults([...fetchedResults]);
    setTotalHits(fetchedResults.length);
  };

  useEffect(() => {
    fetchResults();
  }, [searchTerm, memoizedSortBy, filterString]);

  return {
    rawResults: results,
    totalHits,
  };
};
