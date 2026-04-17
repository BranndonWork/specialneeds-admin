import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import Navbar from "@components/_App/Navbar";
import VerifiedBadgeIcon from "../components/Directory/VerifiedBadge";

const VerifiedBadge = ({ pageTitle, pageHeading, pageBody }) => {
  return (
    <>
      <Navbar />
      <PageBanner
        bannerFilename={pageTitle}
        pageTitle={pageTitle}
        pageName={pageTitle}
      />
      <section className={`how-it-works-area pt-100 pb-70 `}>
        <div className="container">
          <div className="section-title">
            <h2>
              {pageHeading}
              <VerifiedBadgeIcon asLink={false} />
            </h2>
          </div>
          <div
            className="row justify-content-center"
            dangerouslySetInnerHTML={{ __html: pageBody }}
          />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default VerifiedBadge;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages,
      pageTitle: messages.verifiedBadge.pageTitle,
      pageHeading: messages.verifiedBadge.pageHeading,
      pageBody: messages.verifiedBadge.pageBody
    },
  };
}
