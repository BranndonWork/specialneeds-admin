import { eventDateInfo } from "@utils/events/utils";
import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const DisplayEvents = ({ events }) => {
  if (!events || events.length == 0) return null;

  function displayLocation(event) {
    let location = [];
    if (event.address.city) {
      location.push(event.address.city);
    }
    if (event.address.state_province) {
      location.push(event.address.state_province);
    }
    if (location && location.length > 0) {
      location = location.join(", ");
      // title case it
      location = location.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      return location;
    }
    return "Unknown";
  }

  function displayLarge(event) {
    return (
      <div className="col-lg-6 col-md-12">
        <div className="events-box">
          <Link href={`/${event.slug}/`} className="link-btn">
            <Image
              src={
                event.images && event.images.length > 0
                  ? event.images[0].url
                  : serveAsset("eventsBig", 300)
              }
              alt="image"
              width={300}
              height={200}
            />
            <div className="content">
              <h3>{event.title}</h3>
              <span className="meta">
                <i className="bx bx-calendar"></i>{" "}
                {eventDateInfo(event, { time: true, weekday: true })}
                <br />
                <i className="bx bx-map"></i> {displayLocation(event)}
              </span>
            </div>
          </Link>
        </div>
      </div>
    );
  }
  function displaySmall(events) {
    if (!events || events.length == 0) return null;
    const formatTime = (date) => {
      let hours = new Date(date).getHours().toString();
      if (hours > 12) hours = (hours - 12).toString();
      const minutes = new Date(date).getMinutes().toString().padStart(2, "0");
      return `${hours.replace(/^0/, "")}:${minutes}`;
    };

    const startsAt = `${new Date(events[0].starts_at).toDateString()} - ${formatTime(events[0].starts_at)}`;
    const endsAt = `${new Date(events[0].ends_at).toDateString()} - ${formatTime(events[0].ends_at)}`;

    return (
      <>
        <div className="col-lg-6 col-md-12">
          <div className="events-item-list">
            {events.map((event, index) => {
              return (
                <div key={index} className="single-events-box">
                  <Link href={`/${event.slug}`} className="link-btn">
                    <div className="row m-0 ">
                        <div className="col-lg-4 col-md-4 p-0">
                          <div
                            className="image"
                            style={{
                              backgroundImage: `url(${
                                event.images.length > 0
                                  ? event.images[0].url
                                  : serveAsset("events1", 300)
                              })`,
                            }}
                          >
                            <Image
                              src={
                                event.images.length > 0
                                  ? event.images[0].url
                                  : serveAsset("events1", 300)
                              }
                              width={200}
                              height={150}
                              alt="image"
                            />
                          </div>
                        </div>

                        <div className="col-lg-8 col-md-8 p-0">
                          <div className="content">
                            <div style={{ height: "43px" }}>
                              <h3>{event.title}</h3>
                            </div>

                            <div className="meta-dates">
                              <span className="meta">
                                <i className="bx bx-calendar"></i>{" "}
                                {eventDateInfo(event, {
                                  time: true,
                                  weekday: true,
                                })}
                                <br />
                                <i className="bx bx-map"></i> {displayLocation(event)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  function EventsList(events) {
    const subarrays = [];
    for (let i = 0; i < events.length; i += 7) {
      subarrays.push(events.slice(i, i + 7));
    }

    if (subarrays.length === 0) {
      return (
        <div className="col-lg-12 col-md-12">
          <p>No events found</p>
        </div>
      );
    }

    return (
      <>
        {subarrays.map((subarray, index) => (
          <React.Fragment key={String(index)}>
            {displayLarge(subarray[0])}
            {displaySmall(subarray.slice(1, 4))}
            {displaySmall(subarray.slice(3, 6))}
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <>
      <section className="events-area bg-f9f9f9 pt-100 pb-70">
        <div className="container">
          <div className="row">
            {EventsList(events)}
            <hr />

            {/* single big left */}
            <div className="col-lg-6 col-md-12">
              <div className="events-box">
                <Image src={serveAsset("eventsBig", 300)} alt="image" width={300} height={200} />
                <div className="content">
                  <h3>Global Robotics Summit & Festival</h3>
                  <span className="meta">
                    <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                  </span>
                </div>
                <Link href="/single-events" className="link-btn"></Link>
              </div>
            </div>
            {/* three small right */}
            <div className="col-lg-6 col-md-12">
              <div className="events-item-list">
                <div className="single-events-box">
                  <div className="row m-0">
                    <div className="col-lg-4 col-md-4 p-0">
                      <div className="image bg-1">
                        <Image src={serveAsset("events1", 300)} alt="image" width={300} height={200} />
                        <Link href="/single-events" className="link-btn"></Link>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8 p-0">
                      <div className="content">
                        <span className="meta">
                          <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                        </span>
                        <h3>
                          <Link href="/single-events">
                            Internet of Things Forum Africa Exhibition (IOTFA)
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="single-events-box">
                  <div className="row m-0">
                    <div className="col-lg-4 col-md-4 p-0">
                      <div className="image bg-2">
                        <Image src={serveAsset("events2", 300)} alt="image" width={300} height={200} />
                        <Link href="/single-events" className="link-btn"></Link>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8 p-0">
                      <div className="content">
                        <span className="meta">
                          <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                        </span>
                        <h3>
                          <Link href="/single-events">
                            Digital Marketing: Customer Engagement & Social Media
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="single-events-box">
                  <div className="row m-0">
                    <div className="col-lg-4 col-md-4 p-0">
                      <div className="image bg-3">
                        <Image src={serveAsset("events3", 300)} alt="image" width={300} height={200} />
                        <Link href="/single-events" className="link-btn"></Link>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8 p-0">
                      <div className="content">
                        <span className="meta">
                          <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                        </span>
                        <h3>
                          <Link href="/single-events">
                            International Agriculture and Technology Summit
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* three small left */}
            <div className="col-lg-6 col-md-12">
              <div className="events-item-list">
                <div className="single-events-box">
                  <div className="row m-0">
                    <div className="col-lg-4 col-md-4 p-0">
                      <div className="image bg-4">
                        <Image src={serveAsset("events4", 300)} alt="image" width={300} height={200} />
                        <Link href="/single-events" className="link-btn"></Link>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8 p-0">
                      <div className="content">
                        <span className="meta">
                          <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                        </span>
                        <h3>
                          <Link href="/single-events">
                            Internet of Things Forum Africa Exhibition (IOTFA)
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="single-events-box">
                  <div className="row m-0">
                    <div className="col-lg-4 col-md-4 p-0">
                      <div className="image bg-5">
                        <Image src={serveAsset("events5", 300)} alt="image" width={300} height={200} />
                        <Link href="/single-events" className="link-btn"></Link>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8 p-0">
                      <div className="content">
                        <span className="meta">
                          <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                        </span>
                        <h3>
                          <Link href="/single-events">
                            Digital Marketing: Customer Engagement & Social Media
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="single-events-box">
                  <div className="row m-0">
                    <div className="col-lg-4 col-md-4 p-0">
                      <div className="image bg-6">
                        <Image src={serveAsset("events6", 300)} alt="image" width={300} height={200} />
                        <Link href="/single-events" className="link-btn"></Link>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8 p-0">
                      <div className="content">
                        <span className="meta">
                          <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                        </span>
                        <h3>
                          <Link href="/single-events">
                            International Agriculture and Technology Summit
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="events-box">
                <Image src={serveAsset("eventsBig2", 300)} alt="image" width={300} height={200} />
                <div className="content">
                  <h3>Global Robotics Summit & Festival</h3>
                  <span className="meta">
                    <i className="flaticon-calendar"></i> Thu, Jul 30, 11:30 am - 10:00 pm
                  </span>
                </div>
                <Link href="/single-events" className="link-btn"></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default DisplayEvents;
