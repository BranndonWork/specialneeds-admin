import HowItWorksSection from "@components/Common/HowItWorks";
import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";

const HowItWorks = ({ pageTitle, description, pageSteps, learnMoreText }) => {
  return (
    <>
      <HTMLHeaderMetaData title={pageTitle} description={description} />
      <Navbar />
      <PageBanner
        bannerFilename="how it works"
        pageTitle={pageTitle}
        pageName={pageTitle}
      />
      <section className="timeline-area ptb-100">
        <div className="container">
          <div className="main-timeline">
            {pageSteps.map((step, index) => (
              <div className="timeline" key={index}>
                <span className="icon">{index + 1}</span>
                <div className="timeline-content">
                  <h3 className="title">{step.title}</h3>
                  <p className="content">{step.content}</p>
                  {step.href && (
                    <a href={step.href} className="default-btn" target="_blank" rel="noreferrer">
                      {step.anchorText || learnMoreText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorksSection bgColor="bg-f9f9f9" />

      <Footer />
    </>
  );
};

export default HowItWorks;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages,
      pageTitle: messages.howItWorks.pageTitle,
      description: messages.howItWorks.description,
      pageSteps: messages.howItWorks.pageSteps,
      learnMoreText: messages.common.buttons.learnMore
    },
  };
}
