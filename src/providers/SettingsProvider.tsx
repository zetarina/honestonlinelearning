"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/components/LayoutRouter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { GlobalSettings, SETTINGS_KEYS } from "@/config/settingKeys"; // Adjust import
import "@/styles/globals.css";

interface SettingsProviderProps {
  children: React.ReactNode;
  settings: Record<string, any>; // You could replace this with GlobalSettings
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  settings,
}) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Dynamically map settings using SETTINGS_KEYS
  const extractedSettings: GlobalSettings = {
    siteName:
      typeof settings[SETTINGS_KEYS.SITE_NAME] === "string"
        ? settings[SETTINGS_KEYS.SITE_NAME]
        : settings[SETTINGS_KEYS.SITE_NAME]?.toString() ?? undefined,
    siteUrl:
      typeof settings[SETTINGS_KEYS.SITE_URL] === "string"
        ? settings[SETTINGS_KEYS.SITE_URL]
        : settings[SETTINGS_KEYS.SITE_URL]?.toString() ?? undefined,
  };

  useEffect(() => {
    const cachedPageLoadStatus = localStorage.getItem("isPageLoaded");

    if (cachedPageLoadStatus === "true") {
      setIsPageLoaded(true);
      setIsFirstLoad(false);
    } else {
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
    }
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
