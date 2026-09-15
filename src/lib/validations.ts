import { z } from "zod";

export const optionalString = z.string().trim().optional();

export const generalInfoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file!"
    )
    .refine(
      (file) => !file || !(file instanceof File) || file.size <= 1024 * 1024 * 2,
      "File must be less than 2MB!"
    )
    .optional(),
  fullName: z.string().optional().or(z.literal("")),
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  photoUrl: z.string().optional().nullable(),
  summary: z.string().optional().or(z.literal("")),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const experienceItemSchema = z.object({
  id: z.string(),
  role: z.string().default(""),
  company: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
});

export const educationItemSchema = z.object({
  id: z.string(),
  degree: z.string().default(""),
  fieldOfStudy: z.string().default(""),
  institution: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  gpaOrHonors: z.string().optional(),
});

export const skillCategoryItemSchema = z.object({
  id: z.string(),
  categoryName: z.string().default(""),
  skills: z.array(z.string()).default([]),
});

export const projectItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  techStack: z.array(z.string()).default([]),
  link: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  issuer: z.string().default(""),
  issueDate: z.string().default(""),
  link: z.string().optional(),
});

export const resumeUpdateSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(300).optional().nullable(),
  fullName: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  experience: z.array(experienceItemSchema).optional(),
  education: z.array(educationItemSchema).optional(),
  skills: z.array(skillCategoryItemSchema).optional(),
  projects: z.array(projectItemSchema).optional(),
  certifications: z.array(certificationItemSchema).optional(),
  customSections: z.array(z.any()).optional(),
  template: z.enum(["modern", "minimalist", "executive"]).or(z.string()).optional().nullable(),
  accentColor: z.string().optional().nullable(),
  fontFamily: z.enum(["sans", "serif", "mono"]).or(z.string()).optional().nullable(),
  spacing: z.enum(["compact", "normal", "spacious"]).or(z.string()).optional().nullable(),
  colorHex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color").optional().nullable(),
  borderStyle: z.string().optional().nullable(),
  atsScore: z.number().int().min(0).max(100).optional().nullable(),
});

export type ResumeUpdateValues = z.infer<typeof resumeUpdateSchema>;

export const scoreBreakdownSchema = z.object({
  keywordMatch: z.number().min(0).max(100),
  formattingQuality: z.number().min(0).max(100),
  experienceRelevance: z.number().min(0).max(100),
});

export const bulletPointRewriteSchema = z.object({
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
});

export const resumeAnalysisResultSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  scoreBreakdown: scoreBreakdownSchema,
  missingKeywords: z.array(z.string()),
  matchedKeywords: z.array(z.string()).optional().default([]),
  formattingIssues: z.array(z.string()),
  bulletPointRewrites: z.array(bulletPointRewriteSchema),
  overallFeedback: z.string().optional().default(""),
  targetRoleIdentified: z.string().optional().nullable(),
  detectedExperienceLevel: z.string().optional().nullable(),
});

export const analyzeResumeSchema = z.object({
  resumeId: z.string().optional(),
  resumeText: z.string().optional(),
  jobDescription: z.string().optional(),
  title: z.string().max(100).optional(),
});

export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>;

// ── Interview validation schemas ───────────────────────────────────────────────

const interviewDifficultyEnum = z.enum(["junior", "mid", "senior", "lead"]);
const interviewTypeEnum = z.enum([
  "technical",
  "behavioral",
  "system-design",
  "mixed",
]);

export const generateQuestionsSchema = z.object({
  role: z.string().trim().min(1, "Job role is required").max(100),
  difficulty: interviewDifficultyEnum.optional().default("senior"),
  interviewType: interviewTypeEnum.optional().default("mixed"),
  questionCount: z.number().int().min(1).max(10).optional().default(5),
  jobDescription: z.string().max(10000).optional(),
  resumeText: z.string().max(20000).optional(),
  resumeId: z.string().optional(),
  userId: z.string().optional(),
});

export const interviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  category: z.enum(["technical", "behavioral", "system-design", "situational"]).optional().default("technical"),
  expectedKeywords: z.array(z.string()).optional().default([]),
  context: z.string().optional(),
  hint: z.string().optional(),
  sampleAnswer: z.string().optional(),
});

export const evaluateAnswerSchema = z.object({
  question: interviewQuestionSchema,
  userAnswer: z.string().trim().min(2, "Please provide a valid answer"),
  role: z.string().optional().default("Software Engineer"),
  difficulty: interviewDifficultyEnum.optional().default("senior"),
  interviewType: interviewTypeEnum.optional().default("mixed"),
  sessionId: z.string().optional(),
  questionIndex: z.number().int().min(0).optional(),
});

export const evaluationItemSchema = z.object({
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
  role: z.string().min(1).optional().default("Software Engineer"),
  difficulty: interviewDifficultyEnum.optional().default("senior"),
  interviewType: interviewTypeEnum.optional().default("mixed"),
  evaluations: z.array(evaluationItemSchema).min(1, "At least one evaluation is required"),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});
