"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/components/LayoutRouter";
import SetupPage from "@/components/SetupPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSettings } from "@/contexts/SettingsContext";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Access settings and isSetupRequired directly from SettingsContext
  const { isSetupRequired } = useSettings();

  useEffect(() => {
    const onLoad = () => {
      setIsPageLoaded(true);
      setIsFirstLoad(true);
      localStorage.setItem("isPageLoaded", "true");
    };

    if (document.readyState === "complete") {
      setIsPageLoaded(true);
      localStorage.setItem("isPageLoaded", "true");
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // Show loading spinner on initial page load
  if (!isPageLoaded && isFirstLoad) {
    return <LoadingSpinner />;
  }

  // Render setup page if setup is required
  if (isSetupRequired) {
    return <SetupPage />;
  }

  return (
    <SessionProvider>
      <UserProvider>
        <LayoutRouter>{children}</LayoutRouter>
      </UserProvider>
    </SessionProvider>
  );
};

export default AppProvider;
