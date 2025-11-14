import type { DataProvider } from "@refinedev/core";
import axios, { type AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

// Add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_URL}/api/v1/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("access_token", access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const djangoDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    // Use the search endpoint for articles listing
    const url = `/${resource}/search/`;

    const params: any = {};

    if (pagination) {
      params.page = pagination.current;
      params.limit = pagination.pageSize;
    }

    if (sorters && sorters.length > 0) {
      params.sort = sorters[0].order === "desc" ? "-" + sorters[0].field : sorters[0].field;
    }

    if (filters) {
      filters.forEach((filter: any) => {
        if ("field" in filter) {
          params[filter.field] = filter.value;
        }
      });
    }

    const { data } = await axiosInstance.get(url, { params });

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    // Transform articles to flatten the nested structure
    const articles = (responseData.articles || responseData.data || responseData.results || responseData || []).map((item: any) => {
      // If the article has article_data (from SummarySerializer), flatten it
      if (item.article_data) {
        const flattened = { ...item.article_data };
        // Add category slug as id for Refine to work with categories
        if (flattened.category && !flattened.category.id) {
          flattened.category = {
            ...flattened.category,
            id: flattened.category.slug,
          };
        }
        return flattened;
      }
      return item;
    });

    return {
      data: articles,
      total: responseData.totalResults || responseData.total || responseData.count || articles.length,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `/${resource}/${id}/`;
    const { data } = await axiosInstance.get(url);

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    // Flatten article_data if present (same structure as getList)
    let article = responseData.data || responseData;
    if (article.article_data) {
      article = { ...article.article_data };
      // Add category slug as id for Refine to work with categories
      if (article.category && !article.category.id) {
        article.category = {
          ...article.category,
          id: article.category.slug,
        };
      }
    }

    return {
      data: article,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const url = `/${resource}/`;
    const { data } = await axiosInstance.post(url, variables);

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    return {
      data: responseData.data || responseData,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `/${resource}/${id}/`;
    const { data } = await axiosInstance.put(url, variables);

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    return {
      data: responseData.data || responseData,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    const url = `/${resource}/${id}/`;
    const { data } = await axiosInstance.delete(url);

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    return {
      data: responseData.data || responseData,
    };
  },

  getApiUrl: () => `${API_URL}/api/v1`,

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let requestUrl = `${url}`;

    if (!requestUrl.startsWith("http")) {
      requestUrl = `${API_URL}/api/v1${url}`;
    }

    const { data } = await axiosInstance.request({
      url: requestUrl,
      method,
      data: payload,
      params: query,
      headers,
    });

    return {
      data,
    };
  },
};
