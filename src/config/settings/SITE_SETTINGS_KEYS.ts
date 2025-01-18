import { FormType, GeneralConfig, NestedFieldType } from ".";

export const SITE_SETTINGS_KEYS = {
  SITE_NAME: "siteName",
  SITE_URL: "siteUrl",
  SITE_BANNER: "siteBanner",
  SITE_LOGO: "siteLogo",
  CURRENCY: "currency",
  HERO_BANNER: "heroBanner",
  FEATURE_COURSES_LIMIT: "featureCoursesLimit",
  MAX_INSTRUCTORS_COUNT: "maxInstructorsCount",
  CONTACT_US_INFO: "contactUsInfo",
  STUDENT_REVIEWS: "studentReviews",
  SEO_SETTINGS: "seoSettings",
} as const;

export const SITE_SETTINGS: GeneralConfig<typeof SITE_SETTINGS_KEYS> = {
  [SITE_SETTINGS_KEYS.SITE_NAME]: {
    label: "Site Name",
    guide: "This is the name of your site.",
    formType: FormType.TEXT,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.SITE_URL]: {
    label: "Site URL",
    guide: "This is the URL of your site.",
    formType: FormType.TEXT,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.SITE_BANNER]: {
    label: "Site Banner",
    guide: "This is the banner image URL for your site.",
    formType: FormType.IMAGE,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.SITE_LOGO]: {
    label: "Site Logo",
    guide: "This is the logo image URL for your site.",
    formType: FormType.IMAGE,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.CURRENCY]: {
    label: "Currency",
    guide: "This is the currency you will be using.",
    formType: FormType.TEXT,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.HERO_BANNER]: {
    label: "Hero Banner",
    guide: "This is the main hero banner image URL for your homepage.",
    formType: FormType.IMAGE,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.FEATURE_COURSES_LIMIT]: {
    label: "Feature Courses Limit",
    guide:
      "This specifies how many featured courses to display on the homepage.",
    formType: FormType.NUMBER,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.MAX_INSTRUCTORS_COUNT]: {
    label: "Max Instructors Count",
    guide: "This is the maximum number of instructors allowed on the platform.",
    formType: FormType.NUMBER,
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.CONTACT_US_INFO]: {
    label: "Contact Us Information",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      address: {
        label: "Contact Address",
        guide: "The physical address for contact.",
        formType: FormType.TEXT,
      },
      phone: {
        label: "Contact Phone",
        guide: "The phone number for contact.",
        formType: FormType.TEXT,
      },
      email: {
        label: "Contact Email",
        guide: "The email address for contact.",
        formType: FormType.TEXT,
      },
      mapLink: {
        label: "Google Maps Link",
        guide: "Embed link for the Google Maps location.",
        formType: FormType.TEXT,
      },
    },
  },
  [SITE_SETTINGS_KEYS.STUDENT_REVIEWS]: {
    label: "Student Reviews",
    type: NestedFieldType.ARRAY,
    visibility: "public",
    fields: {
      name: {
        label: "Student Name",
        guide: "The name of the student.",
        formType: FormType.TEXT,
      },
      comment: {
        label: "Student Comment",
        guide: "The comment from the student.",
        formType: FormType.TEXT,
      },
    },
  },
  [SITE_SETTINGS_KEYS.SEO_SETTINGS]: {
    label: "SEO Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      metaTitle: {
        label: "Meta Title",
        guide: "This is the title displayed in search engines.",
        formType: FormType.TEXT,
      },
      metaDescription: {
        label: "Meta Description",
        guide: "This is the description displayed in search engines.",
        formType: FormType.TEXT,
      },
      ogImage: {
        label: "Open Graph Image",
        guide: "Image URL for social media previews (1200x630 recommended).",
        formType: FormType.IMAGE,
      },
      keywords: {
        label: "Keywords",
        guide: "Comma-separated keywords for SEO.",
        formType: FormType.TEXT,
      },
    },
  },
};

export type SITE_SETTINGS_TYPES = {
  [SITE_SETTINGS_KEYS.SITE_NAME]: string;
  [SITE_SETTINGS_KEYS.SITE_URL]: string;
  [SITE_SETTINGS_KEYS.SITE_BANNER]: string;
  [SITE_SETTINGS_KEYS.SITE_LOGO]: string;
  [SITE_SETTINGS_KEYS.CURRENCY]: string;
  [SITE_SETTINGS_KEYS.HERO_BANNER]: string;
  [SITE_SETTINGS_KEYS.FEATURE_COURSES_LIMIT]: number;
  [SITE_SETTINGS_KEYS.MAX_INSTRUCTORS_COUNT]: number;
  [SITE_SETTINGS_KEYS.CONTACT_US_INFO]: {
    address: string;
    phone: string;
    email: string;
    mapLink: string;
  };
  [SITE_SETTINGS_KEYS.STUDENT_REVIEWS]: {
    name: string;
    comment: string;
  }[];
  [SITE_SETTINGS_KEYS.SEO_SETTINGS]: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
  };
};
