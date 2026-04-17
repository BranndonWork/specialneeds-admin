import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import Image from "next/image";
const sampleEventsFormat = [
  {
    title: "Global Robotics Summit & Festival",
    date: "Thu, Jul 30, 11:30 am - 10:00 pm",
    image: serveAsset("eventsBig", 50),
    link: "/single-events",
  },
  {
    title: "Internet of Things Forum Africa Exhibition (IOTFA)",
    date: "Thu, Jul 30, 11:30 am - 10:00 pm",
    image: serveAsset("events1", 50),
    link: "/single-events",
  },
  {
    title: "Digital Marketing: Customer Engagement & Social Media",
    date: "Thu, Jul 30, 11:30 am - 10:00 pm",
    image: serveAsset("events2", 50),
    link: "/single-events",
  },
  {
    title: "International Agriculture and Technology Summit",
    date: "Thu, Jul 30, 11:30 am - 10:00 pm",
    image: serveAsset("events3", 50),
    link: "/single-events",
  },
];
const EventsArea = ({ events }) => {
  const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const renderEvent = ({ event, parentWrapper, subWrapper, layoutType }) => {
    if (layoutType === "box") {
      return (
        <div className={parentWrapper}>
          <Image src={event.image} alt="image" width={500} height={400} />
          <div className={subWrapper}>
            <h3>{event.title}</h3>
            <span className="meta">
              <i className="flaticon-calendar"></i> {event.date}
            </span>
            <Link href={event.link} className="link-btn"></Link>
          </div>
        </div>
      );
    }

    if (layoutType === "list") {
      return (
        <div className={parentWrapper}>
          <div className={subWrapper}>
            <div className="row m-0">
              <div className="col-lg-4 col-md-4 p-0">
                <div className="image" style={{ backgroundImage: `url(${event.image})` }}>
                  <Image src={event.image} alt="image" width={200} height={150} />
                  <Link href={event.link} className="link-btn"></Link>
                </div>
              </div>

              <div className="col-lg-8 col-md-8 p-0">
                <div className="content">
                  <span className="meta">
                    <i className="flaticon-calendar"></i> {event.date}
                  </span>
                  <h3>
                    <Link href={event.link}>
                      {event.title}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <section className="events-area pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>Upcoming Events</h2>
            <p>
              Explore our directory of special needs events. Discover a variety of activities,
              workshops, and conferences focused on providing supportive and inclusive experiences.
              Find opportunities to learn, connect, and celebrate.
            </p>
          </div>

          <div className="row">
            {chunk(events, 4).map((eventGroup, groupIndex) => (
              <>
                <div key={groupIndex * 4} className="col-lg-6 col-md-12">
                  {renderEvent({
                    event: eventGroup[0],
                    parentWrapper: "events-box",
                    subWrapper: "content",
                    layoutType: "box",
                  })}
                </div>

                <div
                  key={groupIndex * 4 + 1}
                  className={eventGroup.length > 1 ? "col-lg-6 col-md-12" : ""}
                >
                  {eventGroup.slice(1).map((event, index) =>
                    renderEvent({
                      event: event,
                      parentWrapper: "events-item-list",
                      subWrapper: "single-events-box",
                      layoutType: "list",
                    })
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};


export default EventsArea;
