import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { InterviewService } from "@/services/interview.service";
import { evaluateAnswerSchema } from "@/lib/validations";
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_EVALUATE_ANSWER,
} from "@/lib/rate-limit";

export const maxDuration = 45;

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit check ──────────────────────────────────────────────────
    const clientId = getClientIdentifier(request.headers);
    const rateCheck = checkRateLimit(clientId, "evaluate-answer", RATE_LIMIT_EVALUATE_ANSWER);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before submitting another answer." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.retryAfterMs || 60000) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const userId = session?.user?.id;

    const body = await request.json();
    const validation = evaluateAnswerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const result = await InterviewService.evaluateAnswer({
      ...validation.data,
      userId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/interview/evaluate-answer error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while evaluating the answer.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
