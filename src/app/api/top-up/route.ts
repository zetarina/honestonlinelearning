import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import Stripe from "stripe";
import PaymentService from "@/services/PaymentService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { PaymentMethod, PaymentStatus } from "@/models/PaymentModel";
import { initializeStripe } from "@/utils/stripe";
import axios from "axios";

const settingService = new SettingService();
const paymentService = new PaymentService();

async function handleTopUpRequest(req: Request, userId: string | null) {
  try {
    const { amount, screenshot, paymentMethod } = await req.json();

    if (!amount || !userId || !paymentMethod) {
      return NextResponse.json(
        { error: "Amount, userId, and paymentMethod are required" },
        { status: 400 }
      );
    }

    const settings = await settingService.getAllSettings("production");

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string | undefined>);

    // Retrieve the currency from settings and convert it to uppercase with a default of "USD"
    const CURRENCY = (
      settingsMap[SETTINGS_KEYS.CURRENCY] || "usd"
    ).toUpperCase();

    if (paymentMethod === "stripe") {
      const stripeSecretKeySetting = await settingService.getSettingByKey(
        SETTINGS_KEYS.STRIPE_SECRET_KEY
      );
      const STRIPE_SECRET_KEY = stripeSecretKeySetting?.value;

      if (!STRIPE_SECRET_KEY) {
        return NextResponse.json(
          { error: "Stripe is not configured. Please contact the admin." },
          { status: 500 }
        );
      }

      const stripe = initializeStripe(STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: CURRENCY.toLowerCase(), // Stripe expects lowercase currency codes
              product_data: {
                name: "Top-up Payment",
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.SITE_URL}/success`,
        cancel_url: `${process.env.SITE_URL}/cancel`,
      });

      await paymentService.createPayment({
        user_id: userId,
        amount,
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,
        transaction_id: session.id,
      });

      return NextResponse.json({ client_secret: session.id });
    } else if (paymentMethod === "offline") {
      if (!screenshot) {
        return NextResponse.json(
          { error: "Please upload a screenshot for offline payment." },
          { status: 400 }
        );
      }

      const TELEGRAM_BOT_TOKEN = settingsMap[SETTINGS_KEYS.TELEGRAM_BOT_TOKEN];
      const TELEGRAM_CHAT_ID = settingsMap[SETTINGS_KEYS.TELEGRAM_CHAT_ID];

      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
          const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
          const telegramMessage = `User with ID: ${userId} requested a top-up of ${amount} ${CURRENCY} (offline). Screenshot: [Uploaded]`;

          await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
          });

          await paymentService.createPayment({
            user_id: userId,
            amount,
            method: PaymentMethod.OFFLINE,
            status: PaymentStatus.PENDING,
          });

          return NextResponse.json({
            message: "Offline top-up request submitted and sent to Telegram!",
          });
        } catch (error) {
          console.error("Error sending Telegram notification:", error);
        }
      }

      // If Telegram is unavailable, try Gmail as a fallback
      const GMAIL_USER = settingsMap[SETTINGS_KEYS.GMAIL_USER];
      const GMAIL_PASSWORD = settingsMap[SETTINGS_KEYS.GMAIL_PASSWORD];
      const ADMIN_EMAIL = settingsMap[SETTINGS_KEYS.ADMIN_EMAIL];

      if (GMAIL_USER && GMAIL_PASSWORD && ADMIN_EMAIL) {
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
          text: `User with ID: ${userId} requested a top-up of ${amount} ${CURRENCY}.`,
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
          message: "Offline top-up request submitted and sent via email!",
        });
      } else {
        // If neither Telegram nor Gmail are configured
        return NextResponse.json(
          {
            error:
              "Notification configuration is incomplete. Please set up Telegram or Gmail.",
          },
          { status: 500 }
        );
      }
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
