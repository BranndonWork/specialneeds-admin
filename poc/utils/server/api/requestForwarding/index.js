// ./utils/server/api/requestForwarding/index.js
import config from "@config/config";
import ErrorManager from "@utils/server/api/error";
import axios from "axios";
import buildEndpoint from "./buildEndpoint";
import buildHeaders from "./buildHeaders";
import getToken from "./getToken";

let logEnabled = config.env === "development";

// Simple in-memory cache for health check failures (resets on server restart)
const healthCheckCache = new Map();

export { buildEndpoint };

export const debugLog = (...args) => {
  if (logEnabled) {
  }
};

export const runHealthCheck = async (req, res) => {
  console.log("runHealthCheck", { req, res });
  try {
    const result = await axios({
      method: "GET",
      url: buildEndpoint("health"),
      headers: await buildHeaders(req, res),
      maxRedirects: 10,
      validateStatus: false,
    });
    if (!result?.data?.status || result.status >= 500) {
      return { error: "Server down", status: result.status, data: null, headers: null };
    }

    return { headers: result.headers, status: result.status, data: result.data, error: null };
  } catch (e) {
    return { error: e.message, status: 500, data: null, headers: null };
  }
};

export const checkForErrors = async (req, res, endpointResponse) => {
  // first log any errors for this specific endpoint
  await ErrorManager.updateErrorStatus(req.endpoint, endpointResponse.status >= 500);

  // then log the error for the backend as a whole if it's down
  const apiHealthCheckKey = `api-health-check-failures`;
  const lastHealthCheckValue = healthCheckCache.get(apiHealthCheckKey) || [];

  if (endpointResponse.status < 500 && lastHealthCheckValue.length) {
    healthCheckCache.delete(apiHealthCheckKey);
    return;
  }
  if (endpointResponse.status < 500) return;

  const healthCheckResponse = await runHealthCheck(req, res);
  healthCheckResponse.timestamp = Date.now();
  lastHealthCheckValue.push(healthCheckResponse);
  healthCheckCache.set(apiHealthCheckKey, lastHealthCheckValue);
};

export const backendIsDown = async (req) => {
  const apiHealthCheckKey = `api-health-check-failures`;
  let lastHealthCheckValue = healthCheckCache.get(apiHealthCheckKey);
  if (!lastHealthCheckValue) return false;

  const totalFailures = lastHealthCheckValue.length;
  if (!totalFailures) {
    debugLog("Backend has never been down.");
    return false;
  }
  const lastFailure = lastHealthCheckValue[totalFailures - 1];
  const firstFailure = lastHealthCheckValue[0];
  const lastFailureTime = lastFailure.timestamp;
  const firstFailureTime = firstFailure.timestamp;
  const timeBetweenFailures = lastFailureTime - firstFailureTime;
  if (totalFailures > 10 && timeBetweenFailures < 1000 * 60) {
    debugLog("Backend is down???");
    // check again if it's down
    const healthCheckResponse = await runHealthCheck(req);
    healthCheckResponse.timestamp = Date.now();
    if (healthCheckResponse.error) {
      lastHealthCheckValue.push(healthCheckResponse);
      healthCheckCache.set(apiHealthCheckKey, lastHealthCheckValue);
      debugLog("healthCheckResponse 3", healthCheckResponse);
      return true;
    }
    debugLog("Backend is back up!");
    healthCheckCache.delete(apiHealthCheckKey);
  }
  return false;
};

export const processRequest = async (req, res, apiVersion = 1) => {
  const { path, ...query } = req.query;
  let queryString = "";
  if (Object.keys(query).length) {
    queryString = `?${Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&")}`;
  }

  req.endpoint = req.query.path.join("/") + queryString;
  req.token = getToken(req);

  const url = buildEndpoint(req, apiVersion);
  const followRedirects = req.headers["x-follow-redirects"] !== "false";

  if (await backendIsDown(req)) {
    debugLog("[processRequest] Backend is down.");
    throw new Error("Backend is down.");
  }

  if (await ErrorManager.checkErrorThreshold(req.endpoint)) {
    debugLog("[processRequest] Too many errors. Aborting.");
    throw new Error("Too many errors. Aborting.");
  }
  const axiosConfig = {
    method: req.method.toUpperCase(),
    url,
    headers: await buildHeaders(req, res),
    data: req.body || null,
    maxRedirects: followRedirects ? 10 : 0,
    validateStatus: (status) => status >= 200 && status < 500,
    withCredentials: false,
  };
  debugLog("[./utils/server/api/requestForwarding/index.js] forwarding request:", {
    method: axiosConfig.method,
    url: axiosConfig.url,
    headers: axiosConfig.headers,
    data: axiosConfig.data,
    maxRedirects: axiosConfig.maxRedirects,
    withCredentials: axiosConfig.withCredentials,
    apiVersion: apiVersion,
  });

  let endpointResponse = await axios(axiosConfig);
  debugLog("[processRequest] FORWARD endpointResponse raw", endpointResponse);
  endpointResponse.request = "redacted";
  debugLog("[processRequest] FORWARD endpointResponse", {
    endpointResponse,
    data: JSON.stringify(endpointResponse.data),
  });
  if (!endpointResponse.status < 308)
    debugLog("[processRequest] FORWARD endpointResponse", endpointResponse);

  await checkForErrors(req, res, endpointResponse);
  return { response: endpointResponse };
};
