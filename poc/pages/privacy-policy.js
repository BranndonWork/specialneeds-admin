import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";

const PrivacyPolicy = ({ pageTitle, subTitle, policies }) => {
  return (
    <>
      <HTMLHeaderMetaData
        title={pageTitle}
        description="Read the SpecialNeeds.com Privacy Policy to understand how we collect, use, and protect your personal information."
        canonical="https://www.specialneeds.com/privacy-policy/"
      />
      <Navbar />
      <PageBanner
        bannerFilename="privacy policy"
        pageTitle={pageTitle}
        pageName={pageTitle}
      />
      <div className="ptb-100 border-bottom">
        <div className="container">
          <div className="main-text-content">
            <h2>{subTitle}</h2>
            {policies.map((section, index) => (
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

export default PrivacyPolicy;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages,
      pageTitle: messages.privacyPolicy.pageTitle,
      subTitle: messages.privacyPolicy.subTitle,
      policies: messages.privacyPolicy.policies
    },
  };
}
