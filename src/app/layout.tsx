import React from "react";
import AppProvider from "@/providers/AppProvider";
import SettingService from "@/services/SettingService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SettingsProvider } from "@/contexts/SettingsContext";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings server-side
  const settingService = new SettingService();
  const settings = await settingService.getPublicSettings();

  // Display a loading spinner if settings are unavailable
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

  return (
    <html lang="en">
      <head>
        <title>{settings.siteName || "Online Learning App"}</title>
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
