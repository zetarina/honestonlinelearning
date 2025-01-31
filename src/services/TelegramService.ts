import TelegramBot from "node-telegram-bot-api";

export default class TelegramService {
  private bot: TelegramBot | null = null;
  private defaultChatId: string | null = null;

  constructor(botToken: string, defaultChatId: string | null) {
    if (botToken) {
      this.bot = new TelegramBot(botToken, { polling: false });
      console.log("Telegram bot initialized successfully.");
    } else {
      console.error("Telegram bot token is missing in the configuration.");
    }
    this.defaultChatId = defaultChatId;
  }

  public async sendMessage(text: string, chatId?: string) {
    const targetChatId = chatId || this.defaultChatId;

    if (!this.bot) {
      console.error("Telegram bot is not initialized properly.");
      return;
    }

    if (!targetChatId) {
      console.error("No chat ID provided for sending the message.");
      return;
    }

    try {
      const response = await this.bot.sendMessage(targetChatId, text);
      console.log("Telegram response:", response);
      return response;
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      throw error;
    }
  }
  public async sendPhoto(
    photo: Buffer | string,
    caption?: string,
    chatId?: string
  ) {
    const targetChatId = chatId || this.defaultChatId;

    if (!this.bot) {
      console.error("Telegram bot is not initialized properly.");
      return;
    }

    if (!targetChatId) {
      console.error("No chat ID provided for sending the photo.");
      return;
    }

    try {
      const response = await this.bot.sendPhoto(targetChatId, photo, {
        caption,
      });
      console.log("Telegram photo response:", response);
      return response;
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        code: error.code,
        statusCode: error.response?.statusCode,
        statusMessage: error.response?.statusMessage,
      };
      console.error("Failed to send photo to Telegram:", errorDetails);
      throw new Error("Failed to send photo to Telegram");
    }
  }
}
