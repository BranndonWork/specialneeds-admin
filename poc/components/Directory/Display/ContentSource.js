function ContentSource({ content }) {
  let source = null;

  if (
    content.sourceUrl &&
    content.sourceUrl !== "" &&
    !content.sourceUrl.includes("specialneeds.com")
  ) {
    let sourceUrl = content.sourceUrl;
    // keep the domain name only
    if (sourceUrl.includes("://")) {
      sourceUrl = sourceUrl.split("://")[1];
    }
    if (sourceUrl.includes("/")) {
      sourceUrl = sourceUrl.split("/")[0];
    }
    // remove the subdomain
    if (sourceUrl.includes(".")) {
      sourceUrl = sourceUrl.split(".").slice(-2).join(".");
    }
    source = (
      <i className="listings-details-footer text-muted">
        Some of this content was researched and rewritten from {sourceUrl}
      </i>
    );
  }

  return source;
}

export default ContentSource;
