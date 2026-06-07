import axios from "axios";
import { getToken, removeToken } from "../utils/token";
import i18n from "../i18n";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isHandlingUnauthorized = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      removeToken();
      localStorage.setItem("auth_flash_type", "error");
      localStorage.setItem(
        "auth_flash_message",
        i18n.t("auth.sessionExpired") || "Your session expired. Please login again to access the dashboard.",
      );
      window.location.assign("/login");
    }

    return Promise.reject(error);
  },
);

export default api;
