import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysisResult } from "@/types/analyzer";
import {
  InterviewQuestion,
  InterviewAnswerEvaluation,
  InterviewFinalReport,
  InterviewType,
  InterviewDifficulty,
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

// ═══════════════════════════════════════════════════════════════════════════════
// Interview AI Functions
// ═══════════════════════════════════════════════════════════════════════════════

interface GenerateQuestionsParams {
  role: string;
  difficulty: string;
  interviewType: string;
  questionCount: number;
  jobDescription?: string;
  resumeText?: string;
}

/**
 * Generates calibrated interview questions using Gemini, or returns demo
 * questions when no API key is configured.
 */
export async function generateInterviewQuestionsWithGemini(
  params: GenerateQuestionsParams,
): Promise<{ questions: InterviewQuestion[]; isDemo: boolean }> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn(
      "No GEMINI_API_KEY found. Falling back to demo interview questions.",
    );
    return { questions: generateDemoQuestions(params), isDemo: true };
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a world-class technical interviewer and talent evaluator.
Generate exactly ${params.questionCount} interview questions for a "${params.role}" position.
Difficulty level: ${params.difficulty}. Interview type: ${params.interviewType}.
Each question must include a category (technical, behavioral, system-design, or situational),
expected keywords the candidate should mention, optional context/hint, and a sample ideal answer.
Return strictly valid JSON matching the requested structure.`;

  const prompt = `
Role: ${params.role}
Difficulty: ${params.difficulty}
Interview Type: ${params.interviewType}
Number of Questions: ${params.questionCount}
${params.jobDescription ? `\nJob Description:\n"""\n${params.jobDescription.slice(0, 5000)}\n"""` : ""}
${params.resumeText ? `\nCandidate Resume:\n"""\n${params.resumeText.slice(0, 5000)}\n"""` : ""}

Generate the interview questions now.`;

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
                  category: { type: Type.STRING },
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
    return { questions: parsed.questions ?? [], isDemo: false };
  } catch (error: any) {
    console.error("Gemini generateInterviewQuestions error:", error);
    return { questions: generateDemoQuestions(params), isDemo: true };
  }
}

function generateDemoQuestions(
  params: GenerateQuestionsParams,
): InterviewQuestion[] {
  const role = params.role || "Software Engineer";
  const technicalQs: InterviewQuestion[] = [
    {
      id: "demo-q1",
      question: `Describe how you would design a scalable REST API for a ${role} role. What patterns and technologies would you use?`,
      category: "technical",
      expectedKeywords: ["REST", "scalability", "caching", "load balancing", "API gateway"],
      hint: "Think about request routing, caching layers, and horizontal scaling.",
      sampleAnswer: "I would design RESTful endpoints following OpenAPI specifications, implement caching with Redis, use an API gateway for rate limiting, and deploy behind a load balancer for horizontal scaling.",
    },
    {
      id: "demo-q2",
      question: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
      category: "technical",
      expectedKeywords: ["relational", "schema", "ACID", "document store", "scalability"],
      hint: "Consider data structure, consistency requirements, and query patterns.",
      sampleAnswer: "SQL databases enforce schemas and ACID compliance, ideal for structured relational data. NoSQL databases offer flexible schemas and horizontal scalability, suited for unstructured data or high-throughput scenarios.",
    },
  ];

  const behavioralQs: InterviewQuestion[] = [
    {
      id: "demo-q3",
      question: "Tell me about a time you had to resolve a conflict within your team. What was the outcome?",
      category: "behavioral",
      expectedKeywords: ["conflict resolution", "communication", "empathy", "outcome", "collaboration"],
      hint: "Use the STAR method: Situation, Task, Action, Result.",
      sampleAnswer: "In a previous project, two team members disagreed on the tech stack. I facilitated a structured discussion where each presented pros/cons, and we agreed on a compromise that satisfied both parties and delivered the project on time.",
    },
    {
      id: "demo-q4",
      question: "Describe a situation where you had to learn a new technology quickly to meet a deadline.",
      category: "behavioral",
      expectedKeywords: ["learning", "adaptability", "deadline", "self-study", "delivery"],
      hint: "Focus on your learning strategy and how you applied the new knowledge.",
      sampleAnswer: "When our team adopted Kubernetes mid-sprint, I spent evenings studying the documentation, set up a local cluster, and within a week had containerized our main service, meeting our deployment deadline.",
    },
  ];

  const systemDesignQs: InterviewQuestion[] = [
    {
      id: "demo-q5",
      question: "How would you design a real-time notification system that handles millions of users?",
      category: "system-design",
      expectedKeywords: ["WebSocket", "pub/sub", "message queue", "scalability", "fan-out"],
      hint: "Consider push vs. pull models, message queuing, and delivery guarantees.",
      sampleAnswer: "I'd use WebSocket connections for real-time delivery, backed by a pub/sub system like Kafka for fan-out. A message queue ensures delivery guarantees, and connection state is managed via Redis for horizontal scaling.",
    },
  ];

  const allQuestions = [...technicalQs, ...behavioralQs, ...systemDesignQs];
  return allQuestions.slice(0, params.questionCount);
}

// ─────────────────────────────────────────────────────────────────────────────

interface EvaluateAnswerParams {
  question: InterviewQuestion;
  userAnswer: string;
  role: string;
  difficulty: string;
  interviewType: string;
}

/**
 * Evaluates a candidate's answer to an interview question using Gemini,
 * or returns a heuristic demo evaluation when no API key is configured.
 */
export async function evaluateInterviewAnswerWithGemini(
  params: EvaluateAnswerParams,
): Promise<InterviewAnswerEvaluation> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Falling back to demo evaluation.");
    return generateDemoEvaluation(params);
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a senior technical interview evaluator. Score the candidate's answer from 0 to 100.
Identify specific strengths and weaknesses. Provide an ideal answer.
If the question is behavioral, also evaluate STAR compliance (Situation, Task, Action, Result) with a sub-score 0-100.
Be fair but rigorous. Return strictly valid JSON.`;

  const prompt = `
Role: ${params.role} | Difficulty: ${params.difficulty} | Type: ${params.interviewType}

Question: "${params.question.question}"
Category: ${params.question.category}
Expected keywords: ${params.question.expectedKeywords.join(", ")}

Candidate's Answer:
"""
${params.userAnswer.slice(0, 5000)}
"""

Evaluate this answer now.`;

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
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
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
          required: ["score", "strengths", "weaknesses", "idealAnswer"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      questionId: params.question.id,
      question: params.question.question,
      userAnswer: params.userAnswer,
      score: parsed.score ?? 50,
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      idealAnswer: parsed.idealAnswer ?? "",
      starCompliance: parsed.starCompliance,
      isDemo: false,
    };
  } catch (error: any) {
    console.error("Gemini evaluateInterviewAnswer error:", error);
    return generateDemoEvaluation(params);
  }
}

function generateDemoEvaluation(
  params: EvaluateAnswerParams,
): InterviewAnswerEvaluation {
  const answer = params.userAnswer.toLowerCase();
  const keywords = params.question.expectedKeywords || [];
  const matched = keywords.filter((kw) =>
    answer.includes(kw.toLowerCase()),
  );
  const matchRatio = keywords.length > 0 ? matched.length / keywords.length : 0.5;

  const wordCount = params.userAnswer.split(/\s+/).length;
  let score = Math.round(40 + matchRatio * 40);
  if (wordCount > 50) score += 8;
  if (wordCount > 100) score += 7;
  score = Math.min(score, 95);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (matched.length > 0) {
    strengths.push(`Mentioned relevant keywords: ${matched.join(", ")}`);
  }
  if (wordCount > 50) {
    strengths.push("Provided a detailed response with good depth");
  }
  if (matched.length < keywords.length) {
    const missing = keywords.filter((kw) => !answer.includes(kw.toLowerCase()));
    weaknesses.push(`Missing key concepts: ${missing.slice(0, 3).join(", ")}`);
  }
  if (wordCount < 30) {
    weaknesses.push("Answer could be more detailed and specific");
  }

  if (strengths.length === 0) strengths.push("Attempted to address the question");
  if (weaknesses.length === 0) weaknesses.push("Could include more concrete examples");

  return {
    questionId: params.question.id,
    question: params.question.question,
    userAnswer: params.userAnswer,
    score,
    strengths,
    weaknesses,
    idealAnswer:
      params.question.sampleAnswer ||
      "A strong answer would include specific examples, relevant technical details, and quantifiable outcomes.",
    starCompliance:
      params.question.category === "behavioral"
        ? {
            situation: wordCount > 20 ? "Partially described" : "Not clearly stated",
            task: "Could be more specific",
            action: matched.length > 0 ? "Some relevant actions mentioned" : "Actions unclear",
            result: "Quantifiable results would strengthen the answer",
            score: Math.round(score * 0.8),
          }
        : undefined,
    isDemo: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

interface GenerateReportParams {
  role: string;
  difficulty: string;
  interviewType: string;
  evaluations: InterviewAnswerEvaluation[];
}

/**
 * Generates an aggregate final interview report using Gemini, or computes
 * a demo report from the provided evaluations when no API key is configured.
 */
export async function generateInterviewReportWithGemini(
  params: GenerateReportParams,
): Promise<InterviewFinalReport> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Falling back to demo report.");
    return generateDemoReport(params);
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a senior interview panel chair producing a final assessment report.
Aggregate the per-question evaluations into an overall report with:
- overallScore (0-100), grade, categoryScores, keyStrengths, criticalImprovements,
  detailedFeedback, readinessRecommendation, and per-question breakdowns.
Grade mapping: 90-100 = "Staff / Principal Ready", 75-89 = "Senior Hire",
60-74 = "Mid-Level Hire", below 60 = "Borderline / Needs Practice".
Return strictly valid JSON.`;

  const evaluationsSummary = params.evaluations
    .map(
      (e, i) =>
        `Q${i + 1}: "${e.question}" — Score: ${e.score}/100\nAnswer: "${e.userAnswer.slice(0, 500)}"\nStrengths: ${e.strengths.join("; ")}\nWeaknesses: ${e.weaknesses.join("; ")}`,
    )
    .join("\n\n");

  const prompt = `
Role: ${params.role} | Difficulty: ${params.difficulty} | Type: ${params.interviewType}
Total Questions: ${params.evaluations.length}

Per-Question Evaluations:
${evaluationsSummary}

Generate the final aggregate interview report now.`;

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
            grade: { type: Type.STRING },
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
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            criticalImprovements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            detailedFeedback: { type: Type.STRING },
            readinessRecommendation: { type: Type.STRING },
            questionBreakdowns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  question: { type: Type.STRING },
                  userAnswer: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                  betterAlternative: { type: Type.STRING },
                },
                required: [
                  "questionId",
                  "question",
                  "userAnswer",
                  "score",
                  "feedback",
                  "betterAlternative",
                ],
              },
            },
          },
          required: [
            "overallScore",
            "grade",
            "categoryScores",
            "keyStrengths",
            "criticalImprovements",
            "detailedFeedback",
            "readinessRecommendation",
            "questionBreakdowns",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      ...parsed,
      completedAt: new Date().toISOString(),
      isDemo: false,
    };
  } catch (error: any) {
    console.error("Gemini generateInterviewReport error:", error);
    return generateDemoReport(params);
  }
}

function generateDemoReport(
  params: GenerateReportParams,
): InterviewFinalReport {
  const evaluations = params.evaluations;
  const avgScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((sum, e) => sum + e.score, 0) /
            evaluations.length,
        )
      : 50;

  let grade: InterviewFinalReport["grade"];
  if (avgScore >= 90) grade = "Staff / Principal Ready";
  else if (avgScore >= 75) grade = "Senior Hire";
  else if (avgScore >= 60) grade = "Mid-Level Hire";
  else grade = "Borderline / Needs Practice";

  const allStrengths = evaluations.flatMap((e) => e.strengths);
  const allWeaknesses = evaluations.flatMap((e) => e.weaknesses);

  return {
    overallScore: avgScore,
    grade,
    categoryScores: {
      technicalProficiency: Math.min(Math.round(avgScore * 1.05), 100),
      communicationClarity: Math.min(Math.round(avgScore * 0.95), 100),
      problemSolving: Math.min(Math.round(avgScore * 1.0), 100),
      cultureAndSTAR: Math.min(Math.round(avgScore * 0.9), 100),
    },
    keyStrengths: [...new Set(allStrengths)].slice(0, 4),
    criticalImprovements: [...new Set(allWeaknesses)].slice(0, 4),
    detailedFeedback: `Based on ${evaluations.length} evaluated answers, the candidate achieved an average score of ${avgScore}/100. ${avgScore >= 75 ? "The candidate demonstrates strong competency and is recommended for further rounds." : "The candidate shows potential but should focus on the improvement areas identified."}`,
    readinessRecommendation:
      avgScore >= 80
        ? "Ready for final round interviews. Strong candidate with demonstrated expertise."
        : avgScore >= 60
          ? "Consider for next round with targeted follow-up on weak areas."
          : "Recommend additional preparation before re-interviewing. Focus on fundamentals.",
    questionBreakdowns: evaluations.map((e) => ({
      questionId: e.questionId,
      question: e.question,
      userAnswer: e.userAnswer,
      score: e.score,
      feedback:
        e.strengths.length > 0
          ? `Strengths: ${e.strengths[0]}. ${e.weaknesses.length > 0 ? `Areas to improve: ${e.weaknesses[0]}` : ""}`
          : "Review the ideal answer for guidance on improving this response.",
      betterAlternative:
        e.idealAnswer || "Provide specific examples with quantifiable outcomes.",
    })),
    completedAt: new Date().toISOString(),
    isDemo: true,
  };
}
