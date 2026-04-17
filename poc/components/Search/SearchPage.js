import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import DisplaySearchState from "@components/Search/DisplaySearchState";
import SearchFooter from "@components/Search/SearchFooter";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import SearchResultCard from "@components/Search/SearchResultCard";
import AdUnit from "@components/Article/AdUnit";

import CustomBadge from "@components/Search/CustomBadge";
import ClearFilters from "@components/Search/ClearFilters";
import { getCachedSearchResults } from "@utils/cache/searchCache";
import FindProviderCTA from "@components/Article/FindProviderCTA";

const CategoryCountBadge = ({ count, handleClick }) => {
  let formattedCount = count;

  if (formattedCount > 999) {
    formattedCount = Math.floor(formattedCount / 100);
    formattedCount = `${formattedCount / 10}k`;
    formattedCount = formattedCount.replace(".0", "");
  } else {
    formattedCount = formattedCount.toLocaleString();
  }

  return <CustomBadge content={formattedCount} onClick={handleClick} title={count} />;
};

const CategoryList = ({ categories, currentCategory, currentSubCategory, onCategoryClick, initialExpandedParent }) => {
  const mappedCategories = useMemo(() => {
    const mapped = {};
    if (categories && Object.keys(categories).length > 0) {
      for (let [key, value] of Object.entries(categories)) {
        const [parent, child] = key.split(" > ");
        if (!mapped[parent]) mapped[parent] = { total: 0, children: {} };
        mapped[parent].total += value;
        if (child) mapped[parent].children[child] = value;
      }
    }
    return mapped;
  }, [categories]);

  // Calculate initial expanded state from SSR or current category
  const getInitialExpandedParents = () => {
    if (initialExpandedParent) {
      return { [initialExpandedParent]: true };
    }
    if (currentCategory && Object.keys(mappedCategories).length > 0) {
      const parentKey = Object.keys(mappedCategories).find(
        (p) => p.toLowerCase().replace(/\s+/g, "-") === currentCategory
      );
      return parentKey ? { [parentKey]: true } : {};
    }
    return {};
  };

  const [expandedParents, setExpandedParents] = useState(getInitialExpandedParents);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (currentCategory && Object.keys(mappedCategories).length > 0) {
      const parentKey = Object.keys(mappedCategories).find(
        (p) => p.toLowerCase().replace(/\s+/g, "-") === currentCategory
      );
      setExpandedParents(parentKey ? { [parentKey]: true } : {});
    } else {
      setExpandedParents({});
    }
  }, [currentCategory, currentSubCategory, mappedCategories]);

  if (!categories || Object.keys(categories).length === 0) {
    return <div className="no-results">No categories found.</div>;
  }

  const handleParentClick = (parent) => {
    onCategoryClick(parent);
  };

  const handleChildClick = (child, parent) => {
    onCategoryClick(`${parent} > ${child}`);
  };

  const clearParent = () => {
    onCategoryClick(null);
  };

  const clearChild = (parent) => {
    onCategoryClick(parent);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const scrollable = Object.keys(mappedCategories).length > 5;

  return (
    <>
      {scrollable && (
        <a href="#" onClick={toggleShowMore} className="show-more-categories">
          {showMore ? "Show Less" : "Show More"}
        </a>
      )}
      <ul id="algolia-category-list" className={scrollable && !showMore ? "scrollable" : ""}>
        {Object.entries(mappedCategories).map(([parent, details]) => {
          const isParentExpanded = !!expandedParents[parent];
          const parentSlug = parent.toLowerCase().replace(/\s+/g, "-");
          const isParentActive = parentSlug === currentCategory && !currentSubCategory;

          return (
            <li key={parent} style={{ cursor: "pointer" }}>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <a
                    onClick={() => handleParentClick(parent)}
                    className={isParentExpanded ? "active" : ""}
                  >
                    {parent}
                  </a>
                  {isParentExpanded && !currentSubCategory && (
                    <ClearFilters onClick={() => clearParent()} />
                  )}
                </div>
                <CategoryCountBadge
                  count={details.total}
                  handleClick={() => handleParentClick(parent)}
                />
              </div>

              {isParentExpanded && Object.keys(details.children).length > 0 && (
                <ul>
                  {Object.entries(details.children).map(([child, count]) => {
                    const childSlug = child.toLowerCase().replace(/\s+/g, "-");
                    const isChildActive =
                      parentSlug === currentCategory && childSlug === currentSubCategory;

                    return (
                      <li key={`${parent} > ${child}`} style={{ cursor: "pointer" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <a
                              onClick={() => handleChildClick(child, parent)}
                              className={isChildActive ? "active" : ""}
                            >
                              {child}
                            </a>
                            {isChildActive && <ClearFilters onClick={() => clearChild(parent)} />}
                          </div>
                          <CategoryCountBadge
                            count={count}
                            handleClick={() => handleChildClick(child, parent)}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

const SearchPage = ({ index, pathname, title, subTitle, initialResults, fullCategoryList: initialFullCategoryList, initialExpandedParent }) => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState(
    initialResults || {
      results: [],
      categories: {},
      totalHits: 0,
    }
  );
  const [fullCategoryList, setFullCategoryList] = useState(initialFullCategoryList || {});
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(!initialResults);
  const [showingCached, setShowingCached] = useState(false);
  const hasFetchedCategories = useRef(!!initialFullCategoryList);

  useEffect(() => {
    if (!router.isReady || hasFetchedCategories.current) return;

    const fetchFullCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/search/", {
          params: { index, perPage: 1 },
        });
        setFullCategoryList(data.categories || {});
        hasFetchedCategories.current = true;
      } catch (error) {
        console.error("Error fetching full categories:", error);
      }
    };

    fetchFullCategories();
  }, [router.isReady, index]);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setShowingCached(false);

      try {
        const searchParams = {
          q: router.query.q || "",
          category: router.query.category,
          sub_category: router.query.sub_category,
          pageNumber: router.query.pageNumber || 1,
          perPage: router.query.perPage || 12,
          index,
        };

        // Build the URL that will be cached by service worker
        const searchUrl = `/api/v1/search/?${new URLSearchParams(
          Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null))
        ).toString()}`;

        // Try to load from cache first (instant display)
        const cachedData = await getCachedSearchResults(searchUrl);
        if (cachedData) {
          setSearchResults({
            results: cachedData.results || [],
            categories: cachedData.categories || {},
            totalHits: cachedData.totalHits || 0,
            totalPages: cachedData.totalPages || 0,
          });
          setIsLoading(false);
          setShowingCached(true);
        }

        // Fetch fresh data in background (will update cache via service worker)
        const { data } = await axios.get("/api/v1/search/", { params: searchParams });

        setSearchResults({
          results: data.results || [],
          categories: data.categories || {},
          totalHits: data.totalHits || 0,
          totalPages: data.totalPages || 0,
        });
        setIsLoading(false);
        setShowingCached(false);
      } catch (error) {
        console.error("Search error:", error);
        setIsLoading(false);
        setShowingCached(false);
      }
    };

    fetchSearchResults();
  }, [
    router.isReady,
    router.query.q,
    router.query.category,
    router.query.sub_category,
    router.query.pageNumber,
    router.query.perPage,
    index,
  ]);

  useEffect(() => {
    setSearchInput(router.query.q || "");
  }, [router.query.q]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = { ...router.query };
    if (searchInput) {
      query.q = searchInput;
    } else {
      delete query.q;
    }
    delete query.pageNumber;
    router.push({ pathname, query }, undefined, { shallow: true });
  };

  const handleCategoryClick = (categoryName) => {
    const query = { ...router.query };

    if (!categoryName) {
      delete query.category;
      delete query.sub_category;
    } else {
      const parts = categoryName.split(" > ");

      if (parts.length === 2) {
        query.category = parts[0].toLowerCase().replace(/\s+/g, "-");
        query.sub_category = parts[1].toLowerCase().replace(/\s+/g, "-");
      } else {
        query.category = categoryName.toLowerCase().replace(/\s+/g, "-");
        delete query.sub_category;
      }
    }

    delete query.pageNumber;
    router.push({ pathname, query }, undefined, { shallow: true });
  };

  return (
    <>
      <HTMLHeaderMetaData title={title} description={subTitle} />
      <Navbar />
      <div id="algolia-search">
        <div className="page-title-bg no-form" style={{ padding: "50px 0" }}>
          <div className="container directory-page">
            <div className="banner-content">
              <h1 className="banner-two-heading d-block">
                Special Needs{" "}
                <div className="d-inline-block" style={{ color: "var(--mainColor)" }}>
                  {title}
                </div>
              </h1>
              <p>{subTitle}</p>
            </div>
          </div>
        </div>

        <div className="container">
          {showingCached && (
            <div className="cache-indicator">Showing cached results...</div>
          )}
          <div id="algolia-search-wrapper">
            <div id="algolia-hits-wrapper">
              <div style={{ visibility: isLoading && searchResults.results.length === 0 ? "hidden" : "visible" }}>
                <DisplaySearchState />
              </div>
              {isLoading && searchResults.results.length === 0 ? (
                <div className="loading-results">Loading results...</div>
              ) : searchResults.results.length === 0 ? (
                <div className="loading-results">No results found.</div>
              ) : (
                <div className="results-list results-size-medium">
                  {searchResults.results.map((result, index) => (
                    <React.Fragment key={result.objectID}>
                      <SearchResultCard result={result} />
                      {index % 5 === 4 && <AdUnit slot="in_feed_article_list" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div>
                <div id="algolia-sidebar-wrapper">
                  <FindProviderCTA />

                  <div className="col-12 position-relative">
                    <div className="form-group">
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>Search</strong>
                      </div>
                      <div className="search-input-wrapper">
                        <input
                          type="text"
                          className="form-control search-input"
                          placeholder="Search..."
                          name="search"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div id="category-filter-wrapper">
                    <strong>Categories</strong>
                    {isLoading &&
                    Object.keys(fullCategoryList).length === 0 &&
                    Object.keys(searchResults.categories).length === 0 ? (
                      <div className="loading-results">Loading categories...</div>
                    ) : (
                      <CategoryList
                        categories={
                          Object.keys(fullCategoryList).length > 0
                            ? fullCategoryList
                            : searchResults.categories
                        }
                        currentCategory={router.query.category}
                        currentSubCategory={router.query.sub_category}
                        onCategoryClick={handleCategoryClick}
                        initialExpandedParent={initialExpandedParent}
                      />
                    )}
                  </div>
                </div>
            </div>
          </div>
          <SearchFooter totalHits={searchResults.totalHits} totalPages={searchResults.totalPages} />
        </div>
      </div>
      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

export default SearchPage;
