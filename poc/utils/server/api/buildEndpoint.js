// ./pages/api/v1/forward/buildEndpoint.js
import privateConfig from "@config/private";

const apiEndpoint = `${privateConfig.apiEndpoint}/api/v1`;

const buildEndpoint = (endpoint) => {
  const [baseUrl, queryParams] = endpoint.split("?");
  let cleanedBaseUrl = baseUrl.replace(/^\/+|\/+$/g, "");

  // Strip /api/v1/ from beginning if present (since apiEndpoint already includes it)
  if (cleanedBaseUrl.startsWith("api/v1/")) {
    cleanedBaseUrl = cleanedBaseUrl.replace("api/v1/", "");
  }

  cleanedBaseUrl = `${cleanedBaseUrl}/`;
  if (queryParams) cleanedBaseUrl += `?${queryParams}`;

  let builtEndpoint = cleanedBaseUrl.startsWith("http")
    ? cleanedBaseUrl
    : `${apiEndpoint}/${cleanedBaseUrl}`;

  // Normalize double slashes without clobbering the protocol
  builtEndpoint = builtEndpoint.replace(/([^:])\/\/+/g, "$1/");

  return builtEndpoint;
};

export default buildEndpoint;
