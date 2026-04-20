import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1];
  if (token && !isTokenExpired(token) && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;