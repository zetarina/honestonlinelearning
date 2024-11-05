// services/TelegramService.ts
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

  // Send a message to Telegram
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
  public async sendPhoto(photo: Buffer, caption?: string, chatId?: string) {
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
      // Provide a filename explicitly to avoid deprecation warning
      const response = await this.bot.sendPhoto(
        targetChatId,
        { source: photo }, // Explicitly set the filename
        { caption }
      );
      console.log("Telegram photo response:", response);
      return response;
    } catch (error) {
      console.error("Error sending Telegram photo:", error);
      throw error;
    }
  }
}
