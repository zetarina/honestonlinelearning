import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import useSWR from "swr";
import { User } from "@/models/UserModel";
import { message } from "antd";
import apiClient, { saveTokens, clearTokens } from "@/utils/api/apiClient";

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

  const fetcher = useCallback(
    async (url: string) => {
      try {
        return await apiClient.get(url).then((res) => res.data);
      } catch (error) {
        return null;
      }
    },
    []
  );

  const { data, mutate, isValidating } = useSWR<User>(
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
      if (!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
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

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      saveTokens(data.accessToken, data.refreshToken);

      setHasShownLogoutMessage(false);
      await mutate();
      message.success("Login successful!");
    } catch (error) {
      handleError(error, "Invalid email or password.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutate, handleError]);

  const logoutUser = useCallback((infoMessage?: string) => {
    clearTokens();
    setUser(null);
    mutate(null, false);

    if (infoMessage && !hasShownLogoutMessage) {
      message.info(infoMessage);
      setHasShownLogoutMessage(true);
    } else {
      message.success("Logout successful!");
    }
  }, [mutate, hasShownLogoutMessage]);

  const logout = useCallback(() => {
    setLoading(true);
    try {
      logoutUser();
    } finally {
      setLoading(false);
    }
  }, [logoutUser]);

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
    [user, initialLoading, isCurrentlyLoading, refreshUser, awaitRefreshUser, signIn, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
