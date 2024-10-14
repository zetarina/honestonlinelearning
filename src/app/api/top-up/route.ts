import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys"; // Importing the settings keys

const settingService = new SettingService();

async function handleTopUpRequest(req: Request) {
  try {
    const { amount, screenshot, userId } = await req.json();

    if (!amount || !screenshot || !userId) {
      return NextResponse.json(
        { error: "Amount, screenshot, and userId are required" },
        { status: 400 }
      );
    }

    // Fetch Gmail credentials and admin email from settings using SETTINGS_KEYS
    const gmailUserSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.GMAIL_USER
    );
    const gmailPasswordSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.GMAIL_PASSWORD
    );
    const adminEmailSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.ADMIN_EMAIL
    );

    // Use settings from the database
    const GMAIL_USER = gmailUserSetting?.value;
    const GMAIL_PASSWORD = gmailPasswordSetting?.value;
    const ADMIN_EMAIL = adminEmailSetting?.value;

    // Check if all required settings are configured
    if (!GMAIL_USER || !GMAIL_PASSWORD || !ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Gmail server is not set up yet. Please contact the admin." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: GMAIL_USER,
      to: ADMIN_EMAIL,
      subject: "New Top-up Request",
      text: `User with ID: ${userId} requested a top-up of ${amount} MMK.`,
      attachments: [
        {
          filename: "screenshot.png",
          content: screenshot.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Top-up request submitted!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing top-up request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = async (req: Request) => {
  return handleTopUpRequest(req);
};
