import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { SubscriptionService } from "@/services/subscription.service";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Webhook Error] STRIPE_WEBHOOK_SECRET is not configured on the server.");
    return NextResponse.json(
      { error: "Webhook secret is missing from server configuration." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.warn("[Stripe Webhook Warning] Missing stripe-signature header.");
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook Error] Signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    const result = await SubscriptionService.processWebhookEvent(event);
    return NextResponse.json({ received: true, ...result }, { status: 200 });
  } catch (error: any) {
    console.error(`[Stripe Webhook Error] Event processing failed for ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook event processing failed." },
      { status: 500 }
    );
  }
}
