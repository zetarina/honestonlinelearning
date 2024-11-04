import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import Stripe from "stripe";
import PaymentService from "@/services/PaymentService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { PaymentMethod, PaymentStatus } from "@/models/PaymentModel";

const settingService = new SettingService();
const paymentService = new PaymentService();

async function handleTopUpRequest(req: Request, userId: string | null) {
  try {
    const { amount, screenshot, paymentMethod } = await req.json();

    console.log("Top-up request received:", { amount, screenshot, paymentMethod, userId });

    if (!amount || !userId || !paymentMethod) {
      console.error("Missing required fields:", { amount, userId, paymentMethod });
      return NextResponse.json(
        { error: "Amount, userId, and paymentMethod are required" },
        { status: 400 }
      );
    }

    if (paymentMethod === "stripe") {
      // Stripe processing code remains as-is
      // ...
    } else if (paymentMethod === "offline") {
      if (!screenshot) {
        console.error("Screenshot is required for offline payments.");
        return NextResponse.json(
          { error: "Please upload a screenshot for offline payment." },
          { status: 400 }
        );
      }

      // Fetch email configuration settings
      const gmailUserSetting = await settingService.getSettingByKey(SETTINGS_KEYS.GMAIL_USER);
      const gmailPasswordSetting = await settingService.getSettingByKey(SETTINGS_KEYS.GMAIL_PASSWORD);
      const adminEmailSetting = await settingService.getSettingByKey(SETTINGS_KEYS.ADMIN_EMAIL);

      const GMAIL_USER = gmailUserSetting?.value;
      const GMAIL_PASSWORD = gmailPasswordSetting?.value;
      const ADMIN_EMAIL = adminEmailSetting?.value;

      // Check if email settings are missing
      if (!GMAIL_USER || !GMAIL_PASSWORD || !ADMIN_EMAIL) {
        console.warn("Incomplete email configuration:", { GMAIL_USER, GMAIL_PASSWORD, ADMIN_EMAIL });
        return NextResponse.json(
          {
            error: "Server email configuration is incomplete. Please contact the admin to set up email functionality for offline payments.",
          },
          { status: 400 }
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
        subject: "New Offline Top-up Request",
        text: `User with ID: ${userId} requested a top-up of ${amount} MMK.`,
        attachments: [
          {
            filename: "screenshot.png",
            content: screenshot.split("base64,")[1],
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      await paymentService.createPayment({
        user_id: userId,
        amount,
        method: PaymentMethod.OFFLINE,
        status: PaymentStatus.PENDING,
      });

      return NextResponse.json({
        message: "Offline top-up request submitted!",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing top-up request:", error);
    return NextResponse.json(
      { error: "An internal server error occurred.", details: error.message },
      { status: 500 }
    );
  }
}

export const POST = async (req: Request) =>
  withAuthMiddleware(
    (request, userId) => handleTopUpRequest(request, userId),
    true
  )(req);
