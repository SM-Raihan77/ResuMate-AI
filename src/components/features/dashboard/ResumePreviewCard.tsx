"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Calendar,
  Briefcase,
  GraduationCap,
  Code2,
  Eye,
  UploadCloud,
  Plus,
} from "lucide-react";
import { ResumeDocument } from "@/types/dashboard";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { CreateResumeButton } from "@/components/features/builder";

interface ResumePreviewCardProps {
  resumes: ResumeDocument[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onEditResume: (resume: ResumeDocument) => void;
  onDownloadPDF: (resume: ResumeDocument) => void;
  onAIOptimize: (resume: ResumeDocument) => void;
  isOptimizing?: boolean;
  onTriggerUpload?: () => void;
  isUploading?: boolean;
}

export function ResumePreviewCard({
  resumes,
  activeResumeId,
  onSelectResume,
  onEditResume,
  onDownloadPDF,
  onAIOptimize,
  isOptimizing = false,
  onTriggerUpload,
  isUploading = false,
}: ResumePreviewCardProps) {
  const { data: session } = useSession();
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  const activeResume =
    resumes.find((r) => r.id === activeResumeId) ||
    resumes[0] || {
      id: "res-empty",
      title: "No Resume Uploaded",
      targetRole: "Software Engineer",
      lastUpdated: "Never",
      atsScore: 0,
      fileName: "Upload Resume.pdf",
      fileSize: "0 KB",
      matchedKeywords: [],
      missingKeywords: [],
      summary: "Upload your real resume to receive an automated ATS score audit and personalized AI bullet rewrites.",
      experienceSnippet: [],
      skills: [],
      education: { degree: "Professional Degree", school: "University", year: "2024" },
    };

  const candidateDisplayName =
    session?.user?.name || (activeResume.title ? activeResume.title.replace(/\.[^/.]+$/, "").replace(/_/g, " ") : "Candidate Profile");

  return (
    <div
      id="resume-preview"
      className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 backdrop-blur-sm shadow-sm space-y-6"
    >
      {/* Top Header & Version Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/20 flex items-center justify-center text-[#FFE600]">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Active Resume Preview & AI Actions
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Real document calibrated against ATS parsing algorithms & recruiter screening filters
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <CreateResumeButton variant="outline" title="Create New Resume" className="py-2 text-xs" />

          {/* Quick In-Dashboard Upload Button */}
          {onTriggerUpload && (
            <button
              type="button"
              onClick={onTriggerUpload}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
            >
              <UploadCloud className={`w-3.5 h-3.5 text-[#FFE600] ${isUploading ? "animate-bounce" : ""}`} />
              <span>{isUploading ? "Analyzing..." : "Upload Resume"}</span>
            </button>
          )}

          {/* Version Switcher Dropdown */}
          {resumes.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60 hover:border-neutral-600 text-xs font-medium text-neutral-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span className="truncate max-w-[150px]">{activeResume.title}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {isVersionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 mb-1">
                    <p className="text-[10px] uppercase font-semibold text-neutral-400">
                      Saved Versions ({resumes.length})
                    </p>
                    {onTriggerUpload && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsVersionDropdownOpen(false);
                          onTriggerUpload();
                        }}
                        className="text-[10px] font-medium text-[#FFE600] hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Upload</span>
                      </button>
                    )}
                  </div>
                  {resumes.map((res) => (
                    <div
                      key={res.id}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        res.id === activeResume.id
                          ? "bg-[#FFE600]/10 text-[#FFE600] font-medium"
                          : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectResume(res.id);
                          setIsVersionDropdownOpen(false);
                        }}
                        className="truncate pr-2 text-left flex-1 cursor-pointer"
                      >
                        <p className="font-medium truncate">{res.title}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{res.targetRole}</p>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-neutral-950 text-[#FFE600] border border-neutral-800">
                          {res.atsScore} pts
                        </span>
                        <Link
                          href={`/resume-builder?resumeId=${res.id}`}
                          title="Open in Resume Builder"
                          className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-[#FFE600] transition-colors"
                          onClick={() => setIsVersionDropdownOpen(false)}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Resume Card Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Resume Paper Preview */}
        <div className="lg:col-span-7 bg-neutral-950/60 rounded-xl border border-neutral-800 p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            {/* Paper Header */}
            <div className="border-b border-neutral-800 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {candidateDisplayName}
                </h3>
                <p className="text-xs text-[#FFE600] font-medium">
                  {activeResume.targetRole}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ATS {activeResume.atsScore}/100
                </span>
                {activeResume.id && !activeResume.id.startsWith("res-empty") && (
                  <Link
                    href={`/resume-builder?resumeId=${activeResume.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-[#FFE600] hover:text-neutral-950 border border-neutral-700/60 text-xs font-medium text-neutral-300 transition-colors"
                  >
                    <span>Open in Builder</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#FFE600]" />
                Professional Summary
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                {activeResume.summary}
              </p>
            </div>

            {/* Experience Snippet */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#FFE600]" />
                Experience Highlights (Google XYZ Formula)
              </span>

              {activeResume.experienceSnippet && activeResume.experienceSnippet.length > 0 ? (
                activeResume.experienceSnippet.slice(0, 1).map((exp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white">{exp.role}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{exp.period}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{exp.company}</p>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {(exp.highlights || []).slice(0, 2).map((h, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                          <span className="text-[#FFE600] font-bold mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-neutral-900/40 border border-dashed border-neutral-800 text-xs text-neutral-400 text-center py-4 space-y-2">
                  <p>No experience bullets yet. Create or upload your resume in the Resume Builder.</p>
                  <Link
                    href="/resume-builder"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFE600] text-neutral-950 font-semibold text-xs"
                  >
                    Open Resume Builder
                  </Link>
                </div>
              )}
            </div>

            {/* Expanded Content (toggleable) */}
            {isPreviewExpanded && activeResume.education && (
              <div className="space-y-3 pt-2 border-t border-neutral-800 animate-in fade-in">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#FFE600]" />
                    Education & Credentials
                  </span>
                  <p className="text-xs text-neutral-300 font-medium">
                    {activeResume.education.degree} — {activeResume.education.school} ({activeResume.education.year})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preview Toggle button */}
          <div className="pt-3.5 mt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800">
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-neutral-400" />
              {activeResume.lastUpdated}
            </span>
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="text-[#FFE600] hover:underline font-medium flex items-center gap-1 text-xs cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>{isPreviewExpanded ? "Collapse Details" : "View Full Sheet"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: ATS Keyword Analysis & Quick Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Keyword Status Chips */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Matched ATS Keywords ({(activeResume.matchedKeywords || []).length})
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Matched</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(activeResume.matchedKeywords || []).length > 0 ? (
                  activeResume.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic">No keywords detected yet.</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Keywords to Add ({(activeResume.missingKeywords || []).length})
                </span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase">Missing</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(activeResume.missingKeywords || []).length > 0 ? (
                  activeResume.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium"
                    >
                      + {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-400 font-medium">All target keywords matched!</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Hub */}
          <div className="space-y-2.5 pt-3.5 border-t border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. Edit in Builder / Quick Edit */}
              {activeResume.id && !activeResume.id.startsWith("res-empty") ? (
                <Link
                  href={`/resume-builder?resumeId=${activeResume.id}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Open in Builder</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onEditResume(activeResume)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Edit Resume</span>
                </button>
              )}

              {/* 2. Download Diagnostic / Markdown */}
              <button
                type="button"
                onClick={() => onDownloadPDF(activeResume)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>Download Report</span>
              </button>
            </div>

            {/* 3. AI Optimize CTA */}
            <button
              type="button"
              onClick={() => onAIOptimize(activeResume)}
              disabled={isOptimizing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 disabled:opacity-60 text-neutral-950 text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-[0.99]"
            >
              <Sparkles className={`w-3.5 h-3.5 fill-neutral-950 ${isOptimizing ? "animate-spin" : ""}`} />
              <span>{isOptimizing ? "Calibrating with Gemini AI..." : "AI Optimize (Google XYZ Formula)"}</span>
            </button>

            {/* Full Analyzer deep dive link */}
            <Link
              href={
                activeResume.id && !activeResume.id.startsWith("res-empty")
                  ? `/resume-analyzer?resumeId=${activeResume.id}`
                  : "/resume-analyzer"
              }
              className="w-full flex items-center justify-center gap-1 text-center text-[11px] text-neutral-400 hover:text-[#FFE600] transition-colors pt-0.5"
            >
              <span>Open in Deep ATS Analyzer</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

