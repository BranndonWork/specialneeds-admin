import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Pagination = ({ totalPages, totalHits }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const initialPageNumber = Math.min(
      Math.max(1, parseInt(router.query.pageNumber, 10) || 1),
      totalPages
    );
    setCurrentPage(initialPageNumber);
  }, [router.query.pageNumber, totalPages]);

  const setPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    if (pageNumber === currentPage) return;
    const updatedQuery = { ...router.query, pageNumber: pageNumber.toString() };
    if (pageNumber === 1) {
      delete updatedQuery.pageNumber;
    }
    router.push({ pathname: router.pathname, query: updatedQuery }, undefined, { shallow: true });
  };

  const pageNumbersToShow = (current, total) => {
    const pages = [];
    pages.push(1);
    let lowerLimit = Math.max(Math.min(current - 2, total - 4), 2);
    let upperLimit = Math.min(Math.max(current + 2, 5), total);
    if (lowerLimit <= 3) {
      for (let i = 2; i < upperLimit; i++) pages.push(i);
    } else {
      pages.push("...");
      for (let i = lowerLimit; i < upperLimit; i++) pages.push(i);
    }
    if (upperLimit < total - 1) {
      pages.push("...");
    }
    if (total > 1) pages.push(total);
    return pages;
  };

  // if (totalPages <= 1) return null;

  const visiblePages = pageNumbersToShow(currentPage, totalPages);

  return (
    <div className="col-lg-12 col-md-12">
      <div className="pagination-area">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(currentPage - 1)}
                aria-label="Previous"
                disabled={currentPage === 1}
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {visiblePages.map((number, index) =>
              number === "..." ? (
                <li key={number + index} className="page-item disabled">
                  <span className="page-link">{number}</span>
                </li>
              ) : (
                <li key={number} className={`page-item ${number === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(number)}>
                    {number}
                  </button>
                </li>
              )
            )}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(currentPage + 1)}
                aria-label="Next"
                disabled={currentPage === totalPages}
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
