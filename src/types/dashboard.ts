export interface DashboardStats {
  atsScore: number;
  atsScoreChange: number; // e.g. +8
  interviewsCompleted: number;
  interviewsCompletedChange: number; // e.g. +3 this week
  averageInterviewScore: number;
  averageInterviewScoreChange: number; // e.g. +12%
  careerGoalProgress: number; // 0 - 100
  careerGoalProgressChange: number; // e.g. +5%
  targetRole: string;
  readinessLevel: "Emerging Candidate" | "Interview Ready" | "Senior Ready" | "Staff / Principal Tier";
  totalResumesCreated?: number;
  averageAtsScore?: number;
  activeResumesCount?: number;
  /** Highest individual interview score achieved — sourced from PostgreSQL aggregate query */
  peakInterviewScore?: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "resume" | "analysis" | "interview";
  link?: string;
}

export interface ResumeDocument {
  id: string;
  title: string;
  targetRole: string;
  lastUpdated: string;
  atsScore: number;
  fileName: string;
  fileSize: string;
  scoreBreakdown?: {
    keywordMatch: number;
    formattingQuality: number;
    experienceRelevance: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  summary: string;
  experienceSnippet: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }[];
  skills: string[];
  education: {
    degree: string;
    school: string;
    year: string;
  };
}

export interface AnalyticsDataPoint {
  date: string;
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
  sessionName: string;
}

export interface InterviewHistoryItem {
  id: string;
  role: string;
  difficulty: "junior" | "mid" | "senior" | "lead";
  type: "technical" | "behavioral" | "system-design" | "mixed";
  score: number;
  completedAt: string;
  durationMinutes: number;
  questionCount: number;
  keyStrength: string;
  keyImprovement: string;
  grade: string;
}

export interface AIFeedbackPoint {
  id: string;
  type: "strength" | "improvement";
  category: "Resume & Keywords" | "Technical Depth" | "STAR Communication" | "System Architecture";
  title: string;
  description: string;
  actionableTip: string;
  impactBadge: "High Impact" | "Quick Win" | "Critical";
}

export interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  category: "Resume" | "Interview" | "Portfolio" | "Coding" | "Networking";
  completed: boolean;
  dueDate?: string;
  weight: number; // weight contribution to overall progress
  resources?: { name: string; url: string }[];
}

export interface SkillGapItem {
  name: string;
  category: "Core Backend" | "Frontend & Web" | "Distributed Systems" | "DevOps & Cloud" | "Soft Skills";
  marketDemandScore: number; // 0 - 100
  status: "Acquired" | "In Progress" | "Identified Gap";
  recommendedCourseOrProject: string;
}

