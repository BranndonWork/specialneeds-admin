import constants from "@data/texts/en/constants.json";
import events from "@data/texts/en/events.json";
import searchForm from "@data/texts/en/searchForm.json";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchWidget = ({ popularTags }) => {
  // search
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    if (router.query.search) {
      setSearch(router.query.search);
    }
    if (router.query.location) {
      setLocation(router.query.location);
    }
    if (router.query.date) {
      setEventDate(router.query.date);
    }
  }, [router.query]);

  const submitHandler = (e) => {
    e.preventDefault();
    let newQuery = { ...router.query };
    delete newQuery.page;
    delete newQuery.search;
    delete newQuery.location;
    delete newQuery.date;
    if (search || location || eventDate) {
      if (search) {
        newQuery.search = search;
      }
      if (location) {
        newQuery.location = location;
      }
      if (eventDate) {
        newQuery.date = eventDate;
      }

      for (const key in newQuery) {
        if (newQuery[key] === "") {
          delete newQuery[key];
        }
      }
    }

    router.push({
      pathname: router.pathname,
      query: {
        ...newQuery,
      },
    });
  };

  return (
    <>
      <div className="banner-content">
        <h1 className="banner-two-heading d-block">
          {constants.specialNeeds}{" "}
          <div
            style={{ color: "var(--mainColor)" }}
            className="d-inline-block"
            dangerouslySetInnerHTML={{ __html: constants.events }}
          ></div>
        </h1>
        <p>{events.formSubTitle}</p>
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
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6 p-0">
              <div className="form-group event-date-select">
                <label className="calendar-icon">
                  <i className="flaticon-calendar"></i>
                </label>
                <DatePicker
                  className="form-control"
                  placeholderText={eventSearchArea.eventDate}
                  selected={eventDate}
                  onChange={(date) => setEventDate(date)}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-12 p-0">
              <div className="submit-btn">
                <button type="submit">{constants.search}</button>
              </div>
            </div>
          </div>
        </form>

        <ul className="popular-search-list">
          <li>{constants.popular}:</li>
          {popularTags &&
            popularTags.map((tag, index) => {
              return (
                <li key={index}>
                  <Link href={`/events/?search=${tag.tag}`}>
                    {tag.tag} ({tag.count})
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};


export default SearchWidget;
