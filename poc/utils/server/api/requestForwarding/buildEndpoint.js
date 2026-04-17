// ./pages/api/v1/forward/buildEndpoint.js
import privateConfig from "@config/private";

const buildEndpoint = (req, apiVersion = 1) => {
  const apiBaseEndpoint = `${privateConfig.apiEndpoint}/api/v${apiVersion}`;

  const { path, ...query } = req.query;
  let queryString = "";
  if (Object.keys(query).length) {
    queryString = `?${Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&")}`;
  }
  const endpoint = req.query.path.join("/") + queryString;

  const [baseUrl, queryParams] = endpoint.split("?");
  let cleanedBaseUrl = baseUrl.replace(/^\/+|\/+$/g, "");

  cleanedBaseUrl = `${cleanedBaseUrl}/`;
  if (queryParams) cleanedBaseUrl += `?${queryParams}`;

  let builtEndpoint = cleanedBaseUrl.startsWith("http")
    ? cleanedBaseUrl
    : `${apiBaseEndpoint}/${cleanedBaseUrl}`;

  builtEndpoint = builtEndpoint.replace(/\/\/+/g, "/").replace(/https?:\/(\w)/, "https://$1");

  // Normalize to ensure single version path
  return builtEndpoint.replace(/(\/api\/v\d+\/)+/g, `/api/v${apiVersion}/`);
};

export default buildEndpoint;
