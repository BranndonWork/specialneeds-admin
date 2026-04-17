// ./pages/article/index.js

import Pagination from "@components/Search/AlgoliaPagination";
import SearchControls from "@components/Search/SearchControls";
import { useSearch } from "@hooks/useSearch";

const SearchFooter = ({ totalHits: propTotalHits, totalPages: propTotalPages } = {}) => {
  const searchContext = useSearch();

  const totalHits = propTotalHits !== undefined ? propTotalHits : searchContext.totalHits;
  const totalPages = propTotalPages !== undefined ? propTotalPages : searchContext.totalPages;
  const defaultPerPage = searchContext.defaultPerPage;

  return (
    <div id="algolia-footer" className="container">
      <div className="bottom-bar">
        <div className="total-results">{totalHits ? <>Total Results: {totalHits}</> : null}</div>
        <div className="search-controls">
          <SearchControls defaultPerPage={defaultPerPage} />
        </div>
        <div className="pagination">
          {totalHits ? <Pagination totalPages={totalPages} totalHits={totalHits} /> : null}
        </div>
      </div>
    </div>
  );
};

export default SearchFooter;
