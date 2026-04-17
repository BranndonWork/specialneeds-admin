import React from "react";
import SearchWidget from "./SearchWidget";

const Search = ({ refreshResults, popularTags }) => {
  return (
    <div className="page-title-bg">
      <div className="container directory-page">
        <SearchWidget refreshResults={refreshResults} popularTags={popularTags} />
      </div>
    </div>
  );
};


export default Search;
