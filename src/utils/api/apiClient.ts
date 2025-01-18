import axios from "axios";
import { message } from "antd";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

const MAX_RETRIES = 3;
let retryAttempt = 0;

// Flag to prevent duplicate messages
let messageDisplayed = false;

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // If no tokens are available, user is not logged in
      if (!accessToken || !refreshToken) {
        if (!messageDisplayed) {
          message.info("You need to log in to access this page.");
          messageDisplayed = true;
          setTimeout(() => (messageDisplayed = false), 1000); // Reset flag after 1 second
        }
        return Promise.reject(error);
      }

      // Retry the request with a refreshed token
      originalRequest._retry = true;
      retryAttempt++;

      if (retryAttempt > MAX_RETRIES) {
        localStorage.clear();
        if (!messageDisplayed) {
          message.error("Session expired. Please log in again.");
          messageDisplayed = true;
          setTimeout(() => (messageDisplayed = false), 1000); // Reset flag after 1 second
        }
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const { data } = await axios.post(
          `${NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle token refresh failure
        localStorage.clear();
        if (!messageDisplayed) {
          message.error("Unable to refresh session. Please log in.");
          messageDisplayed = true;
          setTimeout(() => (messageDisplayed = false), 1000); // Reset flag after 1 second
        }
        return Promise.reject(refreshError);
      }
    }

    // For other errors, propagate the error
    return Promise.reject(error);
  }
);

export default apiClient;
