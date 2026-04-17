import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";

const ListingCard = ({ listing }) => {
  // const [distanceToUser, setDistanceToUser] = useState(false);

  useEffect(() => {
    // if (distanceToUser) return;
    // Utils.getDistanceFromUser(listing.address, socket).then((distance) => {
    //   console.log("distance", distance);
    //   if (distance) {
    //     setDistanceToUser(distance);
    //   }
    // });
  }, []);

  const displayImages = (images) => {
    if (!listing || !listing.category || !listing.category.slug) return null;

    let url, alt;
    if (images?.length > 0) {
      url = images[0].url;
      alt = images[0].alt || listing.title + " featured image";
    } else {
      url = `/images/category-${listing.category.slug}.jpg`;
      alt = listing.alt || listing.title + " featured image";
    }
    return (
      <div className="listings-image">
        <Image src={url.replace(/^http:\/\//i, "https://")} alt={alt} className="single-image" width={400} height={300} />
        <div className="category-name">{listing.category && listing.category.singular}</div>

        <style jsx>{`
          .category-name {
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a gray drop shadow effect */
            background-color: rgba(128, 128, 128, 0.5); /* gray with 50% opacity */
            z-index: 999999;
            display: block;
            position: absolute;
            color: white;
            font-weight: 600;
            bottom: 0px;
            width: 100%;
            text-align: center;
            padding: 2px 0;
            font-size: 14px;
            border-radius: 0 0 5px 5px;
          }
          .listings-image {
            position: relative;
          }
        `}</style>
      </div>
    );
  };

  const description = () => {
    if (listing.content_text) {
      // max character len 175, trim after the last word then add ellipsis
      let desc = listing.content_text.substring(0, 175);
      if (desc.length < listing.content_text.length) {
        desc = desc.substring(0, desc.lastIndexOf(" "));
        desc += "...";
      }
      return desc;
    } else {
      return "";
    }
  };

  return (
    <>
      <div className="col-xl-4 col-lg-6 col-md-6" key={listing.id}>
        {listing && (
          <div className="single-listings-box">
            <Link href={`/${listing.slug}/`}>
              {displayImages(listing.images)}
              <div className="listings-content">
                {/* if the listing is featured */}
                {listing.featured && (
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
                <ul className="listings-meta">
                  {listing.address && (
                    <li>
                      <i className="flaticon-pin"></i> {listing.address.city},{" "}
                      {listing.address.state_province}
                      {/* {distanceToUser && <span className="distance"> - {distanceToUser} miles away</span>} */}
                    </li>
                  )}
                </ul>
                <h3>{listing.title}</h3>

                {/* Business hours or availability */}
                {/* Phone number or contact information */}
                {/* Website or social media links */}
                {/* Reviews or ratings from other users */}
                {/* Amenities or features */}
                {/* Special promotions or deals
                <br /> */}
                {/* Payment options accepted */}
                {/* Availability or booking status */}
                {listing.content_text && (
                  <>
                    <div className="listing-description">{description()}</div>
                    <style jsx>{`
                      .listing-description {
                        color: #555;
                        font-style: italic;
                        font-size: 16px;
                        line-height: 20px;
                      }
                    `}</style>
                  </>
                )}
                {listing.reviews && listing.reviews.length > 0 ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="rating">
                      <i className="bx bxs-star"></i>
                      <i className="bx bxs-star"></i>
                      <i className="bx bxs-star"></i>
                      <i className="bx bxs-star"></i>
                      <i className="bx bx-star"></i>
                      <span className="count">(10)</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

// export default ListingCard;

import SearchResultCardFull from "../Search/FullViewCard";

const ListingCardFull = ({ listing }) => {
  return (
    <SearchResultCardFull
      item={listing}
      type="listing"
    />
  );
};

export default ListingCardFull;
