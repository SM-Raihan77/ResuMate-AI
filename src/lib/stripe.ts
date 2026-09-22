import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Warning logged in non-production or when initializing without Stripe configured yet
  if (process.env.NODE_ENV === "production") {
    console.warn("STRIPE_SECRET_KEY environment variable is not set.");
  }
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_initialization",
  {
    apiVersion: "2025-02-24.acacia" as any,
    typescript: true,
  }
);
