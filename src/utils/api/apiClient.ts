import axios from "axios";
import { message } from "antd";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

const MAX_RETRIES = 3;
let retryAttempt = 0;
let messageDisplayed = false;

// In-memory token storage
let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

// Sync tokens from localStorage on load
const loadTokens = () => {
  if (typeof window !== "undefined") {
    inMemoryAccessToken = localStorage.getItem("accessToken") || null;
    inMemoryRefreshToken = localStorage.getItem("refreshToken") || null;
  }
};


// Save tokens to in-memory storage and localStorage
const saveTokens = (accessToken: string, refreshToken: string) => {
  inMemoryAccessToken = accessToken;
  inMemoryRefreshToken = refreshToken;

  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

const clearTokens = () => {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;

  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};


// Load tokens when the module is imported
loadTokens();

apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!inMemoryAccessToken || !inMemoryRefreshToken) {
        if (!messageDisplayed) {
          message.info("Session expired. Please log in.");
          messageDisplayed = true;
          setTimeout(() => (messageDisplayed = false), 1000);
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      retryAttempt++;

      if (retryAttempt > MAX_RETRIES) {
        clearTokens();
        if (!messageDisplayed) {
          message.error("Session expired. Please log in again.");
          messageDisplayed = true;
          setTimeout(() => (messageDisplayed = false), 1000);
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refreshToken: inMemoryRefreshToken,
        });

        saveTokens(data.accessToken, inMemoryRefreshToken!);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        message.error("Session refresh failed. Please log in.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { saveTokens, clearTokens };
export default apiClient;
