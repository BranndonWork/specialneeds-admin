import Link from "next/link";
import { router } from "next/router";
import { useState, useEffect, useCallback } from "react";

const ListingPagination = ({ totalPages }) => {
  const [showPagination, setShowPagination] = useState(false);
  const [paginationNumbers, setPaginationNumbers] = useState([1, 2, 3, 4]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (totalPages > 1) {
      setShowPagination(true);
      updatePagniation(getCurrentPage());
    } else {
      setShowPagination(false);
    }
  }, [totalPages, updatePagniation]);

  useEffect(() => {
    updateCurrentPage();
  }, [updateCurrentPage]);

  useEffect(() => {
    updateCurrentPage();
  }, [updateCurrentPage]);

  const getCurrentPage = () => {
    let parsedParams = new URLSearchParams(window.location.search);
    return parseInt(parsedParams.get("page") || 1);
  };

  const updatePagniation = useCallback((page) => {
    setPage(page);
    let numberOfPageNumbersToShow = 5;
    function paginationGrouped(numberOfPageNumbersToShow) {
      let pages = [];
      let startPage, endPage;
      if (totalPages <= numberOfPageNumbersToShow) {
        // less than numberOfPageNumbersToShow total pages so show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // more than numberOfPageNumbersToShow total pages so calculate start and end pages
        if (page <= Math.ceil(numberOfPageNumbersToShow / 2)) {
          startPage = 1;
          endPage = numberOfPageNumbersToShow;
        } else if (page + Math.floor(numberOfPageNumbersToShow / 2) >= totalPages) {
          startPage = totalPages - numberOfPageNumbersToShow + 1;
          endPage = totalPages;
        } else {
          startPage = page - Math.floor(numberOfPageNumbersToShow / 2);
          endPage = page + Math.floor(numberOfPageNumbersToShow / 2);
        }
      }

      // create an array of pages to ng-repeat in the pager control
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
    setPaginationNumbers(
      paginationGrouped(numberOfPageNumbersToShow).slice(0, numberOfPageNumbersToShow)
    );
  }, [totalPages]);

  const buildHref = (pagnationButton) => {
    let query = new URLSearchParams(window.location.search);
    let pageNumber = parseInt(query.get("page"));
    if (!pageNumber) {
      pageNumber = 1;
    }
    query.delete("page");

    if (pagnationButton === "prev") {
      pageNumber = pageNumber - 1;
    } else if (pagnationButton === "next") {
      pageNumber = pageNumber + 1;
    } else {
      pageNumber = parseInt(pagnationButton);
    }

    if (pageNumber >= 2) {
      query.set("page", String(pageNumber));
    }
    if (pageNumber > parseInt(totalPages)) {
      query.set("page", parseInt(totalPages));
    }
    if (pageNumber <= 1) {
      query.delete("page");
    }
    return `/directory?${query.toString()}`;
  };

  const updateCurrentPage = useCallback((e) => {
    updatePagniation(getCurrentPage());
  }, [updatePagniation]);

  return (
    <>
      <div
        style={{ visibility: showPagination ? "visible" : "hidden" }}
        className={`pagination-area text-center`}
      >
        <Link scroll={false} href={buildHref("prev")}>
          <a
            className={page === 1 ? "isDisabled prev page-numbers" : "prev page-numbers"}
            onClick={updateCurrentPage}
          >
            <i className="bx bx-chevrons-left"></i>
          </a>
        </Link>

        {paginationNumbers.map((x) => (
          <Link scroll={false} href={buildHref(x)} key={x}>
            <a
              className={x === page ? "current page-numbers" : "page-numbers"}
              onClick={updateCurrentPage}
            >
              {x}
            </a>
          </Link>
        ))}

        <Link scroll={false} href={buildHref("next")}>
          <a
            className={page === totalPages ? "isDisabled next page-numbers" : "next page-numbers"}
            onClick={updateCurrentPage}
          >
            <i className="bx bx-chevrons-right"></i>
          </a>
        </Link>
      </div>
    </>
  );
};

export default ListingPagination;
