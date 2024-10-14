// settingsConfig.ts
export const SETTINGS_KEYS = {
  SITE_NAME: "siteName",
  SITE_URL: "siteUrl",
  GMAIL_USER: "gmail_user",
  GMAIL_PASSWORD: "gmail_password",
  ADMIN_EMAIL: "admin_email",
  IMGBB_API_KEY: "imgbb_ApiKey",
  CLOUDINARY_CLOUD_NAME: "cloudinary_cloudName",
  CLOUDINARY_UPLOAD_PRESET: "cloudinary_uploadPreset",
  AWS_BUCKET: "aws_bucket",
  AWS_REGION: "aws_region",
  AWS_ACCESS_KEY_ID: "aws_accessKeyId",
  AWS_SECRET_ACCESS_KEY: "aws_secretAccessKey",
};
export interface GlobalSettings {
  siteName?: string;
  siteUrl?: string;
}
export const keyGuides = {
  [SETTINGS_KEYS.SITE_NAME]: "This is the name of your site.",
  [SETTINGS_KEYS.SITE_URL]: "This is the URL of your site.",
  [SETTINGS_KEYS.GMAIL_USER]: "This is the Gmail user for sending emails.",
  [SETTINGS_KEYS.GMAIL_PASSWORD]:
    "This is the Gmail password for the email service.",
  [SETTINGS_KEYS.ADMIN_EMAIL]:
    "This is the admin email to which notifications are sent.",
  [SETTINGS_KEYS.IMGBB_API_KEY]: "This is the API key for ImgBB image service.",
  [SETTINGS_KEYS.CLOUDINARY_CLOUD_NAME]:
    "This is the Cloudinary cloud name for image uploads.",
  [SETTINGS_KEYS.CLOUDINARY_UPLOAD_PRESET]:
    "This is the Cloudinary upload preset for image uploads.",
  [SETTINGS_KEYS.AWS_BUCKET]: "This is the AWS S3 bucket name.",
  [SETTINGS_KEYS.AWS_REGION]: "This is the AWS S3 bucket region.",
  [SETTINGS_KEYS.AWS_ACCESS_KEY_ID]: "This is the AWS access key ID.",
  [SETTINGS_KEYS.AWS_SECRET_ACCESS_KEY]: "This is the AWS secret access key.",
};