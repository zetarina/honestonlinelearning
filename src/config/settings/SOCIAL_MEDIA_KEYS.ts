import { GeneralConfig } from ".";

// SOCIAL_MEDIA_KEYS - Flat keys for database storage
export const SOCIAL_MEDIA_KEYS = {
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  GITHUB: "github",
} as const;

export const SOCIAL_MEDIA_SETTINGS: GeneralConfig<typeof SOCIAL_MEDIA_KEYS> = {
  [SOCIAL_MEDIA_KEYS.FACEBOOK]: {
    label: "Facebook Settings",
    type: "json",
    visibility: "public",
    fields: {
      pageId: {
        label: "Facebook Page ID",
        guide: "This is the Facebook page ID for page messaging.",
        formType: "string",
      },
      url: {
        label: "Facebook URL",
        guide: "This is the URL for your Facebook page.",
        formType: "string",
      },
    },
  },
  [SOCIAL_MEDIA_KEYS.TWITTER]: {
    label: "Twitter Settings",
    type: "json",
    visibility: "public",
    fields: {
      url: {
        label: "Twitter URL",
        guide: "This is the URL for your Twitter profile.",
        formType: "string",
      },
    },
  },
  [SOCIAL_MEDIA_KEYS.INSTAGRAM]: {
    label: "Instagram Settings",
    type: "json",
    visibility: "public",
    fields: {
      url: {
        label: "Instagram URL",
        guide: "This is the URL for your Instagram profile.",
        formType: "string",
      },
    },
  },
  [SOCIAL_MEDIA_KEYS.LINKEDIN]: {
    label: "LinkedIn Settings",
    type: "json",
    visibility: "public",
    fields: {
      url: {
        label: "LinkedIn URL",
        guide: "This is the URL for your LinkedIn profile.",
        formType: "string",
      },
    },
  },
  [SOCIAL_MEDIA_KEYS.GITHUB]: {
    label: "GitHub Settings",
    type: "json",
    visibility: "public",
    fields: {
      url: {
        label: "GitHub URL",
        guide: "This is the URL for your GitHub profile.",
        formType: "string",
      },
    },
  },
};

export type SOCIAL_MEDIA_SETTINGS_TYPES = {
  [SOCIAL_MEDIA_KEYS.FACEBOOK]: {
    pageId: string;
    url: string;
  };
  [SOCIAL_MEDIA_KEYS.TWITTER]: {
    url: string;
  };
  [SOCIAL_MEDIA_KEYS.INSTAGRAM]: {
    url: string;
  };
  [SOCIAL_MEDIA_KEYS.LINKEDIN]: {
    url: string;
  };
  [SOCIAL_MEDIA_KEYS.GITHUB]: {
    url: string;
  };
};
