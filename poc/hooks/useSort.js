import Utils from "@utils";
import { useState } from "react";

const useSort = ({
  sort,
  defaultItems,
  distanceEnabled,
  router,
  searchUtils,
}) => {
  const [sortState, setSortState] = useState(sort);

  const updateSort = async (e) => {
    const newSort = e.target.value;
    if (newSort === sortState) return;

    if (!distanceEnabled && newSort === "distance") {
      return;
    }
    setSortState(newSort);
    Utils.setPreference("searchResultsSort", newSort);
    updateRouter(newSort);
  };

  const updateRouter = (newSort) => {
    let newQuery = { ...router.query };
    if (newSort === "relevance") {
      delete newQuery.sort;
    } else {
      newQuery.sort = newSort;
    }
    router.push({ pathname: router.pathname, query: newQuery });
  };

  const sortItems = (items) => {
    if (!items) return items;

    if (sortState === "latest") {
      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortState === "popularity") {
      return items.sort((a, b) => b.view_count - a.view_count);
    } else {
      return [...defaultItems];
    }
  };

  return { updateSort, sortItems };
};

export default useSort;
