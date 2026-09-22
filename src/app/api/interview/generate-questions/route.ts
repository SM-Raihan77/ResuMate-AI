import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { InterviewService } from "@/services/interview.service";
import { generateQuestionsSchema } from "@/lib/validations";
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_GENERATE_QUESTIONS,
} from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit check ──────────────────────────────────────────────────
    const clientId = getClientIdentifier(request.headers);
    const rateCheck = checkRateLimit(clientId, "generate-questions", RATE_LIMIT_GENERATE_QUESTIONS);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before generating more questions." },
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
    const validation = generateQuestionsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const result = await InterviewService.generateQuestions({
      ...validation.data,
      userId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API /api/interview/generate-questions error:", error);

    if (error?.code === "PREMIUM_REQUIRED" || error?.name === "PremiumRequiredError") {
      return NextResponse.json(
        {
          success: false,
          code: "PREMIUM_REQUIRED",
          error: error.message || "You have reached your free limit. Upgrade to Premium for unlimited access.",
          message: error.message || "You have reached your free limit. Upgrade to Premium for unlimited access.",
        },
        { status: 403 }
      );
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred while generating questions.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
