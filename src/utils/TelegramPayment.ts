import { SETTINGS_KEYS } from "@/config/settingKeys";
import { User } from "@/models/UserModel";
import TelegramService from "@/services/TelegramService";

export async function TelegramPayment(
  user: User, // Accept full user object
  amount: number,
  currency: string,
  screenshot: Buffer,
  settingsMap: Record<string, string | undefined>
): Promise<boolean> {
  const botToken = settingsMap[SETTINGS_KEYS.TELEGRAM_BOT_TOKEN];
  const chatId = settingsMap[SETTINGS_KEYS.TELEGRAM_CHAT_ID];
  const baseUrl = settingsMap[SETTINGS_KEYS.SITE_URL]; // Base URL of your app

  if (!botToken || !chatId || !baseUrl) {
    console.error("Telegram configuration is incomplete.");
    return false;
  }

  const telegramService = new TelegramService(botToken, chatId);

  // Constructing the Add Points link
  const addPointsLink = `${baseUrl}/dashboard/add-points?userId=${user._id}`;

  // Telegram message using MarkdownV2 for formatting
  const telegramMessage = `
User requested a top-up:
*Name:* ${user.name}
*Username:* ${user.username}
*Email:* ${user.email}
*User ID:* ${user._id}
*Amount:* ${amount} ${currency}
(Offline). Screenshot attached.

[Add Points for this User](${addPointsLink})
  `.replace(/[_*[\]()]/g, "\\$&"); // Escape special MarkdownV2 characters

  try {
    // Sending the photo with MarkdownV2 formatted message
    await telegramService.sendPhoto(
      screenshot, // Photo
      telegramMessage, // Caption
      undefined // Use default chat ID
    );
    console.log(
      `Telegram notification sent successfully for user ${user._id}.`
    );
    return true;
  } catch (error) {
    console.error(
      `Failed to send Telegram message for user ${user._id}:`,
      error
    );
    return false;
  }
}

export default async function notifyViaTelegram(
  user: User, // Accept full user object
  amount: number,
  currency: string,
  screenshotBuffer: Buffer,
  settingsMap: Record<string, string | undefined>
): Promise<boolean> {
  try {
    const telegramResponse = await TelegramPayment(
      user,
      amount,
      currency,
      screenshotBuffer,
      settingsMap
    );

    if (telegramResponse) {
      console.log("Telegram notification sent successfully:", telegramResponse);
      return true;
    } else {
      console.warn("Telegram notification returned an unexpected response.");
      return false;
    }
  } catch (error) {
    console.error("Telegram notification failed:", error);
    return false;
  }
}
