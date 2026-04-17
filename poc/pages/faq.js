import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";

const Faq = ({ pageTitle, faqs }) => {
  return (
    <>
      <HTMLHeaderMetaData
        title={pageTitle}
        description="Find answers to frequently asked questions about SpecialNeeds.com, our directory listings, and how to connect with special needs services."
        canonical="https://www.specialneeds.com/faq/"
      />
      <Navbar />
      <PageBanner bannerFilename="faq" pageTitle={pageTitle} pageName={pageTitle} />
      <section className="faq-area bg-f9f9f9 pt-100 pb-70">
        <div className="container">
          <div className="row">
            {faqs.map((faq, index) => (
              <div className="col-md-6 col-sm-121" key={index}>
                <div className="faq-item">
                  <h3>{faq.question}</h3>
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Faq;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages,
      pageTitle: messages.faq.pageTitle,
      faqs: messages.faq.faqs
    },
  };
}
