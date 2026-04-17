import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.specialneeds.com";

export const authProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/token/`, { email, password });
      const responseData = response.data.response || response.data;
      const { access, refresh, user } = responseData;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, redirectTo: "/admin/listings" };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.response?.data?.detail || error.response?.data?.error || "Invalid email or password",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    return { success: true, redirectTo: "/admin/login" };
  },

  check: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) return { authenticated: true };
    return { authenticated: false, redirectTo: "/admin/login" };
  },

  getPermissions: async () => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (user) return JSON.parse(user).role || null;
    return null;
  },

  getIdentity: async () => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (user) return JSON.parse(user);
    return null;
  },

  onError: async (error) => {
    if (error.response?.status === 401) return { logout: true };
    return { error };
  },
};
