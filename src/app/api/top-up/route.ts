import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import PaymentService from "@/services/PaymentService";
import UserService from "@/services/UserService";
import { PaymentMethod, PaymentStatus } from "@/models/PaymentModel";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import { stripePayment } from "@/utils/server/stripePayment";
import { sendPaymentTelegram } from "@/utils/server/sendPaymentTelegram";
import { sendPaymentEmail } from "@/utils/server/sendPaymentEmail";
import { User } from "@/models/UserModel";

const settingService = new SettingService();
const paymentService = new PaymentService();
const userService = new UserService();

async function handleTopUpRequest(
  req: Request,
  user: User
): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const amount = formData.get("amount") as string | null;
    const paymentMethod = formData.get("paymentMethod") as string | null;
    const file = formData.get("file") as File | null;

    if (!amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Amount, and payment method are required." },
        { status: 400 }
      );
    }

    const settings = await settingService.getAllSettings();

    const currency = settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";

    if (paymentMethod === "stripe") {
      const session = await stripePayment(
        parseInt(amount, 10),
        currency,
        settings
      );

      await paymentService.createPayment({
        user_id: user.id,
        amount: parseFloat(amount),
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,
        transaction_id: session.id,
      });

      return NextResponse.json({ client_secret: session.id }, { status: 201 });
    } else if (paymentMethod === "offline") {
      if (!file) {
        return NextResponse.json(
          { error: "Screenshot file is required for offline payments." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const screenshotBuffer = Buffer.from(arrayBuffer);

      if (user != null) {
        try {
          const telegramSuccess = await sendPaymentTelegram(
            user,
            parseFloat(amount),
            currency,
            screenshotBuffer,
            settings
          );

          if (telegramSuccess) {
            await paymentService.createPayment({
              user_id: user.id,
              amount: parseFloat(amount),
              method: PaymentMethod.OFFLINE,
              status: PaymentStatus.PENDING,
            });

            return NextResponse.json(
              {
                message: "Offline top-up request submitted!",
              },
              { status: 201 }
            );
          }

          console.warn(
            "Telegram notification failed. Attempting email fallback."
          );

          const emailSuccess = await sendPaymentEmail(
            user,
            parseFloat(amount),
            currency,
            screenshotBuffer
          );

          if (emailSuccess) {
            await paymentService.createPayment({
              user_id: user.id,
              amount: parseFloat(amount),
              method: PaymentMethod.OFFLINE,
              status: PaymentStatus.PENDING,
            });

            return NextResponse.json(
              {
                message: "Offline top-up request submitted!",
              },
              { status: 201 }
            );
          }

          throw new Error(
            "Notification configuration is incomplete. Please set up Telegram or Gmail."
          );
        } catch (error: any) {
          console.error("Notification process failed:", error);

          return NextResponse.json(
            {
              error: error.message || "An internal server error occurred.",
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Unauthorized. Please login." },
          { status: 401 }
        );
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
    (request, user) => handleTopUpRequest(request, user),
    true
  )(req);
