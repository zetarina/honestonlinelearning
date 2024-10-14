import React from "react";
import SettingsProvider from "@/providers/SettingsProvider";
import SettingService from "@/services/SettingService";
import AntdStyleRegistry from "@/components/AntdStyleRegistry";
import LoadingSpinner from "@/components/LoadingSpinner";

const AppLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  // Fetch settings asynchronously
  const settings = await new SettingService().getPublicSettings();

  // If settings are null, the setup page needs to be shown.
  const isSetupRequired = !settings || !settings.siteName || !settings.siteUrl;

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
        <AntdStyleRegistry>
          <SettingsProvider settings={settings} isSetupRequired={isSetupRequired}>
            {children}
          </SettingsProvider>
        </AntdStyleRegistry>
      </body>
    </html>
  );
};

export default AppLayout;
