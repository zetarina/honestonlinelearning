import { PaymentMethod, PaymentStatus } from "@/models/PaymentModel";
import { NextResponse } from "next/server";
import { handleEmailNotification } from "./email-top-up-api";
import { handleTelegramNotification } from "./telegram-top-up-api";
import PaymentService from "@/services/PaymentService";

const paymentService = new PaymentService();

export async function handleOfflinePayment(
  userId: string,
  amount: number,
  currency: string,
  screenshot: Buffer,
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
