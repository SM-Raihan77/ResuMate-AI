/**
 * Free tier resource limits for ResuMate AI.
 * Centralized source of truth.
 */
export const FREE_LIMITS = {
  resumes: 3,
  analyses: 3,
  interviews: 3,
} as const;

export type FeatureType = "resume" | "analysis" | "interview";

export const FEATURE_LABELS: Record<FeatureType, string> = {
  resume: "Resumes",
  analysis: "Resume Analyses",
  interview: "Mock Interview Sessions",
};

export class PremiumRequiredError extends Error {
  public readonly code = "PREMIUM_REQUIRED";
  public readonly feature: FeatureType;
  public readonly limit: number;

  constructor(feature: FeatureType, message?: string) {
    const limit = FREE_LIMITS[feature === "resume" ? "resumes" : feature === "analysis" ? "analyses" : "interviews"];
    super(
      message ||
        `You have reached your free limit of ${limit} ${FEATURE_LABELS[feature]}. Upgrade to Premium for unlimited access.`
    );
    this.name = "PremiumRequiredError";
    this.feature = feature;
    this.limit = limit;
  }
}
