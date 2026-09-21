import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysisResult } from "@/types/analyzer";
import {
  InterviewQuestion,
  InterviewAnswerEvaluation,
  InterviewFinalReport,
  InterviewDifficulty,
  InterviewType,
} from "@/types/interview";

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

/* =========================================================================
 * AI MOCK INTERVIEW ENGINE
 * ========================================================================= */

export interface GenerateInterviewQuestionsParams {
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  questionCount?: number;
  jobDescription?: string;
  resumeText?: string;
}

/**
 * Generates tailored, realistic interview questions via Google Gemini.
 */
export async function generateInterviewQuestionsWithGemini(
  params: GenerateInterviewQuestionsParams
): Promise<{ questions: InterviewQuestion[]; isDemo: boolean }> {
  const count = params.questionCount || 5;
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Returning smart heuristic demo interview questions.");
    return {
      questions: generateDemoInterviewQuestions(params),
      isDemo: true,
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are an elite Senior Staff Engineer, Engineering Director, and Bar Raiser at top tech companies (Google, Meta, Amazon, Netflix, Stripe).
Your job is to generate a realistic, high-signal mock interview question set calibrated precisely for the requested role, seniority level, and interview type.

Guidelines:
- Seniority Calibration:
  - Junior: Fundamental language concepts, basic debugging, clean code, learning mindset.
  - Mid: Framework lifecycle, concurrency, API design, performance optimization, trade-offs.
  - Senior: Scalability, resilience, edge cases, cross-cutting architectural choices, STAR leadership.
  - Lead/Staff: Complex distributed system trade-offs, organization-level impact, mentoring, RFC design.
- If resume or job description is provided, customize questions specifically referencing their skills or required competencies.
- For each question:
  - Include an exact category (technical, behavioral, system-design, situational).
  - Include 3-6 expected keywords / core concepts the candidate should mention.
  - Include a subtle context/scenario explaining why this question is asked.
  - Include a short hint that can guide the candidate if stuck.
  - Include a high-quality model sample answer demonstrating ideal depth and structure.`;

  const prompt = `Generate exactly ${count} interview questions for:
ROLE: ${params.role}
SENIORITY: ${params.difficulty.toUpperCase()}
INTERVIEW TYPE: ${params.interviewType.toUpperCase()}
${params.jobDescription ? `TARGET JOB DESCRIPTION:\n"""${params.jobDescription.slice(0, 4000)}"""\n` : ""}
${params.resumeText ? `CANDIDATE RESUME PROFILE:\n"""${params.resumeText.slice(0, 4000)}"""\n` : ""}

Return the response matching the strict JSON schema.`;

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
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    enum: ["technical", "behavioral", "system-design", "situational"],
                  },
                  expectedKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  context: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  sampleAnswer: { type: Type.STRING },
                },
                required: ["id", "question", "category", "expectedKeywords"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Invalid structure returned from Gemini model.");
    }

    const formattedQuestions: InterviewQuestion[] = parsed.questions.map((q: any, i: number) => ({
      id: q.id || `q_${Date.now()}_${i + 1}`,
      question: q.question,
      category: q.category || "technical",
      expectedKeywords: q.expectedKeywords || [],
      context: q.context || undefined,
      hint: q.hint || undefined,
      sampleAnswer: q.sampleAnswer || undefined,
    }));

    return {
      questions: formattedQuestions,
      isDemo: false,
    };
  } catch (error: any) {
    console.error("Gemini generateInterviewQuestions error:", error);
    return {
      questions: generateDemoInterviewQuestions(params),
      isDemo: true,
    };
  }
}

export interface EvaluateInterviewAnswerParams {
  question: InterviewQuestion;
  userAnswer: string;
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
}

/**
 * Evaluates a candidate's answer to an interview question in real-time.
 */
export async function evaluateInterviewAnswerWithGemini(
  params: EvaluateInterviewAnswerParams
): Promise<InterviewAnswerEvaluation> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Generating demo answer evaluation.");
    return generateDemoAnswerEvaluation(params);
  }

  const isBehavioral =
    params.question.category === "behavioral" ||
    params.question.category === "situational";

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are an elite Senior Staff Tech Interviewer and Hiring Committee Chair at top tech companies (Google, Meta, Stripe).
Evaluate the candidate's answer strictly, constructively, and thoroughly.

Step 1: Determine Validity & Question Relevance (CRITICAL):
- Check if the answer is:
  1. Meaningful (not random characters, keyboard mashing, or gibberish).
  2. Professional (not abusive, insulting, or offensive).
  3. Relevant to the specific interview question being asked.
- If the answer is abusive, random gibberish, or completely irrelevant / off-topic (e.g. answering a technical question with a personal story about childhood, sports, village, cooking, etc., that does not address the question):
  - Set isValidAnswer = false
  - Set validationMessage = "Your answer doesn't address the interview question. Please provide a relevant answer." (or appropriate rejection explanation).
  - Set score = 0
  - Set strengths = [] (do NOT invent positive praise for irrelevant/abusive text).
  - Set weaknesses = ["The response did not address the question asked."]
  - Provide an idealAnswer showing how a Staff Engineer would answer this question.

Step 2: Scoring Valid Answers (isValidAnswer = true):
- If the answer is "I don't know", "not sure", or demonstrates lack of knowledge:
  - Set isValidAnswer = true
  - Set score = 0 to 10
  - Set validationMessage = "The response indicates a lack of familiarity or knowledge on this topic."
  - Set strengths = ["Honest acknowledgment of knowledge gap."] or []
  - Set weaknesses = ["No technical knowledge or practical experience was demonstrated for this question."]
- If the answer is short but valid (e.g. "Yes, I have used React for about one year" or a concise direct definition):
  - Set isValidAnswer = true
  - Score appropriately (e.g. 55-70) and provide constructive suggestions on expanding with technical mechanisms.
- If the answer is a detailed technical or behavioral answer:
  - 90-100: Staff/Principal-level answer. Clear structure, edge cases considered, high-impact terminology, quantified business results.
  - 75-89: Solid Senior hire. Covers core concept well, minor missed optimizations or trade-offs.
  - 60-74: Mid-level answer. Understands basics but lacks depth, quantitative impact, or structured problem-solving.
  - <60: Vague or partially incorrect.
${isBehavioral ? `- For behavioral/situational questions: Evaluate STAR framework compliance (Situation, Task, Action, Result).` : `- NOTE: This is a ${params.question.category} question. Do NOT require STAR format.`}

You must return strictly valid JSON matching the requested schema.`;

  const prompt = `
ROLE: ${params.role} (${params.difficulty} level)
INTERVIEW FOCUS: ${params.interviewType}
QUESTION CATEGORY: ${params.question.category}
INTERVIEW QUESTION: "${params.question.question}"
EXPECTED KEYWORDS / CONCEPTS: ${params.question.expectedKeywords.join(", ")}

CANDIDATE'S SUBMITTED ANSWER:
"""
${params.userAnswer}
"""

Evaluate this response thoroughly and output structured JSON.`;

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
            isValidAnswer: { type: Type.BOOLEAN },
            validationMessage: { type: Type.STRING },
            score: { type: Type.INTEGER },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            idealAnswer: { type: Type.STRING },
            starCompliance: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
                score: { type: Type.INTEGER },
              },
              required: ["situation", "task", "action", "result", "score"],
            },
          },
          required: ["isValidAnswer", "score", "strengths", "weaknesses", "idealAnswer"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const isValid = parsed.isValidAnswer !== false;

    return {
      questionId: params.question.id,
      question: params.question.question,
      userAnswer: params.userAnswer,
      isValidAnswer: isValid,
      validationMessage:
        parsed.validationMessage ||
        (!isValid
          ? "Your answer doesn't address the interview question. Please provide a relevant answer."
          : undefined),
      score: isValid ? (parsed.score ?? 75) : 0,
      strengths: isValid ? (parsed.strengths ?? ["Clear initial approach"]) : [],
      weaknesses:
        parsed.weaknesses && parsed.weaknesses.length > 0
          ? parsed.weaknesses
          : !isValid
          ? ["The response did not address the question asked."]
          : ["Could provide deeper trade-off analysis"],
      idealAnswer:
        parsed.idealAnswer ??
        params.question.sampleAnswer ??
        "An ideal response would emphasize performance trade-offs and business impact.",
      starCompliance: isBehavioral ? parsed.starCompliance : undefined,
      isDemo: false,
    };
  } catch (error: any) {
    console.error("Gemini evaluateInterviewAnswer error:", error);
    return generateDemoAnswerEvaluation(params);
  }
}

export interface GenerateInterviewReportParams {
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  evaluations: InterviewAnswerEvaluation[];
}

/**
 * Aggregates all individual question evaluations into a comprehensive final scorecard.
 */
export async function generateInterviewReportWithGemini(
  params: GenerateInterviewReportParams
): Promise<InterviewFinalReport> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Generating demo final report.");
    return generateDemoInterviewReport(params);
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a Principal Engineering Director and Hiring Committee Bar Raiser.
Synthesize the candidate's complete interview session transcript and individual question evaluations into an executive hiring scorecard.

Calculate:
1. overallScore (0-100 weighted average).
2. grade: "Staff / Principal Ready" (90+), "Senior Hire" (78-89), "Mid-Level Hire" (65-77), or "Borderline / Needs Practice" (<65).
3. categoryScores:
   - technicalProficiency (0-100)
   - communicationClarity (0-100)
   - problemSolving (0-100)
   - cultureAndSTAR (0-100)
4. keyStrengths: 3-4 top highlights across the interview.
5. criticalImprovements: 3-4 actionable growth priorities.
6. detailedFeedback: 2-3 paragraph executive summary of the performance.
7. readinessRecommendation: Direct verdict on readiness for Tier-1 engineering interviews.`;

  const transcriptSummary = params.evaluations
    .map(
      (ev, idx) => `
[QUESTION ${idx + 1}] (Score: ${ev.score}/100)
Q: ${ev.question}
A: ${ev.userAnswer}
Feedback: Strengths - ${ev.strengths.join(", ")}; Weaknesses - ${ev.weaknesses.join(", ")}
`
    )
    .join("\n");

  const prompt = `
ROLE: ${params.role} (${params.difficulty} Level)
FOCUS: ${params.interviewType}
EVALUATED TRANSCRIPT:
${transcriptSummary}

Synthesize the final interview report matching the schema.`;

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
            overallScore: { type: Type.INTEGER },
            grade: {
              type: Type.STRING,
              enum: [
                "Staff / Principal Ready",
                "Senior Hire",
                "Mid-Level Hire",
                "Borderline / Needs Practice",
              ],
            },
            categoryScores: {
              type: Type.OBJECT,
              properties: {
                technicalProficiency: { type: Type.INTEGER },
                communicationClarity: { type: Type.INTEGER },
                problemSolving: { type: Type.INTEGER },
                cultureAndSTAR: { type: Type.INTEGER },
              },
              required: [
                "technicalProficiency",
                "communicationClarity",
                "problemSolving",
                "cultureAndSTAR",
              ],
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            criticalImprovements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            detailedFeedback: { type: Type.STRING },
            readinessRecommendation: { type: Type.STRING },
          },
          required: [
            "overallScore",
            "grade",
            "categoryScores",
            "keyStrengths",
            "criticalImprovements",
            "detailedFeedback",
            "readinessRecommendation",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    const questionBreakdowns = params.evaluations.map((ev) => ({
      questionId: ev.questionId,
      question: ev.question,
      userAnswer: ev.userAnswer,
      score: ev.score,
      feedback: ev.weaknesses.length > 0 ? ev.weaknesses.join(". ") : "Solid answer.",
      betterAlternative: ev.idealAnswer,
    }));

    return {
      overallScore: parsed.overallScore ?? 80,
      grade: parsed.grade ?? "Senior Hire",
      categoryScores: parsed.categoryScores ?? {
        technicalProficiency: 82,
        communicationClarity: 80,
        problemSolving: 78,
        cultureAndSTAR: 80,
      },
      keyStrengths: parsed.keyStrengths ?? [
        "Clear technical communication and structured problem decomposition",
        "Demonstrated familiarity with industry best practices and core architectural patterns",
        "Proactive consideration of edge cases and user impact",
      ],
      criticalImprovements: parsed.criticalImprovements ?? [
        "Elaborate more on distributed scaling edge cases",
        "Quantify business results using concrete percentages or latency metrics",
        "Discuss alternative architectural trade-offs before settling on a single solution",
      ],
      detailedFeedback: parsed.detailedFeedback ?? "The candidate demonstrated solid technical competence across multiple core interview domains.",
      readinessRecommendation: parsed.readinessRecommendation ?? "Recommended for on-site technical rounds with minor focus on system trade-offs.",
      questionBreakdowns,
      completedAt: new Date().toISOString(),
      isDemo: false,
    };
  } catch (error: any) {
    console.error("Gemini generateInterviewReport error:", error);
    return generateDemoInterviewReport(params);
  }
}

/* =========================================================================
 * HEURISTIC DEMO FALLBACKS FOR OFFLINE / ZERO-CONFIG ENVIRONMENTS
 * ========================================================================= */

export function generateDemoInterviewQuestions(
  params: GenerateInterviewQuestionsParams
): InterviewQuestion[] {
  const roleLower = params.role.toLowerCase();
  const count = params.questionCount || 5;

  let baseBank: InterviewQuestion[] = [];

  if (roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("next")) {
    baseBank = [
      {
        id: "demo_fe_1",
        question:
          "Explain how Next.js App Router Server Components differ from Client Components. When should you push state down to the client boundary?",
        category: "technical",
        expectedKeywords: ["RSC", "Zero Bundle Size", "Interactivity", "Serialization", "Streaming SSR"],
        context: "Evaluating understanding of modern React 19 / Next.js architectural boundaries and client hydration overhead.",
        hint: "Focus on bundle size impact, sensitive data access on the server, and where event listeners (onClick, useState) must reside.",
        sampleAnswer:
          "Server Components render strictly on the server without shipping JavaScript to the client, reducing bundle size and enabling direct database access. Client components are designated with 'use client' and handle user interactivity, state hooks, and browser APIs. Best practice is to push the client boundary as deep down the component tree as possible (leaf nodes) to preserve server rendering benefits.",
      },
      {
        id: "demo_fe_2",
        question:
          "How do you profile and optimize Core Web Vitals (LCP, CLS, INP) in a large-scale React application?",
        category: "technical",
        expectedKeywords: ["LCP", "INP", "CLS", "Image Optimization", "Code Splitting", "Web Workers"],
        context: "Crucial for assessing production web performance and SEO optimization skills.",
        hint: "Mention dynamic imports, next/image priority loading, font display swap, and breaking up long JavaScript main-thread tasks.",
        sampleAnswer:
          "For LCP, prioritize hero asset delivery using next/image with priority, preload critical fonts, and minimize server TTFB. For CLS, specify explicit aspect ratios on containers and avoid unsized dynamic DOM injection. For INP, break long main-thread tasks with requestIdleCallback, debounce input handlers, and offload CPU-heavy processing to Web Workers.",
      },
      {
        id: "demo_fe_3",
        question:
          "Describe a time when you had a technical disagreement with a backend engineer regarding API payload design. How did you resolve it?",
        category: "behavioral",
        expectedKeywords: ["STAR Framework", "Contract Testing", "BFF Pattern", "Collaboration", "Customer Impact"],
        context: "Testing cross-functional leadership, pragmatic communication, and conflict resolution under deadlines.",
        hint: "Structure your response using Situation, Task, Action, Result (STAR).",
        sampleAnswer:
          "In my previous team (Situation), backend wanted a monolithic payload with 40+ nested fields while mobile/web needed fast 50ms responses (Task). I proposed an RFC with benchmarks showing mobile payload bloat (Action) and introduced a Backend-For-Frontend (BFF) layer with GraphQL. Result: API latency dropped by 38% and both frontend and backend velocity improved without breaking legacy services.",
      },
      {
        id: "demo_fe_4",
        question:
          "How would you design an infinite scrolling virtualization feed (like Twitter or LinkedIn) handling 10,000+ dynamic height items without frame drops?",
        category: "system-design",
        expectedKeywords: ["Virtualization", "DOM recycling", "IntersectionObserver", "Dynamic Height caching", "Windowing"],
        context: "Assessing frontend system design, memory management, and smooth 60fps rendering.",
        hint: "Discuss maintaining scroll offset, overscan windows, and estimated height caches with ResizeObserver.",
        sampleAnswer:
          "I would implement a windowed virtual list maintaining only items within the viewport plus an overscan buffer of ~5 items above and below. For dynamic heights, store measured heights in a Map indexed by item ID using ResizeObserver, recalculating total scroll container height dynamically and using transform: translateY for GPU-accelerated item positioning.",
      },
      {
        id: "demo_fe_5",
        question:
          "Tell me about a high-severity production bug you introduced or fixed. What was the root cause and post-mortem action item?",
        category: "situational",
        expectedKeywords: ["Root Cause Analysis", "Observability", "Rollback", "Post-Mortem", "Automated E2E tests"],
        context: "Evaluating candidate maturity, incident response, and continuous quality improvement.",
        hint: "Emphasize transparency, blameless post-mortem culture, and preventative CI/CD guardrails.",
        sampleAnswer:
          "During a checkout migration, a race condition in authentication token refresh caused 401 errors for 2% of active users. We immediately rolled back the canary deployment within 4 minutes via automated health metrics. In the blameless post-mortem, we added a token mutex queue and incorporated multi-tab token synchronization integration tests in CI.",
      },
    ];
  } else {
    // General Full-Stack / Backend / System Design bank
    baseBank = [
      {
        id: "demo_gen_1",
        question:
          `As a ${params.difficulty} ${params.role}, how do you ensure high database concurrency and prevent race conditions in financial or inventory transactions?`,
        category: "technical",
        expectedKeywords: ["ACID", "Optimistic Locking", "Pessimistic Locking", "Isolation Levels", "Idempotency"],
        context: "Tests fundamental understanding of relational transactions, distributed safety, and concurrency models.",
        hint: "Discuss database isolation levels (SERIALIZABLE vs REPEATABLE READ), SELECT FOR UPDATE, and version columns.",
        sampleAnswer:
          "To prevent race conditions like double-spending or overselling, I utilize database transactions with appropriate isolation levels, combined with Optimistic Locking (version columns) for high-read scenarios or Pessimistic Locking (SELECT ... FOR UPDATE) for high-contention paths. Additionally, every transaction API endpoint enforces idempotency keys stored in Redis.",
      },
      {
        id: "demo_gen_2",
        question:
          "Walk me through how you architect a resilient background job processing system with retry backoff, dead-letter queues, and rate-limiting.",
        category: "system-design",
        expectedKeywords: ["BullMQ / Redis", "DLQ", "Exponential Backoff with Jitter", "Idempotency", "Circuit Breaker"],
        context: "Evaluating distributed systems capability, failure modes, and asynchronous messaging architecture.",
        hint: "Cover queue partitions, worker scalability, exponential backoff with jitter to avoid thundering herd, and poison pill handling.",
        sampleAnswer:
          "I structure the system with a distributed queue (e.g. Redis BullMQ or AWS SQS) backed by independent worker pools. Tasks have deterministic idempotency IDs. For transient errors, retries use exponential backoff with randomized jitter. If retries exceed 5 attempts, messages route to a Dead Letter Queue (DLQ) with alert triggers and administrative replay tooling.",
      },
      {
        id: "demo_gen_3",
        question:
          "Describe a situation where you had to lead a critical project with ambiguous requirements and tight deadlines. What was your process?",
        category: "behavioral",
        expectedKeywords: ["STAR Framework", "Scope Negotiation", "Milestones", "De-risking", "Stakeholder Alignment"],
        context: "Assessing ownership, ambiguity management, and delivery discipline.",
        hint: "Structure using STAR: Situation, Task, Action, Result.",
        sampleAnswer:
          "When our team was tasked with launching a compliance export tool in 3 weeks with shifting legal requirements, I drove an alignment sync to separate MVP must-haves from fast-follow enhancements. I established weekly demo milestones, de-risked the data pipeline first, and successfully shipped 2 days ahead of deadline with zero compliance infractions.",
      },
      {
        id: "demo_gen_4",
        question:
          "How do you design a distributed caching layer to protect your primary database from cache stampede (thundering herd) during peak traffic spikes?",
        category: "system-design",
        expectedKeywords: ["XFetch", "Probabilistic Expiration", "Mutex Locking", "Cache Warmup", "Redis Cluster"],
        context: "Deep dive into caching strategies, cache invalidation, and database protection.",
        hint: "Mention distributed mutex locks (Redlock), probabilistic early recomputation (XFetch), and stale-while-revalidate.",
        sampleAnswer:
          "To prevent cache stampede when high-traffic keys expire, I implement probabilistic early expiration (XFetch algorithm) where workers asynchronously refresh the cache before strict TTL expiry. For absolute misses, workers acquire a short-lived distributed mutex on Redis so only one worker queries the database while others wait or serve stale cached data.",
      },
      {
        id: "demo_gen_5",
        question:
          "Tell me about a time you mentored a junior engineer or championed engineering standards across your team.",
        category: "behavioral",
        expectedKeywords: ["Code Reviews", "Pair Programming", "RFC Process", "Growth Mindset", "Knowledge Sharing"],
        context: "Testing engineering leadership, culture cultivation, and team uplift.",
        hint: "Highlight patience, constructive feedback loops, and sustainable documentation.",
        sampleAnswer:
          "I mentored an associate engineer who was struggling with complex TypeScript generics and async patterns. I initiated weekly 1:1 pair programming sessions, guided them through creating their first RFC, and helped them break large PRs into reviewable chunks. Within six months, they autonomously delivered our core payment webhook integration and were promoted.",
      },
    ];
  }

  return baseBank.slice(0, count);
}

const INTERVIEW_STOP_WORDS = new Set([
  "what", "is", "and", "why", "do", "we", "use", "it", "the", "a", "an",
  "how", "to", "in", "of", "for", "with", "on", "at", "by", "from", "are",
  "you", "your", "can", "should", "would", "could", "describe", "explain",
  "tell", "me", "about", "when", "which", "this", "that", "these", "those",
  "have", "been", "was", "were", "will", "does", "did"
]);

export function generateDemoAnswerEvaluation(
  params: EvaluateInterviewAnswerParams
): InterviewAnswerEvaluation {
  const answer = (params.userAnswer || "").trim();
  const lowerAnswer = answer.toLowerCase();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const isBehavioral =
    params.question.category === "behavioral" ||
    params.question.category === "situational";

  // 1. Check for abusive / profane / offensive language
  const profanityPatterns = [
    /\b(fuck|fucking|f\*\*\*|shit|bitch|asshole|bastard|idiot|moron|stfu|shut\s*up|screw\s*you|hate\s*you|crap)\b/i,
  ];
  const isAbusive = profanityPatterns.some((pattern) => pattern.test(lowerAnswer));
  if (isAbusive) {
    return {
      questionId: params.question.id,
      question: params.question.question,
      userAnswer: params.userAnswer,
      isValidAnswer: false,
      validationMessage:
        "Inappropriate or abusive language detected. Please provide a professional, relevant interview response.",
      score: 0,
      strengths: [],
      weaknesses: [
        "The submitted response contained inappropriate or unprofessional language.",
      ],
      idealAnswer:
        params.question.sampleAnswer ||
        "A professional response directly explains the core technical concept, operational trade-offs, and quantified impact.",
      isDemo: true,
    };
  }

  // 2. Check for random / keyboard mash / gibberish text
  const isGibberish =
    /^[a-z0-9\s!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]{1,30}$/i.test(answer) &&
    (/(.)\1{3,}/.test(answer) ||
      /^[bcdfghjklmnpqrstvwxyz\s!@#$%^&*()_+]{5,}$/i.test(answer) ||
      /^(asdf|qwer|zxcv|1234|test123|abc123)/i.test(answer) ||
      !/[a-zA-Z]{2,}/.test(answer));

  if (isGibberish) {
    return {
      questionId: params.question.id,
      question: params.question.question,
      userAnswer: params.userAnswer,
      isValidAnswer: false,
      validationMessage:
        "Your answer appears to be random or meaningless text. Please provide a clear and relevant response.",
      score: 0,
      strengths: [],
      weaknesses: [
        "The response consisted of random or unreadable characters with no substantive meaning.",
      ],
      idealAnswer:
        params.question.sampleAnswer ||
        "A clear, structured answer explaining the core mechanisms and design decisions.",
      isDemo: true,
    };
  }

  // 3. Check for "I don't know" / lack of knowledge indicators
  const idkWereSaid = [
    /^i\s+(?:don'?t|do\s+not)\s+know/i,
    /^idk/i,
    /^no\s+idea/i,
    /^not\s+(?:sure|familiar)/i,
    /^i\s+have\s+no\s+(?:idea|clue|knowledge)/i,
    /^haven'?t\s+used\s+this/i,
    /^skip/i,
    /^pass/i,
  ].some((pattern) => pattern.test(lowerAnswer));

  if (idkWereSaid && wordCount <= 12) {
    return {
      questionId: params.question.id,
      question: params.question.question,
      userAnswer: params.userAnswer,
      isValidAnswer: true,
      validationMessage:
        "The response indicates a lack of familiarity or knowledge on this topic.",
      score: 5,
      strengths: ["Honest acknowledgment of knowledge gap."],
      weaknesses: [
        "Did not demonstrate familiarity, conceptual definitions, or problem-solving approaches for this question.",
      ],
      idealAnswer:
        params.question.sampleAnswer ||
        "Review the core fundamentals and architecture for this topic to prepare for interview rounds.",
      isDemo: true,
    };
  }

  // 4. Relevance & Topic Overlap Check
  const cleanTokens = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !INTERVIEW_STOP_WORDS.has(w));

  const questionKeywords = cleanTokens(params.question.question);
  const expectedKwTokens = (params.question.expectedKeywords || []).flatMap(cleanTokens);
  const allTopicKeywords = Array.from(new Set([...questionKeywords, ...expectedKwTokens]));

  const matchedExpected = (params.question.expectedKeywords || []).filter((kw) =>
    lowerAnswer.includes(kw.toLowerCase())
  );
  const matchedTopicTokens = allTopicKeywords.filter((kw) => lowerAnswer.includes(kw));

  // Check if answer mentions experience with the topic e.g. "Yes, I have used React for about one year"
  const hasAffirmativeExperience =
    /\b(yes|familiar|experience|worked with|used|built|developed|implemented|learning|started)\b/i.test(
      lowerAnswer
    ) && (matchedTopicTokens.length > 0 || matchedExpected.length > 0);

  // If word count >= 5 and ZERO overlap with question or expected keywords, reject as irrelevant
  const isOffTopic =
    matchedExpected.length === 0 &&
    matchedTopicTokens.length === 0 &&
    !hasAffirmativeExperience &&
    wordCount >= 5;

  if (isOffTopic) {
    return {
      questionId: params.question.id,
      question: params.question.question,
      userAnswer: params.userAnswer,
      isValidAnswer: false,
      validationMessage:
        "Your answer doesn't address the interview question. Please provide a relevant answer.",
      score: 0,
      strengths: [],
      weaknesses: [
        "The submitted response was completely unrelated to the interview question being asked.",
      ],
      idealAnswer:
        params.question.sampleAnswer ||
        "A relevant answer addresses the specific technical mechanisms, concepts, or scenarios presented in the question.",
      isDemo: true,
    };
  }

  // 5. Valid Relevant Answer Scoring
  let score = 65;
  if (wordCount >= 25) score += 8;
  if (wordCount >= 60) score += 7;
  if (matchedExpected.length >= 1) score += 8;
  if (matchedExpected.length >= 3) score += 7;
  if (
    lowerAnswer.includes("because") ||
    lowerAnswer.includes("for example") ||
    lowerAnswer.includes("trade-off") ||
    lowerAnswer.includes("architecture")
  ) {
    score += 5;
  }
  score = Math.min(Math.max(score, 50), 96);

  const strengths: string[] = [];
  if (matchedExpected.length > 0) {
    strengths.push(`Directly referenced key concepts: ${matchedExpected.join(", ")}.`);
  } else if (matchedTopicTokens.length > 0) {
    strengths.push(`Addressed core topic terminology: ${matchedTopicTokens.slice(0, 3).join(", ")}.`);
  } else {
    strengths.push("Provided a coherent initial perspective on the problem.");
  }
  if (wordCount > 40) {
    strengths.push("Good descriptive depth and willingness to elaborate on implementation details.");
  } else {
    strengths.push("Concise and direct response.");
  }

  const weaknesses: string[] = [];
  const missingKeywords = (params.question.expectedKeywords || []).filter(
    (kw) => !lowerAnswer.includes(kw.toLowerCase())
  );
  if (missingKeywords.length > 0) {
    weaknesses.push(
      `Could have strengthened the response by incorporating: ${missingKeywords.slice(0, 3).join(", ")}.`
    );
  }
  if (
    !lowerAnswer.includes("%") &&
    !lowerAnswer.includes("ms") &&
    !lowerAnswer.includes("metric") &&
    !lowerAnswer.includes("latency")
  ) {
    weaknesses.push(
      "Add quantifiable metrics (e.g. % latency reduction, throughput, user scale) to demonstrate concrete business impact."
    );
  }

  return {
    questionId: params.question.id,
    question: params.question.question,
    userAnswer: params.userAnswer,
    isValidAnswer: true,
    score,
    strengths,
    weaknesses,
    idealAnswer:
      params.question.sampleAnswer ||
      "A top-tier answer addresses the core mechanism, explicitly discusses operational trade-offs, and provides quantifiable outcomes.",
    starCompliance: isBehavioral
      ? {
          situation: "Context established",
          task: "Clear objective defined",
          action: "Specific architectural or personal action taken",
          result: "Quantifiable outcome highlighted",
          score: Math.min(score + 4, 98),
        }
      : undefined,
    isDemo: true,
  };
}

export function generateDemoInterviewReport(
  params: GenerateInterviewReportParams
): InterviewFinalReport {
  const evaluations = params.evaluations;
  const avgScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length
        )
      : 78;

  let grade: InterviewFinalReport["grade"] = "Senior Hire";
  if (avgScore >= 90) grade = "Staff / Principal Ready";
  else if (avgScore >= 78) grade = "Senior Hire";
  else if (avgScore >= 65) grade = "Mid-Level Hire";
  else grade = "Borderline / Needs Practice";

  const questionBreakdowns = evaluations.map((ev) => ({
    questionId: ev.questionId,
    question: ev.question,
    userAnswer: ev.userAnswer,
    score: ev.score,
    feedback: ev.weaknesses.join(". ") || "Well articulated response.",
    betterAlternative: ev.idealAnswer,
  }));

  return {
    overallScore: avgScore,
    grade,
    categoryScores: {
      technicalProficiency: Math.min(Math.round(avgScore * 1.02), 98),
      communicationClarity: Math.min(Math.round(avgScore * 0.98), 95),
      problemSolving: Math.min(Math.round(avgScore * 0.95), 96),
      cultureAndSTAR: Math.min(Math.round(avgScore * 1.01), 97),
    },
    keyStrengths: [
      "Clear technical communication and structured problem decomposition",
      "Demonstrated familiarity with industry best practices and core architectural patterns",
      "Proactive consideration of edge cases and user impact",
    ],
    criticalImprovements: [
      "Incorporate more quantified metrics ($ saved, % latency improvement) into STAR behavioral responses",
      "Elaborate further on distributed failure modes and automated fallback mechanisms",
      "Discuss alternative architectural trade-offs before settling on a single solution",
    ],
    detailedFeedback: `The candidate completed a comprehensive mock interview evaluation for the ${params.role} (${params.difficulty} level) track. Overall performance is calibrated at ${grade} tier. Across all questions, the candidate articulated coherent logic and demonstrated strong command of engineering fundamentals. Focusing on deeper trade-off comparisons and metric quantification will elevate interview performance to top-tier percentile.`,
    readinessRecommendation:
      avgScore >= 75
        ? `Ready for Tier-1 onsite technical rounds. Fine-tune system design trade-off storytelling to maximize Staff/Lead level offers.`
        : `Recommended to practice 2-3 additional mock sessions with emphasis on the STAR framework and concrete technical benchmarks.`,
    questionBreakdowns,
    completedAt: new Date().toISOString(),
    isDemo: true,
  };
}
