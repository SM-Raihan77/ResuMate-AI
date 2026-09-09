import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysisResult } from "@/types/analyzer";

/**
 * Resolves the Gemini API key from standard environment variable names.
 */
export function getGeminiApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}

/**
 * Analyzes resume text against an optional Job Description using Google Gemini.
 */
export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysisResult> {
  const apiKey = getGeminiApiKey();

  // If no API key is provided, generate a smart fallback mock analysis
  if (!apiKey) {
    console.warn(
      "No GEMINI_API_KEY found in environment variables. Falling back to intelligent demo analysis."
    );
    return generateDemoAnalysis(resumeText, jobDescription);
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a Principal Executive Recruiter, Head of Technical Talent, and Fortune 500 ATS (Applicant Tracking System) Algorithm Auditor.
Your task is to conduct an uncompromising, highly accurate, and actionable audit of the candidate's resume text against real-world ATS screening algorithms (Workday, Greenhouse, Lever, Taleo, iCIMS) and the provided Job Description (if available).

Scoring Guidelines:
1. atsScore (0-100): Overall probability of passing automated screening.
2. scoreBreakdown:
   - keywordMatch (0-100): Semantic overlap with industry standard tools, frameworks, metrics, and JD requirements.
   - formattingQuality (0-100): Layout readability, standard section headers, chronological clarity, absence of parser-breaking elements.
   - experienceRelevance (0-100): Seniority calibration, achievement density, quantified business impact ($ saved, % latency reduced, team size).
3. missingKeywords: 4 to 8 critical technical skills, methodologies, or certifications missing or under-represented.
4. formattingIssues: 3 to 5 concrete structural/formatting or syntax issues that trigger ATS flags.
5. bulletPointRewrites: 3 to 5 of the weakest/most passive bullets from the resume converted into high-impact Google XYZ-format achievements ("Accomplished [X], as measured by [Y], by doing [Z]").
6. overallFeedback: 2 to 4 sentences providing an executive summary and key strategic adjustments.
7. matchedKeywords: 4 to 8 key skills and keywords correctly detected in the resume.
8. keyStrengths: 2 to 3 notable highlights from the candidate's profile.

You must return strictly valid JSON matching the requested structure.`;

  const prompt = `
RESUME CONTENT:
"""
${resumeText.slice(0, 15000)}
"""

${
  jobDescription && jobDescription.trim().length > 0
    ? `TARGET JOB DESCRIPTION:
"""
${jobDescription.slice(0, 8000)}
"""`
    : `TARGET JOB: Analyze against the target role and seniority inferred from the resume.`
}

Analyze this resume thoroughly and return the structured JSON assessment.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                keywordMatch: { type: Type.INTEGER },
                formattingQuality: { type: Type.INTEGER },
                experienceRelevance: { type: Type.INTEGER },
              },
              required: [
                "keywordMatch",
                "formattingQuality",
                "experienceRelevance",
              ],
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            formattingIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            bulletPointRewrites: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["original", "improved", "reason"],
              },
            },
            overallFeedback: { type: Type.STRING },
            matchedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            targetRoleIdentified: { type: Type.STRING },
            detectedExperienceLevel: { type: Type.STRING },
          },
          required: [
            "atsScore",
            "scoreBreakdown",
            "missingKeywords",
            "formattingIssues",
            "bulletPointRewrites",
            "overallFeedback",
          ],
        },
      },
    });

    const responseText = response.text || "";
    const parsedData: ResumeAnalysisResult = JSON.parse(responseText);

    return {
      ...parsedData,
      analyzedAt: new Date().toISOString(),
      isDemo: false,
    };
  } catch (error: any) {
    console.error("Gemini API invocation error:", error);
    // If Gemini model fails (e.g., model name change or quota), fallback to robust demo parsing with error notes
    const fallback = generateDemoAnalysis(resumeText, jobDescription);
    fallback.overallFeedback = `(Analysis generated via local heuristic model due to API limit: ${error.message}) ${fallback.overallFeedback}`;
    return fallback;
  }
}

/**
 * Generates an intelligent, context-aware analysis when no API key is provided
 * or during offline/mock evaluation.
 */
export function generateDemoAnalysis(
  resumeText: string,
  jobDescription?: string
): ResumeAnalysisResult {
  const lowerText = resumeText.toLowerCase();
  const lowerJD = (jobDescription || "").toLowerCase();

  // Heuristic skill detection
  const commonKeywords = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST API",
    "TailwindCSS",
    "Prisma",
    "Microservices",
    "CI/CD",
    "Git",
    "Agile",
    "System Design",
    "Redux",
    "Redis",
  ];

  const matchedKeywords = commonKeywords.filter((kw) =>
    lowerText.includes(kw.toLowerCase())
  );
  const missingKeywords = commonKeywords
    .filter((kw) => !lowerText.includes(kw.toLowerCase()))
    .slice(0, 6);

  // Derive dynamic score based on text length and keyword density
  const wordCount = resumeText.split(/\s+/).length;
  let baseScore = 72;
  if (matchedKeywords.length >= 8) baseScore += 14;
  else if (matchedKeywords.length >= 4) baseScore += 8;
  if (wordCount > 300 && wordCount < 900) baseScore += 6;
  if (lowerText.includes("%") || lowerText.includes("$")) baseScore += 5;
  const atsScore = Math.min(Math.max(baseScore, 58), 94);

  return {
    atsScore,
    scoreBreakdown: {
      keywordMatch: Math.min(Math.round(atsScore * 0.94), 98),
      formattingQuality: Math.min(Math.round(atsScore * 1.04), 95),
      experienceRelevance: Math.min(Math.round(atsScore * 0.98), 96),
    },
    missingKeywords:
      missingKeywords.length > 0
        ? missingKeywords
        : ["System Architecture", "Performance Benchmarking", "Terraform", "Zero-Downtime Migration"],
    formattingIssues: [
      "Missing quantified revenue/efficiency impact on multiple experience bullet points",
      "Ensure standard section headers ('Experience', 'Education', 'Technical Skills') for 100% ATS parser accuracy",
      "Avoid multi-column tables or text boxes which can scramble text in legacy Workday parsers",
      "Standardize all date formats to 'Month YYYY – Month YYYY'",
    ],
    bulletPointRewrites: [
      {
        original: "Responsible for developing backend APIs and fixing bug tickets with team members.",
        improved:
          "Engineered 18+ high-throughput RESTful microservices in Node.js & TypeScript, cutting p99 query latency by 42% and supporting 1.8M daily active users.",
        reason:
          "Transformed passive duty phrasing into high-impact Google XYZ achievement format with quantifiable metrics and exact tech stack tags.",
      },
      {
        original: "Worked on database optimization and improved application loading speed.",
        improved:
          "Optimized PostgreSQL schema indexing and integrated Redis caching layer, decreasing p95 database query times from 840ms to 65ms (92% speedup).",
        reason:
          "Added specific before-and-after performance benchmarks and architectural mechanism details.",
      },
      {
        original: "Collaborated with product managers and engineers on frontend features.",
        improved:
          "Spearheaded cross-functional delivery of 6 core web capabilities with Next.js and TailwindCSS, lifting user onboarding conversion by 28%.",
        reason:
          "Replaced vague collaboration with verified leadership scope and quantifiable business conversion uplift.",
      },
    ],
    overallFeedback:
      "Your resume displays a solid foundation of engineering experience. To reliably surpass Tier-1 ATS filters and land senior interview callbacks, weave more quantified business impact (% efficiency gains, latency reduction, cost savings) and incorporate the missing cloud infrastructure and system design keywords.",
    matchedKeywords:
      matchedKeywords.length > 0
        ? matchedKeywords
        : ["TypeScript", "React", "Next.js", "REST APIs", "Git"],
    keyStrengths: [
      "Demonstrated experience with modern full-stack web technologies",
      "Clear chronological progression in technical responsibilities",
    ],
    targetRoleIdentified: lowerJD ? "Target Role (from Job Description)" : "Full Stack Software Engineer",
    detectedExperienceLevel: wordCount > 500 ? "Mid - Senior Level" : "Associate / Mid Level",
    analyzedAt: new Date().toISOString(),
    isDemo: true,
  };
}
