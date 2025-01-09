import { NextRequest, NextResponse } from "next/server";
import { initializeStripe } from "@/utils/stripe";
import SettingService from "@/services/SettingService";
import PaymentService from "@/services/PaymentService";
import { PAYMENT_SETTINGS_KEYS } from "@/config/settings/PAYMENT_SETTINGS_KEYS";
import Stripe from "stripe";
import { PaymentStatus } from "@/models/PaymentModel";

const settingService = new SettingService();
const paymentService = new PaymentService();

// Helper function to convert request body to Buffer
async function buffer(request: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of request.body as unknown as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const stripeSignature = req.headers.get("stripe-signature") as string;

  try {
    // Fetch all settings
    const settings = await settingService.getAllSettings();

    // Access Stripe settings directly
    const stripeSettings = settings[PAYMENT_SETTINGS_KEYS.STRIPE];
    if (!stripeSettings?.secretKey || !stripeSettings?.webhookSecret) {
      return NextResponse.json(
        { error: "Stripe configuration is missing." },
        { status: 500 }
      );
    }

    const stripe = initializeStripe(stripeSettings.secretKey);

    // Parse and verify the incoming Stripe event
    const buf = await buffer(req);
    const event = stripe.webhooks.constructEvent(
      buf,
      stripeSignature,
      stripeSettings.webhookSecret
    );

    const session = event.data.object as Stripe.Checkout.Session;

    // Handle event types
    switch (event.type) {
      case "checkout.session.completed":
        // Update payment status to COMPLETED
        const completedPayment =
          await paymentService.processPaymentByTransactionId(session.id, {
            status: PaymentStatus.COMPLETED,
            transaction_id: session.id,
          });
        if (!completedPayment) {
          console.error(`Payment with transaction ID ${session.id} not found.`);
        }
        break;

      case "checkout.session.async_payment_failed":
      case "payment_intent.payment_failed":
        // Update payment status to FAILED
        const failedPayment =
          await paymentService.processPaymentByTransactionId(session.id, {
            status: PaymentStatus.FAILED,
            transaction_id: session.id,
          });
        if (!failedPayment) {
          console.error(
            `Failed payment with transaction ID ${session.id} not found.`
          );
        }
        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook verification failed." },
      { status: 400 }
    );
  }
}
