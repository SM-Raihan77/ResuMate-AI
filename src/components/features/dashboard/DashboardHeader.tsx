"use client";

import React from "react";
import {
  Sparkles,
  Bot,
  ArrowRight,
  TrendingUp,
  Target,
  Menu,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface DashboardHeaderProps {
  targetRole: string;
  readinessLevel: string;
  onOpenMobileSidebar: () => void;
  onStartInterview: () => void;
  onOptimizeResume: () => void;
  onOpenCoach: () => void;
}

export function DashboardHeader({
  targetRole,
  readinessLevel,
  onOpenMobileSidebar,
  onStartInterview,
  onOptimizeResume,
  onOpenCoach,
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Candidate";
  const firstName = userName.split(" ")[0];

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Top Mobile Bar */}
      <div className="flex lg:hidden items-center justify-between pb-3 border-b border-neutral-800">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white"
        >
          <Menu className="w-4 h-4 text-[#FFE600]" />
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#FFE600]" />
          <span>{todayFormatted}</span>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 sm:p-7 backdrop-blur-sm shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20 text-xs font-medium">
                <Sparkles className="w-3 h-3 fill-[#FFE600]" />
                <span>AI Career Intelligence</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>{readinessLevel}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-[#FFE600]">{firstName}</span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Your resume ATS calibration and interview readiness are currently ranked in the{" "}
              <strong className="text-neutral-200 font-medium">top 10% of candidates</strong>. Target role:{" "}
              <span className="text-[#FFE600] font-medium">{targetRole}</span>.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onStartInterview}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-neutral-950 font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Bot className="w-4 h-4 stroke-[2.5]" />
              <span>Start Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOptimizeResume}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-200 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFE600]" />
              <span>AI Optimize Resume</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
