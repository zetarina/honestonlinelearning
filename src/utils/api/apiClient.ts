import axios from "axios";
import { message } from "antd";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

let retryAttempt = 0;

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      originalRequest._retry = true;
      retryAttempt++;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(
          `${NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        retryAttempt = 0; // Reset retry attempts on success

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        if (retryAttempt >= 2 || refreshError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          message.error("Session expired. Please log in again.");
        }
      }
    } else if (!navigator.onLine) {
      message.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
