import cloudflareImages from "./cloudflareImages";

const buildQueryParams = (url, { width, height }) => {
  const queryParams = [];
  if (url.searchParams.toString()) {
    if (url.searchParams.has("w")) queryParams.push(`width=${url.searchParams.get("w")}`);
    if (url.searchParams.has("h")) queryParams.push(`height=${url.searchParams.get("h")}`);
    if (url.searchParams.has("width")) queryParams.push(`width=${url.searchParams.get("width")}`);
    if (url.searchParams.has("height"))
      queryParams.push(`height=${url.searchParams.get("height")}`);
    if (url.searchParams.has("gravity"))
      queryParams.push(`gravity=${url.searchParams.get("gravity")}`);
    if (url.searchParams.has("org_if_sml"))
      queryParams.push(`org_if_sml=${url.searchParams.get("org_if_sml")}`);
  }
  if (width && !queryParams.some((param) => param.startsWith("width")))
    queryParams.push(`width=${width}`);
  if (height && !queryParams.some((param) => param.startsWith("height")))
    queryParams.push(`height=${height}`);
  return queryParams;
};

export const serveAsset = (assetUrl, width = null, height = null) => {
  if (!assetUrl) return "";

  // Cloudflare image key (from imageMappings config)
  if (cloudflareImages.isCloudflareImage(assetUrl)) {
    const params = {};
    if (width) params.w = width;
    if (height) params.h = height;
    return cloudflareImages.getUrl(assetUrl, params);
  }

  if (typeof assetUrl === "string") {
    // Full Cloudflare Images delivery URL — return as-is, variant already specified
    if (assetUrl.startsWith("https://imagedelivery.net")) {
      return assetUrl;
    }

    // Any other full URL — return as-is
    if (assetUrl.startsWith("http")) {
      return assetUrl;
    }
  }

  // Relative URL — preserve/add width/height params
  const assetStr = typeof assetUrl === "string" ? assetUrl : "";
  const [pathname, search = ""] = assetStr.split("?");
  const url = { pathname, searchParams: new URLSearchParams(search), host: "" };
  const queryParams = buildQueryParams(url, { width, height });
  return `${pathname}?${queryParams.join("&")}`;
};
