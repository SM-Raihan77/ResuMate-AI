import {
  DashboardStats,
  ResumeDocument,
  AnalyticsDataPoint,
  InterviewHistoryItem,
  AIFeedbackPoint,
  CareerMilestone,
  SkillGapItem,
} from "@/types/dashboard";
import { ResumeAnalysisResult } from "@/types/analyzer";
import { InterviewFinalReport, InterviewDifficulty, InterviewType } from "@/types/interview";
import {
  initialDashboardStats,
  sampleResumes,
  initialAnalyticsData,
  sampleInterviewHistory,
  sampleAIFeedbackPoints,
  initialCareerMilestones,
  sampleSkillGaps,
} from "./dashboard-data";

export const RESUMATE_DATA_UPDATE_EVENT = "resumate:data-updated";

// Storage keys
const STORAGE_KEYS = {
  RESUMES: "resumate_real_resumes",
  INTERVIEWS: "resumate_real_interviews",
  MILESTONES: "resumate_real_milestones",
  ACTIVE_RESUME_ID: "resumate_active_resume_id",
  TARGET_ROLE: "resumate_target_role",
};

/**
 * Dispatches a window event so all active components across tabs and pages re-sync immediately.
 */
export function notifyDataUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(RESUMATE_DATA_UPDATE_EVENT));
  }
}

// ----------------------------------------------------------------------
// 1. Resumes Storage & Helpers
// ----------------------------------------------------------------------

export function getStoredResumes(): ResumeDocument[] {
  if (typeof window === "undefined") return sampleResumes;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESUMES);
    if (!raw) {
      // Seed with initial sample resumes if empty
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(sampleResumes));
      return sampleResumes;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleResumes;
  } catch (err) {
    console.error("Error reading resumes from localStorage:", err);
    return sampleResumes;
  }
}

export function saveStoredResumes(resumes: ResumeDocument[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
    notifyDataUpdated();
  } catch (err) {
    console.error("Error saving resumes to localStorage:", err);
  }
}

export function saveResumeFromAnalysis(
  analysis: ResumeAnalysisResult,
  fileName: string,
  fileSizeStr?: string,
  rawResumeText?: string
): ResumeDocument {
  const existing = getStoredResumes();
  const id = `res-${Date.now()}`;

  // Extract experience highlights if available or synthesize from rewrites
  const highlights =
    analysis.bulletPointRewrites && analysis.bulletPointRewrites.length > 0
      ? analysis.bulletPointRewrites.slice(0, 3).map((b) => b.improved)
      : [
          "Engineered high-performance web systems and automated CI/CD workflows.",
          "Collaborated across cross-functional product and engineering teams to deliver features on schedule.",
        ];

  const role = analysis.targetRoleIdentified || "Software Engineer";

  const newDoc: ResumeDocument = {
    id,
    title: fileName || `Resume_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`,
    targetRole: role,
    lastUpdated: "Analyzed just now",
    atsScore: analysis.atsScore || 75,
    fileName: fileName || "Resume.pdf",
    fileSize: fileSizeStr || "120 KB",
    matchedKeywords: analysis.matchedKeywords || [],
    missingKeywords: analysis.missingKeywords || [],
    summary:
      analysis.overallFeedback ||
      `Dedicated ${role} focused on delivering reliable, scalable systems and exceptional candidate performance.`,
    experienceSnippet: [
      {
        role: role,
        company: "Verified Experience",
        period: "Recent",
        highlights,
      },
    ],
    skills: analysis.matchedKeywords || [],
    education: {
      degree: analysis.detectedExperienceLevel || "Professional Degree",
      school: "Accredited University",
      year: new Date().getFullYear().toString(),
    },
  };

  const updated = [newDoc, ...existing.filter((r) => r.title !== newDoc.title)];
  saveStoredResumes(updated);
  setActiveResumeId(id);
  return newDoc;
}

export function getActiveResumeId(): string {
  if (typeof window === "undefined") return sampleResumes[0]?.id || "res-01";
  const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_RESUME_ID);
  if (id) return id;
  const resumes = getStoredResumes();
  return resumes[0]?.id || "res-01";
}

export function setActiveResumeId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_RESUME_ID, id);
  notifyDataUpdated();
}

// ----------------------------------------------------------------------
// 2. Interview History Storage & Helpers
// ----------------------------------------------------------------------

export function getStoredInterviews(): InterviewHistoryItem[] {
  if (typeof window === "undefined") return sampleInterviewHistory;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(sampleInterviewHistory));
      return sampleInterviewHistory;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : sampleInterviewHistory;
  } catch (err) {
    console.error("Error reading interviews from localStorage:", err);
    return sampleInterviewHistory;
  }
}

export function saveStoredInterviews(interviews: InterviewHistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
    notifyDataUpdated();
  } catch (err) {
    console.error("Error saving interviews to localStorage:", err);
  }
}

export function saveCompletedInterviewReport(
  report: InterviewFinalReport,
  role: string,
  difficulty: InterviewDifficulty,
  interviewType: InterviewType,
  durationMinutes: number = 20
): InterviewHistoryItem {
  const existing = getStoredInterviews();
  const id = `int-${Date.now()}`;

  const keyStrength =
    report.keyStrengths && report.keyStrengths.length > 0
      ? report.keyStrengths[0]
      : "Demonstrated structured technical problem solving.";

  const keyImprovement =
    report.criticalImprovements && report.criticalImprovements.length > 0
      ? report.criticalImprovements[0]
      : "Continue practicing STAR quantified results.";

  const newItem: InterviewHistoryItem = {
    id,
    role: role || "Software Engineer",
    difficulty: difficulty || "senior",
    type: interviewType || "technical",
    score: report.overallScore || 80,
    completedAt: "Just now",
    durationMinutes: Math.max(durationMinutes, 5),
    questionCount: report.questionBreakdowns?.length || 5,
    keyStrength,
    keyImprovement,
    grade: report.grade || "Senior Hire Ready",
  };

  const updated = [newItem, ...existing];
  saveStoredInterviews(updated);
  return newItem;
}

// ----------------------------------------------------------------------
// 3. Career Milestones Storage & Helpers
// ----------------------------------------------------------------------

export function getStoredMilestones(): CareerMilestone[] {
  if (typeof window === "undefined") return initialCareerMilestones;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(initialCareerMilestones));
      return initialCareerMilestones;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCareerMilestones;
  } catch (err) {
    console.error("Error reading milestones from localStorage:", err);
    return initialCareerMilestones;
  }
}

export function saveStoredMilestones(milestones: CareerMilestone[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
    notifyDataUpdated();
  } catch (err) {
    console.error("Error saving milestones to localStorage:", err);
  }
}

// ----------------------------------------------------------------------
// 4. Dynamic Metric Computation Engines (Real Data)
// ----------------------------------------------------------------------

/**
 * Dynamically computes high-level dashboard metrics from real resumes, interviews, and milestones.
 */
export function computeDashboardStats(
  resumes: ResumeDocument[],
  interviews: InterviewHistoryItem[],
  milestones: CareerMilestone[],
  activeResume?: ResumeDocument,
  defaultRole?: string
): DashboardStats {
  // 1. ATS Score: from active resume (or highest score)
  const currentResume = activeResume || resumes[0];
  const atsScore = currentResume ? currentResume.atsScore : 85;

  // Previous resume score change delta
  const previousScore = resumes.length > 1 ? resumes[1].atsScore : atsScore - 6;
  const atsScoreChange = Math.max(0, atsScore - previousScore);

  // 2. Interviews count
  const interviewsCompleted = interviews.length;
  const interviewsCompletedChange = Math.min(interviewsCompleted, 3);

  // 3. Average Interview Score
  const totalScore = interviews.reduce((acc, curr) => acc + curr.score, 0);
  const averageInterviewScore =
    interviews.length > 0 ? Math.round(totalScore / interviews.length) : 80;

  // Trend change (compare latest 3 vs previous)
  const latestAvg =
    interviews.slice(0, 3).reduce((acc, curr) => acc + curr.score, 0) /
    Math.max(1, Math.min(3, interviews.length));
  const olderAvg =
    interviews.slice(3).reduce((acc, curr) => acc + curr.score, 0) /
    Math.max(1, interviews.length - 3);
  const averageInterviewScoreChange =
    interviews.length >= 4 ? Math.max(0, Math.round(latestAvg - olderAvg)) : 8;

  // 4. Career Goal Progress
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalMilestones = Math.max(1, milestones.length);
  const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);

  // 5. Target Role & Readiness Level
  const targetRole = currentResume?.targetRole || defaultRole || initialDashboardStats.targetRole;

  let readinessLevel: DashboardStats["readinessLevel"] = "Interview Ready";
  const compositeScore = (atsScore + averageInterviewScore) / 2;
  if (compositeScore >= 90) {
    readinessLevel = "Staff / Principal Tier";
  } else if (compositeScore >= 80) {
    readinessLevel = "Senior Ready";
  } else if (compositeScore >= 70) {
    readinessLevel = "Interview Ready";
  } else {
    readinessLevel = "Emerging Candidate";
  }

  return {
    atsScore,
    atsScoreChange,
    interviewsCompleted,
    interviewsCompletedChange,
    averageInterviewScore,
    averageInterviewScoreChange,
    careerGoalProgress: milestoneProgress,
    careerGoalProgressChange: 5,
    targetRole,
    readinessLevel,
  };
}

/**
 * Dynamically computes Recharts analytics chart points from actual completed interview history.
 */
export function computeAnalyticsTrend(interviews: InterviewHistoryItem[]): AnalyticsDataPoint[] {
  if (!interviews || interviews.length === 0) {
    return initialAnalyticsData;
  }

  // Reverse to get chronological order (oldest to newest)
  const chronological = [...interviews].reverse().slice(-8);

  return chronological.map((item, idx) => {
    // Generate realistic sub-competency distribution centered around the real overall score
    const base = item.score;
    const technical = Math.min(100, Math.max(40, base + ((idx % 3) - 1) * 3));
    const communication = Math.min(100, Math.max(40, base - ((idx % 2) - 0) * 2));
    const problemSolving = Math.min(100, Math.max(40, base + ((idx % 4) - 2) * 2));

    const dateLabel = item.completedAt.includes("Today")
      ? "Today"
      : item.completedAt.includes("Yesterday")
      ? "Yesterday"
      : item.completedAt.includes("Just now")
      ? "Latest"
      : item.completedAt.split(" at ")[0] || `Session #${idx + 1}`;

    return {
      date: dateLabel,
      overall: base,
      technical,
      communication,
      problemSolving,
      sessionName: `${item.role} (${item.type})`,
    };
  });
}

/**
 * Dynamically synthesizes strengths and improvement areas from the user's active resume and interview reports.
 */
export function computeDynamicAIFeedback(
  activeResume?: ResumeDocument,
  interviews?: InterviewHistoryItem[]
): AIFeedbackPoint[] {
  const points: AIFeedbackPoint[] = [];

  // 1. Resume Strengths
  if (activeResume && activeResume.matchedKeywords && activeResume.matchedKeywords.length > 0) {
    const topKeywords = activeResume.matchedKeywords.slice(0, 4).join(", ");
    points.push({
      id: "fb-res-strength",
      type: "strength",
      category: "Resume & Keywords",
      title: `ATS Keyword Match in Core Stack`,
      description: `Your resume shows strong automated keyword density for ${topKeywords}, scoring in the top tier for recruiter screening algorithms.`,
      actionableTip: `Keep these terms prominent in your executive summary and top bullet points.`,
      impactBadge: "High Impact",
    });
  }

  // 2. Interview Strengths
  if (interviews && interviews.length > 0) {
    const latest = interviews[0];
    points.push({
      id: "fb-int-strength",
      type: "strength",
      category: latest.type === "behavioral" ? "STAR Communication" : "Technical Depth",
      title: `Demonstrated Mastery in ${latest.role}`,
      description: latest.keyStrength || "Strong technical and architectural explanations provided during mock simulations.",
      actionableTip: "Continue referencing real architectural metrics and business outcomes in initial screening calls.",
      impactBadge: "High Impact",
    });
  }

  // 3. Resume Missing Keywords / Improvements
  if (activeResume && activeResume.missingKeywords && activeResume.missingKeywords.length > 0) {
    const missing = activeResume.missingKeywords.slice(0, 3).join(", ");
    points.push({
      id: "fb-res-gap",
      type: "improvement",
      category: "Resume & Keywords",
      title: `Incorporate Missing High-Demand Skills`,
      description: `Your resume is missing high-signal ATS keywords: ${missing}. Adding these will boost your pass rate for Tier-1 applicant tracking systems.`,
      actionableTip: `Click "AI Optimize" to let Gemini integrate these into your experience bullets automatically.`,
      impactBadge: "Quick Win",
    });
  }

  // 4. Interview Critical Improvement
  if (interviews && interviews.length > 0) {
    const latest = interviews[0];
    points.push({
      id: "fb-int-gap",
      type: "improvement",
      category: "System Architecture",
      title: `Elevate Response Depth in ${latest.type.toUpperCase()}`,
      description: latest.keyImprovement || "Elaborate more on trade-offs and edge-case failure modes during technical evaluations.",
      actionableTip: "Structure responses with the STAR method and explicitly state latency or scale trade-offs.",
      impactBadge: "Critical",
    });
  }

  // Fallback to sample feedback points if sparse
  if (points.length < 2) {
    return sampleAIFeedbackPoints;
  }

  return points;
}

/**
 * Dynamically computes skill gaps from missing resume keywords and interview areas.
 */
export function computeDynamicSkillGaps(activeResume?: ResumeDocument): SkillGapItem[] {
  if (activeResume && activeResume.missingKeywords && activeResume.missingKeywords.length > 0) {
    return activeResume.missingKeywords.map((kw, i) => {
      const categories: SkillGapItem["category"][] = [
        "Distributed Systems",
        "DevOps & Cloud",
        "Core Backend",
        "Frontend & Web",
      ];
      return {
        name: kw,
        category: categories[i % categories.length],
        marketDemandScore: 88 + (i % 8),
        status: i === 0 ? "Identified Gap" : "In Progress",
        recommendedCourseOrProject: `Build a production demo or study system design patterns featuring ${kw}.`,
      };
    });
  }

  return sampleSkillGaps;
}

/**
 * Reset all dashboard data back to initial sample state if requested.
 */
export function resetDashboardDataToSample() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(sampleResumes));
  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(sampleInterviewHistory));
  localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(initialCareerMilestones));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_RESUME_ID, sampleResumes[0].id);
  notifyDataUpdated();
}
