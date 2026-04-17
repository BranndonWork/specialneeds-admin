import EditButton from "../../../components/Shared/EditButton";
import { getTemplate } from "../../../components/Directory/Display/TemplateRouter";
import Content from "./Content";
import Sidebar from "./Sidebar";

const Display = ({ listing }) => {
  const Template = getTemplate(listing.listing_data?.category?.slug);

  if (Template) {
    return (
      <>
        {listing.isPreview && listing.listing_data.status != "published" && (
          <div className="alert alert-warning mt-5 mb-2" role="alert">
            <strong>
              This content is unpublished and is currently in preview mode. Only you have access
              to view it.
            </strong>
          </div>
        )}
        <EditButton content={listing} />
        <Template listing={listing} />
      </>
    );
  }

  return (
    <>
      <section className="article-details-area bg-f9f9f9 ptb-70 article">
        <div className="container">
          <div className="row">
            {listing.isPreview && listing.listing_data.status != "published" && (
              <div className="alert alert-warning mt-5 mb-2" role="alert">
                <strong>
                  This content is unpublished and is currently in preview mode. Only you have access
                  to view it.
                </strong>
              </div>
            )}
            <EditButton content={listing} />
            <div className="col-lg-8 col-md-12">
              <div className="article-details-desc">
                <Content
                  listing={listing}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-12 listing-sidebar">
              <Sidebar
                listing={listing}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default Display;
