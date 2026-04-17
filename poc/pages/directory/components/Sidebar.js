import ListingUtils from "@utils/listing";
// import StickyBox from "react-sticky-box";
import SidebarWidget from "@components/Directory/Display/SidebarWidget";
import FindProviderCTA from "@components/Article/FindProviderCTA";
import ClaimListingWidget from "@components/Directory/Display/ClaimListingWidget";
import config from "@config/config";

const Sidebar = ({ listing }) => {
  const claimed_by = listing?.listing_data?.claimed_by;
  const isClaimed = claimed_by && Object.keys(claimed_by).length > 0;
  const claimable = config.claimListingEnabled && !isClaimed;

  return (
    <>
      {/* <StickyBox offsetTop={90} offsetBottom={20}> */}
      <div className="listings-sidebar">
        <FindProviderCTA />

        {listing?.listing_data ? (
          <>
            {ListingUtils.getContactWidgetContent(listing) && (
              <SidebarWidget widgetDetails={ListingUtils.getContactWidgetContent(listing)} />
            )}
            {ListingUtils.getSocialMediaWidgetContent(listing) && (
              <SidebarWidget widgetDetails={ListingUtils.getSocialMediaWidgetContent(listing)} />
            )}
            {claimable && <ClaimListingWidget listing={listing} accentColor="#c25b0a" />}
          </>
        ) : (
          <>
            {/* content placeholder */}
            <div
              style={{
                display: "block",
                backgroundColor: "#f2f4f5",
                height: "157px",
                width: "100%",
                marginBottom: "30px",
              }}
            ></div>

            <div
              style={{
                display: "block",
                backgroundColor: "#f2f4f5",
                height: "231px",
                width: "100%",
                marginBottom: "0",
              }}
            ></div>
          </>
        )}
      </div>
      {/* </StickyBox> */}
    </>
  );
};

export default Sidebar;
