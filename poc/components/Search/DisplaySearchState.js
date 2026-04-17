// ./pages/article/index.js

import { useSearch } from "@hooks/useSearch";
import { snakeCaseToTitleCase } from "@utils/textHelpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DisplaySearchState = () => {
  const router = useRouter();
  const { searchStatus } = useSearch();

  const [searchState, setSearchState] = useState({
    parentCategory: "",
    childCategory: "",
    query: "",
  });

  useEffect(() => {
    const { category, sub_category, q } = router.query;
    setSearchState({
      parentCategory: category ? snakeCaseToTitleCase(category) : "",
      childCategory: sub_category ? snakeCaseToTitleCase(sub_category) : "",
      query: q || "",
    });
  }, [router.query]);

  const { parentCategory, childCategory, query } = searchState;
  const isSearching = searchStatus === "searching";

  const generateSearchMessage = () => {
    let message = "";
    const baseText = isSearching ? "Searching" : "Results";

    if (query) {
      message =
        `${baseText} for: <strong>${query}</strong>` +
        (parentCategory ? ` in <strong>${parentCategory}</strong>` : "") +
        (childCategory ? ` > <strong>${childCategory}</strong>` : "");
    } else if (parentCategory || childCategory) {
      message =
        `${baseText} in:` +
        (parentCategory ? ` <strong>${parentCategory}</strong>` : "") +
        (childCategory ? ` > <strong>${childCategory}</strong>` : "");
    } else {
      message = baseText;
    }

    return <span dangerouslySetInnerHTML={{ __html: message }} />;
  };

  return (
    <div className="current-search">
      {generateSearchMessage()}
    </div>
  );
};
export default DisplaySearchState;
