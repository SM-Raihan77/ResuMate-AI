import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { SubscriptionService } from "@/services/subscription.service";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");

    let usage;
    if (sessionId) {
      // Authoritative verification and synchronization from checkout session
      usage = await SubscriptionService.syncSessionFromCheckout(sessionId, session.user.id);
    } else {
      usage = await SubscriptionService.getUserUsage(session.user.id);
    }

    return NextResponse.json(
      {
        success: true,
        data: usage,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error: any) {
    console.error("Subscription Status API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retrieve subscription status.",
      },
      { status: 500 }
    );
  }
}
