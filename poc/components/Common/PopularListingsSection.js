import Link from "next/link";
import React from "react";
import FullViewCard from "../Search/FullViewCard";

const PopularListingsSection = ({ bgColor, listings }) => {
  return (
    <>
      <section className={`listings-area ptb-100 ${bgColor}`}>
        <div className="container">
          <div className="section-title">
            <h2>Popular Listings</h2>
            <p>
              Discover our top-rated listings for special needs resources over the past 30 days.
              Whether you&apos;re searching for a therapist, school, or camp, we have carefully curated
              the best options available. Take a look through our selection to find the perfect fit
              for your specific needs.
            </p>
          </div>

          <div className="row">
            {listings &&
              listings.length > 0 &&
              listings.map(
                (listing, index) =>
                  listing.status === "published" && (
                    <FullViewCard item={listing} key={index} type="listings" />
                  )
              )}

            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="more-listings-box">
                <Link href="/directory/" className="default-btn">
                  More Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default PopularListingsSection;
