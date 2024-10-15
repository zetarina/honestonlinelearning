import React from "react";
import SettingsProvider from "@/providers/SettingsProvider";
import SettingService from "@/services/SettingService";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings on the server-side since layout is a server component
  const settingService = new SettingService();
  const settings = await settingService.getPublicSettings();

  // Handle the case where settings are unavailable
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
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#001529",
                colorLink: "#ffffff",
              },
            }}
          >
            <SettingsProvider
              settings={settings}
              isSetupRequired={isSetupRequired}
            >
              {children}
            </SettingsProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
