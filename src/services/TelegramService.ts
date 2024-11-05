// services/TelegramService.ts
import TelegramBot from "node-telegram-bot-api";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

export default class TelegramService {
  private bot: TelegramBot | null = null;
  private defaultChatId: string | null = null;
  private isInitialized = false;

  constructor() {
    this.init().catch((error) =>
      console.error("Failed to initialize TelegramService:", error)
    );
  }

  // Initialize bot with settings from the database
  private async init() {
    try {
      const settings = await settingService.getSettingsByKeys(
        [SETTINGS_KEYS.TELEGRAM_BOT_TOKEN, SETTINGS_KEYS.TELEGRAM_CHAT_ID],
        "production"
      );

      const botToken = settings[SETTINGS_KEYS.TELEGRAM_BOT_TOKEN];
      this.defaultChatId = settings[SETTINGS_KEYS.TELEGRAM_CHAT_ID];

      if (botToken) {
        // Initialize Telegram Bot with the fetched token
        this.bot = new TelegramBot(botToken, { polling: false });
        this.isInitialized = true;
        console.log("Telegram bot initialized successfully.");
      } else {
        console.error("Telegram bot token is missing in the configuration.");
      }
    } catch (error) {
      console.error("Error initializing TelegramService:", error);
    }
  }

  // Ensure the bot is initialized before sending a message
  private async ensureInitialized() {
    if (!this.isInitialized) {
      console.log("Waiting for bot initialization...");
      await this.init();
    }
  }

  // Send a message to Telegram
  public async sendMessage(text: string, chatId?: string) {
    await this.ensureInitialized();
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

  // Send a photo to Telegram
  public async sendPhoto(photo: Buffer, caption?: string, chatId?: string) {
    await this.ensureInitialized();
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
    } catch (error) {
      console.error("Error sending Telegram photo:", error);
      throw error;
    }
  }
}
