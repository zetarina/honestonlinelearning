"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/components/LayoutRouter";
import SetupPage from "@/components/SetupPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { GlobalSettings, SETTINGS_KEYS } from "@/config/settingKeys";

interface SettingsProviderProps {
  children: React.ReactNode;
  settings: Record<string, any>;
  isSetupRequired: boolean;
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  settings,
  isSetupRequired,
}) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const extractedSettings: GlobalSettings = {
    siteName: settings[SETTINGS_KEYS.SITE_NAME]?.toString() ?? "Online App",
    siteUrl: settings[SETTINGS_KEYS.SITE_URL]?.toString() ?? "",
  };

  // Log extracted settings
  
  

  useEffect(() => {
     // Add logging for page load
    const onLoad = () => {
      setIsPageLoaded(true);
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
  }, [isPageLoaded]);

  if (!isPageLoaded && isFirstLoad) {
     // Track spinner rendering
    return <LoadingSpinner />;
  }

  if (isSetupRequired) {
     // Track when setup is required
    return <SetupPage />;
  }

  return (
    <SessionProvider>
      <UserProvider>
        <LayoutRouter settings={extractedSettings}>{children}</LayoutRouter>
      </UserProvider>
    </SessionProvider>
  );
};

export default SettingsProvider;
