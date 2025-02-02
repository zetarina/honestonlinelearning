"use client";
import UserContext from "@/contexts/UserContext";
import { UserAPI } from "@/models/UserModel";
import apiClient, { saveTokens, clearTokens } from "@/utils/api/apiClient";
import { message } from "antd";
import { ReactNode, useState, useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasShownLogoutMessage, setHasShownLogoutMessage] = useState(false);

  const fetcher = useCallback(async (url: string) => {
    try {
      return await apiClient.get(url).then((res) => res.data);
    } catch (error) {
      return null;
    }
  }, []);

  const { data, mutate, isValidating } = useSWR<UserAPI>(
    () => (localStorage.getItem("accessToken") ? "/me" : null),
    fetcher,
    {
      refreshInterval: 10 * 1000,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    setUser(data || null);
    if (!isValidating) {
      setInitialLoading(false);
    }
  }, [data, isValidating]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (
        !localStorage.getItem("accessToken") ||
        !localStorage.getItem("refreshToken")
      ) {
        if (user) {
          logout("Logged out due to session change.");
        }
      } else {
        mutate();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, mutate]);

  const getBrowserName = () => {
    const userAgent = navigator.userAgent || "Unknown Device";
    let browserName = "Unknown Device";

    if (
      userAgent.includes("Chrome") &&
      userAgent.includes("Safari") &&
      !userAgent.includes("Edge") &&
      !userAgent.includes("OPR")
    ) {
      browserName = "Chrome";
    } else if (userAgent.includes("Edg")) {
      browserName = "Edge";
    } else if (userAgent.includes("OPR")) {
      browserName = "Opera";
    } else if (userAgent.includes("Firefox")) {
      browserName = "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browserName = "Safari";
    }
    localStorage.setItem("deviceName", browserName);
    return browserName;
  };

  useEffect(() => {
    const deviceName = localStorage.getItem("deviceName");
    if (!deviceName) {
      getBrowserName();
    }
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(error);
    const errorMessage = error?.response?.data?.message || defaultMessage;
    message.error(errorMessage);
  }, []);

  const refreshUser = useCallback(() => {
    mutate();
  }, [mutate]);

  const awaitRefreshUser = useCallback(async () => {
    try {
      await mutate();
    } catch (error) {
      handleError(error, "Failed to refresh user data.");
    }
  }, [mutate, handleError]);
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        let deviceName = localStorage.getItem("deviceName");
        if (!deviceName) {
          deviceName = getBrowserName();
        }
        const { data } = await apiClient.post("/auth/login", {
          email,
          password,
          deviceName: deviceName,
        });

        const {
          user: apiUser,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        } = data;

        const accessTokenExpiry = Date.now() + accessTokenExpiresIn * 1000;
        const refreshTokenExpiry = Date.now() + refreshTokenExpiresIn * 1000;

        saveTokens(
          accessToken,
          refreshToken,
          accessTokenExpiry,
          refreshTokenExpiry
        );
        setUser(apiUser);
        setHasShownLogoutMessage(false);
        await mutate();

        // Moved message.success to useEffect or after the async operation
        setTimeout(() => {
          message.success("Login successful!");
        }, 0);
      } catch (error) {
        handleError(error, "Invalid email or password.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutate, handleError]
  );
  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      setLoading(true);
      try {
        const { data } = await apiClient.post("/auth/signup", {
          username,
          email,
          password,
        });

        const {
          user: apiUser,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        } = data;

        const accessTokenExpiry = Date.now() + accessTokenExpiresIn * 1000;
        const refreshTokenExpiry = Date.now() + refreshTokenExpiresIn * 1000;
        setUser(apiUser);
        saveTokens(
          accessToken,
          refreshToken,
          accessTokenExpiry,
          refreshTokenExpiry
        );

        setHasShownLogoutMessage(false);
        await mutate();

        setTimeout(() => {
          message.success("Signup successful!");
        }, 0);
      } catch (error) {
        handleError(error, "Signup failed. Please try again.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutate, handleError]
  );

  const logout = useCallback(
    async (infoMessage: string = "Logging out") => {
      console.log("Logging out...");
      setLoading(true);

      try {
        console.log("Logging out...");

        const refreshToken = localStorage.getItem("refreshToken");
        const deviceName = localStorage.getItem("deviceName");

        // Attempt to log out from the backend
        const logoutPromise =
          refreshToken && deviceName
            ? apiClient.post("/auth/logout", { refreshToken, deviceName })
            : Promise.resolve();

        // Clear tokens, reset user state, and mute SWR
        clearTokens();
        setUser(null);
        mutate(undefined, false);

        // Always show the logout message
        const messageToShow =
          typeof infoMessage === "string" ? infoMessage : "Logging out";
        message.info(messageToShow);

        // Run the backend logout call in parallel with frontend state updates
        await logoutPromise;

        // Remove deviceName from localStorage after logout
        localStorage.removeItem("deviceName");
      } catch (error) {
        console.error("Unexpected error during logout:", error);
        message.error("Logout failed!");
      } finally {
        setLoading(false);
      }
    },
    [mutate]
  );

  const isCurrentlyLoading = initialLoading || isValidating;

  const value = useMemo(
    () => ({
      user,
      initialLoading,
      loading: isCurrentlyLoading,
      refreshUser,
      awaitRefreshUser,
      signIn,
      signUp,
      logout,
    }),
    [
      user,
      initialLoading,
      isCurrentlyLoading,
      refreshUser,
      awaitRefreshUser,
      signIn,
      signUp,
      logout,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
