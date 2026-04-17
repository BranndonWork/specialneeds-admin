import { DEFAULT_TITLE } from "@hooks/useSetPageData";
import Head from "next/head";
const HTMLHeaderMetaData = ({ title, keywords, description, author, additionalMeta, canonical, ogImage, ogUrl, ogType }) => {
  function decodeHtml(html) {
    if (typeof document !== "undefined") {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }
    // Server-side fallback: decode common HTML entities
    return html
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'");
  }
  const hasOg = ogImage || ogUrl;
  return (
    <Head>
      {title && <title>{`${decodeHtml(title)} | ${DEFAULT_TITLE}`}</title>}
      {keywords && keywords.length > 0 && (
        <meta
          name="keywords"
          content={(() => {
            try {
              return keywords.join(", ");
            } catch (e) {
              if (typeof keywords === "string") {
                return keywords;
              }
              return "";
            }
          })()}
        />
      )}
      {description && <meta name="description" content={description} />}
      {author && <meta name="author" content={author} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {hasOg && title && <meta property="og:title" content={title} />}
      {hasOg && description && <meta property="og:description" content={description} />}
      {hasOg && <meta property="og:type" content={ogType || "website"} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {hasOg && title && <meta name="twitter:title" content={title} />}
      {hasOg && description && <meta name="twitter:description" content={description} />}
      {hasOg && <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {additionalMeta && additionalMeta.length > 0
        ? additionalMeta.map((meta, index) => (
            <meta key={index} name={meta?.name} content={meta?.content} />
          ))
        : null}
    </Head>
  );
};

export default HTMLHeaderMetaData;
