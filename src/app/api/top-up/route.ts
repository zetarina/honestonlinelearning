import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import PaymentService from "@/services/PaymentService";
import { PaymentMethod, PaymentStatus } from "@/models/PaymentModel";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import { StripePayment } from "@/utils/StripePayment";
import { TelegramPayment } from "@/utils/TelegramPayment";
import { EmailPayment } from "@/utils/EmailPayment";

const settingService = new SettingService();
const paymentService = new PaymentService();

async function getSettingsMap(): Promise<Record<string, string | undefined>> {
  const settings = await settingService.getAllSettings("production");
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string | undefined>);
}

async function handleTopUpRequest(
  req: Request,
  userId: string | null
): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const amount = formData.get("amount") as string | null;
    const paymentMethod = formData.get("paymentMethod") as string | null;
    const file = formData.get("file") as File | null;

    if (!amount || !userId || !paymentMethod) {
      return NextResponse.json(
        { error: "Amount, user ID, and payment method are required." },
        { status: 400 }
      );
    }

    const settingsMap = await getSettingsMap();
    const currency = (
      settingsMap[SETTINGS_KEYS.CURRENCY] || "USD"
    ).toUpperCase();

    if (paymentMethod === "stripe") {
      // Handle Stripe Payment
      const session = await StripePayment(
        parseInt(amount, 10),
        currency,
        settingsMap
      );

      await paymentService.createPayment({
        user_id: userId,
        amount: parseFloat(amount),
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,
        transaction_id: session.id,
      });

      return NextResponse.json({ client_secret: session.id });
    } else if (paymentMethod === "offline") {
      // Handle Offline Payment
      if (!file) {
        return NextResponse.json(
          { error: "Screenshot file is required for offline payments." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const screenshotBuffer = Buffer.from(arrayBuffer);

      try {
        // Attempt to send Telegram notification
        await TelegramPayment(
          userId,
          parseFloat(amount),
          currency,
          screenshotBuffer,
          settingsMap
        );

        await paymentService.createPayment({
          user_id: userId,
          amount: parseFloat(amount),
          method: PaymentMethod.OFFLINE,
          status: PaymentStatus.PENDING,
        });

        return NextResponse.json({
          message: "Offline top-up request submitted and sent to Telegram!",
        });
      } catch (telegramError) {
        console.error("Telegram notification failed:", telegramError);

        try {
          // Fallback to email notification
          await EmailPayment(
            userId,
            parseFloat(amount),
            currency,
            screenshotBuffer
          );

          await paymentService.createPayment({
            user_id: userId,
            amount: parseFloat(amount),
            method: PaymentMethod.OFFLINE,
            status: PaymentStatus.PENDING,
          });

          return NextResponse.json({
            message: "Offline top-up request submitted and sent via email!",
          });
        } catch (emailError) {
          console.error("Email notification failed:", emailError);
          return NextResponse.json(
            {
              error:
                "Notification configuration is incomplete. Please set up Telegram or Gmail.",
            },
            { status: 500 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { error: "Invalid payment method." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Error processing top-up request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "An internal server error occurred.", details: errorMessage },
      { status: 500 }
    );
  }
}

export const POST = async (req: Request) =>
  withAuthMiddleware(
    (request, userId) => handleTopUpRequest(request, userId),
    true
  )(req);
