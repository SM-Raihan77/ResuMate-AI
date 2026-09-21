import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { ResumeService } from "@/services/resume.service";
import { resumeUpdateSchema } from "@/lib/validations";

export const maxDuration = 30;

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/resumes/[id]
 * Fetch a specific resume ensuring ownership by authenticated user.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resume ID is required." },
        { status: 400 }
      );
    }

    const resume = await ResumeService.getResumeById(session.user.id, id);

    if (!resume) {
      return NextResponse.json(
        { success: false, error: "Resume not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        resume,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch resume.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/resumes/[id]
 * Update a resume's fields with validation and ownership verification.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resume ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = resumeUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await ResumeService.updateResume(
      session.user.id,
      id,
      validationResult.data
    );

    return NextResponse.json(
      {
        success: true,
        resume: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating resume:", error);
    if (error.message?.includes("unauthorized") || error.message?.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update resume.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id]
 * Delete a resume ensuring ownership.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resume ID is required." },
        { status: 400 }
      );
    }

    await ResumeService.deleteResume(session.user.id, id);

    return NextResponse.json(
      {
        success: true,
        message: "Resume deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting resume:", error);
    if (error.message?.includes("unauthorized") || error.message?.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete resume.",
      },
      { status: 500 }
    );
  }
}
