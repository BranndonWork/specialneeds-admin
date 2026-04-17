import React from "react";
import SearchWidget from "../Shared/SearchWidget";

const PopularPlacesFilter = ({ refreshListings, categories }) => {
  return (
    <div className="page-title-bg">
      <div className="container directory-page">
        <SearchWidget categories={categories} refreshListings={refreshListings} />
      </div>
    </div>
  );
};

export default PopularPlacesFilter;
