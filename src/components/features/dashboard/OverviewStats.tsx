"use client";

import React from "react";
import {
  Sparkles,
  Bot,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  FileCheck2,
  ArrowUpRight,
} from "lucide-react";
import { DashboardStats } from "@/types/dashboard";

interface OverviewStatsProps {
  stats: DashboardStats;
  completedMilestonesCount?: number;
  totalMilestonesCount?: number;
  onCardClick?: (type: "resume" | "interview" | "analytics" | "roadmap") => void;
}

export function OverviewStats({
  stats,
  completedMilestonesCount = 4,
  totalMilestonesCount = 6,
  onCardClick,
}: OverviewStatsProps) {
  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 70) return "text-[#FFE600] border-[#FFE600]/30 bg-[#FFE600]/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. ATS Resume Score Card */}
      <div
        onClick={() => onCardClick?.("resume")}
        className="group rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-5 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/20 flex items-center justify-center text-[#FFE600]">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            +{stats.atsScoreChange} pts
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            ATS Resume Score
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {stats.atsScore}
            </span>
            <span className="text-xs font-medium text-neutral-500">/ 100</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.atsScore}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>
              {stats.totalResumesCreated != null
                ? `${stats.totalResumesCreated} Resume${stats.totalResumesCreated !== 1 ? 's' : ''} in Cloud`
                : 'ATS Compatibility'}
            </span>
            <span className="text-[#FFE600] font-medium">Tier-1 Optimized</span>
          </p>
        </div>
      </div>

      {/* 2. Mock Interviews Completed Card */}
      <div
        onClick={() => onCardClick?.("interview")}
        className="group rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-5 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Bot className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            +{stats.interviewsCompletedChange} this week
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Mock Interviews
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {stats.interviewsCompleted}
            </span>
            <span className="text-xs font-medium text-neutral-500">Sessions</span>
          </div>
        </div>

        {/* Info label */}
        <div className="mt-3.5 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Simulation Time</span>
          <span className="text-neutral-300 font-mono font-medium">5.2 Hours Active</span>
        </div>
      </div>

      {/* 3. Average Interview Score Card */}
      <div
        onClick={() => onCardClick?.("analytics")}
        className="group rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-5 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Award className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            +{stats.averageInterviewScoreChange}%
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Avg Interview Score
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {stats.averageInterviewScore}%
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Senior Ready
            </span>
          </div>
        </div>

        {/* Mini breakdown indicator */}
        <div className="mt-3.5 space-y-1.5">
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.averageInterviewScore}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Peak Score</span>
            <span className="text-neutral-300 font-mono font-medium">
              {stats.peakInterviewScore != null
                ? `${stats.peakInterviewScore}%`
                : `${stats.averageInterviewScore}%`}
            </span>
          </p>
        </div>
      </div>

      {/* 4. Career Goal Progress Card */}
      <div
        onClick={() => onCardClick?.("roadmap")}
        className="group rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-5 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {completedMilestonesCount} of {totalMilestonesCount} Done
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Career Goal Progress
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {stats.careerGoalProgress}%
            </span>
            <span className="text-xs text-neutral-500 font-medium">to Offer</span>
          </div>
        </div>

        {/* Milestone gauge */}
        <div className="mt-3.5 space-y-1.5">
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.careerGoalProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Milestone Status</span>
            <span className="text-[#FFE600] font-medium">On Track</span>
          </p>
        </div>
      </div>
    </div>
  );
}
