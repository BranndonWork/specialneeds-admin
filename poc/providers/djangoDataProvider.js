import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.specialneeds.com";
const MEILI_HOST = process.env.NEXT_PUBLIC_MEILI_HOST || "https://search.specialneeds.com";

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
        const response = await axios.post(`${API_URL}/api/v1/token/refresh/`, { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem("access_token", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

function buildMeiliBody(resource, filters, sorters, pagination) {
  const meiliFilters = [];
  let q = "";

  for (const f of (filters || [])) {
    if (!f.field || f.value === undefined || f.value === null || f.value === "") continue;
    if (f.field === "title") q = f.value;
    else if (f.field === "category" || f.field === "category_slug") meiliFilters.push(`category_slug = '${f.value}'`);
    else if (f.field === "status") meiliFilters.push(`status = '${f.value}'`);
  }

  const sortMap = { created_at: "updated_at_timestamp", updated_at: "updated_at_timestamp", published_at: "published_at_timestamp" };
  const sort = sorters?.length
    ? sorters.map((s) => `${sortMap[s.field] ?? s.field}:${s.order}`)
    : [resource === "articles" ? "published_at_timestamp:desc" : "updated_at_timestamp:desc"];

  const limit = pagination?.pageSize ?? 10;
  const offset = ((pagination?.current ?? 1) - 1) * limit;

  return { q, filter: meiliFilters.length ? meiliFilters : undefined, sort, limit, offset };
}

function transformMeiliHit(hit) {
  const parts = (hit.category_name || "").split(" > ");
  const hasParent = parts.length === 2;
  return {
    id: hit.id,
    slug: hit.slug,
    title: hit.title,
    status: hit.status,
    category: {
      id: hit.category_slug,
      slug: hit.category_slug,
      name: hasParent ? parts[1] : parts[0],
      parent: hasParent ? { name: parts[0] } : undefined,
    },
    created_at: hit.updated_at_timestamp ? new Date(hit.updated_at_timestamp * 1000).toISOString() : null,
    published_at: hit.published_at_timestamp ? new Date(hit.published_at_timestamp * 1000).toISOString() : null,
  };
}

export const djangoDataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    if (resource === "conversations") {
      const params = {
        limit: pagination?.pageSize ?? 50,
        offset: ((pagination?.current ?? 1) - 1) * (pagination?.pageSize ?? 50),
      };
      if (filters) {
        for (const f of filters) {
          if (f.field === "type" && f.value) params.type = f.value;
          if (f.field === "status" && f.value) params.status = f.value;
        }
      }
      const { data } = await axiosInstance.get(`/conversations/`, { params });
      return { data: data.results || [], total: data.count || 0 };
    }

    const indexName = resource === "listings" ? "listings" : "articles";
    const body = buildMeiliBody(resource, filters, sorters, pagination);
    const { data } = await axios.post(`${MEILI_HOST}/indexes/${indexName}/search`, body);
    const hits = (data.hits || []).map((hit) => transformMeiliHit(hit));
    const total = data.totalHits ?? data.estimatedTotalHits ?? hits.length;
    return { data: hits, total };
  },

  getOne: async ({ resource, id }) => {
    let url;
    if (resource === "conversations") {
      url = `/conversations/${id}/`;
    } else if (resource === "listings") {
      url = `/listings/display/${id}/?level=editor`;
    } else if (resource === "articles") {
      url = `/articles/${id}/?level=editor`;
    } else {
      url = `/${resource}/${id}/`;
    }
    const { data } = await axiosInstance.get(url);
    console.log(`[getOne] ${resource}/${id} raw response:`, data);
    const responseData = data.response || data;
    if (resource === "conversations") {
      return { data: responseData };
    }
    if (resource === "listings") {
      const listingData = responseData.listing_data || responseData;
      return { data: { ...listingData, category_data: responseData.category_data || {}, categories: responseData.categories || [] } };
    }
    if (resource === "articles") {
      const articleData = data.article?.article_data || responseData.article_data || responseData;
      const categories = responseData.categories || (articleData.category ? [articleData.category] : []);
      return { data: { ...articleData, categories, form_fields: responseData.form_fields || {} } };
    }
    return { data: responseData.data || responseData };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axiosInstance.post(`/${resource}/`, variables);
    const responseData = data.response || data;
    return { data: responseData.data || responseData };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await axiosInstance.put(`/${resource}/${id}/`, variables);
    const responseData = data.response || data;
    return { data: responseData.data || responseData };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await axiosInstance.delete(`/${resource}/${id}/`);
    const responseData = data.response || data;
    return { data: responseData.data || responseData };
  },

  getApiUrl: () => `${API_URL}/api/v1`,

  custom: async ({ url, method, payload, query, headers }) => {
    const requestUrl = url.startsWith("http") ? url : `${API_URL}/api/v1${url}`;
    const { data } = await axiosInstance.request({ url: requestUrl, method, data: payload, params: query, headers });
    return { data };
  },
};
