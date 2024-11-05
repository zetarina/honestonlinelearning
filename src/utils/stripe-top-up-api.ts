import { SETTINGS_KEYS } from "@/config/settingKeys";
import { initializeStripe } from "./stripe";

export async function createStripePayment(
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
