// services/TelegramService.ts
import TelegramBot from "node-telegram-bot-api";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

export default class TelegramService {
  private bot: TelegramBot | undefined;
  private chatId: string | undefined;

  constructor() {
    this.init();
  }

  // Initialize bot with settings from database
  private async init() {
    const botTokenSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.TELEGRAM_BOT_TOKEN
    );
    const chatIdSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.TELEGRAM_CHAT_ID
    );

    const botToken = botTokenSetting?.value;
    this.chatId = chatIdSetting?.value;

    if (botToken) {
      // Initialize Telegram Bot
      this.bot = new TelegramBot(botToken, { polling: false });
    } else {
      console.error("Telegram bot token is missing.");
    }
  }

  // Send a message to Telegram
  public async sendMessage(text: string, chatId?: string) {
    if (!this.bot || !this.chatId) {
      console.error("Telegram configuration is incomplete.");
      throw new Error("Telegram configuration is incomplete.");
    }

    try {
      const targetChatId = chatId || this.chatId;
      const response = await this.bot.sendMessage(targetChatId, text);
      return response;
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      throw error;
    }
  }
}
