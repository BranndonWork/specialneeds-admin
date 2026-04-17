// AlgoliaResults.js

import ContentLoadingPlaceholder from "@components/Common/ContentLoadingPlaceholder";
import { useSearch } from "@hooks/useSearch";
import SearchResultCard from "./SearchResultCard";

const AlgoliaContentLoadingCard = ({ size }) => {
  // <ContentLoadingPlaceholder styleOverrides={{ height: "20px", width: "100%" }} />
  return (
    <a href="#" className="result-card">
      <div className="thumbnail" data-category="">
        <ContentLoadingPlaceholder styleOverrides={{ height: "100%", width: "100%" }} />
      </div>
      <div className="details">
        <div className="category-large">
          <ContentLoadingPlaceholder
            styleOverrides={{ height: "18px", width: "200px", marginTop: "15px" }}
          />
        </div>
        {/* Title */}
        <ContentLoadingPlaceholder styleOverrides={{ height: "22x" }} />
        {/* content */}
        <ContentLoadingPlaceholder
          styleOverrides={{ height: "18px", width: "95%", marginTop: "15px" }}
        />
        <ContentLoadingPlaceholder
          styleOverrides={{ height: "18px", width: "85%", marginTop: "5px" }}
        />
        <ContentLoadingPlaceholder
          styleOverrides={{ height: "18px", width: "15%", marginTop: "5px" }}
        />
      </div>
    </a>
  );
};

const AlgoliaContentLoading = ({ size }) => {
  return (
    <div className={`results-list results-size-${size}`}>
      <AlgoliaContentLoadingCard size={size} />
    </div>
  );
};

const AlgoliaResults = () => {
  const searchState = useSearch();
  const { results, searchStatus, perPage, resultCardSize } = searchState;

  if (typeof results === "undefined" || searchStatus === "searching") {
    return <AlgoliaContentLoading size={resultCardSize} />;
  }

  if (searchStatus === "error") {
    return (
      <div className={`results-list results-size-${resultCardSize}`}>
        <div className="loading-results">Error loading results.</div>
      </div>
    );
  }

  if (searchStatus === "no-results" || (Array.isArray(results) && results.length === 0)) {
    return (
      <div className={`results-list results-size-${resultCardSize}`}>
        <div className="loading-results">No results found.</div>
      </div>
    );
  }

  return (
    <>
      <strong className="results-title">Results</strong>
      <div className={`results-list results-size-${resultCardSize}`}>
        {results.slice(0, perPage).map((result) => (
          <SearchResultCard key={result.objectID} result={result} />
        ))}
      </div>
    </>
  );
};

export default AlgoliaResults;
