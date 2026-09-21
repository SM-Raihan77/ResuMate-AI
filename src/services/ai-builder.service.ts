/**
 * Client-side service for AI-powered resume enhancement utilities.
 */

export interface AISummaryResponse {
  success: boolean;
  suggestions: string[];
  error?: string;
}

export interface AIBulletResponse {
  success: boolean;
  improved: string;
  alternatives: string[];
  error?: string;
}

export interface AISkillCategoriesResponse {
  success: boolean;
  categories: { categoryName: string; skills: string[] }[];
  error?: string;
}

export class AIBuilderService {
  /**
   * Enhances a professional summary draft with high-impact phrasing and ATS keywords.
   */
  static async enhanceSummary(
    jobTitle: string,
    currentSummary: string
  ): Promise<AISummaryResponse> {
    try {
      const res = await fetch("/api/builder/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance-summary",
          payload: { jobTitle, currentSummary },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to enhance summary.");
      return { success: true, suggestions: data.suggestions || [] };
    } catch (err: any) {
      console.error("AIBuilderService.enhanceSummary error:", err);
      return {
        success: false,
        suggestions: [],
        error: err.message || "Failed to connect to AI engine.",
      };
    }
  }

  /**
   * Optimizes a raw bullet point into a quantified Google XYZ formula achievement.
   */
  static async rewriteBullet(
    rawBullet: string,
    role: string,
    company?: string
  ): Promise<AIBulletResponse> {
    try {
      const res = await fetch("/api/builder/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rewrite-bullet",
          payload: { rawBullet, role, company },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rewrite bullet.");
      return {
        success: true,
        improved: data.improved || rawBullet,
        alternatives: data.alternatives || [],
      };
    } catch (err: any) {
      console.error("AIBuilderService.rewriteBullet error:", err);
      return {
        success: false,
        improved: rawBullet,
        alternatives: [],
        error: err.message || "Failed to connect to AI engine.",
      };
    }
  }

  /**
   * Recommends high-demand ATS skills for a chosen role.
   */
  static async suggestSkills(jobTitle: string): Promise<AISkillCategoriesResponse> {
    try {
      const res = await fetch("/api/builder/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest-skills",
          payload: { jobTitle },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to suggest skills.");
      return { success: true, categories: data.categories || [] };
    } catch (err: any) {
      console.error("AIBuilderService.suggestSkills error:", err);
      return {
        success: false,
        categories: [],
        error: err.message || "Failed to connect to AI engine.",
      };
    }
  }
}
