import Utils from "@utils";
import { useState } from "react";

export const DEFAULT_TITLE =
  "Special Needs Resources, Events, Schools, Camps, Therapists, and More!";

export const useSetPageData = () => {
  const [pageAuthor, setPageAuthor] = useState("SpecialNeeds.com Staff");
  const [pageTitle, setPageTitle] = useState(DEFAULT_TITLE);
  const [pageDescription, setPageDescription] = useState(
    "Connecting Families to Special Needs Resources and Information!"
  );
  const [pageKeywords, setPageKeywords] = useState([
    "Special Needs",
    "Autism",
    "ADHD",
    "Down Syndrome",
    "Learning Disabilities",
    "Mental Health",
    "Child Development",
    "Child Care",
    "Child Care Providers",
    "Child Care Centers",
    "Child Care Resources",
    "Child Care Information",
    "Child Care Referrals",
    "Child Care Referral Services",
    "Child Care",
  ]);

  const setPageData = ({ title, category, keywords, author, description }) => {
    if (typeof window === "undefined") {
      return;
    }
    if (title) {
      setPageTitle(title.includes(DEFAULT_TITLE) ? title : `${title} | ${DEFAULT_TITLE}`);
      Utils.addPageData({ eventData: { page_title: title } });
    }

    if (keywords) {
      setPageKeywords(keywords);
    }

    if (author) {
      setPageAuthor(author);
    }

    if (description) {
      setPageDescription(description);
    }
  };

  return { pageAuthor, pageTitle, pageDescription, pageKeywords, setPageData };
};
