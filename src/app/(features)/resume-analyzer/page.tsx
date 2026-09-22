"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar, Footer, UpgradeModal } from "@/components/shared";
import {
  ResumeUploader,
  ScoreGauge,
  BreakdownCards,
  KeywordGaps,
  FormattingChecklist,
  BulletRewrites,
} from "@/components/features/resume";
import { ResumeAnalysisResult } from "@/types";
import { saveResumeFromAnalysis } from "@/lib/dashboard-store";
import {
  Sparkles,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Award,
  Database,
  FileText,
  History,
  Loader2,
} from "lucide-react";

function ResumeAnalyzerContent() {
  const searchParams = useSearchParams();
  const urlResumeId = searchParams.get("resumeId") || undefined;

  const [savedResumes, setSavedResumes] = useState<Array<{ id: string; title: string | null; updatedAt?: string }>>([]);
  const [pastAnalyses, setPastAnalyses] = useState<ResumeAnalysisResult[]>([]);
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // 1. Fetch user's saved resumes on mount
  useEffect(() => {
    async function loadUserResumes() {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.resumes)) {
            setSavedResumes(data.resumes);
          }
        }
      } catch (err) {
        console.error("Failed to load user resumes for analyzer:", err);
      }
    }
    loadUserResumes();
  }, []);

  // 2. If urlResumeId is provided, fetch previous analyses for it
  useEffect(() => {
    if (!urlResumeId) return;

    async function loadPastAnalyses() {
      if (!urlResumeId) return;
      try {
        const res = await fetch(`/api/analyze-resume?resumeId=${urlResumeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setPastAnalyses(data.data);
            setAnalysisResult(data.data[0]);
            setFileName(`Saved Resume (ID: ${urlResumeId.slice(0, 8)})`);
          }
        }
      } catch (err) {
        console.error("Failed to load historical analyses:", err);
      }
    }
    loadPastAnalyses();
  }, [urlResumeId]);

  const handleAnalyze = async (payload: {
    file?: File;
    resumeText?: string;
    jobDescription?: string;
    resumeId?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);
    setLoadingStep("1/3 Preparing resume data for AI engine...");

    try {
      let response: Response;

      if (payload.file) {
        setFileName(payload.file.name);
        const formData = new FormData();
        formData.append("file", payload.file);
        if (payload.jobDescription) {
          formData.append("jobDescription", payload.jobDescription);
        }
        if (payload.resumeId) {
          formData.append("resumeId", payload.resumeId);
        }

        setTimeout(() => {
          setLoadingStep("2/3 Evaluating ATS keyword overlap and formatting...");
        }, 1500);

        setTimeout(() => {
          setLoadingStep("3/3 Generating Google XYZ bullet rewrites with Gemini...");
        }, 3500);

        response = await fetch("/api/analyze-resume", {
          method: "POST",
          body: formData,
        });
      } else {
        const displayName = payload.resumeId
          ? savedResumes.find((r) => r.id === payload.resumeId)?.title || "Saved Resume"
          : "Pasted Resume";
        setFileName(displayName);

        setTimeout(() => {
          setLoadingStep("2/3 Evaluating ATS keyword overlap and formatting...");
        }, 1000);

        setTimeout(() => {
          setLoadingStep("3/3 Generating Google XYZ bullet rewrites with Gemini...");
        }, 2500);

        response = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeId: payload.resumeId,
            resumeText: payload.resumeText,
            jobDescription: payload.jobDescription,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data?.code === "PREMIUM_REQUIRED") {
          setShowUpgrade(true);
        }
        throw new Error(data.error || data.message || "Failed to analyze resume. Please try again.");
      }

      const result: ResumeAnalysisResult = data.data;
      setAnalysisResult(result);

      // Add to past analyses list if persisted
      if (result.id) {
        setPastAnalyses((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);
        setSelectedAnalysisIndex(0);
      }

      // Save to real candidate store so it syncs immediately to the dashboard
      try {
        const fileSizeStr = payload.file?.size
          ? (payload.file.size / 1024).toFixed(0) + " KB"
          : "Database Record";
        saveResumeFromAnalysis(result, fileName, fileSizeStr, payload.resumeText);
      } catch (storageErr) {
        console.error("Failed to save resume to real dashboard store:", storageErr);
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: any) {
      console.error("Resume analysis error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during analysis.");
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleSelectPastAnalysis = (index: number) => {
    setSelectedAnalysisIndex(index);
    if (pastAnalyses[index]) {
      setAnalysisResult(pastAnalyses[index]);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setFileName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExportMarkdown = () => {
    if (!analysisResult) return;

    const content = `# ResuMate AI Resume Audit Report
**Date:** ${new Date().toLocaleDateString()}
**Overall ATS Score:** ${analysisResult.atsScore} / 100
**Target Role:** ${analysisResult.targetRoleIdentified || "Not specified"}
**Database Persistence ID:** ${analysisResult.id || "Unsaved"}

---

## 1. Score Breakdown
- **Keyword Match:** ${analysisResult.scoreBreakdown.keywordMatch}%
- **Formatting Quality:** ${analysisResult.scoreBreakdown.formattingQuality}%
- **Experience Relevance:** ${analysisResult.scoreBreakdown.experienceRelevance}%

---

## 2. Executive Feedback
${analysisResult.overallFeedback}

---

## 3. Missing Keywords
${analysisResult.missingKeywords.map((k) => `- ${k}`).join("\n")}

---

## 4. Formatting & Parser Issues
${analysisResult.formattingIssues.map((f) => `- ${f}`).join("\n")}

---

## 5. Bullet Point Rewrites (Google XYZ Formula)
${analysisResult.bulletPointRewrites
  .map(
    (b, i) => `### Rewrite #${i + 1}
**Original:** "${b.original}"
**AI Optimized:** "${b.improved}"
**Reason:** ${b.reason}
`
  )
  .join("\n")}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_Audit_${analysisResult.atsScore}PTS.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 relative overflow-hidden">
        {/* Background glow ambiance */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE600]/6 blur-[200px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FFE600]/4 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 relative z-10 space-y-12">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                AI Resume Intelligence
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-gray-300 font-medium">
                PostgreSQL Backed
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              AI Resume Analyzer & <br />
              <span className="text-[#FFE600]">ATS Algorithm Optimizer</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Scan your resume against Tier-1 recruiting algorithms (Workday, Greenhouse, Lever). Uncover missing keywords, fix parser vulnerabilities, and upgrade weak bullet points with high-impact quantified achievements.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                <span>Deterministic ATS Parsing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google XYZ Formula Rewriting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-400" />
                <span>PostgreSQL Audit Retention</span>
              </div>
            </div>
          </div>

          {/* Upload & Form Section */}
          <div className="max-w-4xl mx-auto">
            <ResumeUploader
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              loadingStep={loadingStep}
              savedResumes={savedResumes}
              initialResumeId={urlResumeId}
            />

            {errorMessage && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-bold">Analysis Failed</p>
                  <p className="text-xs text-rose-400/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Dashboard Section */}
          {analysisResult && (
            <div
              ref={resultsRef}
              className="space-y-8 pt-8 border-t border-white/[0.08] animate-in fade-in duration-300"
            >
              {/* Dashboard Actions Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121316] border border-white/[0.08] shadow-md">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Resume Diagnostic Results
                    </h2>
                    {analysisResult.id && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                        <Database className="w-3 h-3" />
                        <span>PostgreSQL Synced</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Source: <strong className="text-gray-200">{fileName || "Uploaded Resume"}</strong> • Calibrated for top ATS platforms
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {pastAnalyses.length > 1 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-gray-300">
                      <History className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span className="text-[11px] text-gray-400">Audit History:</span>
                      <select
                        value={selectedAnalysisIndex}
                        onChange={(e) => handleSelectPastAnalysis(Number(e.target.value))}
                        className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                      >
                        {pastAnalyses.map((item, idx) => (
                          <option key={item.id || idx} value={idx} className="bg-[#121316] text-white">
                            Score: {item.atsScore}% ({item.createdAt ? new Date(item.createdAt).toLocaleDateString() : `#${idx + 1}`})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {analysisResult.resumeId && (
                    <Link
                      href={`/resume-builder?resumeId=${analysisResult.resumeId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black text-xs font-black transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Edit in Resume Builder</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleExportMarkdown}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-gray-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#FFE600]" />
                    <span>Export (.md)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-gray-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New Scan</span>
                  </button>
                </div>
              </div>

              {/* 1. Overall Score Gauge */}
              <ScoreGauge
                score={analysisResult.atsScore}
                overallFeedback={analysisResult.overallFeedback}
                targetRole={analysisResult.targetRoleIdentified}
                experienceLevel={analysisResult.detectedExperienceLevel}
                isDemo={analysisResult.isDemo}
              />

              {/* 2. ATS Breakdown Cards */}
              <BreakdownCards breakdown={analysisResult.scoreBreakdown} />

              {/* 3. Keyword Gaps Analysis */}
              <KeywordGaps
                missingKeywords={analysisResult.missingKeywords}
                matchedKeywords={analysisResult.matchedKeywords}
              />

              {/* 4. Formatting & Compliance Checklist */}
              <FormattingChecklist
                formattingIssues={analysisResult.formattingIssues}
              />

              {/* 5. Bullet Point Rewrites */}
              <BulletRewrites rewrites={analysisResult.bulletPointRewrites} />

              {/* Action Plan Summary Banner */}
              <div className="rounded-3xl bg-gradient-to-r from-[#121316] via-[#1a1b22] to-[#121316] border border-[#FFE600]/30 p-8 lg:p-10 shadow-[0_20px_50px_rgba(255,230,0,0.08)] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600]/15 text-[#FFE600] text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Ready to improve your score?</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Apply Rewritten Bullets in the Builder & Re-scan
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
                    Update your resume with the suggested keywords and Google XYZ bullet replacements directly in the live builder, then run another scan to verify your 95%+ Tier-1 ATS ranking.
                  </p>
                </div>

                {analysisResult.resumeId ? (
                  <Link
                    href={`/resume-builder?resumeId=${analysisResult.resumeId}`}
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-sm shadow-[0_0_30px_rgba(255,230,0,0.35)] hover:shadow-[0_0_40px_rgba(255,230,0,0.55)] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Open in Resume Builder</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-sm shadow-[0_0_30px_rgba(255,230,0,0.35)] hover:shadow-[0_0_40px_rgba(255,230,0,0.55)] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Re-scan Updated Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="analysis"
      />

      <Footer />
    </div>
  );
}

export default function ResumeAnalyzerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent text-gray-100 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFE600]" />
            <span className="text-sm font-semibold text-gray-400">Loading Resume Analyzer...</span>
          </div>
        </div>
      }
    >
      <ResumeAnalyzerContent />
    </Suspense>
  );
}
