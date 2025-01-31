import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { initializeStripe } from "@/utils/stripe";

export async function StripePayment(
  amount: number,
  currency: string,
  settings: SettingsInterface // Use SettingsInterface for strong typing
) {
  const stripeSettings = settings[SETTINGS_KEYS.STRIPE];
  if (!stripeSettings || !stripeSettings.secretKey) {
    throw new Error("Stripe is not configured. Please contact the admin.");
  }

  const stripe = initializeStripe(stripeSettings.secretKey);

  const siteUrl =
    settings[SETTINGS_KEYS.SITE_SETTINGS].siteUrl || process.env.SITE_URL;
  if (!siteUrl) {
    throw new Error("Site URL is not configured. Please contact the admin.");
  }

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
    success_url: `${siteUrl}/success`,
    cancel_url: `${siteUrl}/cancel`,
  });
}
