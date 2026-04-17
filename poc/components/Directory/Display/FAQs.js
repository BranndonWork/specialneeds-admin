import React from "react";
import AccordianField from "./Accordian";

export default function FAQs({ faqs }) {
  if (faqs.length === 0) return null;
  return <AccordianField title="FAQs" content={faqs} options={{ expandFirst: false }} />;
}
