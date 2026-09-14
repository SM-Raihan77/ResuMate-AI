import z from "zod";

export const optionalString = z.string().trim().optional();

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});
export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file!",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 2,
      "File must be less than 2MB!",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

// ── Interview validation schemas ───────────────────────────────────────────────

const interviewDifficultyEnum = z.enum(["junior", "mid", "senior", "lead"]);
const interviewTypeEnum = z.enum([
  "technical",
  "behavioral",
  "system-design",
  "mixed",
]);

export const generateQuestionsSchema = z.object({
  role: z.string().trim().min(1, "Job role is required"),
  difficulty: interviewDifficultyEnum.optional().default("senior"),
  interviewType: interviewTypeEnum.optional().default("mixed"),
  questionCount: z.number().int().min(3).max(10).optional().default(5),
  jobDescription: z.string().trim().optional(),
  resumeText: z.string().trim().optional(),
  resumeId: z.string().optional(),
});

const interviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.enum(["technical", "behavioral", "system-design", "situational"]),
  expectedKeywords: z.array(z.string()).optional().default([]),
  context: z.string().optional(),
  hint: z.string().optional(),
  sampleAnswer: z.string().optional(),
});

export const evaluateAnswerSchema = z.object({
  question: interviewQuestionSchema,
  userAnswer: z.string().trim().min(2, "Please provide a more substantive answer"),
  role: z.string().optional().default("Software Engineer"),
  difficulty: interviewDifficultyEnum.optional().default("senior"),
  interviewType: interviewTypeEnum.optional().default("technical"),
  sessionId: z.string().optional(),
  questionIndex: z.number().int().optional(),
});

const evaluationItemSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  userAnswer: z.string(),
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  idealAnswer: z.string(),
  starCompliance: z
    .object({
      situation: z.string(),
      task: z.string(),
      action: z.string(),
      result: z.string(),
      score: z.number(),
    })
    .optional(),
  isDemo: z.boolean().optional(),
});

export const generateFinalReportSchema = z.object({
  role: z.string().optional().default("Software Engineer"),
  difficulty: interviewDifficultyEnum.optional().default("senior"),
  interviewType: interviewTypeEnum.optional().default("mixed"),
  evaluations: z.array(evaluationItemSchema).min(1, "At least one evaluation is required"),
  sessionId: z.string().optional(),
});
