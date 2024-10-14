import React from "react";
import SettingsProvider from "@/providers/SettingsProvider";
import AntdStyleRegistry from "@/components/AntdStyleRegistry";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Static values for settings
  const settings = {
    siteName: "My Online Learning App",
    siteUrl: "https://myonlinelearningapp.com",
  };

  // Check if setup is required (for example, if settings are missing)
  const isSetupRequired = !settings.siteName || !settings.siteUrl;

  return (
    <html lang="en">
      <head>
        <title>{settings.siteName || "Online Learning App"}</title>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="prefetch" href="/_next/static/css/app/page.css" />
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
