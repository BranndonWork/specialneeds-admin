// import HowItWorks from "@components/Common/HowItWorks";

import Feedback from "@components/Common/Feedback";
import HomePageCategories from "@components/Common/HomePageCategories";
import DisplayContent from "@components/HomePage/DisplayContent";
import AdUnit from "@components/Article/AdUnit";
import SearchArea from "@components/HomePage/SearchArea";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import { useSearch } from "@hooks/useSearch";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.specialneeds.com/#organization",
  "name": "SpecialNeeds.com",
  "url": "https://www.specialneeds.com/",
  "logo": "https://imagedelivery.net/iQbJNjrNARW2nbQ489hjzg/logo-full/public",
  "description": "Find special needs schools, therapists, camps, and resources near you. SpecialNeeds.com connects families to the services and support they need.",
  "sameAs": [],
};

const Index = ({ categories, recentListings, news }) => {
  useSearch({ searchIndex: "listing", skipInitialSearch: true });

  return (
    <div id="homepage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />
      <HTMLHeaderMetaData
        title="Special Needs Directory — Schools, Therapists & Camps"
        description="Find special needs schools, therapists, camps, and resources near you. SpecialNeeds.com connects families to the services and support they need."
        canonical="https://www.specialneeds.com/"
      />
      <Navbar />
      <SearchArea />
      <HomePageCategories categories={categories} />
      <div className="container">
        <AdUnit slot="homepage_feature" />
      </div>
      <DisplayContent content={recentListings} contentType="recentByCategory" />
      <DisplayContent content={news} contentType="news" />
      {/* <EventsArea events={events} /> */}
      {/* <HowItWorks /> */}
      <Feedback title={true} bgImage="bg-image" />
      {/* <AppDownload  /> */}
      <Footer />
    </div>
  );
};

// Sanitize props to ensure all values are JSON-serializable for Next.js
// Converts undefined to null and removes functions, symbols, etc.
const sanitizeProps = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    value === undefined ? null : value
  ));
};

export async function getStaticProps(context) {
  const { getPopularDirectoryCategories, getRecentListingsByCategory } =
    await import("@pages/api/v1/search/getDirectoryData");
  const { getPopularNews } =
    await import("@pages/api/v1/search/getPopular");

  const props = {
    messages: (await import(`../messages/${context.locale || 'en'}.json`)).default,
    categories: (await getPopularDirectoryCategories()) || [],
    recentListings: (await getRecentListingsByCategory(5)) || [],
    news: (await getPopularNews(10))?.results || [],
  };

  return {
    props: sanitizeProps(props),
    revalidate: process.env.NODE_ENV === 'development' ? 1 : 86400,
  };
}

export default Index;
