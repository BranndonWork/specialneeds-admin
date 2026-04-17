import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchFilterBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [cityState, setCityState] = useState("");
  const [date, setDate] = useState(null);

  useEffect(() => {
    setSearch(router.query.search || "");
    setTags(router.query.tags || "");
    let cityState = `${router.query.city || ""}, ${router.query.state_province || ""}`.trim();
    if (cityState === ",") cityState = "";
    let city = "";
    let state = "";
    // if address__state is in the query
    if (router.query.address__state) {
      // if address__state is a state abbreviation
      state = getState(router.query.address__state);
    }
    // if address__city is in the query
    if (router.query.address__city) {
      // if address__city is a state abbreviation
      city = router.query.address__city;
    }
    // remove any extra commas from the beginning or end of the cityState
    cityState = `${city}, ${state}`.trim().replace(/^,|,$/g, "");
    if (cityState === ",") cityState = "";
    cityState = cityState.replace(/,,/g, ",").trim();

    setCityState(cityState);
    const eventDateParam = router.query.date;
    setDate(eventDateParam ? new Date(eventDateParam) : null);
  }, [router.query]);

  const getState = (state) => {
    state = state.trim();
    const states = {
      AL: "Alabama",
      AK: "Alaska",
      AS: "American Samoa",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      DC: "District Of Columbia",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VI: "Virgin Islands",
      VA: "Virginia",
      WA: "Washington",
      WDC: "Washington, D.C.",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
    };

    let lowerStateKeys = Object.keys(states).map((state) => state.toLowerCase());
    let lowerState = state.toLowerCase().replace(".", "").replace(".", "");
    let lowerStateValues = Object.values(states).map((state) => state.toLowerCase());

    if (lowerStateKeys.includes(lowerState)) {
      return lowerState.toUpperCase();
    }
    if (lowerStateValues.includes(lowerState)) {
      // return the key of the state
      return Object.keys(states).find((key) => states[key].toLowerCase() === lowerState);
    }
    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    function getCityAndState() {
      let cityStateSplit = cityState.split(",");
      let city = "";
      let state = "";
      if (cityStateSplit.length > 3) {
        // it's city, state, country
        cityStateSplit = [cityStateSplit[0], cityStateSplit[1]];
      }
      if (cityStateSplit.length == 2) {
        // it's city, state
        city = cityStateSplit[0].trim();
        state = cityStateSplit[1].trim();
        if (getState(state)) {
          state = getState(state);
        } else {
          city = `${city}, ${state}`;
          state = null;
        }
      } else if (cityStateSplit.length == 1) {
        // it's city or state
        if (getState(cityStateSplit[0].trim())) {
          state = getState(cityStateSplit[0].trim());
        } else {
          city = cityStateSplit[0].trim();
        }
      }
      console.log("Got city and state: ", {
        city,
        state,
        cityState,
        cityStateSplit,
      });
      return { city, state };
    }

    // build city and state from cityState
    let { city, state } = getCityAndState();

    const queryParams = {
      search,
      tags: tags.split(",").map((tag) => tag.trim()),
      city: city || null,
      state: state || null,
      date: date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString() : null,
    };

    console.log("Search: ", { queryParams });

    if (queryParams.date === "Invalid Date") {
      queryParams.date = null;
    } else if (queryParams.date) {
      queryParams.date = queryParams.date.split("T")[0];
    }
    // remove empty params
    Object.keys(queryParams).forEach((key) => {
      if (Array.isArray(queryParams[key])) {
        queryParams[key] = queryParams[key].filter((item) => item !== "");
        queryParams[key] = queryParams[key].filter((item) => item !== null);
      }
      if (
        queryParams[key] === "" ||
        queryParams[key] === null ||
        queryParams[key] === undefined ||
        queryParams[key].length === 0
      ) {
        delete queryParams[key];
      }
    });
    // update address keys
    Object.keys(queryParams).forEach((key) => {
      if (key === "city" || key === "state_province") {
        queryParams["address__" + key] = queryParams[key];
        delete queryParams[key];
      }
    });

    const queryString = new URLSearchParams(queryParams).toString();
    // the url will be /events?search=My%20Event&tags=adhd,movies&city=My%20City&state=MY&date=2021-01-01
    let url = `/events?${queryString}`;
    router.push(url);
  };

  const submitOnEnter = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      handleSubmit(event);
    }
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit} className="row">
        <Form.Group controlId="search" className="col-md-3 col-6">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={submitOnEnter}
          />
        </Form.Group>
        <Form.Group controlId="tags" className="col-md-3 col-6">
          <Form.Label>Tags (comma separated)</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            onKeyDown={submitOnEnter}
          />
        </Form.Group>
        <Form.Group controlId="cityState" className="col-md-3 col-6">
          <Form.Label>City, State</Form.Label>
          <Form.Control
            type="text"
            value={cityState}
            onChange={(event) => setCityState(event.target.value)}
            onKeyDown={submitOnEnter}
          />
        </Form.Group>
        <Form.Group controlId="date" className="col-md-3 col-6">
          <Form.Label>Event Date</Form.Label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="form-control"
            wrapperClassName="form-control"
            inputVariant="outlined"
            format="yyyy-MM-dd"
            autoOk
            clearable
            showTodayButton
          />
        </Form.Group>
        <div className="col-12 d-flex justify-content-end mt-3">
          <Button
            type="clear"
            onClick={(event) => {
              event.preventDefault();
              setSearch("");
              setTags("");
              setCityState("");
              setDate(null);
              // submit the form to clear the search
              // clear out the URL params
              window.history.pushState({}, document.title, window.location.pathname);
              // use router to reload the page dynamically with the new URL
              router.push(window.location.pathname);
            }}
          >
            Clear
          </Button>
          <Button type="submit">Search</Button>
        </div>
      </Form>
    </div>
  );
};

export default SearchFilterBar;
