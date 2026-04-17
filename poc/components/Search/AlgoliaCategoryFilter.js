import ContentLoadingPlaceholder from "@components/Common/ContentLoadingPlaceholder";
import { useSearch } from "@hooks/useSearch";
import { toSnakeCase } from "@utils/textHelpers";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import AlgoliaCategoryList from "./AlgoliaCategoryList";

const CategoriesPlaceholder = () => {
  const categoryPlaceholder = (width) => (
    <li>
      <ContentLoadingPlaceholder
        styleOverrides={{
          height: "20px",
          marginBottom: "11px",
          marginTop: "2px",
          width: width,
          float: "left",
        }}
      />
      <ContentLoadingPlaceholder
        styleOverrides={{
          height: "20px",
          width: "32px",
          borderRadius: "10px",
          float: "right",
          marginLeft: "10px",
        }}
      />
    </li>
  );

  return (
    <>
      <ul className="categories-list-placeholder">
        {categoryPlaceholder("50%")}
        {categoryPlaceholder("60%")}
        {categoryPlaceholder("65%")}
        {categoryPlaceholder("50%")}
      </ul>
    </>
  );
};

const AlgoliaCategoryFilter = () => {
  const { categories, searchStatus, searchIndex, searchState, setSearchState, onSubmit } =
    useSearch();

  const router = useRouter();
  const [activeChild, setActiveChild] = useState(null);
  const [activeParent, setActiveParent] = useState(null);
  const [expandedParents, setExpandedParents] = useState({});
  const [hasCategories, setHasCategories] = useState(false);

  useEffect(() => {
    const { category, sub_category } = router.query;
    const findKey = (slug, pos) =>
      Object.keys(categories).find((key) => toSnakeCase(key.split(" > ")[pos]) === slug);

    const parentKey = category && findKey(category, 0);
    const childKey = sub_category && findKey(sub_category, 1);

    setExpandedParents(parentKey ? { [parentKey.split(" > ")[0]]: true } : {});
    setActiveChild(childKey ? childKey.split(" > ")[1] : null);
    setActiveParent(parentKey ? parentKey.split(" > ")[0] : null);
  }, [router.query, categories]);

  const handleParentClickOld = (parentKey) => {
    let newExpandedParents = {};

    const parentOfActiveChild = activeChild
      ? Object.keys(categories)
          .find((key) => key.endsWith(` > ${activeChild}`))
          ?.split(" > ")[0]
      : null;

    if (parentOfActiveChild) {
      newExpandedParents[parentOfActiveChild] = true;
    }

    if (parentKey !== parentOfActiveChild) {
      newExpandedParents[parentKey] = !expandedParents[parentKey];
    }

    setExpandedParents(newExpandedParents);
    updateUrl(toSnakeCase(activeParent), null);
    setActiveParent((prevParent) =>
      toSnakeCase(parentKey) === toSnakeCase(prevParent) ? null : parentKey
    );
    setSearchState((prevState) => ({
      ...prevState,
      sub_category: null,
      category: toSnakeCase(parentKey),
    }));
  };

  const handleParentClick = useCallback((parentKey) => {
    // setExpandedParents((prevExpandedParents) => ({ ...prevExpandedParents, [parentKey]: !prevExpandedParents[parentKey] }));
    // setActiveParent((prevParent) => (toSnakeCase(parentKey) === toSnakeCase(prevParent) ? null : parentKey));
    setSearchState((prevState) => ({
      ...prevState,
      sub_category: null,
      category: toSnakeCase(parentKey),
    }));
    updateUrl(toSnakeCase(parentKey), null);
  }, [updateUrl, setSearchState]);

  const onChildClick = useCallback((child, parent) => {
    setActiveChild((prevChild) =>
      toSnakeCase(child) === toSnakeCase(prevChild) ? prevChild : child
    );
    setExpandedParents({ [parent]: true });
    setSearchState((prevState) => ({
      ...prevState,
      sub_category: toSnakeCase(child),
      category: toSnakeCase(parent),
    }));

    updateUrl(toSnakeCase(parent), toSnakeCase(child));
  }, [updateUrl, setSearchState]);

  const clearChild = useCallback(() => {
    setActiveChild(null);
    setSearchState((prevState) => ({ ...prevState, sub_category: null }));
    updateUrl(toSnakeCase(activeParent), null);
  }, [activeParent, updateUrl, setSearchState]);

  const clearParent = useCallback(() => {
    setActiveParent(null);
    setExpandedParents({});
    setSearchState((prevState) => ({ ...prevState, category: null, sub_category: null }));
    updateUrl(null, null);
  }, [updateUrl, setSearchState]);

  const updateUrl = useCallback((parentSlug, childSlug) => {
    const contentBase = searchIndex == "listing" ? `/directory/` : `/${searchIndex}s/`;

    const query = { ...router.query };
    if (parentSlug) {
      query.category = parentSlug;
    } else {
      delete query.category;
      delete query.sub_category;
    }
    if (childSlug) {
      query.sub_category = childSlug;
    } else {
      delete query.sub_category;
    }
    delete query.pageNumber;
    router.push({ pathname: contentBase, query }, undefined, { shallow: true }).then(() => {
      window.scrollTo(0, 0);
    });
  }, [searchIndex, router]);

  useEffect(() => {
    setHasCategories(categories && Object.keys(categories).length > 0);
  }, [categories]);
  let content;

  const CategoryList = useCallback(
    () => (
      <AlgoliaCategoryList
        categories={categories}
        handleParentClick={handleParentClick}
        expandedParents={expandedParents}
        onChildClick={onChildClick}
        activeChild={activeChild}
        clearChild={clearChild}
        clearParent={clearParent}
      />
    ),
    [
      categories,
      expandedParents,
      activeChild,
      handleParentClick,
      onChildClick,
      clearChild,
      clearParent,
    ]
  );

  const NoResults = () => <div className="no-results">No categories found.</div>;

  switch (searchStatus) {
    case "error":
      content = <div className="error">Error fetching categories. Please reload to try again.</div>;
      break;
    case "searching":
      content = <CategoriesPlaceholder />;
      break;
    case "no-results":
    case "success":
      content = !categories || !hasCategories ? <NoResults /> : <CategoryList />;
      break;
    default:
      content = !hasCategories ? <NoResults /> : <CategoryList />;
      break;
  }

  return (
    <div id="category-filter-wrapper">
      <strong>Categories</strong>
      {content}
    </div>
  );
};

export default AlgoliaCategoryFilter;
