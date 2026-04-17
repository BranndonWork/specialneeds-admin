import searchForm from "@data/texts/en/searchForm.json";
import { useSearch } from "@hooks/useSearch";
import { useRef } from "react";

export const SearchInput = ({ compact = false }) => {
  const { searchInput, setSearchInput, onSubmit, previousQuery } = useSearch();

  const inputRef = useRef();

  const handleClear = (e) => {
    e.preventDefault();
    setSearchInput("");
    onSubmit();
  };

  const handleEscape = (e) => {
    if (e.key !== "Escape") return;
    setSearchInput(previousQuery);
    inputRef.current.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") return onSubmit();
    if (e.key === "Escape") return handleEscape(e);
  };

  const onChange = (e) => {
    setSearchInput(e.target.value);
  };

  const classes = compact ? "col-12 position-relative" : "col-lg-10 col-md-9 p-0 position-relative";

  return (
    <div className={classes}>
      <div className="form-group">
        {!compact ? (
          <label>
            <i className="flaticon-search"></i>
          </label>
        ) : (
          <div style={{ marginBottom: "1rem" }}>
            <strong>Search</strong>
          </div>
        )}
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="form-control search-input"
            placeholder={compact ? "Search..." : searchForm.searchPlaceholder}
            name="search"
            onKeyDown={handleKeyDown}
            onChange={onChange}
            value={searchInput}
          />
          {!compact && searchInput && (
            <button type="button" className="algolia-clear-button" onClick={handleClear}>
              Clear
            </button>
          )}
          {compact && (
            <span onClick={(e) => onSubmit()} role="button" className="search-icon">
              <i className="flaticon-search"></i>
            </span>
          )}
          <style jsx>{`
            .search-icon {
              position: absolute;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              padding: 10px 20px;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

const DisplayForm = () => {
  const { onSubmit } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="row m-0 align-items-center">
        <SearchInput />
        <div className="col-lg-2 col-md-3 p-0">
          <div className="submit-btn">
            <button type="submit">{searchForm.searchButton}</button>
          </div>
        </div>
      </div>
    </form>
  );
};

const SearchForm = ({ title, formSubTitle, displayForm = true }) => {
  return (
    <div className="container directory-page">
      <div className="banner-content">
        <h1 className="banner-two-heading d-block">
          {searchForm.specialNeeds}{" "}
          <div className="d-inline-block" style={{ color: "var(--mainColor)" }}>
            {title}
          </div>
        </h1>
        <p>{formSubTitle}</p>
        {displayForm && <DisplayForm />}
      </div>
    </div>
  );
};

export default SearchForm;
