import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import Utils from "@utils";
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import ErrorPage from "../404";
import Display from "./components/Display";
import StructuredData from '../../components/_App/StructuredData';

const Listing = ({ pageData, notFound, ogUrl }) => {
  // Show error page if listing not found
  if (notFound || !pageData?.listing_data) {
    return <ErrorPage />;
  }

  const listingData = pageData.listing_data;
  const description = Utils.stripHTML(listingData.content).substring(0, 160);
  const headerData = {
    title: listingData.title + " | " + listingData.category.name,
    keywords:
      listingData.keywords.length > 0 ? listingData.keywords.join(", ") : listingData.category.name,
    description: description,
    author: listingData?.claimed_by?.displayname || listingData.created_by.displayname,
  };

  const buildListingBreadcrumbs = () => {
    const category = listingData.category;
    const items = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.specialneeds.com/" },
      { "@type": "ListItem", "position": 2, "name": "Directory", "item": "https://www.specialneeds.com/directory/" },
    ];

    if (category.parent?.slug) {
      const childSlug = category.slug.includes("/") ? category.slug.split("/").pop() : category.slug;
      items.push({ "@type": "ListItem", "position": 3, "name": category.parent.name, "item": `https://www.specialneeds.com/directory/?category=${category.parent.slug}` });
      items.push({ "@type": "ListItem", "position": 4, "name": category.name, "item": `https://www.specialneeds.com/directory/?category=${category.parent.slug}&sub_category=${childSlug}` });
      items.push({ "@type": "ListItem", "position": 5, "name": listingData.title });
    } else {
      items.push({ "@type": "ListItem", "position": 3, "name": category.name, "item": `https://www.specialneeds.com/directory/?category=${category.slug}` });
      items.push({ "@type": "ListItem", "position": 4, "name": listingData.title });
    }

    return items;
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": buildListingBreadcrumbs(),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": listingData.title,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listingData.address?.street_1,
      "addressLocality": listingData.address?.city,
      "addressRegion": listingData.address?.state_province,
      "postalCode": listingData.address?.postal_code,
      "addressCountry": listingData.address?.country
    },
    "telephone": listingData.phone,
    "url": ogUrl,
    "image": listingData.images?.[0]?.url
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <StructuredData data={localBusinessJsonLd} />
      <HTMLHeaderMetaData
        title={headerData.title}
        keywords={headerData.keywords}
        description={headerData.description}
        author={headerData.author}
        canonical={ogUrl}
        ogImage={listingData.images?.[0]?.url}
        ogUrl={ogUrl}
        ogType="website"
      />

      <Navbar />
      <section
        className={`content-details-area listing-category-${listingData.category.slug}`}
      >
        <Display
          listing={pageData}
        />
      </section>
      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [], // Generate no paths at build time
    fallback: 'blocking', // Generate on-demand, then cache
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;

  const api = new SpecialNeedsAPI(context);
  const endpoint = `/listings/display/${slugPath}/`;
  const response = await api.query(endpoint, "GET", {}, {}, { fullResponse: true });
  console.log('[DEBUG slug]', slugPath, 'url:', response.url, 'status:', response.status, 'error:', response.error, 'has listing_data:', !!response.data?.listing_data);
  // Handle redirects
  if (response.status >= 300 && response.status < 309) {
    const redirectUrl = response.headers?.location;
    if (redirectUrl) {
      // Ensure redirect starts with /directory/
      const finalUrl = redirectUrl.startsWith('directory/')
        ? `/${redirectUrl}`
        : redirectUrl.startsWith('/directory/')
        ? redirectUrl
        : `/directory/${redirectUrl.replace(/^\//, '')}`;

      return {
        redirect: {
          destination: finalUrl,
          permanent: response.status === 301,
        },
      };
    }
  }

  // Handle errors
  if (response.error || !response.data?.listing_data) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      pageData: response.data,
      notFound: false,
      ogUrl: `https://www.specialneeds.com/directory/${slugPath}/`,
    },
    revalidate: 3600, // 1 hour
  };
}

export default Listing;