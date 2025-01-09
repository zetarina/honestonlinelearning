import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";
import { User } from "@/models/UserModel";
import TelegramService from "@/services/TelegramService";

// TelegramPayment function
export async function TelegramPayment(
  user: User, // Accept full user object
  amount: number,
  currency: string,
  screenshot: Buffer,
  settings: SettingsInterface // Use strongly-typed settings
): Promise<boolean> {
  const telegramSettings = settings[SETTINGS_KEYS.TELEGRAM];
  if (
    !telegramSettings ||
    !telegramSettings.botToken ||
    !telegramSettings.chatId
  ) {
    console.error("Telegram configuration is incomplete.");
    return false;
  }

  const botToken = telegramSettings.botToken;
  const chatId = telegramSettings.chatId;
  const baseUrl = settings.siteUrl; // Directly use `siteUrl` from settings

  if (!botToken || !chatId || !baseUrl) {
    console.error("Telegram configuration or base URL is incomplete.");
    return false;
  }

  // Construct the Add Points link with points and reason
  const points = amount; // Points can be equivalent to the top-up amount
  const reason = encodeURIComponent("Top up");
  const addPointsLink = `${baseUrl}/dashboard/add-points?userId=${user._id}&points=${points}&reason=${reason}`;

  const telegramService = new TelegramService(botToken, chatId);

  // Plain text message with link
  const telegramMessage = `
User requested a top-up:
- Name: ${user.name}
- Username: ${user.username}
- Email: ${user.email}
- User ID: ${user._id}
- Amount: ${amount} ${currency}
(Offline). Screenshot attached.

Add Points for this User: ${addPointsLink}
  `;

  try {
    await telegramService.sendPhoto(screenshot, telegramMessage);
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
  settings: SettingsInterface // Use strongly-typed settings
): Promise<boolean> {
  try {
    const telegramResponse = await TelegramPayment(
      user,
      amount,
      currency,
      screenshotBuffer,
      settings
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
