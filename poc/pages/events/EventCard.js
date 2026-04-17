import { eventDateInfo } from "@utils/events/utils";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";

const EventCard = ({ event }) => {
  useEffect(() => {
    // find all of the .event-content on the page and make them all
    // as tall as the tallest one
    const events = document.querySelectorAll(".event-content");
    let tallest = 0;
    events.forEach((event) => {
      if (event.offsetHeight > tallest) {
        tallest = event.offsetHeight;
      }
    });
    events.forEach((event) => {
      event.style.height = tallest + "px";
    });
  }, []);

  if (!event) {
    return (
      <div>
        Oops, we missed a step. But don&apos;t worry, we&apos;ll help you get back on track and on your way to
        finding the information you need.
      </div>
    );
  }

  const displayImages = (images) => {
    let url, alt;
    if (images.length > 0) {
      url = images[0].url + "?width=500";
      alt = images[0].alt ? images[0].alt : event.title + " featured image";
    } else {
      url = `/images/category-events.jpg?width=500`;
      alt = event.title + " featured image";
    }
    return (
      <div className="listings-image">
        <Image src={url.replace(/^http:\/\//i, "https://")} alt={alt} className="single-image" width={500} height={350} />
      </div>
    );
  };

  const displayLocation = () => {
    if (event.address) {
      let city = event.address.city ? event.address.city : "";
      let state = event.address.state_province ? event.address.state_province : "";
      if (city && state) return [city, state].join(", ");
      if (city) return city;
      if (state) return state;
    }
    return "";
  };

  const displayDate = () => {
    if (event.starts_at && event.ends_at) {
      let formattedDate = eventDateInfo(event, {
        dateFormat: "short",
        alwaysShowYear: false,
        weekday: true,
        time: false,
      });
      return formattedDate;
    }
    return "";
  };

  return (
    <>
      <div className="col-xl-4 col-lg-6 col-md-6" key={event.id}>
        {event && (
          <div className="single-listings-box">
            <Link href={`/${event.slug}/`}>
              {displayImages(event.images)}
              <div className="listings-content">
                  {/* if the listing is featured */}
                  {event.featured && (
                    <div className="supporter">
                      <div className="d-flex align-items-center">
                        <i
                          className="bx bxs-badge-check"
                          style={{ color: "#efc02e", marginRight: "2px" }}
                        ></i>
                        <span>Featured</span>
                      </div>
                    </div>
                  )}
                  <ul className="listings-meta" style={{ height: "70px" }}>
                    {displayDate() && (
                      <li>
                        <i className="flaticon-calendar"></i> {displayDate()}
                      </li>
                    )}
                    {displayLocation() && (
                      <li>
                        <i className="flaticon-pin"></i> {displayLocation()}
                      </li>
                    )}
                  </ul>

                  <div style={{ height: "43px" }}>
                    <h3>{event.title}</h3>
                  </div>
                </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};


export default EventCard;
