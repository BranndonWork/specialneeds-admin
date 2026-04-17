import type { DataProvider } from "@refinedev/core";
import axios, { type AxiosInstance } from "axios";
import { flattenCategoryData } from "../utils/categoryDataTransform";

const API_URL = import.meta.env.VITE_API_ENDPOINT;
const MEILI_HOST = "https://search.specialneeds.com";

const activeRequests = new Map<string, Promise<any>>();

function deduplicatedGet(url: string, params: Record<string, any>): Promise<any> {
  const key = url + JSON.stringify(params);
  if (activeRequests.has(key)) {
    return activeRequests.get(key)!;
  }
  const promise = axiosInstance.get(url, { params }).finally(() => {
    activeRequests.delete(key);
  });
  activeRequests.set(key, promise);
  return promise;
}

export const axiosInstance: AxiosInstance = axios.create({
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

function buildMeiliBody(resource: string, filters: any[], sorters: any[], pagination: any) {
  const meiliFilters: string[] = [];
  let q = "";

  for (const f of (filters || [])) {
    if (!("field" in f) || f.value === undefined || f.value === null || f.value === "") continue;
    if (f.field === "title") {
      q = f.value;
    } else if (f.field === "category" || f.field === "category_slug") {
      meiliFilters.push(`category_slug = '${f.value}'`);
    } else if (f.field === "status") {
      meiliFilters.push(`status = '${f.value}'`);
    }
  }

  const sortMap: Record<string, string> = {
    created_at: "updated_at_timestamp",
    updated_at: "updated_at_timestamp",
    published_at: "published_at_timestamp",
  };
  const sort = sorters?.length
    ? sorters.map((s: any) => `${sortMap[s.field] ?? s.field}:${s.order}`)
    : [resource === "articles" ? "published_at_timestamp:desc" : "updated_at_timestamp:desc"];

  const limit = pagination?.pageSize ?? 10;
  const offset = ((pagination?.currentPage ?? 1) - 1) * limit;

  return {
    q,
    filter: meiliFilters.length ? meiliFilters : undefined,
    sort,
    limit,
    offset,
  };
}

function transformMeiliHit(hit: any, resource: string) {
  const parts = (hit.category_name || "").split(" > ");
  const hasParent = parts.length === 2;
  const category = {
    id: hit.category_slug,
    slug: hit.category_slug,
    name: hasParent ? parts[1] : parts[0],
    parent: hasParent ? { name: parts[0] } : undefined,
  };

  return {
    id: hit.id,
    title: hit.title,
    status: hit.status,
    category,
    created_at: hit.updated_at_timestamp ? new Date(hit.updated_at_timestamp * 1000).toISOString() : null,
    published_at: hit.published_at_timestamp ? new Date(hit.published_at_timestamp * 1000).toISOString() : null,
  };
}

export const djangoDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const indexName = resource === "listings" ? "listings" : "articles";
    const body = buildMeiliBody(resource, filters as any[], sorters as any[], pagination);

    const { data } = await axios.post(
      `${MEILI_HOST}/indexes/${indexName}/search`,
      body,
    );

    const hits = (data.hits || []).map((hit: any) => transformMeiliHit(hit, resource));
    const total = data.totalHits ?? data.estimatedTotalHits ?? hits.length;

    return { data: hits, total };
  },

  getOne: async ({ resource, id, meta }) => {
    let url: string;
    let params: any = {};

    if (resource === "listings") {
      url = `/listings/`;
      params.id = id;
      params.level = "editor"; // Returns full data with form_fields and categories
    } else {
      url = `/${resource}/${id}/`;
      if (resource === "articles") {
        params.level = "editor"; // Request editor-level data for articles
      }
    }

    let apiResponse: any;
    try {
      const { data } = await axiosInstance.get(url, { params });
      apiResponse = data;
    } catch (err: any) {
      // If Django fails for listings, fall back to Meilisearch for basic show data
      if (resource === "listings") {
        const { data: meiliData } = await axios.post(
          `${MEILI_HOST}/indexes/listings/search`,
          { q: "", filter: `id = '${id}'`, limit: 1 },
        );
        const hit = meiliData.hits?.[0];
        if (!hit) throw err;
        return { data: transformMeiliHit(hit, resource) as any };
      }
      throw err;
    }
    const data = apiResponse;

    // Extract response data
    // Note: Articles return raw data, Listings wrap in { success, response, error }
    const responseData = data.response || data;

    if (resource === "listings") {
      // API returns: { listing_data: {...}, category_data: {...}, form_fields: {...}, categories: [...] }
      const listingData = responseData.listing_data || responseData;
      const categoryData = responseData.category_data || {};
      const categories = responseData.categories || [];

      // category_data is already in the nested format needed by the UI:
      // category_data[section].fields[field].attributes.value
      // So we just pass it through as-is

      return {
        data: {
          ...listingData,
          category_data: categoryData,
          categories: categories,
          // Ensure category has an id (convert slug to object if needed)
          category: typeof listingData.category === 'string'
            ? { id: listingData.category, slug: listingData.category }
            : listingData.category && !listingData.category.id
            ? { ...listingData.category, id: listingData.category.slug }
            : listingData.category,
        },
      };
    } else if (resource === "articles") {
      // Articles API returns: { article_data: {...}, category_data: {}, form_fields: {}, categories: [...] }
      // We need to flatten article_data and add the categories array for the category dropdown
      const articleData = responseData.article_data || responseData;
      const categories = responseData.categories || [];

      // Add category slug as id for Refine to work with select components
      if (articleData.category && !articleData.category.id) {
        articleData.category = {
          ...articleData.category,
          id: articleData.category.slug,
        };
      }

      return {
        data: {
          ...articleData,
          // Include the categories array so the edit form can use it for the dropdown
          categories: categories,
        },
      };
    } else {
      // Generic resource handling
      let data = responseData.data || responseData;
      return {
        data: data,
      };
    }
  },

  create: async ({ resource, variables, meta }) => {
    const url = `/${resource}/`;

    let payload: any;
    if (resource === "listings") {
      // Transform to listing structure
      const { category_data, category, ...listingData } = variables as any;

      // Flatten category_data from UI format to API format
      const flattenedCategoryData = flattenCategoryData(category_data || {});

      // Convert category object to slug string if needed
      const categorySlug = typeof category === 'string'
        ? category
        : category?.slug || category?.id || category;

      payload = {
        listing_data: {
          ...listingData,
          id: "new", // New listings use "new" as ID
          category: categorySlug,
        },
        category_data: flattenedCategoryData,
      };
    } else {
      payload = variables;
    }

    const { data } = await axiosInstance.post(url, payload);

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    if (resource === "listings") {
      const listing = responseData.listing;
      return {
        data: listing?.listing_data || listing || responseData.data || responseData,
      };
    }

    return {
      data: responseData.data || responseData,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    let url: string;
    let payload: any;

    if (resource === "listings") {
      url = `/listings/`;

      // CRITICAL: The backend expects the FULL listing object
      // The form component now merges all original fields with changes before sending

      // Extract form fields
      const { category_data, category, ...listingData } = variables as any;

      // Convert category to slug string
      const categorySlug = typeof category === 'string'
        ? category
        : category?.slug || category?.id || category;

      // Flatten category_data from UI format to API format
      const flattenedCategoryData = flattenCategoryData(category_data || {});

      payload = {
        listing_data: {
          ...listingData,
          id,
          category: categorySlug,
        },
        category_data: flattenedCategoryData,
      };
    } else if (resource === "articles") {
      url = `/${resource}/${id}/`;

      // Remove the categories array (it was only for the UI dropdown)
      const { categories, category, ...articleData } = variables as any;

      // Extract category slug (form sends it as category.id)
      const categorySlug = category?.id || category?.slug || category;

      // Articles API expects: { article_data: {...}, category_data: {} }
      payload = {
        article_data: {
          ...articleData,
          id,
          category: categorySlug,
        },
        category_data: {},
      };
    } else {
      url = `/${resource}/${id}/`;
      payload = variables;
    }

    const { data } = await axiosInstance.put(url, payload);

    // Extract response data (Django wraps in { success, response, error })
    const responseData = data.response || data;

    if (resource === "listings") {
      const listing = responseData.listing;
      return {
        data: listing?.listing_data || listing || responseData.data || responseData,
      };
    }

    return {
      data: responseData.data || responseData,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    let url: string;
    let config: any = {};

    if (resource === "listings") {
      url = `/listings/`;
      config.params = { id };
    } else {
      url = `/${resource}/${id}/`;
    }

    const { data } = await axiosInstance.delete(url, config);

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
