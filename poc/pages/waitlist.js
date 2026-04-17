"use client";

import {useTranslations} from 'next-intl';
import waitlistData from "@data/texts/en/waitlist.json";
import ContactForm from "@components/Common/ContactForm";

import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";

const Waitlist = () => {
  const tCommon = useTranslations('common');
  const tWaitlist = useTranslations('waitlist');
  const onSuccess = () => {
    // Remove #contact-form from the
    document.getElementById("contact-form").remove();
  };
  return (
    <>
      <HTMLHeaderMetaData title={tWaitlist('pageTitle')} />
      <Navbar />
      <ContactForm
        onSuccess={onSuccess}
        apiPath="/api/v1/waitlist"
        pageTitle={tWaitlist('pageTitle')}
        contentText={waitlistData.welcomeMessage}
        successResponse={tWaitlist('successResponse')}
        submitButtonText={tWaitlist('submitButton')}
        fields={[
          {
            name: "email",
            label: tCommon('labels.email'),
            required: true,
            type: "email",
          },
          {
            name: "message",
            label: tWaitlist('messageFieldLabel'),
            required: false,
            type: "textarea",
          },
        ]}
      />
      <Footer />
    </>
  );
};

export default Waitlist;

export async function getStaticProps() {
  return {
    props: {
      messages: (await import('../messages/en.json')).default,
    },
  };
}
