"use client";

import {useTranslations} from 'next-intl';
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import Utils from "@utils";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Results from "../../components/Search/Results";
import Search from "../../components/Search/SearchHeader";
import useSearchUtils from "../../components/Search/utils";

const EventsPage = () => {
  const t = useTranslations('common');
  const searchUtils = useSearchUtils();
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState([]);
  const [searchState, setSearchState] = useState("searching");
  const router = useRouter();

  const getCategories = useCallback(async () => {
    try {
      const catResponse = await fetch('/api/v1/events/categories?published=true').then(r => r.json());
      let cats = catResponse?.categories || catResponse?.response?.categories || [];
      if (Array.isArray(cats) && cats.length > 0) {
        cats = cats.sort((a, b) => a.name.localeCompare(b.name));
      }
      setCategories(cats);
    } catch (error) {
      console.error("events categories error", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams({
      page: router.query.page || "1",
      limit: Utils.getPreference("searchResultsPerPage", 6),
      search: router.query.search || "",
      location: router.query.location || "",
      sort: router.query.sort || Utils.getPreference("searchResultsSort", "relevance"),
    });

    if (router.query.category) {
      params.set('category', router.query.category);
    }

    try {
      const searchData = await fetch(`/api/v1/events/search?${params}`).then(r => r.json());
      if (searchData?.events !== undefined) {
        setSearchState("done");
        return {
          events: searchData.events || [],
          totalPages: searchData.totalPages || 0,
          totalResults: searchData.totalResults || 0,
        };
      }
    } catch (error) {
      console.error("events search error", error);
    }

    setSearchState("networkError");
    return { events: [], totalPages: 0, totalResults: 0 };
  }, [router.query]);

  const updateEvents = useCallback(async () => {
    fetchData().then((data) => {
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
    });
  }, [fetchData]);

  useEffect(() => {
    if (!router.isReady) return;
    updateEvents();
    getCategories();
  }, [router.query, router.isReady, updateEvents, getCategories]);

  const tableData = searchUtils.getTableData(events, "events");

  return (
    <>
      <HTMLHeaderMetaData
        title={events.pageTitle}
        description={events.description}
        keywords={[
          "special needs events",
          "special needs activities",
          "special needs groups",
          "special needs get togethers",
        ]}
      />
      <Navbar />

      <Search
        refreshResults={() => {
          setSearchState("searching");
          setEvents([]);
        }}
        categories={categories}
        formTitle={t('terms.events')}
        formSubTitle={events.formSubTitle}
      />

      <Results
        contentType="event"
        items={events}
        refreshResults={updateEvents}
        totalPages={totalPages}
        totalResults={totalResults}
        searchState={searchState}
        tableData={tableData}
      />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};


export default EventsPage;
