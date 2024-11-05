// services/TelegramService.ts
import TelegramBot from "node-telegram-bot-api";

export default class TelegramService {
  private bot: TelegramBot;
  private defaultChatId: string | null;

  constructor() {
    // Load bot token and default chat ID from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.defaultChatId = process.env.TELEGRAM_CHAT_ID || null;

    if (!botToken) {
      throw new Error("Telegram bot token is missing. Please set up the configuration.");
    }

    // Initialize Telegram Bot
    this.bot = new TelegramBot(botToken, { polling: false });
    console.log("Telegram bot initialized successfully.");
  }

  // Send a message to Telegram
  public async sendMessage(text: string, chatId?: string) {
    const targetChatId = chatId || this.defaultChatId;
    if (!targetChatId) {
      console.error("No chat ID provided for sending the message.");
      return;
    }

    try {
      const response = await this.bot.sendMessage(targetChatId, text);
      return response;
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      throw error;
    }
  }

  // Send a photo to Telegram
  public async sendPhoto(photo: Buffer, caption?: string, chatId?: string) {
    const targetChatId = chatId || this.defaultChatId;
    if (!targetChatId) {
      console.error("No chat ID provided for sending the photo.");
      return;
    }

    try {
      const response = await this.bot.sendPhoto(targetChatId, photo, { caption });
      return response;
    } catch (error) {
      console.error("Error sending Telegram photo:", error);
      throw error;
    }
  }
}
