import config from "@config/config";

export const convertThumbnailURLs = (results) => {
  results.forEach((result) => {
    if (!result.thumbnail) return;

    if (result.thumbnail.includes("imagedelivery.net")) {
      return;
    }

    if (result.thumbnail.includes("image/upload")) {
      let thumbnailURL = result.thumbnail;
      let thumbnailURLParts = thumbnailURL.split("/image/upload/");
      let finalParts = thumbnailURLParts[1].split("/");

      const versionRegex = /^v\d+$/;
      const newPathParts = finalParts.filter((part) => !versionRegex.test(part));
      const basePath = [
        "wp-content",
        "specialneeds",
        "images",
        "articles",
        "listings",
        "avatars",
        "core",
      ].includes(newPathParts[0])
        ? ""
        : "core/";

      result.thumbnail = `/assets/${basePath}${newPathParts.join("/")}`;
    } else if (result.thumbnail.includes("assets.specialneeds.com")) {
      let thumbnailURL = result.thumbnail;
      let thumbnailURLParts = thumbnailURL.split("assets.specialneeds.com");
      result.thumbnail = `/assets/${thumbnailURLParts[1]}`;
    }

    if (!result.thumbnail.startsWith("http"))
      result.thumbnail = result.thumbnail.replace(/\/\//g, "/");
    if (result.thumbnail.startsWith("/assets/"))
      result.thumbnail = `${config.siteUrl}${result.thumbnail}`;

    const url = new URL(
      result.thumbnail,
      result.thumbnail.startsWith("http") ? undefined : config.host
    );
    const queryParams = [];
    if (!url.searchParams.has("gravity")) queryParams.push("gravity=smart");
    if (!url.searchParams.has("func")) queryParams.push("func=fitmin");
    if (!url.searchParams.has("width")) queryParams.push("width=200");
    if (!url.searchParams.has("height")) queryParams.push("height=200");

    result.thumbnail = `${url.pathname}?${queryParams.join("&")}`;
  });
};
