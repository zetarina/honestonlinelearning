import { FormType, GeneralConfig, NestedFieldType } from ".";

export const MAIL_SERVICE_KEYS = {
  GMAIL: "gmail",
  OUTLOOK: "outlook",
  SENDGRID: "sendgrid",
  ADMIN_EMAIL: "adminEmail",
} as const;

export const MAIL_SERVICE_SETTINGS: GeneralConfig<typeof MAIL_SERVICE_KEYS> = {
  [MAIL_SERVICE_KEYS.GMAIL]: {
    label: "Gmail Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    fields: {
      user: {
        label: "Gmail User",
        guide: "Enter your Gmail username.",
        formType: FormType.TEXT,
      },
      password: {
        label: "Gmail Password",
        guide: "Enter your Gmail password.",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SERVICE_KEYS.OUTLOOK]: {
    label: "Outlook Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    fields: {
      user: {
        label: "Outlook User",
        guide: "Enter your Outlook username.",
        formType: FormType.TEXT,
      },
      password: {
        label: "Outlook Password",
        guide: "Enter your Outlook password.",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SERVICE_KEYS.SENDGRID]: {
    label: "SendGrid Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    fields: {
      apiKey: {
        label: "SendGrid API Key",
        guide: "Enter your SendGrid API key.",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SERVICE_KEYS.ADMIN_EMAIL]: {
    label: "Admin Email",
    guide: "Enter the admin email for notifications.",
    formType: FormType.EMAIL,
    visibility: "private",
  },
};

export type Mail_SETTINGS_TYPES = {
  [MAIL_SERVICE_KEYS.GMAIL]: {
    user: string;
    password: string;
  };
  [MAIL_SERVICE_KEYS.OUTLOOK]: {
    user: string;
    password: string;
  };
  [MAIL_SERVICE_KEYS.SENDGRID]: {
    apiKey: string;
  };
  [MAIL_SERVICE_KEYS.ADMIN_EMAIL]: string;
};
