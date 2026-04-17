import constants from "@data/texts/en/constants.json";
import searchResults from "@data/texts/en/searchResults.json";
import useSearchPreferences from "@hooks/useSearchPreferences";
import useSort from "@hooks/useSort";
import { useRouter } from "next/router";
import useSearchUtils from "../../components/Search/utils";
import FormSelectControl from "../Shared/FormSelectControl";
import FullView from "./FullView";
import MinimalView from "./MinimalView";
import Pagination from "./Pagination";
const Results = ({
  contentType,
  items,
  totalPages,
  totalResults,
  searchState,
  refreshResults,
  tableData,
}) => {
  const router = useRouter();
  const searchUtils = useSearchUtils();
  const {
    defaultItems,
    itemsToDisplay,
    perPage,
    sort,
    searchResultDisplay,
    distanceEnabled,
    updateDisplay,
    updatePerPage,
    // setDefaultItems,
    // setItemsToDisplay
  } = useSearchPreferences({
    items,
    contentType,
    router,
    refreshResults,
  });

  const { updateSort, sortItems } = useSort({
    sort,
    defaultItems,
    distanceEnabled,
    router,
    searchUtils,
  });

  const renderItems = () => {
    if (!itemsToDisplay) return null;

    const sortedItems = sortItems(itemsToDisplay);

    if (searchResultDisplay === "minimal") {
      return (
        <MinimalView
          tableData={tableData}
        />
      );
    }

    return (
      <FullView
        items={sortedItems}
        fullCardProps={{
          contentType,
          showReviews: true,
        }}
      />
    );
  };

  return (
    <>
      <section className="listings-area ptb-100 bg-f9f9f9" style={{ position: "relative" }}>
        <div className="container">
          <div className="listings-grid-sorting row align-items-center">
            <div className="col-md-4 col-sm-12 result-count">
              {searchState === "done" && itemsToDisplay.length > 0 && (
                <>
                  <span className="count">{totalResults}</span>{" "}
                  {totalResults === 1
                    ? constants.result.toLowerCase()
                    : constants.results.toLowerCase()}{" "}
                  {constants.found.toLowerCase()}
                </>
              )}
            </div>
            <div className="col-md-8 col-sm-12 ordering">
              <div className="d-flex justify-content-end">
                <FormSelectControl
                  id="per-page-select"
                  label={searchResults.perPage}
                  value={perPage}
                  onChange={updatePerPage}
                  options={[
                    { value: 6, label: "6" },
                    { value: 9, label: "9" },
                    { value: 12, label: "12" },
                  ]}
                />
                <FormSelectControl
                  id="sort-by-select"
                  label={searchResults.sortBy}
                  value={sort || "relevance"}
                  onChange={updateSort}
                  options={[
                    { value: "relevance", label: searchResults.relevance },
                    {
                      value: "distance",
                      label: searchResults.distance,
                      condition: distanceEnabled,
                    },
                    { value: "popularity", label: searchResults.popularity },
                    { value: "latest", label: searchResults.latest },
                  ]}
                />
                <FormSelectControl
                  id="display-select"
                  label={searchResults.display}
                  value={searchResultDisplay}
                  onChange={updateDisplay}
                  options={[
                    { value: "full", label: searchResults.full },
                    { value: "minimal", label: searchResults.minimal },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="row">
            {renderItems()}
            <div className="col-xl-12 col-lg-12 col-md-12">
              {searchState === "done" && itemsToDisplay.length === 0 && (
                <div className="text-center">
                  <h3>{searchResults.noResults}</h3>
                </div>
              )}
              {searchState === "networkError" && itemsToDisplay.length === 0 && (
                <div className="text-center">
                  <h2 onClick={() => refreshResults(true)} className="text-primary" role="button">
                    {searchResults.networkError} &#x21bb;
                  </h2>
                </div>
              )}
              {itemsToDisplay.length > 0 && <Pagination totalPages={totalPages} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Results;
