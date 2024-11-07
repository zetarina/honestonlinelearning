import React, { createContext, ReactNode, useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import { User } from "@/models/UserModel";
import { message } from "antd";
import apiClient from "@/utils/api/apiClient";

interface UserContextProps {
  user: User | null;
  initialLoading: boolean;
  loading: boolean;
  refreshUser: () => void;
  awaitRefreshUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasShownLogoutMessage, setHasShownLogoutMessage] = useState(false); // Flag for message

  const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

  const { data, mutate, isValidating } = useSWR<User>(
    () => (localStorage.getItem("accessToken") ? "/me" : null),
    fetcher,
    {
      refreshInterval: 6000,
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
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setUser(null);
        mutate(null, false);
        if (!hasShownLogoutMessage) {
          message.info("Logged out due to session change.");
          setHasShownLogoutMessage(true); // Set the flag
        }
      } else {
        mutate();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [mutate, hasShownLogoutMessage]);

  const refreshUser = () => {
    mutate();
  };

  const awaitRefreshUser = async () => {
    try {
      await mutate();
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setHasShownLogoutMessage(false); // Reset the flag on successful login
      await mutate();
      message.success("Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      mutate(null, false);
      message.success("Logout successful!");
    } finally {
      setLoading(false);
    }
  };

  const isCurrentlyLoading = initialLoading || isValidating;

  const value = useMemo(
    () => ({
      user,
      initialLoading,
      loading: isCurrentlyLoading,
      refreshUser,
      awaitRefreshUser,
      signIn,
      logout,
    }),
    [user, initialLoading, isCurrentlyLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
