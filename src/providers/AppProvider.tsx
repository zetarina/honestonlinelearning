"use client";

import React from "react";
import { UserProvider } from "@/contexts/UserContext";
import LayoutRouter from "@/router/LayoutRouter";
import SetupForm from "@/components/forms/SetupForm";
import { useSettings } from "@/contexts/SettingsContext";

import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { FilePickerProvider } from "@/contexts/FilePickerContext";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isSetupRequired } = useSettings();

  if (isSetupRequired === undefined) {
    return <LoadingSpinner />;
  }

  if (isSetupRequired) {
    return <SetupForm />;
  }

  return (
    <UserProvider>
      <FilePickerProvider>
        <LayoutRouter>{children}</LayoutRouter>
      </FilePickerProvider>
    </UserProvider>
  );
};

export default AppProvider;
