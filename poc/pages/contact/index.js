"use client";

import {useTranslations} from 'next-intl';
import ContactForm from "@components/Common/ContactForm";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ContactPage = ({ setPageData }) => {
  const t = useTranslations('common');
  const [defaultName, setDefaultName] = useState("");
  const [defaultEmail, setDefaultEmail] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.debug("ContactPage", { router });
    if (router.query.name) {
      setDefaultName(router.query.name);
    }
    if (router.query.email) {
      setDefaultEmail(router.query.email);
    }
    if (router.query.message) {
      setDefaultMessage(router.query.message);
    }
  }, [router.query, router]);

  useEffect(() => {
    setPageData({ title: "Contact Us" });
  }, [setPageData]);
  return (
    <>
      <HTMLHeaderMetaData
        title={t('terms.contactUs')}
        description="Get in touch with SpecialNeeds.com. We're here to help families find special needs schools, therapists, camps, and resources."
        canonical="https://www.specialneeds.com/contact/"
      />
      <Navbar />
      <ContactForm
        setPageData={setPageData}
        pageTitle="Contact Us"
        contentText="We'd love to hear from you! Fill in the form below and we'll get back to you as soon as we can."
        successResponse="Thanks, we got your message!"
        fields={[
          {
            name: "name",
            label: "Name",
            required: false,
            type: "text",
            defaultValue: defaultName,
          },
          {
            name: "email",
            label: "Email",
            required: true,
            type: "email",
            defaultValue: defaultEmail,
          },
          {
            name: "message",
            label: "Message",
            required: true,
            type: "textarea",
            defaultValue: defaultMessage,
            maxlength: 2500,
          },
        ]}
      />
      <Footer />
    </>
  );
};

export default ContactPage;