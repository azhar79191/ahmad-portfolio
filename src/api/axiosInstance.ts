import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

/** Read a cookie value by name (client-side only) */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; samesite=lax`;
}

function clearAuthCookies() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
}

// Attach Bearer token to every request unless marked public
api.interceptors.request.use((config) => {
  if ((config as any).public) return config;
  const token = getCookie("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if a refresh is already in progress to avoid multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

// Response interceptor — handle 401 by refreshing token then retrying
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401, skip if already retried or it's the refresh call itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getCookie("refresh");

    if (!refreshToken) {
      clearAuthCookies();
      if (typeof window !== "undefined") window.location.href = "/admin/login";
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refresh: refreshToken }
      );

      const newAccessToken: string = data.access;
      setCookie("token", newAccessToken);

      // Update the default header and retry the original request
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthCookies();
      if (typeof window !== "undefined") window.location.href = "/admin/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;