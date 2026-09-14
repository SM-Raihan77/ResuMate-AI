import { NextRequest, NextResponse } from "next/server";
import { ResumeService } from "@/services/resume.service";
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_OPTIMIZE_RESUME,
} from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit check ──────────────────────────────────────────────────
    const clientId = getClientIdentifier(request.headers);
    const rateCheck = checkRateLimit(clientId, "optimize-resume", RATE_LIMIT_OPTIMIZE_RESUME);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before submitting another optimization." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.retryAfterMs || 60000) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();

    if (!body || !body.resume) {
      return NextResponse.json(
        { error: "Target resume object is required for AI optimization." },
        { status: 400 }
      );
    }

    const result = await ResumeService.optimizeResume(body.resume);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/optimize-resume error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while optimizing resume.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
