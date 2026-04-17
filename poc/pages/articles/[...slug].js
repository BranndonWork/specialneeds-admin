import Article from "@components/Article/Article";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import StructuredData from "@components/_App/StructuredData";
import Utils from "@utils";
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import buildEndpoint from "@utils/server/api/buildEndpoint";
import injectDirectoryLinks from "@components/Article/injectDirectoryLinks";
import ErrorPage from "../404";

const SingleArticle = ({ article, sidebarData, notFound, ogUrl }) => {
  // Show error page if article not found
  if (notFound || !article?.article_data) {
    return <ErrorPage />;
  }

  const articleData = article.article_data;
  const description = Utils.stripHTML(articleData.content).substring(0, 160);
  const headerData = {
    title: articleData.title + " | " + articleData.category.name,
    keywords: articleData.tags.length > 0 ? articleData.tags.join(", ") : articleData.category.name,
    description: description,
    author: articleData?.author?.displayname,
  };

  const buildArticleBreadcrumbs = () => {
    const category = articleData.category;
    const items = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.specialneeds.com/" },
      { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://www.specialneeds.com/articles/" },
    ];

    if (category.parent?.slug) {
      const childSlug = category.slug.includes("/") ? category.slug.split("/").pop() : category.slug;
      items.push({ "@type": "ListItem", "position": 3, "name": category.parent.name, "item": `https://www.specialneeds.com/articles/?category=${category.parent.slug}` });
      items.push({ "@type": "ListItem", "position": 4, "name": category.name, "item": `https://www.specialneeds.com/articles/?category=${category.parent.slug}&sub_category=${childSlug}` });
      items.push({ "@type": "ListItem", "position": 5, "name": articleData.title });
    } else {
      items.push({ "@type": "ListItem", "position": 3, "name": category.name, "item": `https://www.specialneeds.com/articles/?category=${category.slug}` });
      items.push({ "@type": "ListItem", "position": 4, "name": articleData.title });
    }

    return items;
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": buildArticleBreadcrumbs(),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": ogUrl
    },
    "headline": articleData.title,
    "description": description,
    "image": articleData.images?.[0]?.url,
    "author": {
      "@type": "Person",
      "name": articleData?.author?.displayname
    },
    "publisher": {
      "@type": "Organization",
      "name": "SpecialNeeds.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.specialneeds.com/favicon.ico"
      }
    },
    "datePublished": articleData.date,
    "dateModified": articleData.date
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <StructuredData data={articleJsonLd} />
      <HTMLHeaderMetaData
        title={headerData.title}
        keywords={headerData.keywords}
        description={headerData.description}
        author={headerData.author}
        canonical={ogUrl}
        ogImage={articleData.images?.[0]?.url}
        ogUrl={ogUrl}
        ogType="article"
      />

      <Navbar />

      <section
        className={`content-details-area listing-category-${articleData.category.slug}`}
      >
        <Article
          article={article}
          sidebarData={sidebarData}
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
  const endpoint = `/articles/display/${slugPath}/`;
  const response = await api.query(endpoint, "GET", {}, {}, { fullResponse: true });

  // Handle redirects
  if (response.status >= 300 && response.status < 309) {
    const redirectUrl = response.headers?.location;
    if (redirectUrl) {
      return {
        redirect: {
          destination: redirectUrl,
          permanent: response.status === 301,
        },
      };
    }
  }

  // Handle errors — Next.js built-in notFound serves the 404 page without rendering article HTML
  if (response.error || !response.data?.article) {
    return { notFound: true, revalidate: 60 };
  }

  // Fetch sidebar data server-side — throws on failure so ISR serves last good page
  const [articlesRes, categoriesRes, tagsRes] = await Promise.allSettled([
    fetch(buildEndpoint('/articles/popular/articles/?limit=5')).then(r => r.json()),
    fetch(buildEndpoint('/articles/popular/categories/')).then(r => r.json()),
    fetch(buildEndpoint('/articles/popular/tags/?limit=10')).then(r => r.json()),
  ]);
  const sidebarData = {
    popularArticles: articlesRes.status === 'fulfilled' ? (articlesRes.value?.articles || []) : [],
    popularCategories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.categories || []) : [],
    popularTags: tagsRes.status === 'fulfilled' ? (tagsRes.value?.tags || []) : [],
  };

  const article = response.data.article;
  const directoryLinks = article.article_data.directory_links;
  if (directoryLinks && directoryLinks.length > 0) {
    article.article_data.content = injectDirectoryLinks(article.article_data.content, directoryLinks);
  }

  return {
    props: {
      article,
      sidebarData,
      notFound: false,
      ogUrl: `https://www.specialneeds.com/articles/${slugPath}/`,
    },
    revalidate: 3600,
  };
}

export default SingleArticle;