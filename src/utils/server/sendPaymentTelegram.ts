import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";
import { User } from "@/models/UserModel";
import TelegramService from "@/services/TelegramService";

export async function sendPaymentTelegram(
  user: User,
  amount: number,
  currency: string,
  screenshot: Buffer,
  settings: SettingsInterface
): Promise<boolean> {
  try {
    const telegramSettings = settings[SETTINGS_KEYS.TELEGRAM];
    const baseUrl = settings[SETTINGS_KEYS.SITE_SETTINGS]?.siteUrl;

    if (!telegramSettings?.botToken || !telegramSettings?.chatId || !baseUrl) {
      console.error("Incomplete Telegram or site configuration.");
      return false;
    }

    const addPointsLink = `${baseUrl}/dashboard/add-points?userId=${
      user._id
    }&points=${amount}&reason=${encodeURIComponent("Top up")}`;
    const telegramService = new TelegramService(
      telegramSettings.botToken,
      telegramSettings.chatId
    );

    const telegramMessage = `
User requested a top-up:
- Name: ${user.name}
- Username: ${user.username}
- Email: ${user.email}
- User ID: ${user._id}
- Amount: ${amount} ${currency} (Offline). Screenshot attached.

Add Points for this User: ${addPointsLink}`;

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

