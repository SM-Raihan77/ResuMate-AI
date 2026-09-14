"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Resume } from "@/types/resume";
import { GeneralInfoForm } from "./GeneralInfoForm";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { EDITOR_STEPS, DEFAULT_STEP, isValidStep } from "./steps";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Calendar,
  AlertCircle,
  Eye,
  Edit3,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ResumeEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resumeId = searchParams.get("resumeId");
  const stepParam = searchParams.get("step") || DEFAULT_STEP;

  const [currentStep, setCurrentStep] = useState<string>(
    isValidStep(stepParam) ? stepParam : DEFAULT_STEP
  );
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");

  // Keep currentStep synchronized with URL search params
  useEffect(() => {
    if (stepParam && isValidStep(stepParam) && stepParam !== currentStep) {
      setCurrentStep(stepParam);
    }
  }, [stepParam, currentStep]);

  // Fetch resume data from API
  const fetchResume = useCallback(async () => {
    if (!resumeId) {
      setErrorMessage("No resume ID provided in the URL.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/resumes/${resumeId}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.resume) {
        throw new Error(data.error || "Failed to load resume. It may not exist or you lack permission.");
      }

      setResumeData(data.resume);
    } catch (err: any) {
      console.error("Failed to fetch resume:", err);
      setErrorMessage(err.message || "Failed to fetch resume.");
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  // Navigate to step
  const goToStep = (stepKey: string) => {
    if (!isValidStep(stepKey)) return;
    setCurrentStep(stepKey);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", stepKey);
    router.push(`/editor?${params.toString()}`, { scroll: false });
  };

  // Handle local state updates from child forms
  const handleDataChange = (updated: Partial<Resume>) => {
    setResumeData((prev) => (prev ? { ...prev, ...updated } : (updated as Resume)));
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#FFE600]" />
        <p className="text-xs font-mono text-gray-400">Loading resume from PostgreSQL...</p>
      </div>
    );
  }

  if (errorMessage || !resumeData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white">Unable to Load Resume</h2>
        <p className="text-xs text-gray-400">{errorMessage || "Resume could not be found."}</p>
        <div className="flex items-center gap-3 pt-2">
          <Link href="/resumes">
            <Button className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white">
              Back to Saved Resumes
            </Button>
          </Link>
          <Button
            onClick={fetchResume}
            className="px-4 py-2 rounded-xl bg-[#FFE600] text-black text-xs font-bold"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Step Breadcrumbs */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#121316] border border-white/[0.08] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/resumes"
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-gray-300 hover:text-white transition-colors"
            title="Back to saved resumes"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate max-w-[280px] sm:max-w-md">
                {resumeData.title || "Untitled Resume"}
              </h1>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
              <span>Resume ID: <code className="text-[#FFE600] font-mono">{resumeData.id.substring(0, 12)}...</code></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span>Last updated {new Date(resumeData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Step Navigation Pills & Workspace Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href={`/resume-builder?resumeId=${resumeData.id}`}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,230,0,0.25)] inline-flex items-center gap-1.5 shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open in Full Builder</span>
          </Link>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/[0.06] overflow-x-auto no-scrollbar">
          {EDITOR_STEPS.map((step, idx) => {
            const isActive = currentStep === step.key;
            const isCompleted =
              step.key === "general-info"
                ? Boolean(resumeData.title)
                : Boolean(resumeData.firstName);

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => goToStep(step.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.3)] font-black"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive
                      ? "bg-black text-[#FFE600]"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/[0.1] text-gray-400"
                  }`}
                >
                  {isCompleted && !isActive ? "✓" : idx + 1}
                </div>
                <span>{step.title}</span>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Mobile Screen Toggle */}
      <div className="flex lg:hidden items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#121316] border border-white/[0.08]">
        <button
          type="button"
          onClick={() => setMobileView("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === "form"
              ? "bg-[#FFE600] text-black font-black shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Editor Step</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === "preview"
              ? "bg-[#FFE600] text-black font-black shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Resume Preview</span>
        </button>
      </div>

      {/* Main Split-Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Step Form */}
        <div
          className={`lg:col-span-6 min-w-0 ${
            mobileView === "form" ? "block" : "hidden lg:block"
          }`}
        >
          {currentStep === "general-info" && (
            <GeneralInfoForm
              resumeId={resumeData.id}
              initialData={resumeData}
              onNext={() => goToStep("personal-info")}
              onDataChange={handleDataChange}
            />
          )}

          {currentStep === "personal-info" && (
            <PersonalInfoForm
              resumeId={resumeData.id}
              initialData={resumeData}
              onPrev={() => goToStep("general-info")}
              onDataChange={handleDataChange}
            />
          )}
        </div>

        {/* Right: Live Reactive Resume Document Preview */}
        <div
          className={`lg:col-span-6 min-w-0 lg:sticky lg:top-24 ${
            mobileView === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-[#121316] rounded-3xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFE600]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Resume Snapshot
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                PostgreSQL Synced
              </span>
            </div>

            {/* Simulated Clean A4 Document Card */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 min-h-[480px]">
              {/* Header Section */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
                <div className="space-y-1 flex-1">
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">
                    {resumeData.firstName || resumeData.lastName
                      ? `${resumeData.firstName || ""} ${resumeData.lastName || ""}`.trim()
                      : "Candidate Name"}
                  </h2>
                  <p className="text-sm font-bold text-gray-700">
                    {resumeData.jobTitle || "Target Job Title"}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-600 pt-2">
                    {resumeData.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span>{resumeData.email}</span>
                      </span>
                    )}
                    {resumeData.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <span>{resumeData.phone}</span>
                      </span>
                    )}
                    {(resumeData.city || resumeData.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span>{[resumeData.city, resumeData.country].filter(Boolean).join(", ")}</span>
                      </span>
                    )}
                  </div>
                </div>

                {resumeData.photoUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resumeData.photoUrl}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Executive Summary */}
              {resumeData.summary ? (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {resumeData.summary}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-400">
                  Fill in your Personal Information and Professional Summary on the left to see it rendered here in real time.
                </div>
              )}

              {/* Resume Title & Meta Info */}
              <div className="pt-4 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Resume: <strong>{resumeData.title || "Untitled"}</strong></span>
                <span>Created {new Date(resumeData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
