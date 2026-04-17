import React, { useEffect, useState } from "react";
import SearchResultPagination from "./SearchResultPagination";
import EventCard from "./EventCard";
import { router } from "next/router";

const SearchResults = ({ events, totalPages, totalResults }) => {
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);
  const [sort, setSort] = useState("Default");

  useEffect(() => {
    if (router.query.sort) {
      setSort(router.query.sort);
    }
    setSort(router.query.sort || "Default");
  }, []);

  useEffect(() => {
    setEventsToDisplay(events);
    setDefaultEvents([...events]);
  }, [events]);

  const updateSort = (e) => {
    let newSort = e.target.value;
    setSort(newSort);
    if (newSort === "Default") {
      // remove the query param from the browser
      let newQuery = { ...router.query };
      delete newQuery.sort;
      router.push({
        pathname: router.pathname,
        query: {
          ...newQuery,
        },
      });
    } else {
      // add the query param to the browser
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          sort: newSort,
        },
      });
    }
  };

  const sortEvents = (events) => {
    if (!events) {
      return events;
    }

    let sortedEvents = [];
    if (sort === "Latest") {
      sortedEvents = events.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (sort === "Popularity") {
      sortedEvents = events.sort((a, b) => {
        return b.view_count - a.view_count;
      });
    } else {
      sortedEvents = [...defaultEvents];
    }

    return sortedEvents;
  };

  const renderEvents = () => {
    const display = [];
    if (eventsToDisplay) {
      sortEvents(eventsToDisplay).map((event, index) => {
        display.push(<EventCard key={index} event={event} />);
      });
    }
    return display;
  };

  return (
    <>
      <section className="listings-area ptb-100 bg-f9f9f9">
        <div className="container">
          <div className="listings-grid-sorting row align-items-center">
            <div className="col-lg-5 col-md-6 result-count">
              <p>
                We found <span className="count">{totalResults}</span> Events available for you
              </p>
            </div>

            <div className="col-lg-7 col-md-6 ordering">
              <div className="d-flex justify-content-end">
                <div className="select-box">
                  <label>Sort By:</label>
                  <select className="article-select" onChange={updateSort} value={sort}>
                    <option>Default</option>
                    <option>Popularity</option>
                    <option>Latest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {renderEvents()}
            <div className="col-xl-12 col-lg-12 col-md-12">
              {eventsToDisplay.length > 0 && <SearchResultPagination totalPages={totalPages} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResults;
