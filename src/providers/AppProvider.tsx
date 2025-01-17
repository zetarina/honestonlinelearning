"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/components/LayoutRouter";
import SetupPage from "@/components/SetupPage";
import { useSettings } from "@/contexts/SettingsContext";
import { ImagePickerProvider } from "@/contexts/ImagePickerContext";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isSetupRequired } = useSettings();
  if (isSetupRequired) {
    return <SetupPage />;
  }

  return (
    <UserProvider>
      <ImagePickerProvider>
        <LayoutRouter>{children}</LayoutRouter>
      </ImagePickerProvider>
    </UserProvider>
  );
};

export default AppProvider;
