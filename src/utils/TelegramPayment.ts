import { SETTINGS_KEYS } from "@/config/settingKeys";
import TelegramService from "@/services/TelegramService";

export async function TelegramPayment(
  userId: string,
  amount: number,
  currency: string,
  screenshot: Buffer,
  settingsMap: Record<string, string | undefined>
) {
  const botToken = settingsMap[SETTINGS_KEYS.TELEGRAM_BOT_TOKEN];
  const chatId = settingsMap[SETTINGS_KEYS.TELEGRAM_CHAT_ID];

  if (!botToken || !chatId) {
    console.error("Telegram configuration is incomplete.");
    return;
  }

  const telegramService = new TelegramService(botToken, chatId);
  const telegramMessage = `User with ID: ${userId} requested a top-up of ${amount} ${currency} (offline). Screenshot attached.`;

  try {
    return await telegramService.sendPhoto(screenshot, telegramMessage);
  } catch (error) {
    throw "Error sending screenshot to Telegram API";
  }
}
