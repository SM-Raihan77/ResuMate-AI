import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DashboardService } from "@/services/dashboard.service";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request (no ISR/static caching)

/**
 * GET /api/dashboard
 *
 * Returns aggregated candidate intelligence for the authenticated user:
 * - Resume list with ATS scores (from `Resume` + `ResumeAnalysis` models)
 * - Latest & average ATS scores (PostgreSQL AVG/MAX aggregate)
 * - Completed mock interview sessions & average/peak scores (InterviewSession aggregate)
 * - Unified activity feed (resumes + analyses + interview events, sorted newest-first)
 * - Dynamic career milestones linked to real DB accomplishments
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to load candidate dashboard." },
        { status: 401 }
      );
    }

    const result = await DashboardService.getDashboardData(session.user.id);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        // Prevent CDN / Next.js data cache from serving stale dashboard metrics
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading the dashboard.";
    console.error("API /api/dashboard error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
