import React from "react";
import AppProvider from "@/providers/AppProvider";
import SettingService from "@/services/SettingService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SITE_SETTINGS_KEYS } from "@/config/settings/SITE_SETTINGS_KEYS";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingService = new SettingService();

  let settings;
  try {
    settings = await settingService.getPublicSettings();
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    settings = null;
  }

  if (!settings) {
    return (
      <html lang="en">
        <head>
          <title>Loading...</title>
        </head>
        <body
          style={{
            margin: 0,
            padding: 0,
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingSpinner message="Loading application settings..." />
        </body>
      </html>
    );
  }

  // Safely access `siteName` with fallback
  const siteName =
    settings[SITE_SETTINGS_KEYS.SITE_NAME]?.toString() || "Online Learning App";

  return (
    <html lang="en">
      <head>
        <title>{siteName}</title>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SettingsProvider settings={settings}>
          <AppProvider>{children}</AppProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
