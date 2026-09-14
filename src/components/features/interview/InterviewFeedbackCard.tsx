"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
} from "lucide-react";
import { InterviewAnswerEvaluation } from "@/types/interview";

interface InterviewFeedbackCardProps {
  evaluation: InterviewAnswerEvaluation;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function InterviewFeedbackCard({
  evaluation,
  onNextQuestion,
  isLastQuestion,
  questionNumber,
  totalQuestions,
}: InterviewFeedbackCardProps): React.JSX.Element {
  const [showIdealAnswer, setShowIdealAnswer] = useState<boolean>(true);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 70) return "text-[#FFE600] border-[#FFE600]/30 bg-[#FFE600]/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Staff / Principal Caliber";
    if (score >= 78) return "Senior Bar Met";
    if (score >= 65) return "Mid-Level Standard";
    return "Needs Revision";
  };

  return (
    <div className="rounded-2xl bg-neutral-900/85 border border-neutral-800 p-6 sm:p-7 space-y-6 shadow-xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant AI Evaluation • Question {questionNumber} of {totalQuestions}</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Performance Breakdown & Critique
          </h3>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${getScoreColor(
              evaluation.score
            )}`}
          >
            <div className="text-right">
              <p className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
                Question Score
              </p>
              <p className="text-xs font-semibold">{getScoreLabel(evaluation.score)}</p>
            </div>
            <span className="text-2xl font-extrabold font-mono">
              {evaluation.score}
              <span className="text-xs opacity-70 font-sans">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>What You Did Well</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {evaluation.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Growth / Missing Elements */}
        <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Missed Opportunities & Nuances</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {evaluation.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* STAR Framework Breakdown (if behavioral) */}
      {evaluation.starCompliance && (
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FFE600] font-semibold text-xs">
              <Zap className="w-4 h-4" />
              <span>STAR Method Compliance Analysis</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#FFE600]">
              Score: {evaluation.starCompliance.score}/100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Situation</p>
              <p className="text-neutral-200 mt-0.5">{evaluation.starCompliance.situation}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Task</p>
              <p className="text-neutral-200 mt-0.5">{evaluation.starCompliance.task}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Action</p>
              <p className="text-neutral-200 mt-0.5">{evaluation.starCompliance.action}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Result</p>
              <p className="text-neutral-200 mt-0.5">{evaluation.starCompliance.result}</p>
            </div>
          </div>
        </div>
      )}

      {/* Staff Engineer Model Answer */}
      <div className="rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowIdealAnswer(!showIdealAnswer)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFE600]">
            <Award className="w-4 h-4" />
            <span>How a Staff / Principal Engineer Would Answer</span>
          </div>
          {showIdealAnswer ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {showIdealAnswer && (
          <div className="px-4 pb-4 pt-1 text-xs text-neutral-200 leading-relaxed border-t border-neutral-850 bg-neutral-950">
            <p className="whitespace-pre-line italic font-sans">{evaluation.idealAnswer}</p>
          </div>
        )}
      </div>

      {/* Action to continue */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={onNextQuestion}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
        >
          <span>{isLastQuestion ? "View Final Executive Scorecard" : "Proceed to Next Question"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
