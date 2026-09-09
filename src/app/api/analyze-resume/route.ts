import { NextRequest, NextResponse } from "next/server";
import { ResumeService } from "@/services/resume.service";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const rawText = formData.get("resumeText") as string | null;
      const jd = formData.get("jobDescription") as string | null;

      let fileData;
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        fileData = {
          buffer,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        };
      }

      const result = await ResumeService.analyzeResume({
        file: fileData,
        resumeText: rawText || undefined,
        jobDescription: jd || undefined,
      });

      return NextResponse.json(result, { status: 200 });
    }

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const result = await ResumeService.analyzeResume({
        resumeText: body.resumeText,
        jobDescription: body.jobDescription,
      });

      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type. Please send multipart/form-data or application/json." },
      { status: 415 }
    );
  } catch (error: any) {
    console.error("API /api/analyze-resume error:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred while analyzing the resume.",
      },
      { status: 400 }
    );
  }
}
