"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ResumeBuilderState, INITIAL_RESUME_DATA } from "@/types/builder";
import { BuilderForm } from "./BuilderForm";
import { BuilderPreview } from "./BuilderPreview";
import { saveResumeFromAnalysis } from "@/lib/dashboard-store";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Eye,
  Edit3,
  Save,
  Cloud,
  Loader2,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "resumate_builder_state";

export function BuilderContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeIdParam = searchParams.get("resumeId");

  const { data: session } = useSession();

  const [activeResumeId, setActiveResumeId] = useState<string | null>(resumeIdParam);
  const [resumeTitle, setResumeTitle] = useState<string>("Alex Rivera — Resume");
  const [resumeData, setResumeData] = useState<ResumeBuilderState>(INITIAL_RESUME_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error" | "local">("idle");
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "info" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  const triggerToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      setNotification({ show: true, message, type });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
    },
    []
  );

  // Sync state from Database if resumeId is provided
  const fetchDatabaseResume = useCallback(
    async (id: string) => {
      setIsLoaded(false);
      try {
        const res = await fetch(`/api/resumes/${id}`);
        const data = await res.json();

        if (res.ok && data.success && data.resume) {
          const doc = data.resume;
          setResumeTitle(doc.title || "Untitled Resume");

          // Map database document to ResumeBuilderState
          const mapped: ResumeBuilderState = {
            personal: {
              fullName: doc.fullName || `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || doc.title || "Alex Rivera",
              jobTitle: doc.jobTitle || "Senior Full-Stack Engineer",
              email: doc.email || "",
              phone: doc.phone || "",
              location: doc.location || [doc.city, doc.country].filter(Boolean).join(", ") || "",
              website: doc.website || "",
              linkedin: doc.linkedin || "",
              github: doc.github || "",
              summary: doc.summary || "",
            },
            experience: Array.isArray(doc.experience) && doc.experience.length > 0 ? doc.experience : INITIAL_RESUME_DATA.experience,
            education: Array.isArray(doc.education) && doc.education.length > 0 ? doc.education : INITIAL_RESUME_DATA.education,
            skills: Array.isArray(doc.skills) && doc.skills.length > 0 ? doc.skills : INITIAL_RESUME_DATA.skills,
            projects: Array.isArray(doc.projects) && doc.projects.length > 0 ? doc.projects : INITIAL_RESUME_DATA.projects,
            certifications: Array.isArray(doc.certifications) && doc.certifications.length > 0 ? doc.certifications : INITIAL_RESUME_DATA.certifications,
            template: (doc.template as any) || "modern",
            accentColor: doc.accentColor || doc.colorHex || "#FFE600",
            fontFamily: (doc.fontFamily as any) || "sans",
            spacing: (doc.spacing as any) || "normal",
          };

          setResumeData(mapped);
          setSaveStatus("saved");
          triggerToast(`Loaded "${doc.title || "Resume"}" from PostgreSQL.`, "success");
        } else {
          throw new Error(data.error || "Resume not found.");
        }
      } catch (err: any) {
        console.error("Failed to load resume from database:", err);
        triggerToast("Could not load cloud resume. Falling back to local draft.", "error");
        setSaveStatus("local");
      } finally {
        setIsLoaded(true);
      }
    },
    [triggerToast]
  );

  // Initial load
  useEffect(() => {
    if (resumeIdParam) {
      setActiveResumeId(resumeIdParam);
      fetchDatabaseResume(resumeIdParam);
    } else {
      // Load from localStorage on mount if guest or draft
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setResumeData(parsed);
        }
      } catch (err) {
        console.error("Failed to load saved builder data:", err);
      } finally {
        setIsLoaded(true);
        setSaveStatus("local");
      }
    }
  }, [resumeIdParam, fetchDatabaseResume]);

  // Persist update to Database
  const persistToDatabase = useCallback(
    async (id: string, updated: ResumeBuilderState) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/resumes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updated.personal.fullName ? `${updated.personal.fullName} — Resume` : resumeTitle,
            fullName: updated.personal.fullName,
            jobTitle: updated.personal.jobTitle,
            email: updated.personal.email,
            phone: updated.personal.phone,
            location: updated.personal.location,
            website: updated.personal.website,
            linkedin: updated.personal.linkedin,
            github: updated.personal.github,
            summary: updated.personal.summary,
            experience: updated.experience,
            education: updated.education,
            skills: updated.skills,
            projects: updated.projects,
            certifications: updated.certifications,
            template: updated.template,
            accentColor: updated.accentColor,
            fontFamily: updated.fontFamily,
            spacing: updated.spacing,
            colorHex: updated.accentColor,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSaveStatus("saved");
        } else {
          throw new Error(data.error || "Save failed");
        }
      } catch (err: any) {
        console.error("Auto-save to database failed:", err);
        setSaveStatus("error");
      }
    },
    [resumeTitle]
  );

  // Auto-save handler
  const handleDataChange = (updated: ResumeBuilderState) => {
    setResumeData(updated);

    // Save to localStorage as quick local backup
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to auto-save builder data locally:", err);
    }

    // Debounced database auto-save if working on a persistent resume
    if (activeResumeId) {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
      setSaveStatus("saving");
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        persistToDatabase(activeResumeId, updated);
      }, 800);
    } else {
      setSaveStatus("local");
    }
  };

  // Create new persistent resume in database
  const handleSaveToCloud = async () => {
    if (!session) {
      triggerToast("Please log in to save your resume to your PostgreSQL account.", "info");
      router.push("/login?redirect=/resume-builder");
      return;
    }

    setSaveStatus("saving");
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeData.personal.fullName ? `${resumeData.personal.fullName} — Resume` : "My Resume",
          initialData: resumeData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.id) {
        setActiveResumeId(data.id);
        setSaveStatus("saved");
        triggerToast("✨ Resume saved to PostgreSQL database!", "success");
        router.push(`/resume-builder?resumeId=${data.id}`, { scroll: false });
      } else {
        throw new Error(data.error || "Could not save to database.");
      }
    } catch (err: any) {
      console.error("Save to cloud error:", err);
      triggerToast(err.message || "Failed to save resume to cloud.", "error");
      setSaveStatus("error");
    }
  };

  // Reset to empty state
  const handleResetToBlank = () => {
    const blank: ResumeBuilderState = {
      ...INITIAL_RESUME_DATA,
      personal: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      experience: [],
      education: [],
      skills: [{ id: "skill-1", categoryName: "Core Stack", skills: [] }],
      projects: [],
      certifications: [],
    };
    handleDataChange(blank);
    triggerToast("Cleared all resume fields. Ready for fresh input.", "info");
  };

  // Load rich sample data
  const handleLoadSample = () => {
    handleDataChange(INITIAL_RESUME_DATA);
    triggerToast("Loaded curated senior engineering sample profile.", "success");
  };

  // Sync to candidate dashboard
  const handleSyncToDashboard = () => {
    try {
      const title = `${resumeData.personal.fullName || "Candidate"}_Resume.pdf`;
      const analysisDummy = {
        atsScore: 92,
        scoreBreakdown: { keywordMatch: 94, formattingQuality: 96, experienceRelevance: 90 },
        missingKeywords: [],
        formattingIssues: [],
        bulletPointRewrites: [],
        overallFeedback: resumeData.personal.summary,
        matchedKeywords: resumeData.skills.flatMap((s) => s.skills),
        targetRoleIdentified: resumeData.personal.jobTitle,
        detectedExperienceLevel: "Senior Level",
      };

      saveResumeFromAnalysis(analysisDummy as any, title, "140 KB");
      triggerToast("✨ Resume synced to your Candidate Dashboard!", "success");
    } catch (err) {
      console.error("Failed to sync resume to dashboard:", err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FFE600] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {notification.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl text-xs font-medium flex items-center gap-3 animate-in slide-in-from-bottom duration-200 ${
            notification.type === "error"
              ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
              : "bg-[#121316] border-[#FFE600]/60 shadow-[0_10px_35px_rgba(255,230,0,0.25)] text-white"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              notification.type === "error" ? "bg-rose-500" : "bg-[#FFE600]"
            } animate-pulse`}
          />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Toolbar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#121316] border border-white/[0.08] shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-black text-white tracking-tight">
              Real-Time Resume Workspace
            </h2>
            {/* Status badge */}
            {activeResumeId ? (
              <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
                    <span className="text-yellow-400">Saving to DB...</span>
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span className="text-rose-400">Save Error</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>PostgreSQL Synced</span>
                  </>
                )}
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.05] border border-white/[0.1] text-gray-400">
                <Cloud className="w-3 h-3 text-gray-500" />
                <span>Local Draft Mode</span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Split-screen reactive editor with instant live A4 print simulation & Gemini AI assistance
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!activeResumeId && (
            <button
              type="button"
              onClick={handleSaveToCloud}
              disabled={saveStatus === "saving"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black text-xs font-black transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer disabled:opacity-50"
            >
              {saveStatus === "saving" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cloud className="w-3.5 h-3.5" />
              )}
              <span>Save to Cloud DB</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-gray-200 hover:text-white transition-colors cursor-pointer"
          >
            Load Sample Profile
          </button>

          <button
            type="button"
            onClick={handleResetToBlank}
            className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/10 border border-white/[0.1] hover:border-rose-500/30 text-xs font-bold text-gray-300 hover:text-rose-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSyncToDashboard}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold transition-all border border-white/[0.1] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>Sync to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Screen View Switcher */}
      <div className="flex lg:hidden items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#121316] border border-white/[0.08]">
        <button
          type="button"
          onClick={() => setMobileView("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mobileView === "form"
              ? "bg-[#FFE600] text-black font-black shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Editor Form</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mobileView === "preview"
              ? "bg-[#FFE600] text-black font-black shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* Main Split-Screen Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Editor */}
        <div
          className={`lg:col-span-6 min-w-0 ${
            mobileView === "form" ? "block" : "hidden lg:block"
          }`}
        >
          <BuilderForm data={resumeData} onChange={handleDataChange} />
        </div>

        {/* Right Live A4 Sheet Preview */}
        <div
          className={`lg:col-span-6 min-w-0 lg:sticky lg:top-24 ${
            mobileView === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <BuilderPreview data={resumeData} onChange={handleDataChange} />
        </div>
      </div>
    </div>
  );
}
