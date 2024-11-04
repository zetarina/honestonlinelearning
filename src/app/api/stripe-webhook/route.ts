import { NextRequest, NextResponse } from "next/server";
import { initializeStripe } from "@/utils/stripe";
import SettingService from "@/services/SettingService";
import PaymentService from "@/services/PaymentService";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import Stripe from "stripe";
import { PaymentStatus } from "@/models/PaymentModel";

const settingService = new SettingService();
const paymentService = new PaymentService();

async function buffer(request: NextRequest) {
  const chunks = [];
  for await (const chunk of request.body as unknown as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const stripeSignature = req.headers.get("stripe-signature") as string;

  try {
    const stripeSecretKeySetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.STRIPE_SECRET_KEY
    );
    const STRIPE_SECRET_KEY = stripeSecretKeySetting?.value?.toString();

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe Secret Key is not configured." },
        { status: 500 }
      );
    }

    const stripe = initializeStripe(STRIPE_SECRET_KEY);

    const stripeWebhookSecretSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.STRIPE_WEBHOOK_SECRET
    );
    const STRIPE_WEBHOOK_SECRET = stripeWebhookSecretSetting?.value?.toString();

    if (!STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Stripe Webhook secret is not configured." },
        { status: 500 }
      );
    }

    const buf = await buffer(req);
    const event = stripe.webhooks.constructEvent(
      buf,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET
    );

    // Handle successful payment completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update payment status to COMPLETED and assign points
      const updatedPayment = await paymentService.processPaymentByTransactionId(
        session.id,
        { status: PaymentStatus.COMPLETED, transaction_id: session.id }
      );

      if (!updatedPayment) {
        console.error(`Payment with transaction ID ${session.id} not found.`);
      }
    }

    // Handle failed payment
    if (
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update payment status to FAILED in the database
      const failedPayment = await paymentService.processPaymentByTransactionId(
        session.id,
        { status: PaymentStatus.FAILED, transaction_id: session.id }
      );

      if (!failedPayment) {
        console.error(
          `Failed payment with transaction ID ${session.id} not found.`
        );
      }
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
