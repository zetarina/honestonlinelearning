import React from "react";
import AppProvider from "@/providers/AppProvider";
import SettingService from "@/services/SettingService";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { SettingsInterface } from "@/config/settingKeys";
import {
  ColorSchema,
  DESIGN_SCHEMA_SETTINGS_KEYS,
} from "@/config/settings/DESIGN_SCHEMA_KEYS";
import CustomConfigProvider from "@/providers/CustomConfigProvider";
import UserService from "@/services/UserService";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { NextResponse } from "next/server";

async function getSettings(): Promise<Partial<SettingsInterface>> {
  try {
    const settingService = new SettingService();
    const userService = new UserService();
    const fetchedSettings = await settingService.getPublicSettings();
    await userService.syncRolePermissions();
    return fetchedSettings || {};
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}
export async function generateMetadata(): Promise<any> {
  const settings: Partial<SettingsInterface> = await getSettings();

  // Default values
  const defaultProductName = "WisdomWave";
  const defaultProductDescription =
    "An innovative learning platform designed to empower learners and educators.";
  const defaultProductLogo = "/images/product-logo.webp";
  const defaultFavicon = "/images/favicon.ico";
  const defaultKeywords =
    "learning, education, e-learning, online courses, knowledge, training";

  // Extracting settings or fallback to defaults
  const siteName =
    (settings as any)?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteName ||
    defaultProductName;
  const seoSettings =
    (settings as any)?.[GLOBAL_SETTINGS_KEYS.SEO_SETTINGS] || {};
  const metaTitle = seoSettings.metaTitle || siteName;
  const metaDescription =
    seoSettings.metaDescription || defaultProductDescription;
  const ogImage = seoSettings.ogImage || defaultProductLogo;
  const keywords = seoSettings.keywords || defaultKeywords;
  const favicon =
    (settings as any)?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteLogo ||
    defaultFavicon;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    icons: {
      icon: favicon,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      image: ogImage,
      url: "/",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      image: ogImage,
    },
  };
}
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings: Partial<SettingsInterface> = await getSettings();
  return (
    <html lang="en">
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
          <CustomConfigProvider>
            <AppProvider>{children}</AppProvider>
          </CustomConfigProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
