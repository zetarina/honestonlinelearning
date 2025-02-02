import React, { Suspense } from "react";
import AppProvider from "@/providers/AppProvider";
import {
  GLOBAL_SETTINGS_KEYS,
  GLOBAL_SETTINGS_TYPES,
} from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { SettingsInterface } from "@/config/settingKeys";
import CustomConfigProvider from "@/providers/CustomConfigProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";


async function getSettings(): Promise<Partial<SettingsInterface>> {
  try {
    let baseUrl =
      process.env.NEXT_PUBLIC_API_URL || // Explicitly set API URL first
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Ensure baseUrl has the correct protocol
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    const res = await fetch(`${baseUrl}/api/settings/public`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch settings: ${res.status}`);
    }

    const fetchedSettings = await res.json();
    console.log("Fetched settings:", fetchedSettings);

    return fetchedSettings || {};
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}


export async function generateMetadata(): Promise<Record<string, any>> {
  const settings: Partial<SettingsInterface> = await getSettings();

  const siteSettings = (settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS] ??
    {}) as GLOBAL_SETTINGS_TYPES[typeof GLOBAL_SETTINGS_KEYS.SITE_SETTINGS];
  const seoSettings = (settings[GLOBAL_SETTINGS_KEYS.SEO_SETTINGS] ??
    {}) as GLOBAL_SETTINGS_TYPES[typeof GLOBAL_SETTINGS_KEYS.SEO_SETTINGS];

  const defaults = {
    productName: "WisdomWave",
    description:
      "An innovative learning platform designed to empower learners and educators.",
    logo: "/images/product-logo.webp",
    favicon: "/images/favicon.ico",
    keywords:
      "learning, education, e-learning, online courses, knowledge, training",
  };

  return {
    title:
      seoSettings.metaTitle ?? siteSettings.siteName ?? defaults.productName,
    description: seoSettings.metaDescription ?? defaults.description,
    keywords: seoSettings.keywords ?? defaults.keywords,
    icons: { icon: siteSettings.siteLogo ?? defaults.favicon },
    openGraph: {
      title: seoSettings.metaTitle ?? defaults.productName,
      description: seoSettings.metaDescription ?? defaults.description,
      image: seoSettings.ogImage ?? defaults.logo,
      url: "/",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoSettings.metaTitle ?? defaults.productName,
      description: seoSettings.metaDescription ?? defaults.description,
      image: seoSettings.ogImage ?? defaults.logo,
    },
  };
}

async function SettingsLoader({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <SettingsProvider settings={settings}>
      <CustomConfigProvider>
        <AppProvider>{children}</AppProvider>
      </CustomConfigProvider>
    </SettingsProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Next.js automatically injects metadata from generateMetadata() */}
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
        {/* Wrap content with Suspense for smooth loading */}
        <Suspense fallback={<div>Loading settings...</div>}>
          <SettingsLoader>{children}</SettingsLoader>
        </Suspense>
      </body>
    </html>
  );
}
