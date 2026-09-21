"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Code2,
  Users,
  Compass,
  ArrowRight,
  FileText,
  Briefcase,
  SlidersHorizontal,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import {
  InterviewDifficulty,
  InterviewType,
  GenerateQuestionsRequest,
} from "@/types/interview";

interface SavedResumeOption {
  id: string;
  title: string | null;
}

interface InterviewSetupProps {
  onStartInterview: (payload: GenerateQuestionsRequest) => Promise<void>;
  isLoading: boolean;
  savedResumes?: SavedResumeOption[];
}


const PRESET_ROLES = [
  { label: "Frontend Engineer", icon: Code2, desc: "React, Next.js, Web Perf, CSS" },
  { label: "Full Stack Engineer", icon: Layers, desc: "Node.js, Next.js, Postgres, APIs" },
  { label: "Backend Engineer", icon: BrainCircuit, desc: "Distributed Systems, Microservices, SQL" },
  { label: "DevOps & Cloud", icon: Compass, desc: "Kubernetes, CI/CD, AWS, Terraform" },
  { label: "Engineering Manager", icon: Users, desc: "Team Leadership, Delivery, Strategy" },
  { label: "System Design Spec", icon: SlidersHorizontal, desc: "High Scale, Caching, Event-Driven" },
];

const DIFFICULTY_LEVELS: Array<{
  id: InterviewDifficulty;
  title: string;
  badge: string;
  desc: string;
}> = [
  {
    id: "junior",
    title: "Junior / Entry Level",
    badge: "0 - 2 Yrs",
    desc: "Focus on clean coding, core fundamentals, and eagerness to learn.",
  },
  {
    id: "mid",
    title: "Mid-Level Engineer",
    badge: "2 - 5 Yrs",
    desc: "Framework internals, async patterns, concurrency, and API design.",
  },
  {
    id: "senior",
    title: "Senior Engineer",
    badge: "5+ Yrs",
    desc: "Scalability, edge cases, trade-offs, and technical mentorship.",
  },
  {
    id: "lead",
    title: "Staff / Tech Lead",
    badge: "8+ Yrs",
    desc: "Org-wide architecture, RFC leadership, and business strategy.",
  },
];

const INTERVIEW_MODES: Array<{
  id: InterviewType;
  title: string;
  desc: string;
  icon: React.ElementType;
}> = [
  {
    id: "mixed",
    title: "Realistic Mixed Simulation",
    desc: "A balanced mix of technical deep dive, architecture, and STAR leadership rounds.",
    icon: Sparkles,
  },
  {
    id: "technical",
    title: "Technical & Coding Architecture",
    desc: "Heavy emphasis on framework internals, concurrency, algorithms, and debugging.",
    icon: Code2,
  },
  {
    id: "behavioral",
    title: "Behavioral & STAR Method",
    desc: "Situational questions assessing cross-functional leadership, conflict resolution, and impact.",
    icon: Users,
  },
  {
    id: "system-design",
    title: "System Design & Scalability",
    desc: "Distributed caching, rate-limiting, database sharding, and high-availability trade-offs.",
    icon: SlidersHorizontal,
  },
];

export function InterviewSetup({
  onStartInterview,
  isLoading,
  savedResumes = [],
}: InterviewSetupProps): React.JSX.Element {
  const [selectedRole, setSelectedRole] = useState<string>("Full Stack Engineer");
  const [customRole, setCustomRole] = useState<string>("");
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("senior");
  const [interviewType, setInterviewType] = useState<InterviewType>("mixed");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");
  const [showTailorContext, setShowTailorContext] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = isCustomRole ? customRole.trim() : selectedRole;
    if (!finalRole) return;

    onStartInterview({
      role: finalRole,
      difficulty,
      interviewType,
      questionCount,
      resumeId: selectedResumeId || undefined,
      jobDescription: jobDescription.trim() || undefined,
      resumeText: resumeText.trim() || undefined,
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Target Role Selection */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600]">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              1. Choose Your Target Role
            </h2>
            <p className="text-xs text-neutral-400">
              Select a standard engineering track or define your custom position.
            </p>
          </div>
        </div>

        {/* Preset Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = !isCustomRole && selectedRole === role.label;
            return (
              <button
                key={role.label}
                type="button"
                onClick={() => {
                  setIsCustomRole(false);
                  setSelectedRole(role.label);
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-[#FFE600]/10 border-[#FFE600]/60 shadow-sm"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-[#FFE600] text-black"
                        : "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#FFE600]" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold text-xs sm:text-sm ${isSelected ? "text-[#FFE600]" : "text-white"}`}>
                    {role.label}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">{role.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Role Input Toggle */}
        <div className="pt-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCustomRole(!isCustomRole)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isCustomRole
                  ? "bg-[#FFE600] text-black border-[#FFE600] font-semibold"
                  : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              + Custom Role / Specialized Title
            </button>
          </div>

          {isCustomRole && (
            <div className="mt-3 animate-in fade-in">
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. AI Prompt Engineer, Rust Infrastructure Specialist, iOS Lead..."
                required={isCustomRole}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#FFE600]"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Seniority & Interview Format */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seniority Level */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 space-y-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                2. Seniority Level
              </h2>
              <p className="text-xs text-neutral-400">
                Calibrates depth, trade-off expectations, and scoring rigor.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {DIFFICULTY_LEVELS.map((lvl) => {
              const isSelected = difficulty === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#FFE600]/10 border-[#FFE600]/60 shadow-sm"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-xs sm:text-sm ${
                          isSelected ? "text-[#FFE600]" : "text-white"
                        }`}
                      >
                        {lvl.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{lvl.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-[#FFE600] bg-[#FFE600] text-black"
                        : "border-neutral-700"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interview Focus Mode */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 space-y-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                3. Interview Focus & Mode
              </h2>
              <p className="text-xs text-neutral-400">
                Choose the round archetype you want to practice.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {INTERVIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = interviewType === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setInterviewType(mode.id)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#FFE600]/10 border-[#FFE600]/60 shadow-sm"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#FFE600] text-black"
                          : "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p
                        className={`font-semibold text-xs sm:text-sm ${
                          isSelected ? "text-[#FFE600]" : "text-white"
                        }`}
                      >
                        {mode.title}
                      </p>
                      <p className="text-xs text-neutral-400">{mode.desc}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-[#FFE600] bg-[#FFE600] text-black"
                        : "border-neutral-700"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Session Length & Optional Customization */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 space-y-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white tracking-tight">
              4. Session Length & Question Count
            </h2>
            <p className="text-xs text-neutral-400">
              Select how many questions you want the AI interviewer to generate.
            </p>
          </div>

          {/* Question Count Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            {[3, 5, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  questionCount === num
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {num} Questions ({num * 3} min)
              </button>
            ))}
          </div>
        </div>

        {/* Optional JD / Resume Tailoring Accordion */}
        <div className="pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => setShowTailorContext(!showTailorContext)}
            className="flex items-center gap-2 text-xs font-semibold text-[#FFE600] hover:underline cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {showTailorContext
                ? "– Hide Custom JD & Resume Tailoring"
                : "+ Tailor Questions to a Specific Job Description or My Resume (Optional)"}
            </span>
          </button>

          {showTailorContext && (
            <div className="mt-4 space-y-4 animate-in fade-in duration-200">
              {savedResumes.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <label className="text-xs font-semibold text-[#FFE600] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Select from My Saved Resumes (PostgreSQL)</span>
                  </label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:border-[#FFE600] focus:outline-none"
                  >
                    <option value="">-- No specific resume (Use manual text / JD) --</option>
                    {savedResumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title || "Untitled Resume"} (ID: {r.id.slice(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Target Job Description
                  </label>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the requirements from LinkedIn, Greenhouse, or Lever..."
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFE600]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Your Resume Text / Highlights
                  </label>
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume summary or key accomplishments to test against your background..."
                    className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFE600]"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Start Button Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl backdrop-blur-xl">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-bold text-white">
            Ready to Begin:{" "}
            <span className="text-[#FFE600]">
              {isCustomRole ? customRole || "Custom Role" : selectedRole}
            </span>{" "}
            ({difficulty.toUpperCase()})
          </p>
          <p className="text-xs text-neutral-400">
            {questionCount} dynamic questions • Instant audio synthesis • Real-time AI grading
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || (isCustomRole && !customRole.trim())}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Generating Questions with Gemini...</span>
            </>
          ) : (
            <>
              <span>Launch Mock Interview</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
