"use client";

import React, { createContext, useContext } from "react";
import { GlobalSettings } from "@/config/settingKeys";

interface SettingsContextProps {
  settings: GlobalSettings;
  isSetupRequired: boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ settings: GlobalSettings; children: React.ReactNode }> = ({ settings, children }) => {
  const isSetupRequired = !settings.siteName || !settings.siteUrl;

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
