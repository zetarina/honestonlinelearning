// app/api/telegram-webhook/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

async function handleTelegramWebhook(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  const { message } = body;

  if (!message || !message.text) {
    return NextResponse.json({ status: "No message received" });
  }
  const botTokenSetting = await settingService.getSettingByKey(
    SETTINGS_KEYS.TELEGRAM_BOT_TOKEN
  );
  const botToken = botTokenSetting?.value;
  if (!botToken) {
    return NextResponse.json(
      { error: "Telegram bot token not configured" },
      { status: 500 }
    );
  }
  const chatId = message.chat.id;
  const text = message.text;
  if (text === "/groupid") {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: chatId,
        text: `The group ID is: ${chatId}`,
      });
      return NextResponse.json({ status: "Group ID sent" });
    } catch (error) {
      console.error("Error sending group ID message:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ status: "No action taken" });
  }
}

export const POST = async (req: Request) => handleTelegramWebhook(req);
