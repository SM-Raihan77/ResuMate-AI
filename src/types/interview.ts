export type InterviewType = "technical" | "behavioral" | "system-design" | "mixed";

export type InterviewDifficulty = "junior" | "mid" | "senior" | "lead";

export interface InterviewQuestion {
  id: string;
  question: string;
  category: "technical" | "behavioral" | "system-design" | "situational";
  expectedKeywords: string[];
  context?: string;
  hint?: string;
  sampleAnswer?: string;
}

export interface StarCompliance {
  situation: string;
  task: string;
  action: string;
  result: string;
  score: number;
}

export interface InterviewAnswerEvaluation {
  questionId: string;
  question: string;
  userAnswer: string;
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
  starCompliance?: StarCompliance;
  isDemo?: boolean;
}

export interface InterviewCategoryScores {
  technicalProficiency: number;
  communicationClarity: number;
  problemSolving: number;
  cultureAndSTAR: number;
}

export interface QuestionBreakdownItem {
  questionId: string;
  question: string;
  userAnswer: string;
  score: number;
  feedback: string;
  betterAlternative: string;
}

export interface InterviewFinalReport {
  overallScore: number;
  grade: "Staff / Principal Ready" | "Senior Hire" | "Mid-Level Hire" | "Borderline / Needs Practice";
  categoryScores: InterviewCategoryScores;
  keyStrengths: string[];
  criticalImprovements: string[];
  detailedFeedback: string;
  readinessRecommendation: string;
  questionBreakdowns: QuestionBreakdownItem[];
  completedAt: string;
  isDemo?: boolean;
}

export interface GenerateQuestionsRequest {
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  questionCount?: number;
  jobDescription?: string;
  resumeText?: string;
  resumeId?: string;
  userId?: string;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  sessionId?: string;
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  questions: InterviewQuestion[];
  isDemo: boolean;
}

export interface EvaluateAnswerRequest {
  question: InterviewQuestion;
  userAnswer: string;
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  sessionId?: string;
  questionIndex?: number;
}

export interface EvaluateAnswerResponse {
  success: boolean;
  evaluation: InterviewAnswerEvaluation;
}

export interface GenerateInterviewReportRequest {
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  evaluations: InterviewAnswerEvaluation[];
  sessionId?: string;
  userId?: string;
}

export interface GenerateInterviewReportResponse {
  success: boolean;
  sessionId?: string;
  report: InterviewFinalReport;
}

export interface InterviewSessionSummary {
  id: string;
  userId: string;
  resumeId?: string | null;
  role: string;
  difficulty: string;
  interviewType: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  totalQuestions: number;
  overallScore?: number | null;
  grade?: string | null;
  createdAt: string;
  updatedAt: string;
}

