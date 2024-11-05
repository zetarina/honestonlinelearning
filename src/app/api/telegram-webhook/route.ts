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
    const text = message.text.trim().toLowerCase();

    console.log("Received message from chat ID:", chatId);
    console.log("Message text:", text);

    // Define available commands
    const availableCommands = {
      "/groupid": `The group ID is: ${chatId}`,
      "/chatid": `The chat ID is: ${chatId}`,
      "/help": "Available commands:\n/groupid or /chatid - Get the chat ID\n/help - Show available commands"
    };

    // Check if the command exists
    if (availableCommands[text]) {
      try {
        // Send the appropriate response based on command
        const response = await telegramService.sendMessage(
          availableCommands[text],
          chatId
        );
        console.log("Telegram response:", response);
        return NextResponse.json({ status: "Command processed successfully" });
      } catch (error) {
        console.error("Error sending message:", error);
        // Inform user that the bot encountered an issue
        await telegramService.sendMessage("Sorry, I encountered an error while processing your request.", chatId);
        return NextResponse.json({ status: "Temporary issue occurred" });
      }
    } else {
      // If command is unrecognized, send help message
      const unrecognizedCommandMessage = `Unrecognized command: ${text}. Type /help to see available commands.`;
      await telegramService.sendMessage(unrecognizedCommandMessage, chatId);
      return NextResponse.json({ status: "Unrecognized command sent help message" });
    }
  } catch (error) {
    console.error("Error processing webhook request:", error);
    return NextResponse.json(
      { status: "An error occurred while processing the request. Please try again later." },
      { status: 200 }
    );
  }
}

export const POST = async (req: Request) => handleTelegramWebhook(req);
