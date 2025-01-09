import { GeneralConfig } from ".";

export const PAYMENT_SETTINGS_KEYS = {
  STRIPE: "stripe",
  PAYPAL: "paypal",
  SQUARE: "square",
} as const;

export const PAYMENT_SETTINGS: GeneralConfig<typeof PAYMENT_SETTINGS_KEYS> = {
  [PAYMENT_SETTINGS_KEYS.STRIPE]: {
    label: "Stripe Payment Settings",
    type: "json",
    visibility: "private",

    fields: {
      publicKey: {
        label: "Stripe Public Key",
        guide: "Enter your Stripe public API key.",
        formType: "string",
      },
      secretKey: {
        label: "Stripe Secret Key",
        guide: "Enter your Stripe secret API key.",
        formType: "string",
      },
      webhookSecret: {
        label: "Stripe Webhook Secret",
        guide: "Enter your Stripe webhook secret for event verification.",
        formType: "string",
      },
    },
  },
  [PAYMENT_SETTINGS_KEYS.PAYPAL]: {
    label: "PayPal Payment Settings",
    type: "json",
    visibility: "private",
    fields: {
      clientId: {
        label: "PayPal Client ID",
        guide: "Enter your PayPal client ID.",
        formType: "string",
      },
      clientSecret: {
        label: "PayPal Client Secret",
        guide: "Enter your PayPal client secret.",
        formType: "string",
      },
    },
  },
  [PAYMENT_SETTINGS_KEYS.SQUARE]: {
    label: "Square Payment Settings",
    type: "json",
    visibility: "private",
    fields: {
      accessToken: {
        label: "Square Access Token",
        guide: "Enter your Square access token.",
        formType: "string",
      },
    },
  },
};

export type PAYMENT_SETTINGS_TYPES = {
  [PAYMENT_SETTINGS_KEYS.STRIPE]: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  [PAYMENT_SETTINGS_KEYS.PAYPAL]: {
    clientId: string;
    clientSecret: string;
  };
  [PAYMENT_SETTINGS_KEYS.SQUARE]: {
    accessToken: string;
  };
};
