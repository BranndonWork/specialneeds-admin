import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";

const TermsAndConditions = ({ pageTitle, subTitle, terms }) => {
  return (
    <>
      <HTMLHeaderMetaData
        title={pageTitle}
        description="Review the SpecialNeeds.com Terms and Conditions governing use of our special needs directory and services."
        canonical="https://www.specialneeds.com/terms-and-conditions/"
      />
      <Navbar />
      <PageBanner
        bannerFilename="terms and conditions"
        pageTitle={pageTitle}
        pageName={pageTitle}
      />
      <div className="ptb-100 border-bottom">
        <div className="container">
          <div className="main-text-content">
            <h2>{subTitle}</h2>
            {terms.map((section, index) => (
              <p key={index}>
                <b>{section.title}</b>
                {section.content && (
                  <>
                    <br />
                    {section.content}
                  </>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages,
      pageTitle: messages.termsAndConditions.pageTitle,
      subTitle: messages.termsAndConditions.subTitle,
      terms: messages.termsAndConditions.terms
    },
  };
}
