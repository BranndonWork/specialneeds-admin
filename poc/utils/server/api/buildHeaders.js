import addServerAuthToken from "./addServerAuthToken";
const protectedHeaders = ["host"];

/**
 * Builds request headers by filtering out protected headers, adding a server-to-server auth token,
 * and optionally including an access token.
 *
 * @param {Object} [incomingHeaders={}] - The initial headers object.
 * @param {Object} [token={}] - An optional token object that may contain an 'access' property.
 * @returns {Object} Updated headers ready for the request.
 */
const buildHeaders = (incomingHeaders = {}, token = {}) => {
  const validatedHeaders =
    incomingHeaders && typeof incomingHeaders === "object" ? incomingHeaders : {};
  const validatedToken = token && typeof token === "object" ? token : {};

  let requestHeaders = Object.assign({}, validatedHeaders);

  for (let header in requestHeaders) {
    if (protectedHeaders.includes(header)) {
      delete requestHeaders[header];
    }
  }

  let finalHeaders = addServerAuthToken({ ...requestHeaders });

  if (validatedToken?.access) finalHeaders["Authorization"] = `Bearer ${validatedToken.access}`;

  return finalHeaders;
};

export default buildHeaders;
