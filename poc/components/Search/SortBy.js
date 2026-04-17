import Utils from "@utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SortBy = () => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState(router.query.sortBy || "relevance");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleSortByChange = async (newSortBy) => {
    if (newSortBy === "distance") await Utils.getUserLocation();
    setShowSortOptions(false);
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
    }
  };

  useEffect(() => {
    if (
      router.query?.sortBy &&
      router.query.sortBy !== "relevance" &&
      sortBy !== router.query.sortBy
    ) {
      setSortBy(router.query.sortBy);
    }
  }, [router, sortBy]);

  useEffect(() => {
    if (!router.isReady || !router.query) return;
    if (sortBy === router.query.sortBy) return;

    const updatedQuery = { ...router.query, sortBy };

    if (sortBy === "relevance") {
      delete updatedQuery.sortBy;
    }

    router.replace({ pathname: router.pathname, query: updatedQuery }, undefined, {
      shallow: true,
    });
  }, [sortBy, router]);

  return (
    <div className="sort-by-container" style={{ position: "relative", marginBottom: "1rem" }}>
      <div
        className="sort-by-label"
        onClick={() => setShowSortOptions(!showSortOptions)}
        style={{
          cursor: "pointer",
          padding: "0.5rem 1rem",
          background: "#f8f9fa",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        Sort by: {sortBy === "relevance" ? "Relevance" : "Distance"}
      </div>
      {showSortOptions && (
        <ul
          className="sort-options"
          style={{
            position: "absolute",
            listStyleType: "none",
            padding: "0",
            margin: "0",
            backgroundColor: "#ffffff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "200px",
            zIndex: 1000,
          }}
        >
          <li
            className="sort-option"
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
            onClick={() => handleSortByChange("relevance")}
          >
            Relevance {sortBy === "relevance" && "✓"}
          </li>
          <li
            className="sort-option"
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
            onClick={() => handleSortByChange("distance")}
          >
            Distance {sortBy === "distance" && "✓"}
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortBy;
