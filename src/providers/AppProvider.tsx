"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/router/LayoutRouter";
import SetupForm from "@/components/forms/SetupForm";
import { useSettings } from "@/contexts/SettingsContext";
import { ImagePickerProvider } from "@/contexts/ImagePickerContext";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isSetupRequired } = useSettings();

  if (isSetupRequired === undefined) {
    // Optional: Show loading while `SettingsProvider` initializes
    return <LoadingSpinner />;
  }

  if (isSetupRequired) {
    return <SetupForm />;
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
