import ContentLoadingPlaceholder from "@components/Common/ContentLoadingPlaceholder";
// import SidebarWidget from "@components/Directory/Display/SidebarWidget";
// import ListingUtils from "@utils/listing";
import Utils from "@utils";
import "react-tooltip/dist/react-tooltip.css";

const ContactInfo = ({ listing }) => {
  // Merge listing data with testing data
  const listingData = {
    ...listing.listing_data,
  };

  // Helper function to create contact detail elements
  const createContactElement = (prefix, iconClass, content, href, isHTML = false) => {
    return (
      <div className="contact-detail" key={prefix}>
        <i className={iconClass} style={{ marginRight: "8px" }}></i>
        <strong style={{ marginRight: "8px" }}>{prefix}</strong>
        {isHTML ? (
          <a href={href} target="_blank" dangerouslySetInnerHTML={{ __html: content }} rel="noreferrer"></a>
        ) : (
          <a href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        )}
      </div>
    );
  };

  const gridDetails = [];
  const fullWidthDetails = [];

  // Populate gridDetails array with elements for the grid
  if (listingData.phone) {
    const phoneDisplay = Utils.displayPhoneNumber(listingData);
    gridDetails.push(
      createContactElement("Phone:", "bx bx-phone-call", phoneDisplay, `tel:${listingData.phone}`)
    );
  }
  if (listingData.website) {
    gridDetails.push(
      createContactElement(
        "Website:",
        "bx bx-globe",
        listingData.website.split("://")[1],
        listingData.website,
        true
      )
    );
  }

  // Populate fullWidthDetails array with elements for full width
  if (listingData.email) {
    fullWidthDetails.push(
      createContactElement(
        "Email:",
        "bx bx-envelope",
        listingData.email,
        `mailto:${listingData.email}`
      )
    );
  }
  if (listingData.address.state_province && listingData.address.city) {
    const addressDisplay = Utils.displayAddress(listingData, true);
    const addressHref =
      "https://www.google.com/maps/search/?api=1&query=" + Utils.displayAddress(listingData);
    fullWidthDetails.push(
      createContactElement("Address:", "bx bx-map", addressDisplay, addressHref, true)
    );
  }

  // Return JSX or null if no details
  return gridDetails.length > 0 || fullWidthDetails.length > 0 ? (
    <>
      <div className="contact-info-grid">{gridDetails}</div>
      <div>{fullWidthDetails}</div>
      <hr />
      <style jsx>{`
        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          // gap: 16px;
        }
        @media (max-width: 768px) {
          .contact-info-grid {
            grid-template-columns: 1fr;
          }
        }
        .contact-detail {
          display: flex;
          align-items: center;
          margin-bottom: 16px; /* Adds spacing for full width elements */
        }
        .contact-detail strong {
          margin-right: 8px;
        }
      `}</style>
    </>
  ) : null;
};

const ListingMetadataPlaceholder = () => {
  return (
    <>
      <div className="entry-meta">
        <ul>
          <li>
            <i className="bx bx-folder-open"></i>
            <span>Category</span>
            <ContentLoadingPlaceholder styleOverrides={{ height: "19px" }} />
          </li>
          {/* <li>
            <i className="bx bx-group"></i>
            <span>Views</span>
            <ContentLoadingPlaceholder styleOverrides={{ height: '19px' }} />
          </li> */}
          <li>
            <i className="bx bx-calendar"></i>
            <span>Last Updated</span>
            <ContentLoadingPlaceholder styleOverrides={{ height: "19px" }} />
          </li>
        </ul>
      </div>
      <style jsx>{`
        .entry-meta {
          display: flex;
          justify-content: center;
        }

        .entry-meta ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  );
};

const ListingMetadata = ({ listing }) => {
  const date = new Date(listing?.listing_data?.updated_at || listing?.listing_data?.published_at);
  const dateString = date.toLocaleDateString();
  const dateParts = dateString.split("/");
  const newDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  const formattedDate = newDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (!listing?.listing_data?.title) {
    return <ListingMetadataPlaceholder />;
  }

  return (
    <>
      <div className="content-details-desc">
        <div className="content-content">
          <div className="entry-meta">
            <ul>
              <li className="category">
                <i className="bx bx-folder-open"></i>
                <span>Category</span>
                <a href={`/listings/?category=${listing?.listing_data?.category.parent.slug}`}>
                  {listing?.listing_data?.category.parent.name}
                </a>{" "}
                {" > "}
                <a
                  href={`/listings/?category=${listing?.listing_data?.category.parent.slug}&sub_category=${listing?.listing_data?.category.slug}`}
                  className="child-category"
                >
                  {listing?.listing_data?.category.name}
                </a>
              </li>
              {/* <li>
            <i className="bx bx-group"></i>
            <span>Views</span>
            {displayViewCount()}
          </li> */}
              <li className="last-updated">
                <i className="bx bx-calendar"></i>
                <span>Last Updated</span>
                {formattedDate}
              </li>
            </ul>
          </div>
          <ContactInfo listing={listing} />
          {/* <SidebarWidget widgetDetails={ListingUtils.getContactWidgetContent(listing)} /> */}
        </div>
      </div>

      <style jsx>{`
        .entry-meta {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 20px;
          padding: 0 10px;
          color: #333;
        }

        .entry-meta ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 10px;
          align-items: center;
          width: 100%;
        }
        .entry-meta ul li {
          padding-right: 0;
          border: none;
          font-size: 1rem;
        }

        .entry-meta ul li.category {
          font-weight: bold;
        }

        .entry-meta ul li.category .child-category {
          display: inline-block;
        }

        .entry-meta ul li.last-updated {
          flex-grow: 1;
          white-space: nowrap;
        }

        .entry-meta .icon {
          font-size: 1.2rem;
          margin-right: 5px;
        }
      `}</style>
    </>
  );
};
export default ListingMetadata;
