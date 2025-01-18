import { GeneralConfig } from ".";

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
} as const;

export const SITE_SETTINGS: GeneralConfig<typeof SITE_SETTINGS_KEYS> = {
  [SITE_SETTINGS_KEYS.SITE_NAME]: {
    label: "Site Name",
    guide: "This is the name of your site.",
    formType: "string",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.SITE_URL]: {
    label: "Site URL",
    guide: "This is the URL of your site.",
    formType: "string",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.SITE_BANNER]: {
    label: "Site Banner",
    guide: "This is the banner image URL for your site.",
    formType: "image",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.SITE_LOGO]: {
    label: "Site Logo",
    guide: "This is the logo image URL for your site.",
    formType: "image",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.CURRENCY]: {
    label: "Currency",
    guide: "This is the currency you will be using.",
    formType: "string",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.HERO_BANNER]: {
    label: "Hero Banner",
    guide: "This is the main hero banner image URL for your homepage.",
    formType: "image",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.FEATURE_COURSES_LIMIT]: {
    label: "Feature Courses Limit",
    guide:
      "This specifies how many featured courses to display on the homepage.",
    formType: "number",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.MAX_INSTRUCTORS_COUNT]: {
    label: "Max Instructors Count",
    guide: "This is the maximum number of instructors allowed on the platform.",
    formType: "number",
    visibility: "public",
  },
  [SITE_SETTINGS_KEYS.CONTACT_US_INFO]: {
    label: "Contact Us Information",
    type: "json",
    visibility: "public",
    fields: {
      address: {
        label: "Contact Address",
        guide: "The physical address for contact.",
        formType: "string",
      },
      phone: {
        label: "Contact Phone",
        guide: "The phone number for contact.",
        formType: "string",
      },
      email: {
        label: "Contact Email",
        guide: "The email address for contact.",
        formType: "string",
      },
    },
  },
  [SITE_SETTINGS_KEYS.STUDENT_REVIEWS]: {
    label: "Student Reviews",
    type: "array",
    visibility: "public",
    fields: {
      name: {
        label: "Student Name",
        guide: "The name of the student.",
        formType: "string",
      },
      comment: {
        label: "Student Comment",
        guide: "The comment from the student.",
        formType: "string",
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
  };
  [SITE_SETTINGS_KEYS.STUDENT_REVIEWS]: {
    name: string;
    comment: string;
  }[];
};