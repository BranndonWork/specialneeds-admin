// ./pages/api/v1/forward/buildHeaders.js
import addServerAuthToken from "./addServerAuthToken";

const protectedHeaders = [
  "host",
  "accept-encoding",
  "accept-language",
  "connection",
  "content-length",
  "origin",
  "referer",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
];
const buildHeaders = async (req, res) => {
  let requestHeaders = Object.assign({}, req?.headers);

  for (let header in requestHeaders) {
    if (protectedHeaders.includes(header)) {
      delete requestHeaders[header];
    }

    if (header.startsWith("sec-")) {
      delete requestHeaders[header];
    }
  }
  return addServerAuthToken({ ...requestHeaders });
};

export default buildHeaders;
