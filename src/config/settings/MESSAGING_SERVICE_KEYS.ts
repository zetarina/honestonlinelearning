import { GeneralConfig } from ".";

export const MESSAGING_SERVICE_KEYS = {
  TELEGRAM: "telegram",
  VIBER: "viber",
} as const;

export const MESSAGING_SERVICE_SETTINGS: GeneralConfig<
  typeof MESSAGING_SERVICE_KEYS
> = {
  [MESSAGING_SERVICE_KEYS.TELEGRAM]: {
    label: "Telegram Settings",
    type: "json",
    visibility: "public",
    fields: {
      botToken: {
        label: "Telegram Bot Token",
        guide: "Enter your Telegram bot token.",
        formType: "string",
      },
      chatId: {
        label: "Telegram Chat ID",
        guide: "Enter your Telegram chat ID.",
        formType: "string",
      },
    },
  },
  [MESSAGING_SERVICE_KEYS.VIBER]: {
    label: "Viber Settings",
    type: "json",
    visibility: "public",
    fields: {
      botToken: {
        label: "Viber Bot Token",
        guide: "Enter your Viber bot token.",
        formType: "string",
      },
    },
  },
};

export type MESSAGING_SERVICE_TYPES = {
  [MESSAGING_SERVICE_KEYS.TELEGRAM]: {
    botToken: string;
    chatId: string;
  };
  [MESSAGING_SERVICE_KEYS.VIBER]: {
    botToken: string;
  };
};
