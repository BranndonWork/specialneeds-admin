// ./hooks/useSearch.js

// import { useAppContext } from "@hooks/contexts/useAppContext";
import { AppContext } from "@root/contexts";
import Utils from "@utils";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";


const defaultPerPage = 12;

const updateSearchState = (newValues, setSearchState) => {
  setSearchState((prevState) => ({ ...prevState, ...newValues }));
};

const extractSearchParams = (source) => {
  if (!Utils.isObject(source)) return {};
  let { sub_category, category, pageNumber, sortBy, q, perPage } = source;
  const builtQuery = {};
  q = q || source?.searchInput;
  if (q) builtQuery.q = q;
  if (sub_category) builtQuery.sub_category = sub_category;
  if (category) builtQuery.category = category;
  if (pageNumber) builtQuery.pageNumber = pageNumber;
  if (sortBy) builtQuery.sortBy = sortBy;
  if (perPage) builtQuery.perPage = perPage;
  if (builtQuery?.perPage === defaultPerPage) delete builtQuery.perPage;
  return builtQuery;
};

const canSearch = (searchState, router) => {
  const timeSinceInit = new Date().getTime() - searchState?.initTime;
  if (timeSinceInit < 1000 && searchState?.skipInitialSearch) return;
  return (
    typeof window !== "undefined" &&
    router.isReady &&
    searchState?.searchIndex &&
    searchState?.searchStatus !== "searching"
  );
};

const resetSearchResults = (setSearchState) => {
  return;
  updateSearchState(
    { results: [], categories: [], totalPages: null, totalHits: null },
    setSearchState
  );
};

const buildSearchPayload = async (searchState, router) => {
  const searchParams = extractSearchParams(router.query);

  const filters = {};
  if (searchParams.sub_category && searchParams.category) {
    filters.category_slug = `${searchParams.category}/${searchParams.sub_category}`;
    delete searchParams.category;
    delete searchParams.sub_category;
  } else if (searchParams.category) {
    filters.parent_category_slug = searchParams.category;
  }
  // const userPosition = await Utils.getUserLocation();
  // // if (searchParams.sortBy === "distance" && userPosition && userPosition.lat && userPosition.lng) {
  //   searchParams.aroundLatLng = `${userPosition.lat}, ${userPosition.lng}`;
  //   searchParams.aroundRadius = "all";
  //   searchParams.sortBy = "distance";
  // }

  return {
    ...searchParams,
    ...filters,
    index: `${searchState.searchIndex}s`,
  };
};

const fetchResults = async (searchState, setSearchState, router) => {
  if (!canSearch(searchState, router)) return;

  if (!router.isReady || !Utils.isObject(searchState)) return;
  updateSearchState({ searchStatus: "searching" }, setSearchState);

  const searchPayload = await buildSearchPayload(searchState, router);
  const stringifiedSearchPayload = JSON.stringify(searchPayload);
  if (searchState.previousSearch === stringifiedSearchPayload)
    return updateSearchState({ searchStatus: "" }, setSearchState);

  const {
    category_slug,
    parent_category_slug,
    aroundLatLng,
    aroundRadius,
    index,
    ...searchParams
  } = searchPayload;
  updateSearchState(
    {
      previousSearch: stringifiedSearchPayload,
      ...searchParams,
    },
    setSearchState
  );

  resetSearchResults(setSearchState);
  try {
    const searchID = Math.floor(Date.now() / 1000) * 42.67981652;
    const headers = {
      "search-id": searchID,
    };
    const { data } = await axios.get("/api/v1/search/", {
      params: searchPayload,
      headers,
    });
    if (!data?.results) throw new Error("No results returned from search API");
    updateSearchState(
      {
        searchStatus: data.results.length > 0 ? "success" : "no-results",
        results: data.results,
        categories: data.categories,
        totalPages: data.totalPages,
        totalHits: data.totalHits,
      },
      setSearchState
    );
  } catch (error) {
    updateSearchState({ searchStatus: "error", error }, setSearchState);
  }
};

export const useSearch = (initialState = {}) => {
  const router = useRouter();
  const { searchState, setSearchState } = useContext(AppContext);

  const onSubmit = (router, searchState) => {
    deleteFromSearchState("q");

    const searchParams = extractSearchParams(router.query);
    const stateParams = extractSearchParams(searchState);

    if (Utils.objectsAreEqual(searchParams, stateParams)) {
      return }
    let pathname = router.pathname;
    if (pathname === "/") {
      if (searchState?.searchIndex === "listing") pathname = "/directory/";
      else pathname = `/${searchState?.searchIndex}s/`;
    }
    router.push({ pathname, query: stateParams }, undefined);
  };

  const exportFunctions = {
    onSubmit: () => onSubmit(router, searchState),
    setSearchInput: (searchInput) => setSearchState((prevState) => ({ ...prevState, searchInput })),
  };

  const defaults = {
    categories: [],
    contentType: "",
    defaultPerPage: defaultPerPage,
    perPage: defaultPerPage,
    previousQuery: "",
    resultCardSize: "medium",
    results: [],
    searchInput: router?.query?.q || "",
    searchStatus: "",
    previousSearch: "",
    totalHits: null,
    totalPages: null,
    ...exportFunctions,
    ...(initialState || {}),
  };

  useEffect(() => {
    setSearchState((prevState) => ({
      ...prevState,
      ...defaults,
      ...searchState,
      ...exportFunctions,
    }));
  }, []);

  const deleteFromSearchState = (key) => {
    if (searchState.hasOwnProperty(key)) {
      setSearchState((prevState) => {
        const { [key]: deletedKey, ...rest } = prevState;
        return { ...rest };
      });
    }
  };

  // DISABLED: This causes infinite loops - searchState dependency triggers on every state change
  // useEffect(() => {
  //   deleteFromSearchState("q");
  // }, [searchState]);

  // Commenting out redundant useEffects that cause multiple fetches
  // useEffect(() => {
  //   if (!router.isReady) return;
  //   setSearchState((prevState) => ({
  //     ...prevState,
  //     ...defaults,
  //     ...searchState,
  //     searchInput: router?.query?.q || searchState?.searchInput || defaults?.searchInput || "",
  //   }));
  //   if (searchState?.searchIndex && initialState?.searchIndex === searchState?.searchIndex) {
  //     fetchResults(searchState, setSearchState, router);
  //   }
  // }, [router.isReady, searchState?.searchIndex]);

  // useEffect(() => {
  //   if (!initialState?.searchIndex) return;
  //   if (searchState?.searchIndex === initialState?.searchIndex) return;

  //   setSearchState((prevState) => ({
  //     ...defaults,
  //     ...initialState,
  //     initTime: new Date().getTime(),
  //     searchInput: router?.query?.q || searchState?.searchInput || defaults?.searchInput || "",
  //   }));

  //   fetchResults(searchState, setSearchState, router);
  // }, [initialState?.searchIndex]);

  // This should be the ONLY useEffect that triggers fetches
  useEffect(() => {
    if (!router.isReady) return;
    fetchResults(searchState, setSearchState, router);
  }, [router.query]);

  return { ...defaults, ...searchState, ...exportFunctions, setSearchState };
};
