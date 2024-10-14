import React from "react";
import SettingsProvider from "@/providers/SettingsProvider";
import SettingService from "@/services/SettingService";
import AntdStyleRegistry from "@/components/AntdStyleRegistry";

const AppLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const settings = await new SettingService().getPublicSettings();

  return (
    <html lang="en">
      <head>
        <title>{settings?.siteName || "Online Learning App"}</title>

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
          <SettingsProvider settings={settings}>{children}</SettingsProvider>
        </AntdStyleRegistry>
      </body>
    </html>
  );
};

export default AppLayout;
