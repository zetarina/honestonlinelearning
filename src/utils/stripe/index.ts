// utils/stripe.ts
import Stripe from "stripe";

export function initializeStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: "2024-10-28.acacia",
  });
}
