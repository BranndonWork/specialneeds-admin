import Utils from "@utils";
import { useEffect, useState } from "react";

const useSearchPreferences = ({
  items,
  contentType,
  router,
  refreshResults,
}) => {
  const [defaultItems, setDefaultItems] = useState([]);
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [perPage, setPerPage] = useState(Utils.getPreference("searchResultsPerPage", 6));
  const [sort, setSort] = useState(
    router.query.sort || Utils.getPreference("searchResultsSort", "relevance")
  );
  const [searchResultDisplay, setSearchResultDisplay] = useState(
    Utils.getPreference("searchResultDisplay", "full")
  );
  const [distanceEnabled, setDistanceEnabled] = useState(false);

  useEffect(() => {
    setItemsToDisplay(items);
    setDefaultItems([...items]);
  }, [items]);

  useEffect(() => {
    if (router.query.sort) {
      setSort(router.query.sort);
    } else if (Utils.localStorage.get("searchResultsSort")) {
      setSort(Utils.localStorage.get("searchResultsSort"));
    } else {
      setSort("relevance");
    }
  }, [router.query?.sort]);

  useEffect(() => {
    if (contentType === "article") {
      setDistanceEnabled(false);
    }
  }, [contentType]);

  const updateDisplay = (e) => {
    setSearchResultDisplay(e.target.value);
    Utils.setPreference("searchResultDisplay", e.target.value);
  };

  const updatePerPage = (e) => {
    Utils.setPreference("searchResultsPerPage", e.target.value);
    setPerPage(e.target.value);
    refreshResults(true);
  };

  return {
    defaultItems,
    itemsToDisplay,
    perPage,
    sort,
    searchResultDisplay,
    distanceEnabled,
    updateDisplay,
    updatePerPage,
    setDefaultItems,
    setItemsToDisplay,
  };
};

export default useSearchPreferences;
