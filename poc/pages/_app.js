//////////////////////////////////////////////
// DO NOT REMOVE THESE COMMENTS
// THEY ARE USED TO KEEP THE ORDER OF IMPORTS
//////////////////////////////////////////////
// animate css
import "../styles/animate.min.css";
// bootstrap css
import "../styles/bootstrap.min.css";
// boxicons css
import "../styles/boxicons.min.css";
// flaticon css
import "../styles/flaticon.css";
// swiper css
import "swiper/css";
// swiper css bundle
import "swiper/css/bundle";
//
//
// Global Style
import "../styles/style.css";

// Article Style
import "../styles/article.css";
// Search Style
import "../styles/algolia.css";
import "../styles/algolia_results_card.css";
// Buttons
import "../styles/buttons.css";
// Home
import "../styles/homepage.css";
// Responsive Style
import "../styles/responsive.css";
// print
import "../styles/print.css";

// Package Styles

// lightgallery
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lightgallery.css";

// Refine
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/pages";
import { djangoDataProvider } from "../providers/djangoDataProvider";
import { authProvider } from "../providers/authProvider";

// components
import SimpleDialog from "@components/Common/SimpleDialog";
import InstallPrompt from "@components/InstallPrompt";
import Head from "next/head";
import { useRouter } from "next/router";
import { usePrefetchOnScroll } from "@utils/hooks/usePrefetchOnScroll";
import { useEffect, useState } from "react";

// next-intl
import { NextIntlClientProvider } from 'next-intl';

// other
import ConfirmDialog from "@components/Common/ConfirmDialog";
import Layout from "@components/_App/Layout";
import RouterLoading from "@components/_App/RouterLoading";
import { useOnlineStatus } from "@hooks/useOnlineStatus";
import { useSetPageData } from "@hooks/useSetPageData";
import Utils from "@utils";
import GoTop from "../components/Shared/GoTop";
import ToastMessages from "../components/Shared/ToastMessages";
import { AppProvider } from "../contexts";
import ErrorPage404 from "./404";
import ErrorPageGeneral from "./_error";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const isOnline = useOnlineStatus();

  const router = useRouter();
  const locale = router.locale || 'en';

  const setPageDataValues = useSetPageData();
  const { setPageData } = setPageDataValues;
  let pageAuthor = pageProps.author || setPageDataValues.pageAuthor;
  let pageTitle =
    pageProps.title2 ||
    setPageDataValues.pageTitle ||
    "Special Needs Resources, Events, Schools, Camps, Therapists, and More!";

  let pageDescription = pageProps.description || setPageDataValues.pageDescription;
  let pageKeywords = pageProps.keywords || setPageDataValues.pageKeywords;

  useEffect(() => {
    return initializeUserInteractionTracking(Utils, router, setError);
  }, [router]);

  // Enable site-wide prefetching of links and images as they become visible
  usePrefetchOnScroll();

  if (error?.code == "unauthorizedCheck") {
    return null;
  }

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={djangoDataProvider}
      authProvider={authProvider}
      resources={[
        { name: "listings", list: "/admin/listings" },
        { name: "articles", list: "/admin/articles" },
        { name: "conversations", list: "/admin/messages" },
      ]}
      options={{ syncWithLocation: false }}
    >
    <NextIntlClientProvider messages={pageProps.messages} locale={locale} timeZone="UTC">
      <Layout>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <title>{pageTitle}</title>
          <meta
            name="keywords"
            content={(() => {
              try {
                return pageKeywords.join(", ");
              } catch (e) {
                return typeof pageKeywords === "string" ? pageKeywords : "";
              }
            })()}
          />
          <meta name="description" content={pageDescription} />
          <meta name="author" content={pageAuthor} />
        </Head>
        <AppProvider>
          <InstallPrompt />
          {!isOnline && (
            <div className="offline-banner">
              ⚠️ You&apos;re offline. Some features may be unavailable.
            </div>
          )}
          <RouterLoading>
            <ConfirmDialog />

            {error?.code == 404 ? (
              <>
                <ErrorPage404
                  {...pageProps}
                  setPageData={setPageData}
                  addCustomHeadTag={addCustomHeadTag}
                  setLoading={setLoading}
                />
                <ToastMessages />
              </>
            ) : error?.code ? (
              <ErrorPageGeneral
                setPageData={setPageData}
                addCustomHeadTag={addCustomHeadTag}
                setLoading={setLoading}
                errorCode={error.code}
                errorHeading={error?.heading || false}
                errorMessage={error?.message || false}
                errorData={error?.data || false}
              />
            ) : (
              <>
                <Component
                  {...pageProps}
                  setPageData={setPageData}
                  addCustomHeadTag={addCustomHeadTag}
                  setLoading={setLoading}
                  setError={setError}
                />
                <GoTop scrollStepInPx="100" delayInMs="10" />
                <ToastMessages />
                <SimpleDialog />
              </>
            )}
          </RouterLoading>
        </AppProvider>
      </Layout>
    </NextIntlClientProvider>
    </Refine>
  );
}

// Load translations globally for all pages
MyApp.getInitialProps = async ({ ctx }) => {
  const locale = ctx?.locale || 'en';

  return {
    pageProps: {
      messages: (await import(`../messages/${locale}.json`)).default
    }
  };
};

export default MyApp;

const addCustomHeadTag = (incomingTag, onLoadCallback) => {
  if (typeof document === "undefined") return;
  const { type } = incomingTag;
  if (!type) {
    console.warn("No tag type provided.");
    return;
  }

  const existingTag = document.querySelector(
    `${type}[src="${incomingTag.attributes.src}"], ${type}[href="${incomingTag.attributes.href}"]`
  );

  if (existingTag) {
    console.warn(`A ${type} tag with the same src or href already exists.`);
    return;
  }

  const tag = document.createElement(type);
  Object.entries(incomingTag.attributes).forEach(([key, value]) => tag.setAttribute(key, value));

  tag.onload = () => {
    if (onLoadCallback && typeof onLoadCallback === "function") {
      onLoadCallback();
    }
  };

  tag.onerror = () => {
    console.error(`Error loading ${type} tag: ${incomingTag.attributes.src}`);
  };

  document.head.appendChild(tag);
  return tag;
};

function initializeUserInteractionTracking(Utils, router, setError) {
  if (typeof window === "undefined") {
    return;
  }

  // Generate a random number for the page view id
  const startTime = new Date().getTime();
  const rand = Math.random();
  Utils.addPageData({ eventData: { pv_id: String(rand).slice(-6) }, startTime });
}
