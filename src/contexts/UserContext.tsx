"use client";

import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import { User } from "@/models/UserModel";

interface UserContextProps {
  user: User | null;
  initialLoading: boolean;
  loading: boolean; // New loading state
  error: any;
  refreshUser: () => void; // Regular refresh
  awaitRefreshUser: () => Promise<void>; // Awaitable refresh
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [initialLoading, setInitialLoading] = useState(true);

  // Axios-based fetcher function
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const {
    data: userData,
    error,
    isValidating,
    mutate,
  } = useSWR<User>(isAuthenticated ? "/api/me" : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 6000,
  });

  useEffect(() => {
    if (!isValidating && status !== "loading") {
      setInitialLoading(false);
    }
  }, [isValidating, status]);

  // Regular refresh
  const refreshUser = () => mutate();

  // Awaitable refresh
  const awaitRefreshUser = async () => {
    await mutate();
  };

  const value = useMemo(
    () => ({
      user: userData,
      initialLoading,
      loading: isValidating, // Expose loading state
      error,
      refreshUser,
      awaitRefreshUser, // Expose both refresh functions
    }),
    [userData, initialLoading, isValidating, error, mutate]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
