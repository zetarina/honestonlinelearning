import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from "react";
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

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasShownLogoutMessage, setHasShownLogoutMessage] = useState(false);

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

  // Update user and initial loading state when data changes
  useEffect(() => {
    setUser(data || null);
    if (!isValidating) {
      setInitialLoading(false);
    }
  }, [data, isValidating]);

  // Handle session changes (e.g., token changes in localStorage)
  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        if (user) {
          logoutUser("Logged out due to session change.");
        }
      } else {
        mutate();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, mutate]);

  // Centralized error handling
  const handleError = (error: any, defaultMessage: string) => {
    console.error(error);
    const errorMessage = error?.response?.data?.message || defaultMessage;
    message.error(errorMessage);
  };

  // Refresh user data
  const refreshUser = () => {
    mutate();
  };

  // Refresh user data and handle errors
  const awaitRefreshUser = async () => {
    try {
      await mutate();
    } catch (error) {
      handleError(error, "Failed to refresh user data.");
    }
  };

  // Handle user login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setHasShownLogoutMessage(false);
      await mutate();
      message.success("Login successful!");
    } catch (error) {
      handleError(error, "Invalid email or password.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const logoutUser = (infoMessage?: string) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    mutate(null, false);

    if (infoMessage && !hasShownLogoutMessage) {
      message.info(infoMessage);
      setHasShownLogoutMessage(true);
    } else {
      message.success("Logout successful!");
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  const isCurrentlyLoading = initialLoading || isValidating;

  // Memoize context value for performance
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
