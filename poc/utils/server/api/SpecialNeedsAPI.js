import config from "@config/config";
import axios from "axios";
import buildEndpoint from "./buildEndpoint";
// import buildHeaders from "./buildHeaders";

const debuggingOn = true;

export default class SpecialNeedsAPI {
  constructor(ctx) {
    this.ctx = ctx;
    this.token = {};

    this.apV1Url = `${config.siteUrl}/api/v1`;
  }

  async buildHeaders(headers = {}) {
    let finalHeaders = {
      ...headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.ctx?.req?.headers?.cookie) {
      finalHeaders = {
        ...finalHeaders,
        cookie: this.ctx.req.headers.cookie,
      };
    }
    return finalHeaders;
  }

  async get(endpoint, headers = {}) {
    return await this.query(endpoint, "GET", {}, headers);
  }

  async post(endpoint, data = {}, headers = {}) {
    return await this.query(endpoint, "POST", data, headers);
  }

  async put(endpoint, data = {}, headers = {}) {
    return await this.query(endpoint, "PUT", data, headers);
  }

  async delete(endpoint, data = {}, headers = {}) {
    return await this.query(endpoint, "DELETE", data, headers);
  }

  unwrapResponse(response) {
    const data = response.data || response;

    if (data && typeof data === 'object' && data.hasOwnProperty('success')) {
      if (data.success === false && data.error) {
        const msg = typeof data.error === 'string'
          ? data.error
          : data.error?.error || JSON.stringify(data.error);
        throw new Error(msg);
      }
      return data.response || data;
    }

    return data;
  }

  async query(endpoint, method = "POST", data = {}, headers = {}, options = {}) {
    if (typeof options === "boolean") options = { fullResponse: options };

    let { fullResponse = false, withCredentials = true, followRedirects = true } = options;

    if (endpoint.endsWith("/logs/")) return { status: 200, data: [] };
    try {
      method = method.toUpperCase();
      endpoint = buildEndpoint(endpoint);

      let builtHeaders = await this.buildHeaders(headers);

      if (!withCredentials) delete builtHeaders.cookie;
      if (fullResponse) followRedirects = false;

      let axiosConfig = {
        method: method,
        url: endpoint,
        data: data,
        withCredentials: withCredentials,
        headers: { ...builtHeaders, "X-Follow-Redirects": followRedirects.toString() },
        maxRedirects: followRedirects ? 10 : 0,
        timeout: 10000, // 10s — fail fast during build
      };

      const maxStatus = fullResponse ? 999 : 304;
      axiosConfig.validateStatus = function (status) {
        return status <= maxStatus;
      };

      const startTime = new Date().getTime();
      console.warn(`[API] ${method} ${endpoint}`);
      let response = await axios(axiosConfig);
      response.request = "redacted";

      const duration = new Date().getTime() - startTime;
      console.warn(`[API] ${method} ${endpoint} → ${response.status} (${duration}ms)`);

      let responseData;
      let unwrapError = null;
      try {
        responseData = this.unwrapResponse(response);
      } catch (err) {
        unwrapError = err.message;
        responseData = response.data;
      }

      const rawError = response?.data?.error;
      const errorMsg = unwrapError
        || (rawError && typeof rawError === 'string' ? rawError : rawError?.error || null)
        || null;

      const fullResponsePayload = {
        axiosConfig,
        url: response.config.url,
        status: response.status,
        data: responseData,
        headers: response.headers,
        error: errorMsg,
      };

      if (fullResponse) {
        return fullResponsePayload;
      }

      if (response.status === 304) {
        return { status: 304 };
      } else if (response.status === 204) {
        return { status: 204 };
      }
      return responseData;
    } catch (error) {
      if (error.response) {
        try {
          return this.unwrapResponse(error.response);
        } catch (unwrapError) {
          return { error: unwrapError.message, status: error.response?.status };
        }
      }
      let status_code = error.response?.status;
      let error_message = error.response?.data?.error || error.message;
      return { error: error_message, status: status_code };
    }
  }
}
