"use client";

import React, { useState } from "react";
import {
  Award,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Brain,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Zap,
  Database,
} from "lucide-react";
import {
  InterviewFinalReport,
  InterviewDifficulty,
  InterviewType,
} from "@/types/interview";

interface InterviewReportProps {
  report: InterviewFinalReport;
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  sessionId?: string;
  onReset: () => void;
}

export function InterviewReport({
  report,
  role,
  difficulty,
  interviewType,
  sessionId,
  onReset,
}: InterviewReportProps): React.JSX.Element {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);


  const getVerdictBadge = (grade: string) => {
    if (grade.includes("Staff") || grade.includes("Principal")) {
      return {
        bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        label: "Staff / Principal Level",
      };
    }
    if (grade.includes("Senior")) {
      return {
        bg: "bg-[#FFE600]/15 border-[#FFE600]/30 text-[#FFE600]",
        label: "Strong Senior Hire",
      };
    }
    if (grade.includes("Mid")) {
      return {
        bg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
        label: "Mid-Level Standard",
      };
    }
    return {
      bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      label: "Needs Additional Practice",
    };
  };

  const verdict = getVerdictBadge(report.grade);

  const handleExportMarkdown = () => {
    const mdContent = `# ResuMate AI Mock Interview Performance Scorecard
**Role Track:** ${role} (${difficulty.toUpperCase()} Level)
**Interview Focus:** ${interviewType.toUpperCase()}
**Completed Date:** ${new Date().toLocaleDateString()}
**Overall Score:** ${report.overallScore} / 100
**Hiring Committee Verdict:** ${report.grade}

---

## 1. Executive Performance Summary
${report.detailedFeedback}

### Readiness Recommendation
> ${report.readinessRecommendation}

---

## 2. Core Competency Scores
- **Technical Proficiency:** ${report.categoryScores.technicalProficiency}%
- **Communication & Clarity:** ${report.categoryScores.communicationClarity}%
- **Problem Solving & Depth:** ${report.categoryScores.problemSolving}%
- **Culture & STAR Execution:** ${report.categoryScores.cultureAndSTAR}%

---

## 3. Key Strengths
${report.keyStrengths.map((s) => `- ${s}`).join("\n")}

---

## 4. Priority Growth Areas
${report.criticalImprovements.map((c) => `- ${c}`).join("\n")}

---

## 5. Question-by-Question Detailed Review
${report.questionBreakdowns
  .map(
    (q, i) => `### Question #${i + 1} (Score: ${q.score}/100)
**Prompt:** "${q.question}"

**Your Answer:**
> ${q.userAnswer}

**AI Feedback:**
${q.feedback}

**Staff-Level Model Alternative:**
${q.betterAlternative}
`
  )
  .join("\n---\n")}
`;

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Interview_Scorecard_${role.replace(/\s+/g, "_")}_${report.overallScore}PTS.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Interview Evaluation Scorecard
            </h2>
            {sessionId && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <Database className="w-3 h-3" />
                <span>PostgreSQL Synced</span>
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            Target Track: <strong className="text-neutral-200 font-medium">{role}</strong> • Level:{" "}
            <strong className="text-neutral-200 uppercase font-medium">{difficulty}</strong>
          </p>
        </div>


        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FFE600]" />
            <span>Export Scorecard (.md)</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-neutral-950 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Hero Score Gauge & Executive Summary */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radial Score */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Overall Interview Score
            </p>
            <div className="relative flex items-center justify-center my-1">
              <span className="text-5xl font-bold font-mono text-[#FFE600] tracking-tight">
                {report.overallScore}
              </span>
              <span className="text-xs font-medium text-neutral-500 font-sans self-end mb-2 ml-1">
                /100
              </span>
            </div>

            <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-medium ${verdict.bg}`}>
              {report.grade}
            </div>
          </div>

          {/* Executive Feedback & Recommendation */}
          <div className="lg:col-span-8 space-y-3.5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/20 text-[#FFE600] text-xs font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Hiring Committee Assessment</span>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed">
              {report.detailedFeedback}
            </p>

            <div className="p-3.5 rounded-xl bg-[#FFE600]/5 border border-[#FFE600]/20 text-xs text-neutral-300 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#FFE600] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#FFE600]">Readiness Recommendation</p>
                <p className="text-xs text-neutral-300 mt-0.5">{report.readinessRecommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Category Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Technical Precision</span>
            <Brain className="w-4 h-4 text-[#FFE600]" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {report.categoryScores.technicalProficiency}%
          </p>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-[#FFE600] rounded-full"
              style={{ width: `${report.categoryScores.technicalProficiency}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Communication & Clarity</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {report.categoryScores.communicationClarity}%
          </p>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${report.categoryScores.communicationClarity}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Problem Solving</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {report.categoryScores.problemSolving}%
          </p>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${report.categoryScores.problemSolving}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">STAR Method & Impact</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {report.categoryScores.cultureAndSTAR}%
          </p>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full"
              style={{ width: `${report.categoryScores.cultureAndSTAR}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths vs Growth Priorities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-neutral-300">
            {report.keyStrengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-medium text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>High-Priority Improvements</span>
          </div>
          <ul className="space-y-2 text-xs text-neutral-300">
            {report.criticalImprovements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Deep Dive Accordion */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Detailed Question-by-Question Transcript & AI Critique
          </h3>
          <p className="text-xs text-neutral-400">
            Review your submitted answers compared side-by-side with Staff Engineer model alternatives.
          </p>
        </div>

        <div className="space-y-3">
          {report.questionBreakdowns.map((q, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-neutral-950/50 border border-neutral-800/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="w-6 h-6 rounded-md bg-neutral-800 text-xs font-mono font-medium flex items-center justify-center text-neutral-300 shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-neutral-200 line-clamp-1">
                      {q.question}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-[#FFE600]/10 border border-[#FFE600]/20 text-[#FFE600]">
                      {q.score}/100
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-neutral-800/80 space-y-3 text-xs bg-neutral-900/40">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">
                        Your Submitted Response:
                      </p>
                      <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-neutral-300 italic">
                        &ldquo;{q.userAnswer}&rdquo;
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-amber-400 mb-1">
                        AI Feedback & Optimization Areas:
                      </p>
                      <p className="text-neutral-300 leading-relaxed">{q.feedback}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[#FFE600] mb-1">
                        Staff / Principal Model Answer:
                      </p>
                      <div className="p-3 rounded-lg bg-[#FFE600]/5 border border-[#FFE600]/20 text-neutral-200 whitespace-pre-line leading-relaxed">
                        {q.betterAlternative}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
