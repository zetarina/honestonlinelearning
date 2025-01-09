"use client";

import React, { createContext, useContext } from "react";
import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";

interface SettingsContextProps {
  settings: Partial<SettingsInterface>;
  isSetupRequired: boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{
  settings: Partial<SettingsInterface>;
  children: React.ReactNode;
}> = ({ settings, children }) => {
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
