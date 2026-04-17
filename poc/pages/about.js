import config from "@config/config";
import Feedback from "@components/Common/Feedback";
import HowItWorks from "@components/Common/HowItWorks";
import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import TeamMember from "../components/About/TeamMember";
import { serveAsset } from "@utils/assetHelpers";
import Image from "next/image";

// Import v2 component
import AboutV2 from "@components/v2/About/AboutPage";

const AboutOurLogo = () => {
  return (
    <>
      <section className="team-area pt-100 bg-f9f9f9">
        <div className="container">
          <div className="section-title" style={{ marginBottom: "15px" }}>
            <h2>The SpecialNeeds.com Logo</h2>
          </div>

          <div className="row">
            <div className="col-md-4">
              <Image
                src={serveAsset("logoTreeLarge", 300)}
                alt="A logo with a tree and multicolored leaves"
                className="img-fluid"
                width={300}
                height={300}
              />
            </div>
            <div className="col-md-8">
              <p>
                Our logo, a tree with <span style={{ color: "red" }}>m</span>
                <span style={{ color: "orange" }}>u</span>
                <span style={{ color: "green" }}>l</span>
                <span style={{ color: "blue" }}>t</span>
                <span style={{ color: "indigo" }}>i</span>
                <span style={{ color: "violet" }}>c</span>
                <span style={{ color: "red" }}>o</span>
                <span style={{ color: "orange" }}>l</span>
                <span style={{ color: "green" }}>o</span>
                <span style={{ color: "blue" }}>r</span>
                <span style={{ color: "indigo" }}>e</span>
                <span style={{ color: "violet" }}>d</span> leaves, reflects the core philosophy of
                SpecialNeeds.com. The varied hues of the leaves illustrate the spectrum of human
                abilities, skills, and characteristics, acknowledging that while we are diverse,
                like the many colors of the leaves, we are all part of one community, akin to the
                branches of a single tree. This diversity is our strength, and it is as natural and
                beautiful as the array of colors in nature.
              </p>
              <p>
                This logo is a celebration of unity in diversity, growth in adversity, and the
                collective human experience. It serves as a visual representation of our commitment
                to providing support and resources that cater to the unique needs of each
                individual, promoting a more inclusive and nurturing society.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const AboutV1 = ({ aboutUsText }) => {
  return (
    <>
      <HTMLHeaderMetaData title="About Us" description="About SpecialNeeds.com" />
      <Navbar />
      <PageBanner
        bannerFilename="default"
        pageTitle={aboutUsText}
        pageName={aboutUsText}
      />
      <AboutOurLogo />
      <TeamMember />
      <HowItWorks />
      <Feedback bgColor="bg-f9f9f9" />
      <Footer />
    </>
  );
};

// Main component with version switching
const About = (props) => {
  // Switch between v1 and v2 based on API version config
  return config.apiVersion === 2
    ? <AboutV2 {...props} />
    : <AboutV1 {...props} />;
};

export default About;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages,
      aboutUsText: messages.common.terms.aboutUs
    },
  };
}
