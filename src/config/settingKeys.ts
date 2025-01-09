// Import all settings
import {
  SITE_SETTINGS_KEYS,
  SITE_SETTINGS,
  SITE_SETTINGS_TYPES,
} from "./settings/SITE_SETTINGS_KEYS";

import {
  MAIL_SERVICE_KEYS,
  MAIL_SERVICE_SETTINGS,
  Mail_SETTINGS_TYPES,
} from "./settings/MAIL_SERVICE_KEYS";

import {
  STORAGE_SETTINGS_KEYS,
  STORAGE_SETTINGS,
  STORAGE_SETTINGS_TYPES,
} from "./settings/STORAGE_SETTINGS_KEYS";

import {
  PAYMENT_SETTINGS_KEYS,
  PAYMENT_SETTINGS,
  PAYMENT_SETTINGS_TYPES,
} from "./settings/PAYMENT_SETTINGS_KEYS";

import {
  SOCIAL_MEDIA_KEYS,
  SOCIAL_MEDIA_SETTINGS,
  SOCIAL_MEDIA_SETTINGS_TYPES,
} from "./settings/SOCIAL_MEDIA_KEYS";

import {
  MESSAGING_SERVICE_KEYS,
  MESSAGING_SERVICE_SETTINGS,
  MESSAGING_SERVICE_TYPES,
} from "./settings/MESSAGING_SERVICE_KEYS";
// Combine all keys
export const SETTINGS_KEYS = {
  ...SITE_SETTINGS_KEYS,
  ...MAIL_SERVICE_KEYS,
  ...STORAGE_SETTINGS_KEYS,
  ...PAYMENT_SETTINGS_KEYS,
  ...SOCIAL_MEDIA_KEYS,
  ...MESSAGING_SERVICE_KEYS,
} as const;

// Combine all settings
export const SETTINGS_GUIDE = {
  ...SITE_SETTINGS,
  ...MAIL_SERVICE_SETTINGS,
  ...STORAGE_SETTINGS,
  ...PAYMENT_SETTINGS,
  ...SOCIAL_MEDIA_SETTINGS,
  ...MESSAGING_SERVICE_SETTINGS,
} as const;

export type SettingsInterface = SITE_SETTINGS_TYPES &
  Mail_SETTINGS_TYPES &
  STORAGE_SETTINGS_TYPES &
  PAYMENT_SETTINGS_TYPES &
  SOCIAL_MEDIA_SETTINGS_TYPES &
  MESSAGING_SERVICE_TYPES;

export const SAMPLE_SETTINGS: SITE_SETTINGS_TYPES = {
  siteName: "Sample Site",
  siteUrl: "https://www.samplesite.com",
  siteBanner: "https://www.samplesite.com/banner.jpg",
  siteLogo: "https://www.samplesite.com/logo.png",
  currency: "USD",
  heroBanner: "https://www.samplesite.com/hero.jpg",
  featureCoursesLimit: 10,
  maxInstructorsCount: 5,
  contactUsInfo: {
    address: "example example ",
    phone: "1234567890",
    email: "chaon@gmail.com",
  },
  studentReviews: [
    {
      name: "John Doe",
      comment: "Great site!",
    },
  ],
};
export type PublicKeys = {
  [K in keyof typeof SETTINGS_GUIDE]: (typeof SETTINGS_GUIDE)[K]["visibility"] extends "public"
    ? K
    : never;
}[keyof typeof SETTINGS_GUIDE];

export type PrivateKeys = {
  [K in keyof typeof SETTINGS_GUIDE]: (typeof SETTINGS_GUIDE)[K]["visibility"] extends "private"
    ? K
    : never;
}[keyof typeof SETTINGS_GUIDE];

// Public and private settings types
export type PublicSettings = Pick<SettingsInterface, PublicKeys>;
export type PrivateSettings = Pick<SettingsInterface, PrivateKeys>;

// All settings type (combining public and private settings)
export type AllSettings = PublicSettings & PrivateSettings;
