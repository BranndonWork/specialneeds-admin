import AlgoliaCard from "@components/Search/AlgoliaCard";
import React from "react";

const AlgoliaResultsLarge = ({ results }) => {
  return (
    <ul className="ais-Hits-list">
      {results &&
        results.map(
          (hit) =>
            hit.status === "published" && (
              <li key={hit.objectID} className="ais-Hits-item">
                <AlgoliaCard item={hit} />
              </li>
            )
        )}
      {!results?.length && <div className="no-results">No results found</div>}
    </ul>
  );
};

export default AlgoliaResultsLarge;
