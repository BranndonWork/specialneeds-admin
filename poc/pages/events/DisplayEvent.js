import Utils from "@utils";
import { eventDateInfo } from "@utils/events/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import EditButton from "../../components/Shared/EditButton";
import Images from "../../components/Shared/Images";
import ShareButtons from "../../components/Shared/ShareButtons";
import AddToCalendar, { addressToQuery } from "./AddToCalendar";
import CountDown from "./CountDown";
import EventMap from "./EventMap";

const DisplayEvent = ({ event, addCustomHeadTag }) => {
  const [isClientSide, setIsClientSide] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressDisplay, setAddressDisplay] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsClientSide(true);
  }, [event]);

  if (!event) {
    return (
      <div>
        We apologize for any inconvenience. Let&apos;s take a deep breath and start again with a fresh
        perspective.
      </div>
    );
  }

  const displayLocation = () => {
    // it's stored as event.address.street_1, event.address.street_2, event.address.city, event.address.state_province, event.address.postal_code, event.address.country
    // display it as City, State, Country
    var location = [];
    if (event.address.city) location.push(event.address.city);
    if (event.address.state_province) location.push(event.address.state_province);
    if (event.address.country) location.push(event.address.country.toUpperCase());
    return location.join(", ");
  };

  const displaySocialMedia = () => {
    if (!event.social_media) return;
    var socialMedia = "";

    if (event.social_media.facebook) {
      socialMedia += `<span class="event-social-media"><i class='bx bxl-facebook-square'></i> <a href="${event.social_media.facebook}" target="_blank">Facebook</a></span>`;
    }
    if (event.social_media.instagram) {
      socialMedia += `<span class="event-social-media"><i class='bx bxl-instagram'></i> <a href="${event.social_media.instagram}" target="_blank">Instagram</a></span>`;
    }
    if (event.social_media.pinterest) {
      socialMedia += `<span class="event-social-media"><i class='bx bxl-pinterest'></i> <a href="${event.social_media.pinterest}" target="_blank">Pinterest</a></span>`;
    }
    if (event.social_media.twitter) {
      socialMedia += `<span class="event-social-media"><i class='bx bxl-twitter'></i> <a href="${event.social_media.twitter}" target="_blank">Twitter</a></span>`;
    }
    if (event.social_media.whatsapp) {
      socialMedia += `<span class="event-social-media"><i class='bx bxl-whatsapp'></i> <a href="${event.social_media.whatsapp}" target="_blank">WhatsApp</a></span>`;
    }
    if (event.social_media.youtube) {
      socialMedia += `<span class="event-social-media"><i class='bx bxl-youtube'></i> <a href="${event.social_media.youtube}" target="_blank">YouTube</a></span>`;
    }

    if (socialMedia == "") return;

    return (
      <div className="events-details-info">
        <ul className="info">
          <li>
            <span>Get More Info on Social</span>{" "}
            <div dangerouslySetInnerHTML={{ __html: socialMedia }} />
          </li>
        </ul>
      </div>
    );
  };

  const displayContactInfo = () => {
    function generateEmailLink() {
      const pageHref =
        "https://" +
        window.location.hostname +
        window.location.pathname +
        "?utm_source=email&utm_medium=referral&utm_campaign=events";
      const pageLink = `<a href="${pageHref}">SpecialNeeds.com</a>`;
      const bodyText = `Hi there!<br/><br/>I found the ${event.title} event on ${pageLink} and I'm interested in learning more. Can you provide me with more information about the event, such as any special accommodations that will be available?<br/><br/>Thank you for your time, and I look forward to hearing back from you soon.`;
      const subject = `Inquiry about the event - ${event.title}`;
      const encodedBodyText = encodeURIComponent(bodyText);
      const encodedSubject = encodeURIComponent(subject);
      const href = `mailto:${event.contact.email}?subject=${encodedSubject}&body=${encodedBodyText}`;
      return href;
    }

    let contactInfo = [];
    if (event.organizer_url && event.organizer_url != "")
      contactInfo.push(
        <li key="organizer">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Organizer</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: Utils.displayWebLink(
                  event.organizer_url,
                  event.organizer ? event.organizer : event.organizer_url
                ),
              }}
            />
          </div>
        </li>
      );

    if (event.contact.email)
      contactInfo.push(
        <li key="email">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Contact Email</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: Utils.displayWebLink(generateEmailLink(), event.contact.email),
              }}
            />
          </div>
        </li>
      );
    if (event.contact.phone)
      contactInfo.push(
        <li key="phone">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Contact Phone</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: Utils.displayWebLink(
                  `tel:${String(event.contact.phone)}`,
                  Utils.displayPhoneNumber(event)
                ),
              }}
            />
          </div>
        </li>
      );
    if (contactInfo == []) return;
    return contactInfo.map((info, index) => {
      return info;
    });
  };

  const displayEventCost = () => {
    if (!event.cost) return;

    return (
      <li>
        <div className="d-flex justify-content-between align-items-center">
          <span>Cost</span>
          {event.cost}
        </div>
      </li>
    );
  };

  const displayTags = () => {
    if (!event.tags || event.tags.length == 0) return;
    return (
      <>
        <h3>Tags</h3>
        <div className="event-tags">
          {event.tags.map((tag, index) => {
            return (
              <Link href={`/events?search=${tag}`} key={index} className="event-tag">
                {tag}
              </Link>
            );
          })}
        </div>
      </>
    );
  };

  const displayAddressWithLink = (event) => {
    const { address, location_name, title } = event;

    let queryAddress;
    let displayAddress;

    if (addressQuery) {
      queryAddress = addressQuery;
    } else {
      queryAddress = addressToQuery(address, "query");
      setAddressQuery(queryAddress);
    }

    if (addressDisplay) {
      displayAddress = addressDisplay;
    } else {
      displayAddress = addressToQuery(address, "display");
      setAddressDisplay(displayAddress);
    }

    const locationName = location_name || title;

    const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${queryAddress}`;
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${queryAddress}`;

    const openURL = `<a href="${googleMapLink}" target="_blank"><span style="color:black"><b>${locationName}</b><br>${displayAddress}</span><br>Open in Google Maps</a>`;
    const directionsURL = `<a href="${directionsLink}" target="_blank">Get Directions</a>`;

    return `${openURL}<br/>${directionsURL}`;
  };

  return (
    <>
      <section className="events-details-area bg-f9f9f9 pb-50">
        <div className="container">
          <EditButton content={event} />
          <CountDown event={event} />

          <h1>{event.title}</h1>

          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="events-details-box">
                <ul>
                  <li>
                    <i className="bx bx-calendar"></i>
                    {event.starts_at && event.ends_at
                      ? eventDateInfo(event, {
                          year: true,
                          weekday: true,
                          time: true,
                        })
                      : ""}
                  </li>
                  <li>
                    <i className="bx bx-map"></i>
                    {displayLocation()}{" "}
                    <a
                      href="#"
                      className="hint-text"
                      onClick={(e) => {
                        e.preventDefault();
                        // toggle the display of #map
                        document.getElementById("map").style.display =
                          document.getElementById("map").style.display === "none"
                            ? "block"
                            : "none";
                        if (document.getElementById("map").style.display === "none") {
                          e.target.innerHTML = "(show map)";
                        } else {
                          e.target.innerHTML = "(hide map)";
                        }
                      }}
                    >
                      (hide map)
                    </a>
                  </li>
                </ul>
              </div>

              <EventMap
                event={event}
                addCustomHeadTag={addCustomHeadTag}
                displayAddressWithLink={displayAddressWithLink}
              />

              <div className="events-details-desc">
                {isClientSide && displayAddressWithLink(event) != "" ? (
                  <>
                    <h3>Event Location</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: displayAddressWithLink(event),
                      }}
                    ></div>
                  </>
                ) : null}

                {event.content_html && event.content_html.length > 0 && (
                  <>
                    <h3>About The Event</h3>
                    <div dangerouslySetInnerHTML={{ __html: event.content_html }}></div>
                  </>
                )}

                {event.images && event.images.length > 0 && (
                  <>
                    <h3>Event Images</h3>
                    <Images content={event} />
                  </>
                )}

                {displayTags()}
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="events-details-info">
                <div className="share-info">
                  <div className="text-center">
                    <strong>Share This Event</strong> <i className="flaticon-share"></i>
                  </div>
                  <ShareButtons
                    content={event}
                    disabled={["whatsapp", "pinterest"]}
                    listWrapperInlineStyles={{ textAlign: "center", marginBottom: "10px" }}
                  />
                </div>
                <AddToCalendar event={event} />
                {isClientSide && (
                  <>
                    {(displayEventCost() || displayContactInfo()) && (
                      <ul className="info">
                        {displayEventCost()}
                        {displayContactInfo()}
                      </ul>
                    )}
                  </>
                )}
              </div>
              {displaySocialMedia()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default DisplayEvent;
