import privateConfig from "@config/private";

/**
 * Adds a special server-to-server authentication token to request headers.
 * This token is used to bypass CSRF protection for server-to-server requests.
 *
 * @param {Object} [incomingHeaders={}] - The headers to which the auth token will be added.
 * @returns {Object} Updated headers containing the auth token.
 */
const addServerAuthToken = (incomingHeaders = {}) => {
  const targetHeaders =
    incomingHeaders && typeof incomingHeaders === "object" ? incomingHeaders : {};
  return { ...targetHeaders, "x-specialneeds-server-auth": privateConfig.serverToken };
};

export default addServerAuthToken;
