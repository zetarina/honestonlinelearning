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
const telegramService = new TelegramService();
const mailService = new MailService();

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
              currency: CURRENCY.toLowerCase(),
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

      const telegramMessage = `User with ID: ${userId} requested a top-up of ${amount} ${CURRENCY} (offline). Screenshot: [Uploaded]`;

      // Try to send notification via Telegram
      try {
        await telegramService.sendMessage(telegramMessage);
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

      // Fallback to email notification if Telegram fails
      try {
        const mailSubject = "New Offline Top-up Request";
        const mailText = `User with ID: ${userId} requested a top-up of ${amount} ${CURRENCY}.`;
        const attachments = [
          {
            filename: "screenshot.png",
            content: screenshot.split("base64,")[1],
            encoding: "base64",
          },
        ];

        await mailService.sendMail(mailSubject, mailText, attachments);

        await paymentService.createPayment({
          user_id: userId,
          amount,
          method: PaymentMethod.OFFLINE,
          status: PaymentStatus.PENDING,
        });

        return NextResponse.json({
          message: "Offline top-up request submitted and sent via email!",
        });
      } catch (error) {
        console.error("Error sending email notification:", error);
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
