// Define settings keys
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
  CURRENCY: "currency",
  TELEGRAM_BOT_TOKEN: "telegram_bot_token",
  TELEGRAM_CHAT_ID: "telegram_chat_id",
} as const;

// Define key guides using SETTINGS_KEYS
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
  [SETTINGS_KEYS.CURRENCY]:
    "This is the currency code used on your platform (e.g., USD, EUR, MMK).",
  [SETTINGS_KEYS.TELEGRAM_BOT_TOKEN]:
    "This is the token for your Telegram bot integration.",
  [SETTINGS_KEYS.TELEGRAM_CHAT_ID]:
    "This is the chat ID for Telegram group messaging.",
};

// Define SettingsVisibilityMap using SETTINGS_KEYS
export const SettingsVisibilityMap = {
  [SETTINGS_KEYS.SITE_NAME]: true,
  [SETTINGS_KEYS.SITE_URL]: true,
  [SETTINGS_KEYS.GMAIL_USER]: false,
  [SETTINGS_KEYS.GMAIL_PASSWORD]: false,
  [SETTINGS_KEYS.ADMIN_EMAIL]: false,
  [SETTINGS_KEYS.IMGBB_API_KEY]: false,
  [SETTINGS_KEYS.CLOUDINARY_CLOUD_NAME]: false,
  [SETTINGS_KEYS.CLOUDINARY_UPLOAD_PRESET]: false,
  [SETTINGS_KEYS.AWS_BUCKET]: false,
  [SETTINGS_KEYS.AWS_REGION]: false,
  [SETTINGS_KEYS.AWS_ACCESS_KEY_ID]: false,
  [SETTINGS_KEYS.AWS_SECRET_ACCESS_KEY]: false,
  [SETTINGS_KEYS.STRIPE_PUBLIC_KEY]: true,
  [SETTINGS_KEYS.STRIPE_SECRET_KEY]: false,
  [SETTINGS_KEYS.STRIPE_WEBHOOK_SECRET]: false,
  [SETTINGS_KEYS.FACEBOOK_PAGE_ID]: true,
  [SETTINGS_KEYS.FACEBOOK_URL]: true,
  [SETTINGS_KEYS.TWITTER_URL]: true,
  [SETTINGS_KEYS.INSTAGRAM_URL]: true,
  [SETTINGS_KEYS.LINKEDIN_URL]: true,
  [SETTINGS_KEYS.GITHUB_URL]: true,
  [SETTINGS_KEYS.CURRENCY]: true,
  [SETTINGS_KEYS.TELEGRAM_BOT_TOKEN]: false,
  [SETTINGS_KEYS.TELEGRAM_CHAT_ID]: false,
};

type PublicKeys = {
  [K in keyof typeof SETTINGS_KEYS]: (typeof SettingsVisibilityMap)[(typeof SETTINGS_KEYS)[K]] extends true
    ? K
    : never;
}[keyof typeof SETTINGS_KEYS];

type PrivateKeys = {
  [K in keyof typeof SETTINGS_KEYS]: (typeof SettingsVisibilityMap)[(typeof SETTINGS_KEYS)[K]] extends false
    ? K
    : never;
}[keyof typeof SETTINGS_KEYS];

// Define PublicSettings and PrivateSettings types
export type PublicSettings = Record<(typeof SETTINGS_KEYS)[PublicKeys], string>;
export type PrivateSettings = Record<
  (typeof SETTINGS_KEYS)[PrivateKeys],
  string
>;

// AllSettings combines PublicSettings and PrivateSettings
export type AllSettings = PublicSettings & PrivateSettings;
