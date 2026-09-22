import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { ResumeService } from "@/services/resume.service";
import { ResumeBuilderState } from "@/types/builder";

export const maxDuration = 30;

/**
 * POST /api/resumes
 * Create a new Resume in PostgreSQL associated with the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to create a resume." },
        { status: 401 }
      );
    }

    let payload: {
      title?: string;
      description?: string;
      initialData?: Partial<ResumeBuilderState>;
    } = {};

    try {
      const body = await request.json();
      if (body) {
        payload = {
          title: typeof body.title === "string" ? body.title : undefined,
          description: typeof body.description === "string" ? body.description : undefined,
          initialData: body.initialData && typeof body.initialData === "object" ? body.initialData : undefined,
        };
      }
    } catch {
      // Body is optional for initial creation
    }

    const createdResume = await ResumeService.createResume(session.user.id, payload);

    return NextResponse.json(
      {
        success: true,
        id: createdResume.id,
        resume: createdResume,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating resume:", error);

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

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create resume.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resumes
 * Retrieve all resumes belonging to the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const resumes = await ResumeService.getUserResumes(session.user.id);

    return NextResponse.json(
      {
        success: true,
        resumes,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch resumes.",
      },
      { status: 500 }
    );
  }
}
