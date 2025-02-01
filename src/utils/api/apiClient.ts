import axios from "axios";
import { message } from "antd";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

const MAX_RETRIES = 3;

const saveTokens = (
  accessToken: string,
  refreshToken: string,
  accessTokenExpiry: number,
  refreshTokenExpiry: number
) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessTokenExpiry", accessTokenExpiry.toString());
    localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry.toString());
  }
};

const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("deviceName");
    localStorage.removeItem("accessTokenExpiry");
    localStorage.removeItem("refreshTokenExpiry");
  }
};

const isTokenExpired = (): boolean => {
  const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");
  const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry");

  const accessTokenExpiryParsed = accessTokenExpiry
    ? parseInt(accessTokenExpiry, 10)
    : null;
  const refreshTokenExpiryParsed = refreshTokenExpiry
    ? parseInt(refreshTokenExpiry, 10)
    : null;

  return (
    (accessTokenExpiryParsed !== null &&
      accessTokenExpiryParsed < Date.now()) ||
    (refreshTokenExpiryParsed !== null && refreshTokenExpiryParsed < Date.now())
  );
};

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const deviceName = localStorage.getItem("deviceName");
    if (deviceName) {
      config.headers["Device-Name"] = deviceName;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    originalRequest._retryAttempt = originalRequest._retryAttempt || 0;

    if (
      error.response?.status === 401 &&
      originalRequest._retryAttempt < MAX_RETRIES
    ) {
      originalRequest._retryAttempt++;

      const refreshToken = localStorage.getItem("refreshToken");
      const deviceName = localStorage.getItem("deviceName");

      if (!refreshToken || !localStorage.getItem("accessToken")) {
        message.info("Session expired. Please log in.");
        clearTokens();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken, deviceName }
        );

        const accessTokenExpiry = data.accessTokenExpiry;
        const refreshTokenExpiry = data.refreshTokenExpiry;

        saveTokens(
          data.accessToken,
          data.refreshToken,
          accessTokenExpiry,
          refreshTokenExpiry
        );

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        message.error("Session refresh failed. Please log in.");
        return Promise.reject(refreshError);
      }
    }

    if (originalRequest._retryAttempt >= MAX_RETRIES) {
      clearTokens();
      message.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export { saveTokens, clearTokens };
export default apiClient;
