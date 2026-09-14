import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { InterviewService } from "@/services/interview.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to access interview sessions." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    if (sessionId) {
      const interviewSession = await InterviewService.getInterviewSessionById(
        session.user.id,
        sessionId
      );
      return NextResponse.json({ success: true, data: interviewSession }, { status: 200 });
    }

    const sessions = await InterviewService.getUserInterviewSessions(session.user.id, limit);
    return NextResponse.json({ success: true, data: sessions }, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/interview GET error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while fetching interview sessions.";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to delete interview sessions." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query parameter is required for deletion." },
        { status: 400 }
      );
    }

    await InterviewService.deleteInterviewSession(session.user.id, sessionId);
    return NextResponse.json(
      { success: true, message: "Interview session deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API /api/interview DELETE error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while deleting interview session.";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
