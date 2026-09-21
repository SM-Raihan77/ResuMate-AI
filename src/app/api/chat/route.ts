import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { ChatRequestBody } from "@/types/chat";
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_CHAT,
} from "@/lib/rate-limit";

export const maxDuration = 45;

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit check ──────────────────────────────────────────────────
    const clientId = getClientIdentifier(request.headers);
    const rateCheck = checkRateLimit(clientId, "chat", RATE_LIMIT_CHAT);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before sending more messages." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.retryAfterMs || 60000) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = (await request.json()) as ChatRequestBody;

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. 'messages' array is required." },
        { status: 400 }
      );
    }

    const stream = await ChatService.streamChat(body);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    console.error("API /api/chat error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during chat generation.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
