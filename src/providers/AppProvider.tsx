"use client";

import React from "react";

import LayoutRouter from "@/router/LayoutRouter";
import SetupForm from "@/components/forms/SetupForm";
import { UserProvider } from "./UserProvider";
import { FilePickerProvider } from "./FilePickerProvider";
import { useSettings } from "@/hooks/useSettings";
import LoadingSpin from "@/components/loaders/LoadingSpin";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isSetupRequired } = useSettings();

  if (isSetupRequired === undefined) {
    return <LoadingSpin message="..." />;
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
