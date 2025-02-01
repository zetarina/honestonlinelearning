"use client";

import React from "react";

import LayoutRouter from "@/router/LayoutRouter";
import SetupForm from "@/components/forms/SetupForm";

import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { UserProvider } from "./UserProvider";
import { FilePickerProvider } from "./FilePickerProvider";
import { useSettings } from "@/hooks/useSettings";

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
