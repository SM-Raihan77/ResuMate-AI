export interface ScoreBreakdown {
  keywordMatch: number;
  formattingQuality: number;
  experienceRelevance: number;
}

export interface BulletPointRewrite {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeAnalysisResult {
  id?: string;
  resumeId?: string;
  userId?: string;
  atsScore: number;
  scoreBreakdown: ScoreBreakdown;
  missingKeywords: string[];
  formattingIssues: string[];
  bulletPointRewrites: BulletPointRewrite[];
  overallFeedback: string;
  matchedKeywords?: string[];
  keyStrengths?: string[];
  targetRoleIdentified?: string;
  detectedExperienceLevel?: string;
  analyzedAt?: string;
  createdAt?: string;
  isDemo?: boolean;
}

export interface AnalyzeResumeRequest {
  resumeId?: string;
  resumeText?: string;
  jobDescription?: string;
  title?: string;
}

