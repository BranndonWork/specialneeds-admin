import Link from "next/link";
import React from "react";

const ListingCardMinimal = ({ listing }) => {
  const displayImages = (images) => {
    let url, alt;
    if (images.length > 0) {
      url = images[0].url;
      alt = images[0].alt ? images[0].alt : listing.title + " featured image";
    } else {
      url = `/images/category-${listing.category.slug}.jpg`;
      alt = listing.alt ? listing.alt : listing.title + " featured image";
    }
    return (
      <>
        <div
          className="listings-image"
          style={{
            backgroundImage: `url(${url.replace(/^http:\/\//i, "https://")})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "150px",
            height: "100px",
          }}
          alt={alt}
        >
          <div className="category-name">{listing.category && listing.category.singular}</div>
        </div>

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
          .listings-image,
          .listings-image::before {
            border-radius: 5px;
          }
          .listings-image::before {
            opacity: 0;
          }
          .listings-image {
            min-width: 150px; /* Set a fixed minimum width for the thumbnail */
            min-height: 100px; /* Set a fixed minimum height for the thumbnail */
          }
        `}</style>
      </>
    );
  };

  const shortDescription = () => {
    if (listing.short_description) {
      // max character len 70, trim after the last word then add ellipsis
      let desc = listing.short_description.substring(0, 65).replace(/\s+\S*$/, "");
      if (desc.length < listing.short_description.length) {
        desc += "...";
      }
      return desc;
    } else {
      return "";
    }
  };

  return (
    <div className="col-lg-6 col-md-6" key={listing.id}>
      <div className="single-listings-box listing-card-minimal">
        <Link href={`/${listing.slug}/`} className="d-flex align-items-center">
          {displayImages(listing.images)}
          <div className="listing-info">
            <strong>{listing.title}</strong>
            {listing.short_description && (
              <div className="short-description">{shortDescription()}</div>
            )}
            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="rating">
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bx-star"></i>
                <span className="count">(10)</span>
              </div>
            ) : null}
          </div>
        </Link>
        <style jsx>{`
          .listing-card-minimal a:hover {
            text-decoration: none;
            color: var(--blackColor);
          }

          .listing-card-minimal {
            border: 1px solid #eaeaea;
            border-radius: 5px;
            margin-bottom: 1rem;
          }
          .listing-info {
            margin-left: 1rem;
          }
          .short-description {
            color: #555;
            font-style: italic;
            font-size: 14px;
            height: 40px;
            width: 90%;
            line-height: 20px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ListingCardMinimal;
