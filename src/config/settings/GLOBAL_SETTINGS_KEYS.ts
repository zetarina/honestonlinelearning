import { FormType, GeneralConfig, NestedFieldType } from ".";

export const GLOBAL_SETTINGS_KEYS = {
  SITE_SETTINGS: "siteSettings",
  HOMEPAGE: "homepage",
  SEO_SETTINGS: "seoSettings",
} as const;

export const GLOBAL_SETTINGS: GeneralConfig<typeof GLOBAL_SETTINGS_KEYS> = {
  [GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]: {
    label: "Site Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      siteName: {
        label: "Site Name",
        guide: "The name of your site.",
        formType: FormType.TEXT,
      },
      siteUrl: {
        label: "Site URL",
        guide: "The URL of your site.",
        formType: FormType.TEXT,
      },
      siteBanner: {
        label: "Site Banner",
        guide: "The banner image for your site.",
        formType: FormType.IMAGE,
      },
      siteLogo: {
        label: "Site Logo",
        guide: "The logo image for your site.",
        formType: FormType.IMAGE,
      },
    },
  },
  [GLOBAL_SETTINGS_KEYS.HOMEPAGE]: {
    label: "Homepage Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      heroBanner: {
        label: "Hero Banner",
        guide: "The main hero banner image for your homepage.",
        formType: FormType.IMAGE,
      },
      featureCoursesLimit: {
        label: "Feature Courses Limit",
        guide: "Number of featured courses on the homepage.",
        formType: FormType.NUMBER,
      },
      instructorsSection: {
        label: "Instructors Section",
        type: NestedFieldType.JSON,
        fields: {
          maxInstructorsCount: {
            label: "Max Instructors Count",
            guide: "Maximum number of instructors displayed.",
            formType: FormType.NUMBER,
          },
          instructorRole: {
            label: "Instructor Role",
            guide: "Select the role assigned to instructors.",
            formType: FormType.ROLE_SELECTION,
          },
        },
      },
      contactUsInfo: {
        label: "Contact Us Information",
        type: NestedFieldType.JSON,
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
      studentReviews: {
        label: "Student Reviews",
        type: NestedFieldType.ARRAY,
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
    },
  },
  [GLOBAL_SETTINGS_KEYS.SEO_SETTINGS]: {
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

export type GLOBAL_SETTINGS_TYPES = {
  [GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]: {
    siteName: string;
    siteUrl: string;
    siteBanner: string;
    siteLogo: string;
    currency: string;
  };
  [GLOBAL_SETTINGS_KEYS.HOMEPAGE]: {
    heroBanner: string;
    featureCoursesLimit: number;
    instructorsSection: {
      maxInstructorsCount: number;
      instructorRole: string;
    };
    contactUsInfo: {
      address: string;
      phone: string;
      email: string;
      mapLink: string;
    };
    studentReviews: {
      name: string;
      comment: string;
    }[];
  };
  [GLOBAL_SETTINGS_KEYS.SEO_SETTINGS]: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
  };
};
