import React from "react";
import AppProvider from "@/providers/AppProvider";
import SettingService from "@/services/SettingService";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
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

  // Fallback values
  const defaultProductName = "WisdomWave";
  const defaultProductDescription =
    "An innovative learning platform designed to empower learners and educators.";
  const defaultProductLogo = "/images/product-logo.webp";
  const defaultFavicon = "/images/favicon.ico";
  const defaultKeywords =
    "learning, education, e-learning, online courses, knowledge, training";

  // Extract settings
  const siteName =
    settings?.[SITE_SETTINGS_KEYS.SITE_NAME]?.toString() || defaultProductName;
  const seoSettings = settings?.[SITE_SETTINGS_KEYS.SEO_SETTINGS];
  const metaTitle = seoSettings?.metaTitle || siteName; // Use SITE_NAME as fallback
  const metaDescription =
    seoSettings?.metaDescription || defaultProductDescription;
  const ogImage = seoSettings?.ogImage || defaultProductLogo;
  const keywords = seoSettings?.keywords || defaultKeywords;
  const favicon =
    settings?.[SITE_SETTINGS_KEYS.SITE_LOGO]?.toString() || defaultFavicon;

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
          <AppProvider>{children}</AppProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
