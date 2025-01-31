import React from "react";
import AppProvider from "@/providers/AppProvider";
import SettingService from "@/services/SettingService";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { SettingsInterface } from "@/config/settingKeys";

import {
  ColorSchema,
  DESIGN_SCHEMA_SETTINGS_KEYS,
} from "@/config/settings/DESIGN_SCHEMA_KEYS";
import CustomConfigProvider from "@/providers/CustomConfigProvider";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingService = new SettingService();
  let settings: Partial<SettingsInterface> = {};
  let loading = true;

  try {
    const fetchedSettings = await settingService.getPublicSettings();
    settings = fetchedSettings || {};
    loading = false;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    loading = false;
  }

  if (loading) {
    return (
      <html lang="en">
        <head>
          <title>Loading...</title>
        </head>
      </html>
    );
  }

  const defaultProductName = "WisdomWave";
  const defaultProductDescription =
    "An innovative learning platform designed to empower learners and educators.";
  const defaultProductLogo = "/images/product-logo.webp";
  const defaultFavicon = "/images/favicon.ico";
  const defaultKeywords =
    "learning, education, e-learning, online courses, knowledge, training";

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
  const colorSchema = (settings as any)?.[
    DESIGN_SCHEMA_SETTINGS_KEYS.COLOR_SCHEMA
  ] as ColorSchema;

  return (
    <html lang="en">
      <head>
        {/* Basic SEO Metadata */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/" />
        <link rel="icon" href={favicon} />

        {/* Open Graph Metadata */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Performance Optimization */}
        <link rel="preload" href={ogImage} as="image" />
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
          <CustomConfigProvider>
            <AppProvider>{children}</AppProvider>
          </CustomConfigProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
