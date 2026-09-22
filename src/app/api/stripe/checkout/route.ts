import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { SubscriptionService } from "@/services/subscription.service";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to proceed with checkout." },
        { status: 401 }
      );
    }

    const origin = request.headers.get("origin") || request.nextUrl.origin || "";

    const { url, sessionId } = await SubscriptionService.createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name || undefined,
      origin,
    });

    return NextResponse.json({ success: true, url, sessionId }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize Stripe checkout.",
      },
      { status: 500 }
    );
  }
}
