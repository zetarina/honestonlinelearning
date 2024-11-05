// app/api/telegram-webhook/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

async function handleTelegramWebhook(req: Request) {
  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);  // Log unexpected method
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);  // Log entire incoming body for inspection

    const { message } = body;
    if (!message || !message.text) {
      console.log("No valid message or text found in body");  // Log if message or text is missing
      return NextResponse.json({ status: "No message received" });
    }

    const botTokenSetting = await settingService.getSettingByKey(SETTINGS_KEYS.TELEGRAM_BOT_TOKEN);
    const botToken = botTokenSetting?.value;
    if (!botToken) {
      console.error("Telegram bot token not configured");  // Log missing token configuration
      return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 });
    }

    const chatId = message.chat.id;
    const text = message.text;

    // Log incoming message details for further debugging
    console.log("Received message from chat ID:", chatId);
    console.log("Message text:", text);

    // Handle the /groupid command
    if (text === "/groupid" || text === "/chatid") {
      try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await axios.post(url, {
          chat_id: chatId,
          text: `The group ID is: ${chatId}`,
        });
        console.log("Telegram response:", response.data);  // Log Telegram API response
        return NextResponse.json({ status: "Group ID sent" });
      } catch (error) {
        console.error("Error sending group ID message:", error);  // Log error with API call
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
      }
    } else {
      console.log("No recognized command, no action taken");  // Log if the message text is not "/groupid"
      return NextResponse.json({ status: "No action taken" });
    }
  } catch (error) {
    console.error("Error processing webhook request:", error);  // Log general processing errors
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}

export const POST = async (req: Request) => handleTelegramWebhook(req);
