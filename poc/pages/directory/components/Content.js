import FeaturedImage from "@components/Shared/FeaturedImage";
import ListingUtils from "@utils/listing";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DisplayContent from "../../../components/Directory/Display/Content";
import ContentSource from "../../../components/Directory/Display/ContentSource";
import FAQS from "../../../components/Directory/Display/FAQs";
import Reviews from "../../../components/Directory/Display/Reviews";
import config from "../../../config/config";
import ListingMetadata from "./ListingMetadata";


const Content = ({ listing }) => {
  const [listingData, setListingData] = useState({});
  const [categoryData, setCategoryData] = useState({});

  const [headerConfig, setHeaderConfig] = useState({});
  useEffect(() => {
    setHeaderConfig({
      showImages: true,
      showReviews: true,
    });
  }, [listingData]);

  useEffect(() => {
    ListingUtils.showNoTableDataMessage("");
  }, [listingData]);

  useEffect(() => {
    if (listing?.listing_data) setListingData(listing.listing_data);
    if (listing?.category_data) setCategoryData(listing.category_data);
  }, [listing?.listing_data, listing?.category_data]);

  const displayCategoryData = () => {

    // Helper function to check if a field's value is empty
    const isFieldValueEmpty = (field) => {
      return !field.attributes || !field.attributes.value || field.attributes.value.length === 0;
    };

    // for each item in the object category it is section_key and section_data
    return Object.values(categoryData).map((section_data, index) => {
      // Check if all fields are empty
      const areAllFieldsEmpty = Object.values(section_data.fields).every(isFieldValueEmpty);
      // If all fields are empty, render a "Data not available" message
      if (areAllFieldsEmpty) {
        return (
          <span className="mb-3 d-block" key={index}>
            <h2 style={{ fontSize: "1.5rem" }}>{section_data.label}</h2>
            <div className="section-subtitle">{section_data.description}</div>
            <p>No details available for this section.</p>
          </span>
        );
      }

      // If not all fields are empty, render the table
      return (
        <span className="mb-3 d-block" key={index}>
          <h2 style={{ fontSize: "1.5rem" }}>{section_data.label}</h2>
          <div className="section-subtitle">{section_data.description}</div>
          <Table bordered responsive>
            <tbody>
              {Object.values(section_data.fields).map((row, subIndex) => {
                return (
                  <React.Fragment key={subIndex}>{ListingUtils.displayRow(row)}</React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </span>
      );
    });
  };

  if (!headerConfig?.showImages) return null;
  const noImages = !headerConfig.showImages || !listingData?.images?.length;
  return (
    <div className={`article-content ${noImages ? "no-images" : ""}`}>
      {listingData?.title ? (
        <>
          <FeaturedImage contentData={listingData} />
          <h2 className="article-title">{listing?.listing_data?.title}</h2>
          <ListingMetadata listing={listing} />

          {/* <LightGallery content={listingData} options={{ displayDefaultImage: false }} /> */}
          <DisplayContent content={listingData} />
          <hr style={{ margin: "2rem 0" }} />
          {displayCategoryData()}
          {listingData.faqs.length > 0 && (
            <>
              <hr style={{ margin: "2rem 0" }} />
              <FAQS faqs={listingData.faqs} />
            </>
          )}
          {config.listingReviewsEnabled && (
            <Reviews
              listing={listing}
              enableAddReview={true}
            />
          )}
          <ContentSource content={listing} />
        </>
      ) : (
        <>
          {/* content placeholder */}
          <div
            style={{
              display: "block",
              backgroundColor: "#f2f4f5",
              height: "144px",
              width: "100%",
              marginBottom: "18px",
            }}
          ></div>
          <div
            style={{
              display: "block",
              backgroundColor: "#f2f4f5",
              height: "116px",
              width: "100%",
              marginBottom: "18px",
            }}
          ></div>
          <div
            style={{
              display: "block",
              backgroundColor: "#f2f4f5",
              height: "173px",
              width: "100%",
              marginBottom: "18px",
            }}
          ></div>
        </>
      )}
    </div>
  );
};


export default Content;
