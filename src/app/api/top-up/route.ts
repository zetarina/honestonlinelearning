// app/api/top-up/route.ts
import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import PaymentService from "@/services/PaymentService";
import { PaymentMethod, PaymentStatus } from "@/models/PaymentModel";
import { initializeStripe } from "@/utils/stripe";
import TelegramService from "@/services/TelegramService";
import MailService from "@/services/MailService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

const settingService = new SettingService();
const paymentService = new PaymentService();
const mailService = new MailService();

async function getSettingsMap() {
  const settings = await settingService.getAllSettings("production");
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string | undefined>);
}

async function createStripePayment(
  amount: number,
  currency: string,
  settingsMap: Record<string, string | undefined>
) {
  const STRIPE_SECRET_KEY = settingsMap[SETTINGS_KEYS.STRIPE_SECRET_KEY];

  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. Please contact the admin.");
  }

  const stripe = initializeStripe(STRIPE_SECRET_KEY);

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: "Top-up Payment" },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.SITE_URL}/success`,
    cancel_url: `${process.env.SITE_URL}/cancel`,
  });
}

async function handleTelegramNotification(
  userId: string,
  amount: number,
  currency: string,
  screenshot: string,
  settingsMap: Record<string, string | undefined>
) {
  const botToken = settingsMap[SETTINGS_KEYS.TELEGRAM_BOT_TOKEN];
  const chatId = settingsMap[SETTINGS_KEYS.TELEGRAM_CHAT_ID];

  if (!botToken || !chatId) {
    console.error("Telegram configuration is incomplete.");
    return;
  }

  const telegramService = new TelegramService(botToken, chatId);

  const telegramMessage = `User with ID: ${userId} requested a top-up of ${amount} ${currency} (offline). Screenshot attached.`;
  const screenshotBuffer = Buffer.from(
    screenshot.split("base64,")[1],
    "base64"
  );
  return telegramService.sendPhoto(screenshotBuffer, telegramMessage);
}

async function handleEmailNotification(
  userId: string,
  amount: number,
  currency: string,
  screenshot: string
) {
  const mailSubject = "New Offline Top-up Request";
  const mailText = `User with ID: ${userId} requested a top-up of ${amount} ${currency}.`;
  const attachments = [
    {
      filename: "screenshot.png",
      content: screenshot.split("base64,")[1],
      encoding: "base64",
    },
  ];

  return mailService.sendMail(mailSubject, mailText, attachments);
}

async function handleOfflinePayment(
  userId: string,
  amount: number,
  currency: string,
  screenshot: string,
  settingsMap: Record<string, string | undefined>
) {
  try {
    await handleTelegramNotification(
      userId,
      amount,
      currency,
      screenshot,
      settingsMap
    );
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
    console.error("Error sending Telegram photo notification:", error);

    try {
      await handleEmailNotification(userId, amount, currency, screenshot);
      await paymentService.createPayment({
        user_id: userId,
        amount,
        method: PaymentMethod.OFFLINE,
        status: PaymentStatus.PENDING,
      });
      return NextResponse.json({
        message: "Offline top-up request submitted and sent via email!",
      });
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      return NextResponse.json(
        {
          error:
            "Notification configuration is incomplete. Please set up Telegram or Gmail.",
        },
        { status: 500 }
      );
    }
  }
}

async function handleTopUpRequest(req: Request, userId: string | null) {
  try {
    const { amount, screenshot, paymentMethod } = await req.json();
    if (!amount || !userId || !paymentMethod) {
      return NextResponse.json(
        { error: "Amount, userId, and paymentMethod are required" },
        { status: 400 }
      );
    }

    const settingsMap = await getSettingsMap();
    const currency = (
      settingsMap[SETTINGS_KEYS.CURRENCY] || "USD"
    ).toUpperCase();

    if (paymentMethod === "stripe") {
      const session = await createStripePayment(amount, currency, settingsMap);
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
      return await handleOfflinePayment(
        userId,
        amount,
        currency,
        screenshot,
        settingsMap
      );
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
