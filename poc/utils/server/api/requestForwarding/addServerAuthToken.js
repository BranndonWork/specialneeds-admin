// ./pages/api/v1/forward/addServerAuthToken.js
import privateConfig from "@config/private";

const addServerAuthToken = (headers = {}) => {
  // this allows bypassing csrf protection for server-to-server requests
  headers["x-specialneeds-server-auth"] = privateConfig.serverToken;
  return headers;
};

export default addServerAuthToken;
