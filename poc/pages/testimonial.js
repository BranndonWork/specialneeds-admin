import Feedback from "@components/Common/Feedback";

import PageBanner from "@components/Common/PageBanner";

import Footer from "@components/_App/Footer";
import Navbar from "@components/_App/Navbar";

const Testimonial = () => {
  return (
    <>
      <Navbar />

      <PageBanner bannerFilename="" pageTitle="Testimonials" pageName="Testimonials" />

      <Feedback />

      <Feedback bgImage="bg-image" />

      <Footer />
    </>
  );
};

export default Testimonial;
