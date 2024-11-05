import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import TelegramService from "@/services/TelegramService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

const BOT_NAME_SUFFIX = "@honest_online_learning_bot";

export const GET = async () => {
  console.log("Received GET request - webhook is active.");
  return NextResponse.json({
    status: "Webhook is active and ready to receive updates.",
  });
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { message } = body;
    if (!message || !message.text) {
      console.log("No valid message or text found in body");
      return NextResponse.json({ status: "No message received" });
    }

    const chatId = message.chat.id;
    const text = message.text.trim().toLowerCase();

    console.log("Received message from chat ID:", chatId);
    console.log("Message text:", text);

    if (!text.startsWith("/")) {
      console.log("Message does not start with '/' - ignoring.");
      return NextResponse.json({ status: "Non-command message ignored" });
    }

    const settings = await settingService.getSettingsByKeys(
      [SETTINGS_KEYS.TELEGRAM_BOT_TOKEN, SETTINGS_KEYS.TELEGRAM_CHAT_ID],
      "production"
    );

    const botToken = settings[SETTINGS_KEYS.TELEGRAM_BOT_TOKEN];
    const defaultChatId = settings[SETTINGS_KEYS.TELEGRAM_CHAT_ID];

    const telegramService = new TelegramService(botToken, defaultChatId);

    const availableCommands = {
      "/groupid": `The group ID is: ${chatId}`,
      [`/groupid${BOT_NAME_SUFFIX}`]: `The group ID is: ${chatId}`,
      "/chatid": `The chat ID is: ${chatId}`,
      [`/chatid${BOT_NAME_SUFFIX}`]: `The chat ID is: ${chatId}`,
      "/help": `Available commands:\n/groupid or /chatid - Get the chat ID\n/help - Show available commands`,
      [`/help${BOT_NAME_SUFFIX}`]: `Available commands:\n/groupid or /chatid - Get the chat ID\n/help - Show available commands`,
    };

    if (availableCommands[text]) {
      try {
        const response = await telegramService.sendMessage(
          availableCommands[text],
          chatId
        );
        console.log("Telegram response:", response);
        return NextResponse.json({ status: "Command processed successfully" });
      } catch (error) {
        console.error("Error sending message:", error);
        await telegramService.sendMessage(
          "Sorry, I encountered an error while processing your request.",
          chatId
        );
        return NextResponse.json({ status: "Temporary issue occurred" });
      }
    } else {
      const unrecognizedCommandMessage = `Unrecognized command: ${text}. Type /help to see available commands.`;
      await telegramService.sendMessage(unrecognizedCommandMessage, chatId);
      return NextResponse.json({
        status: "Unrecognized command sent help message",
      });
    }
  } catch (error) {
    console.error("Error processing webhook request:", error);
    return NextResponse.json(
      {
        status:
          "An error occurred while processing the request. Please try again later.",
      },
      { status: 200 }
    );
  }
};

export const OPTIONS = async () => {
  return NextResponse.json(
    { status: "OK" },
    { status: 200, headers: { Allow: "GET, POST, OPTIONS" } }
  );
};
