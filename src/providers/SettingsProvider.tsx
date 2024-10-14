"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/components/LayoutRouter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { GlobalSettings, SETTINGS_KEYS } from "@/config/settingKeys";

interface SettingsProviderProps {
  children: React.ReactNode;
  settings: Record<string, any>;
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  settings,
}) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const extractedSettings: GlobalSettings = {
    siteName: settings[SETTINGS_KEYS.SITE_NAME]?.toString() ?? "Online App",
    siteUrl: settings[SETTINGS_KEYS.SITE_URL]?.toString() ?? "",
  };

  useEffect(() => {
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
  }, []);

  if (!isPageLoaded && isFirstLoad) {
    return <LoadingSpinner />;
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
