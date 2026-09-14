import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ResumeService } from "@/services/resume.service";
import { analyzeResumeSchema } from "@/lib/validations";
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_ANALYZE_RESUME,
} from "@/lib/rate-limit";

export const maxDuration = 60;

/**
 * Helper to serialize a PostgreSQL Resume entity into plain text for Gemini ATS analysis.
 */
function serializeResumeForAnalysis(resume: any): string {
  const parts: string[] = [];

  if (resume.fullName || resume.firstName || resume.lastName) {
    const name = resume.fullName || `${resume.firstName || ""} ${resume.lastName || ""}`.trim();
    parts.push(`CANDIDATE NAME: ${name}`);
  }

  if (resume.jobTitle) parts.push(`TARGET TITLE: ${resume.jobTitle}`);

  const contact = [resume.email, resume.phone, resume.location, resume.linkedin, resume.github]
    .filter(Boolean)
    .join(" | ");
  if (contact) parts.push(`CONTACT: ${contact}`);

  if (resume.summary) {
    parts.push(`\nSUMMARY:\n${resume.summary}`);
  }

  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    parts.push(`\nWORK EXPERIENCE:`);
    for (const exp of resume.experience) {
      parts.push(
        `- ${exp.role || "Role"} at ${exp.company || "Company"} (${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""})`
      );
      if (Array.isArray(exp.highlights)) {
        for (const h of exp.highlights) {
          if (h && typeof h === "string") parts.push(`  * ${h}`);
        }
      }
    }
  }

  if (Array.isArray(resume.skills) && resume.skills.length > 0) {
    parts.push(`\nSKILLS:`);
    for (const cat of resume.skills) {
      if (Array.isArray(cat.skills) && cat.skills.length > 0) {
        parts.push(`${cat.categoryName || "Category"}: ${cat.skills.join(", ")}`);
      }
    }
  }

  if (Array.isArray(resume.education) && resume.education.length > 0) {
    parts.push(`\nEDUCATION:`);
    for (const edu of resume.education) {
      parts.push(
        `- ${edu.degree || "Degree"} in ${edu.fieldOfStudy || "Field"} from ${edu.institution || "Institution"} (${edu.startDate || ""} - ${edu.endDate || ""})`
      );
    }
  }

  if (Array.isArray(resume.projects) && resume.projects.length > 0) {
    parts.push(`\nPROJECTS:`);
    for (const proj of resume.projects) {
      const stack = Array.isArray(proj.techStack) ? ` [${proj.techStack.join(", ")}]` : "";
      parts.push(`- ${proj.title || "Project"}${stack}`);
      if (Array.isArray(proj.highlights)) {
        for (const h of proj.highlights) {
          if (h && typeof h === "string") parts.push(`  * ${h}`);
        }
      }
    }
  }

  if (Array.isArray(resume.certifications) && resume.certifications.length > 0) {
    parts.push(`\nCERTIFICATIONS:`);
    for (const cert of resume.certifications) {
      parts.push(`- ${cert.name || "Certification"} (${cert.issuer || ""})`);
    }
  }

  return parts.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit check ──────────────────────────────────────────────────
    const clientId = getClientIdentifier(request.headers);
    const rateCheck = checkRateLimit(clientId, "analyze-resume", RATE_LIMIT_ANALYZE_RESUME);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before submitting another analysis." },
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

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      let rawText = (formData.get("resumeText") as string | null) || undefined;
      const jd = (formData.get("jobDescription") as string | null) || undefined;
      const resumeId = (formData.get("resumeId") as string | null) || undefined;
      const title = (formData.get("title") as string | null) || undefined;

      let fileData;
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        fileData = {
          buffer,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        };
      } else if (!rawText && resumeId && userId) {
        // If no file/text provided but resumeId is given, load from PostgreSQL
        const dbResume = await ResumeService.getResumeById(userId, resumeId);
        if (dbResume) {
          rawText = serializeResumeForAnalysis(dbResume);
        }
      }

      const result = await ResumeService.analyzeResume({
        file: fileData,
        resumeText: rawText,
        jobDescription: jd,
        resumeId,
        userId,
        title,
      });

      return NextResponse.json(result, { status: 200 });
    }

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const validation = analyzeResumeSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: "Invalid request payload", details: validation.error.flatten() },
          { status: 400 }
        );
      }

      let resumeText = validation.data.resumeText;
      const resumeId = validation.data.resumeId;

      if (!resumeText && resumeId && userId) {
        const dbResume = await ResumeService.getResumeById(userId, resumeId);
        if (dbResume) {
          resumeText = serializeResumeForAnalysis(dbResume);
        }
      }

      const result = await ResumeService.analyzeResume({
        resumeText,
        jobDescription: validation.data.jobDescription,
        resumeId,
        userId,
        title: validation.data.title,
      });

      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type. Please send multipart/form-data or application/json." },
      { status: 415 }
    );
  } catch (error: unknown) {
    console.error("API /api/analyze-resume POST error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while analyzing the resume.";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to view analysis history." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get("resumeId");
    const analysisId = searchParams.get("analysisId");

    if (analysisId) {
      const analysis = await ResumeService.getAnalysisById(session.user.id, analysisId);
      return NextResponse.json({ success: true, data: analysis }, { status: 200 });
    }

    if (resumeId) {
      const analyses = await ResumeService.getResumeAnalyses(session.user.id, resumeId);
      return NextResponse.json({ success: true, data: analyses }, { status: 200 });
    }

    const recentAnalyses = await ResumeService.getUserAnalyses(session.user.id);
    return NextResponse.json({ success: true, data: recentAnalyses }, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/analyze-resume GET error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while fetching analyses.";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

