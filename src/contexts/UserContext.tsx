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
import { User } from "@/models/UserModel";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UserContextProps {
  user: User | null;
  initialLoading: boolean;
  error: any;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [initialLoading, setInitialLoading] = useState(true);

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

    if (isValidating && !initialLoading) {
      console.log("Silently checked auth.");
    }
  }, [isValidating, status, initialLoading]);

  const value = useMemo(
    () => ({
      user: userData,
      initialLoading,
      error,
      refreshUser: mutate,
    }),
    [userData, initialLoading, error, mutate]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
