import { GeneralConfig } from ".";

export const STORAGE_SETTINGS_KEYS = {
  IMGBB: "imgbb",
  CLOUDINARY: "cloudinary",
  AWS: "aws",
} as const;

export const STORAGE_SETTINGS: GeneralConfig<typeof STORAGE_SETTINGS_KEYS> = {
  [STORAGE_SETTINGS_KEYS.IMGBB]: {
    label: "ImgBB Settings",
    type: "json",
    visibility: "public",
    fields: {
      apiKey: {
        label: "ImgBB API Key",
        guide: "This is the API key for ImgBB image service.",
        formType: "string",
      },
    },
  },
  [STORAGE_SETTINGS_KEYS.CLOUDINARY]: {
    label: "Cloudinary Settings",
    type: "json",
    visibility: "public",
    fields: {
      cloudName: {
        label: "Cloudinary Cloud Name",
        guide: "This is the Cloudinary cloud name for image uploads.",
        formType: "string",
      },
      uploadPreset: {
        label: "Cloudinary Upload Preset",
        guide: "This is the Cloudinary upload preset for image uploads.",
        formType: "string",
      },
    },
  },
  [STORAGE_SETTINGS_KEYS.AWS]: {
    label: "AWS Settings",
    type: "json",
    visibility: "private",
    fields: {
      bucket: {
        label: "AWS Bucket",
        guide: "This is the AWS S3 bucket name.",
        formType: "string",
      },
      region: {
        label: "AWS Region",
        guide: "This is the AWS S3 bucket region.",
        formType: "string",
      },
      accessKeyId: {
        label: "AWS Access Key ID",
        guide: "This is the AWS access key ID.",
        formType: "string",
      },
      secretAccessKey: {
        label: "AWS Secret Access Key",
        guide: "This is the AWS secret access key.",
        formType: "string",
      },
    },
  },
};

export type STORAGE_SETTINGS_TYPES = {
  [STORAGE_SETTINGS_KEYS.IMGBB]: {
    apiKey: string;
  };
  [STORAGE_SETTINGS_KEYS.CLOUDINARY]: {
    cloudName: string;
    uploadPreset: string;
  };
  [STORAGE_SETTINGS_KEYS.AWS]: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
};
