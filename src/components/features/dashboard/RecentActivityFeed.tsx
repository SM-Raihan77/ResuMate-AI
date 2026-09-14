"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  FileText,
  Sparkles,
  Bot,
  ArrowUpRight,
  ChevronRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { RecentActivityItem } from "@/types/dashboard";

interface RecentActivityFeedProps {
  activities: RecentActivityItem[];
  onStartInterview?: () => void;
}

export function RecentActivityFeed({
  activities,
  onStartInterview,
}: RecentActivityFeedProps) {
  const getActivityIcon = (type: RecentActivityItem["type"]) => {
    switch (type) {
      case "resume":
        return {
          icon: FileText,
          bg: "bg-[#FFE600]/10 border-[#FFE600]/20 text-[#FFE600]",
          badge: "bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/20",
          label: "Resume Edit",
        };
      case "analysis":
        return {
          icon: Sparkles,
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          label: "ATS Audit",
        };
      case "interview":
        return {
          icon: Bot,
          bg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
          badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
          label: "Mock Session",
        };
      default:
        return {
          icon: Activity,
          bg: "bg-neutral-800 border-neutral-700 text-neutral-300",
          badge: "bg-neutral-800 text-neutral-400 border-neutral-700",
          label: "Activity",
        };
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 2) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 backdrop-blur-sm shadow-sm space-y-5">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Recent Activity Feed
            </h2>
            <p className="text-xs text-neutral-400">
              Live audit events, resume modifications, and interview simulations from PostgreSQL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/60 border border-neutral-800 text-[11px] font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Realtime Synced</span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-2.5">
        {activities.length > 0 ? (
          activities.map((item) => {
            const config = getActivityIcon(item.type);
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#FFE600] transition-colors">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${config.badge}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>

                  {item.link && (
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-[#FFE600] hover:text-neutral-950 text-neutral-300 text-xs font-medium border border-neutral-700/60 transition-all cursor-pointer group-hover:border-neutral-600"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-xl bg-neutral-950/40 border border-dashed border-neutral-800 text-center space-y-3">
            <Clock className="w-7 h-7 text-neutral-500 mx-auto" />
            <p className="text-xs text-neutral-400">
              No recent activity found. Start building your resume or practicing interviews to see your timeline.
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                href="/resume-builder"
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs text-white font-medium transition-colors"
              >
                Create Resume
              </Link>
              {onStartInterview && (
                <button
                  type="button"
                  onClick={onStartInterview}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-xs text-neutral-950 font-semibold transition-colors"
                >
                  Mock Interview
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
