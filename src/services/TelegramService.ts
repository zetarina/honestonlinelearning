// services/TelegramService.ts
import TelegramBot from "node-telegram-bot-api";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

export default class TelegramService {
  private bot: TelegramBot | null = null;
  private defaultChatId: string | null = null;

  constructor() {
    this.init();
  }

  // Initialize bot with settings from the database
  private async init() {
    try {
      const botTokenSetting = await settingService.getSettingByKey(
        SETTINGS_KEYS.TELEGRAM_BOT_TOKEN
      );
      const chatIdSetting = await settingService.getSettingByKey(
        SETTINGS_KEYS.TELEGRAM_CHAT_ID
      );

      const botToken = botTokenSetting?.value;
      this.defaultChatId = chatIdSetting?.value || null;

      if (botToken) {
        // Initialize Telegram Bot with the fetched token
        this.bot = new TelegramBot(botToken, { polling: false });
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
    if (!this.bot) {
      await this.init();
    }
  }

  // Send a message to Telegram
  public async sendMessage(text: string, chatId?: string) {
    await this.ensureInitialized();
    const targetChatId = chatId || this.defaultChatId;
    
    if (!this.bot || !targetChatId) {
      console.error("Telegram configuration is incomplete or chat ID is missing.");
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
    await this.ensureInitialized();
    const targetChatId = chatId || this.defaultChatId;
    
    if (!this.bot || !targetChatId) {
      console.error("Telegram configuration is incomplete or chat ID is missing.");
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
