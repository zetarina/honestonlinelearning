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
  const settings = await settingService.getPublicSettings();

  if (!settings) {
    return (
      <html lang="en">
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
          <LoadingSpinner />
        </body>
      </html>
    );
  }

  // Coerce `siteName` to a string
  const siteName =
    typeof settings[SITE_SETTINGS_KEYS.SITE_NAME] === "string"
      ? settings.siteName
      : "Online Learning App";

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
