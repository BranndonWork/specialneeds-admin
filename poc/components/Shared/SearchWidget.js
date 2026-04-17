import constants from "@data/texts/en/constants.json";
import searchForm from "@data/texts/en/searchForm.json";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SearchWidget = ({ categories, refreshListings }) => {
  // search
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    if (router.query.search) {
      setSearch(router.query.search);
    }
    if (router.query.location) {
      let location = router.query.location;
      // strip off whitespace and any surrounding commas
      location = location
        .trim()
        .replace(/^,+|,+$|,/g, "")
        .trim();
      if (location !== "" && location !== router.query.location) {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            location,
          },
        });
      }
      setLocation(location);
    }
    if (router.query.category) {
      setCategory(router.query.category.toLowerCase().replace(/ /g, "-"));
    }
  }, [router.query, router]);

  useEffect(() => {
    if (!categories || categories.length === 0 || typeof categories === "undefined") {
      return;
    }
    // get the top 6 categories by number of listings
    // sort the object categories by the value of the key count
    const sorted = categories.sort((a, b) => {
      return b.count - a.count;
    });

    // get the first 6 categories
    setPopularCategories(sorted.slice(0, 6));
  }, [categories]);

  const submitHandler = (e) => {
    e.preventDefault();
    let newQuery = { ...router.query };
    delete newQuery.page;
    delete newQuery.search;
    delete newQuery.location;
    delete newQuery.category;
    if (search || location || category) {
      if (search) {
        newQuery.search = search;
      }
      if (location) {
        newQuery.location = location;
      }
      if (category && category !== searchForm.allCategories) {
        newQuery.category = category.toLowerCase().replace(/ /g, "-");
      }

      for (const key in newQuery) {
        if (newQuery[key] === "") {
          delete newQuery[key];
        }
      }

      router.push({
        pathname: router.pathname,
        query: {
          ...newQuery,
        },
      });
    } else {
      router.push({
        pathname: router.pathname,
        query: {
          ...newQuery,
        },
      });
    }
    refreshListings();
  };

  console.log("TODO: Make category options dynamic", categories);

  return (
    <>
      <div className="page-title-bg">
        <div className="container directory-page">
          <div className="banner-content">
            <h1 className="banner-two-heading d-block">
              {constants.specialNeeds}{" "}
              <div
                style={{ color: "var(--mainColor)" }}
                className="d-inline-block"
                dangerouslySetInnerHTML={{ __html: constants.search }}
              ></div>
            </h1>
            <p>{directorySearchArea.formSubTitle}</p>
            <form onSubmit={submitHandler}>
              <div className="row m-0 align-items-center">
                <div className="col-lg-4 col-md-12 p-0">
                  <div className="form-group">
                    <label>
                      <i className="flaticon-search"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={searchForm.searchPlaceholder}
                      name="search"
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-md-6 p-0">
                  <div className="form-group">
                    <label>
                      <i className="flaticon-pin"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={constants.location}
                      name="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-md-6 p-0">
                  <div className="form-group category-select">
                    <label className="category-icon">
                      <i className="flaticon-category"></i>
                    </label>
                    <select
                      className="banner-form-select-two"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>{searchForm.allCategories}</option>
                      {categories &&
                        categories.length &&
                        categories.map((category, index) => {
                          return (
                            <option key={index} value={category.slug}>
                              {category.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>

                <div className="col-lg-2 col-md-12 p-0">
                  <div className="submit-btn">
                    <button type="submit">{constants.search}</button>
                  </div>
                </div>
              </div>
            </form>

            {popularCategories && popularCategories.length > 0 && (
              <ul className="popular-search-list">
                <li>{constants.popular}:</li>
                {popularCategories.map((category, index) => {
                  return (
                    <li key={index}>
                      <Link href={`/directory/?category=${category.slug}`}>
                        {category.name} ({category.count})
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchWidget;
