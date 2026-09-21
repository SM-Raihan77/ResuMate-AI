"use client";

import React from "react";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Target,
  Lightbulb,
} from "lucide-react";
import { AIFeedbackPoint } from "@/types/dashboard";

interface AIFeedbackSummaryProps {
  feedbackPoints: AIFeedbackPoint[];
  onStartInterview: () => void;
  onOpenCoach: () => void;
}

export function AIFeedbackSummary({
  feedbackPoints,
  onStartInterview,
  onOpenCoach,
}: AIFeedbackSummaryProps) {
  const strengths = feedbackPoints.filter((f) => f.type === "strength");
  const improvements = feedbackPoints.filter((f) => f.type === "improvement");

  return (
    <div className="space-y-6">
      {/* 2-Column AI Intelligence Feedback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Strengths Identified Card */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-5 backdrop-blur-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Demonstrated Strengths
                </h3>
                <p className="text-[11px] text-emerald-400">
                  Competitive advantages in candidate profile
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
              {strengths.length} Validated
            </span>
          </div>

          <div className="space-y-2.5">
            {strengths.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-1.5 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white">{item.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-start gap-1.5 pt-1.5 border-t border-neutral-800 text-[11px] text-neutral-300 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 text-[#FFE600] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#FFE600]">Coach Tip:</strong> {item.actionableTip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Areas to Improve Card */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-5 backdrop-blur-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  High-Priority Improvements
                </h3>
                <p className="text-[11px] text-amber-400">
                  Targeted fixes to unlock 95%+ offer readiness
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">
              {improvements.length} Action Items
            </span>
          </div>

          <div className="space-y-2.5">
            {improvements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-1.5 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white">{item.title}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.impactBadge === "Critical"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/25"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                    }`}
                  >
                    {item.impactBadge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-start gap-1.5 pt-1.5 border-t border-neutral-800 text-[11px] text-neutral-300 font-medium">
                  <Target className="w-3.5 h-3.5 text-[#FFE600] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#FFE600]">Action:</strong> {item.actionableTip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent "Start Mock Interview" CTA Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20 text-xs font-medium">
              <Zap className="w-3 h-3" />
              <span>Simulate Real Hiring Bar</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Ready for your next round? Simulate a Senior-Level Panel
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
              Practice dynamic technical problem solving, live system design, and behavioral STAR questions with real-time AI scoring and instant diagnostic feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCoach}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer"
            >
              Ask AI Career Coach
            </button>

            <button
              type="button"
              onClick={onStartInterview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-neutral-950 font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Bot className="w-4 h-4 stroke-[2.5]" />
              <span>Start Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
