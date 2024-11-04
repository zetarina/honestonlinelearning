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
  STRIPE_PUBLIC_KEY: "stripe_PublicKey",
  STRIPE_SECRET_KEY: "stripe_SecretKey",
  STRIPE_WEBHOOK_SECRET: "stripe_WebhookSecret",
  FACEBOOK_PAGE_ID: "facebook_page_id",
  FACEBOOK_URL: "facebookUrl",
  TWITTER_URL: "twitterUrl",
  INSTAGRAM_URL: "instagramUrl",
  LINKEDIN_URL: "linkedinUrl",
  GITHUB_URL: "githubUrl",
};

export interface GlobalSettings {
  siteName?: string;
  siteUrl?: string;
  facebookPageId?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
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
  [SETTINGS_KEYS.STRIPE_PUBLIC_KEY]: "This is the Stripe public API key.",
  [SETTINGS_KEYS.STRIPE_SECRET_KEY]: "This is the Stripe secret API key.",
  [SETTINGS_KEYS.STRIPE_WEBHOOK_SECRET]:
    "This is the Stripe webhook secret for verifying webhook events.",
  [SETTINGS_KEYS.FACEBOOK_PAGE_ID]:
    "This is the Facebook page ID for page messaging.",
  [SETTINGS_KEYS.FACEBOOK_URL]: "This is the URL for your Facebook page.",
  [SETTINGS_KEYS.TWITTER_URL]: "This is the URL for your Twitter profile.",
  [SETTINGS_KEYS.INSTAGRAM_URL]: "This is the URL for your Instagram profile.",
  [SETTINGS_KEYS.LINKEDIN_URL]: "This is the URL for your LinkedIn profile.",
  [SETTINGS_KEYS.GITHUB_URL]: "This is the URL for your GitHub profile.",
};
