// app/api/telegram-webhook/route.ts
import { NextResponse } from "next/server";
import TelegramService from "@/services/TelegramService";

const telegramService = new TelegramService();

async function handleTelegramWebhook(req: Request) {
  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { message } = body;
    if (!message || !message.text) {
      console.log("No valid message or text found in body");
      return NextResponse.json({ status: "No message received" });
    }

    const chatId = message.chat.id;
    const text = message.text;

    console.log("Received message from chat ID:", chatId);
    console.log("Message text:", text);

    // Handle the /groupid command
    if (text === "/groupid" || text === "/chatid") {
      try {
        const response = await telegramService.sendMessage(
          `The group ID is: ${chatId}`,
          chatId
        );
        console.log("Telegram response:", response);
        return NextResponse.json({ status: "Group ID sent" });
      } catch (error) {
        console.error("Error sending group ID message:", error);
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 500 }
        );
      }
    } else {
      console.log("No recognized command, no action taken");
      return NextResponse.json({ status: "No action taken" });
    }
  } catch (error) {
    console.error("Error processing webhook request:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export const POST = async (req: Request) => handleTelegramWebhook(req);
