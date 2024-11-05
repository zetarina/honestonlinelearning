"use client";

import React, { createContext, useContext } from "react";
import { PublicSettings, SETTINGS_KEYS } from "@/config/settingKeys";

interface SettingsContextProps {
  settings: PublicSettings;
  isSetupRequired: boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{
  settings: PublicSettings;
  children: React.ReactNode;
}> = ({ settings, children }) => {
  // Use SETTINGS_KEYS to dynamically reference `siteName` and `siteUrl`
  const isSetupRequired =
    !settings[SETTINGS_KEYS.SITE_NAME]?.trim() ||
    !settings[SETTINGS_KEYS.SITE_URL]?.trim();

  return (
    <SettingsContext.Provider value={{ settings, isSetupRequired }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
