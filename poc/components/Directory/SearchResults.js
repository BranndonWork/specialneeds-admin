import AppsIcon from "@mui/icons-material/Apps";
import ViewListIcon from "@mui/icons-material/ViewList";
import Utils from "@utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ContentLoading from "../../components/Shared/ContentLoading";
import ListingCard from "./ListingCard";
import ListingCardMinimal from "./ListingCardMinimal";
import ListingPagination from "./ListingPagination";

const SearchResults = ({
  listings,
  totalPages,
  totalResults,
  searchState,
  refreshResults,
}) => {
  const SORT_ENABLED = true;
  const router = useRouter();
  const [defaultListings, setDefaultListings] = useState([]);
  const [listingsToDisplay, setListingsToDisplay] = useState([]);
  const [sort, setSort] = useState(router.query.sort || "relevance");
  const [minimalView, setMinimalView] = useState(
    Utils.getPreference("directoryMinimalView", false)
  );

  const resizeListingCards = () => {
    Utils.sameSizeHeights(".listings-content");
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const resizeCards = () => {
      resizeListingCards();
    };

    // listen for content change of the .search-result-items div and resize cards
    const searchResults = document.querySelector(".search-result-items");
    const observer = new MutationObserver(resizeCards);
    observer.observe(searchResults, { childList: true });

    window.addEventListener("resize", resizeCards);

    setSort(router.query.sort || "relevance");

    return () => {
      window.removeEventListener("resize", resizeCards);
      observer.disconnect();
    };
  }, [router.query.sort]);

  useEffect(() => {
    setListingsToDisplay(listings);
    setDefaultListings([...listings]);
    resizeListingCards();
  }, [listings]);

  const updateSort = (e) => {
    const newSort = e.target.value;
    setSort(newSort);

    let newQuery = { ...router.query };
    if (newSort === "default") {
      delete newQuery.sort;
    } else {
      newQuery.sort = newSort;
    }
    router.push({ pathname: router.pathname, query: newQuery });
  };

  const sortListings = (listings) => {
    if (!listings) return listings;

    if (sort === "latest") {
      return listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "popularity") {
      return listings.sort((a, b) => b.view_count - a.view_count);
    } else {
      return [...defaultListings];
    }
  };

  const toggleThumbnailView = () => {
    Utils.setPreference("directoryMinimalView", !minimalView);
    setMinimalView(!minimalView);
  };

  const renderListings = () =>
    listingsToDisplay &&
    sortListings(listingsToDisplay).map((listing, index) =>
      minimalView ? (
        <ListingCardMinimal
          key={index}
          listing={listing}
        />
      ) : (
        <ListingCard
          key={index}
          listing={listing}
        />
      )
    );

  return (
    <>
      <section className="listings-area ptb-100 bg-f9f9f9">
        <div className="container">
          <div className="listings-grid-sorting row align-items-center">
            <div className="col-lg-5 col-md-6 result-count">
              <p>
                {searchState === "searching" && <span className="count">Searching...</span>}
                {searchState === "done" && (
                  <span>
                    We found <span className="count">{totalResults}</span> listings available for
                    you
                  </span>
                )}
              </p>
            </div>

            <div className="col-lg-7 col-md-6 ordering">
              <div className="d-flex justify-content-end">
                <div className="select-box">
                  <label>Results Per Page:</label>
                  <select
                    className="article-select"
                    onChange={(e) => {
                      Utils.localStorage.set("directoryResultsPerPage", e.target.value);
                      refreshResults();
                    }}
                    value={Utils.localStorage.get("directoryResultsPerPage", 6)}
                  >
                    <option>6</option>
                    <option>9</option>
                    <option>12</option>
                  </select>
                </div>
                {SORT_ENABLED && (
                  <div className="select-box">
                    <label>Sort By:</label>
                    <select className="article-select" onChange={updateSort} value={sort}>
                      <option value="relevance" selected={sort === "relevance"}>
                        Relevance
                      </option>
                      <option value="distance" selected={sort === "distance"}>
                        Distance
                      </option>
                      <option value="popularity" selected={sort === "popularity"}>
                        Popularity
                      </option>
                      <option value="latest" selected={sort === "latest"}>
                        Latest
                      </option>
                    </select>
                  </div>
                )}

                <button
                  className="thumbnail-toggle-btn"
                  onClick={toggleThumbnailView}
                  title={minimalView ? "Switch to full view" : "Switch to minimal view"}
                >
                  {minimalView ? <ViewListIcon /> : <AppsIcon />}
                </button>

                <style jsx>{`
                  .thumbnail-toggle-btn {
                    background: none;
                    border: none;
                    color: #333;
                    font-size: 24px;
                    cursor: pointer;
                    margin-left: 10px;
                  }
                `}</style>
              </div>
            </div>
          </div>

          <div className="row search-result-items">
            {renderListings()}
            <div className="col-xl-12 col-lg-12 col-md-12">
              {searchState === "done" && listingsToDisplay.length === 0 && (
                <div className="text-center">
                  <h3>No results found</h3>
                </div>
              )}
              {searchState === "done" && listingsToDisplay.length > 0 && (
                <ListingPagination totalPages={totalPages} />
              )}
              {searchState === "searching" && <ContentLoading />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default SearchResults;
