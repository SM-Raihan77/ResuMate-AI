"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  UploadCloud,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  RefreshCw,
} from "lucide-react";

interface ResumeUploaderProps {
  onAnalyze: (payload: { file?: File; resumeText?: string; jobDescription?: string }) => void;
  isLoading: boolean;
  loadingStep: string;
}

const SAMPLE_TECH_RESUME = `ALEXANDER VANCE
Senior Full Stack Engineer | San Francisco, CA | alex.vance@example.com | github.com/avance

SUMMARY
Full Stack Software Engineer with 6+ years of experience building scalable web applications, microservices, and distributed cloud systems using TypeScript, React, Next.js, and Node.js.

WORK EXPERIENCE
Senior Software Engineer | TechScale Inc. | 2022 – Present
- Responsible for developing backend APIs and fixing bug tickets with team members.
- Worked on database optimization and improved application loading speed.
- Collaborated with product managers and engineers on frontend features.
- Mentored junior engineers and participated in bi-weekly code reviews.

Software Engineer | CloudMatrix Solutions | 2019 – 2022
- Maintained React and Node.js codebase for enterprise clients.
- Implemented authentication workflows and payment gateway integrations.
- Assisted with cloud migrations on AWS EC2 and S3 buckets.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
Frameworks: React, Next.js, Node.js, Express, TailwindCSS
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker, Git`;

const SAMPLE_TECH_JD = `Role: Senior Full Stack Engineer (Next.js / Node.js)
Company: NextWave Technologies
Location: Remote

We are seeking a Senior Full Stack Engineer to lead the architecture and scaling of our AI-driven SaaS platform.

Responsibilities:
- Architect high-throughput RESTful and GraphQL microservices in TypeScript and Node.js.
- Build high-performance, modular frontend applications with Next.js App Router and TailwindCSS.
- Spearhead zero-downtime database migrations on PostgreSQL and distributed caching with Redis.
- Champion CI/CD automation, Docker containerization, and Kubernetes cluster orchestration on AWS.
- Benchmark system performance and maintain sub-100ms p99 latency SLAs.

Requirements:
- 5+ years building distributed web applications in TypeScript, React, and Node.js.
- Strong proficiency with PostgreSQL indexing, Redis caching, and Docker/Kubernetes.
- Proven track record with CI/CD pipelines, System Design, and automated unit/integration testing.`;

const SAMPLE_PM_RESUME = `SARAH CHEN
Lead Technical Product Manager | New York, NY | sarah.chen@example.com

SUMMARY
Product Manager with 5+ years of experience driving B2B SaaS product roadmaps, user retention, and enterprise platform growth.

WORK EXPERIENCE
Product Manager | NexaFlow | 2021 – Present
- Led the delivery of product features across web and mobile platforms.
- Ran user interviews to gather feedback and prioritized sprint backlog tickets.
- Analyzed product analytics dashboards to understand user drop-off.

Associate Product Manager | DataSprint | 2019 – 2021
- Worked with agile engineering team on quarterly release goals.
- Authored PRDs and user stories for workflow automation tools.`;

const SAMPLE_PM_JD = `Role: Lead Product Manager (Growth & Platform)
Company: HyperGrowth Labs

Responsibilities:
- Own the end-to-end product lifecycle from discovery to GA for our enterprise analytics platform.
- Define North Star metrics, OKRs, and conduct quantitative A/B testing experiments.
- Partner with engineering, UX design, and GTM teams to increase onboarding conversion by 30%.
- Conduct customer discovery interviews and analyze Amplitude/Mixpanel funnels.`;

export default function ResumeUploader({
  onAnalyze,
  isLoading,
  loadingStep,
}: ResumeUploaderProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ["pdf", "docx", "txt", "doc"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      setValidationError("Please upload a valid PDF, DOCX, or TXT file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError("File size exceeds 10MB limit.");
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLoadSample = (type: "tech" | "pm") => {
    setActiveTab("paste");
    setSelectedFile(null);
    if (type === "tech") {
      setResumeText(SAMPLE_TECH_RESUME);
      setJobDescription(SAMPLE_TECH_JD);
    } else {
      setResumeText(SAMPLE_PM_RESUME);
      setJobDescription(SAMPLE_PM_JD);
    }
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "file" && !selectedFile) {
      setValidationError("Please select a resume file or switch to Paste Text.");
      return;
    }

    if (activeTab === "paste" && (!resumeText || resumeText.trim().length < 50)) {
      setValidationError("Please enter at least 50 characters of resume content.");
      return;
    }

    setValidationError(null);

    if (activeTab === "file" && selectedFile) {
      onAnalyze({ file: selectedFile, jobDescription });
    } else {
      onAnalyze({ resumeText, jobDescription });
    }
  };

  return (
    <div className="rounded-3xl bg-[#121316] border border-white/[0.08] p-6 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FFE600]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Preset sample loaders strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/[0.08] mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFE600]" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Quick Start Demos
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleLoadSample("tech")}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#FFE600]/10 border border-white/[0.08] hover:border-[#FFE600]/40 text-xs font-medium text-gray-300 hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            ⚡ Load Senior Tech Resume & JD
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample("pm")}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#FFE600]/10 border border-white/[0.08] hover:border-[#FFE600]/40 text-xs font-medium text-gray-300 hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            📋 Load Product Manager Demo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Resume Upload / Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FFE600] text-black text-xs font-black flex items-center justify-center">
                1
              </span>
              <span>Upload Resume</span>
            </label>

            <div className="flex rounded-xl bg-black/60 p-1 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "file"
                    ? "bg-[#FFE600] text-black shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Upload File (PDF / DOCX)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paste")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "paste"
                    ? "bg-[#FFE600] text-black shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {activeTab === "file" ? (
            <div>
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group rounded-2xl border-2 border-dashed transition-all p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDragging
                      ? "border-[#FFE600] bg-[#FFE600]/10 scale-[1.01]"
                      : "border-white/[0.12] hover:border-[#FFE600]/60 bg-black/40 hover:bg-[#15171d]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-14 h-14 rounded-2xl bg-[#1c1e24] border border-white/[0.08] group-hover:border-[#FFE600]/50 group-hover:scale-110 flex items-center justify-center text-[#FFE600] mb-4 transition-all shadow-md">
                    <UploadCloud className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  <p className="text-sm font-bold text-white mb-1">
                    Drag and drop your resume here, or{" "}
                    <span className="text-[#FFE600] underline underline-offset-2">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF, DOCX, DOC, or TXT (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-black/60 border border-[#FFE600]/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE600]/15 border border-[#FFE600]/30 flex items-center justify-center text-[#FFE600]">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready for AI extraction
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <textarea
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here (Experience, Education, Skills, Projects)..."
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/[0.08] focus:border-[#FFE600]/60 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-colors font-mono resize-y"
              />
              <div className="flex justify-between items-center text-[11px] text-gray-500 mt-1">
                <span>Markdown or plain text supported</span>
                <span>{resumeText.length} characters</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Target Job Description */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/[0.1] text-gray-300 text-xs font-black flex items-center justify-center">
                2
              </span>
              <span>Target Job Description (Optional, Recommended)</span>
            </label>
            <span className="text-[11px] text-[#FFE600] font-medium">
              Calibrates exact ATS match %
            </span>
          </div>

          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target Job Description (JD) to compute semantic keyword overlap and role alignment..."
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/[0.08] focus:border-[#FFE600]/60 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-colors resize-y"
          />
        </div>

        {validationError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative overflow-hidden py-4 px-6 rounded-2xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-black text-sm sm:text-base transition-all shadow-[0_0_30px_rgba(255,230,0,0.3)] hover:shadow-[0_0_45px_rgba(255,230,0,0.5)] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2.5"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-5 h-5 animate-spin text-black" />
                <span className="tracking-wide font-bold">{loadingStep || "Analyzing with Gemini AI..."}</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-black stroke-black" />
                <span>Analyze Resume with AI</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
