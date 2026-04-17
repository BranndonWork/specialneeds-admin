import moment from "moment";
import { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";

export const addressToQuery = (address, format = "display") => {
  if (!address) return;

  var location = [];
  if (address.street_1) location.push(address.street_1);
  if (address.street_2) location.push(address.street_2);
  if (address.city) location.push(address.city);
  if (address.state_province) location.push(address.state_province);
  if (address.postal_code) location.push(address.postal_code);
  if (address.country) location.push(address.country.toUpperCase());
  if (format == "query") {
    return location.join("+");
  } else if (format == "inline") {
    return location.join(", ");
  } else if (format == "display") {
    // display as:
    // street 1
    // street 2
    // city, state zipcode, country
    let locString = "";
    if (address.street_1) locString += address.street_1 + "<br/>";
    if (address.street_2) locString += address.street_2 + "<br/>";
    if (address.city || address.state_province || address.postal_code || address.country) {
      locString += [
        address.city,
        address.state_province,
        address.postal_code,
        address.country.toUpperCase(),
      ]
        .filter(Boolean)
        .join(", ");
    }
    return locString;
  }

  return address;
};

const AddToCalendar = function ({ event }) {
  const [selectedCalendar, setSelectedCalendar] = useState("");

  const handleAddToCalendar = (calendar) => {
    // Convert the local start and end times to UTC
    const startsAtLocal = moment(event.starts_at);
    const startsAtUtc = startsAtLocal.utc().format("YYYYMMDDTHHmmss[Z]");
    const endsAtLocal = moment(event.ends_at);
    const endsAtUtc = endsAtLocal.utc().format("YYYYMMDDTHHmmss[Z]");
    console.log("Starts at check", {
      startsAtUtc,
      startsAt: event.starts_at,
    });

    function buildGoogleCalendarUrl() {
      let googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE`;
      googleCalendarUrl += `&text=${encodeURIComponent(event.title)}`;

      googleCalendarUrl += `&dates=${encodeURIComponent(startsAtUtc)}/${encodeURIComponent(endsAtUtc)}`;
      googleCalendarUrl += `&location=`;
      googleCalendarUrl += event.location_title
        ? encodeURIComponent(event.location_title) + " "
        : "";
      googleCalendarUrl += addressToQuery(event.address, "inline");
      googleCalendarUrl +=
        "&details=Event Information: " +
        encodeURIComponent(
          '<a href="' +
            window.location.href +
            '?utm_source=gcal&utm_medium=referral">' +
            event.title +
            "</a>"
        ) +
        "<br/><br/>";
      googleCalendarUrl += encodeURIComponent(event.content_html);

      return googleCalendarUrl;
    }
    function buildIcalUrl() {
      return `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0ABEGIN:VEVENT%0D%0ASUMMARY:${encodeURIComponent(
        event.title
      )}%0D%0ALOCATION:${encodeURIComponent(event.location_title)}%0D%0ADESCRIPTION:${encodeURIComponent(
        event.url
      )}%0D%0ADTSTART:${encodeURIComponent(event.starts_at)}%0D%0ADTEND:${encodeURIComponent(
        event.ends_at
      )}%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR%0D%0A`;
      // let icalUrl = `data:text/calendar;charset=utf8,${encodeURIComponent('BEGIN:VCALENDAR')}`
      // icalUrl += encodeURIComponent(
    }

    function buildOutlook365Url() {
      return `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(
        event.title
      )}&startdt=${encodeURIComponent(event.starts_at)}&enddt=${encodeURIComponent(
        event.ends_at
      )}&location=${encodeURIComponent(event.location_title)}&body=${encodeURIComponent(event.url)}`;
    }

    function buildOutlookLiveUrl() {
      return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(
        event.title
      )}&startdt=${encodeURIComponent(event.starts_at)}&enddt=${encodeURIComponent(
        event.ends_at
      )}&location=${encodeURIComponent(event.location_title)}&body=${encodeURIComponent(event.url)}`;
    }

    let url = "";
    switch (calendar) {
      case "google":
        url = buildGoogleCalendarUrl();
        break;
      case "ical":
        url = buildIcalUrl();
        break;
      case "outlook-365":
        url = buildOutlook365Url();
        break;
      case "outlook-live":
        url = buildOutlookLiveUrl();
        break;
    }
    if (url) {
      window.open(url, "_blank");
      setSelectedCalendar("");
    }
  };

  return (
    <div className="form-group d-flex justify-content-center">
      <Form>
        <DropdownButton
          id="calendar-platform"
          title={selectedCalendar || "Add to Calendar"}
          variant="primary"
          size="sm"
          onSelect={(eventKey, event) => {
            setSelectedCalendar(event.target.innerText);
            handleAddToCalendar(eventKey);
          }}
        >
          <Dropdown.Item eventKey="google">Google Calendar</Dropdown.Item>
          <Dropdown.Item eventKey="ical">iCalendar</Dropdown.Item>
          <Dropdown.Item eventKey="outlook-365">Outlook 365</Dropdown.Item>
          <Dropdown.Item eventKey="outlook-live">Outlook Live</Dropdown.Item>
        </DropdownButton>
      </Form>
    </div>
  );
}


export default AddToCalendar;
