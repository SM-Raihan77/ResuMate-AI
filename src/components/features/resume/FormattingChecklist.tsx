"use client";

import React, { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert, CheckSquare, Square } from "lucide-react";

interface FormattingChecklistProps {
  formattingIssues: string[];
}

export default function FormattingChecklist({
  formattingIssues,
}: FormattingChecklistProps) {
  const [resolvedIssues, setResolvedIssues] = useState<Record<number, boolean>>({});

  const toggleResolved = (idx: number) => {
    setResolvedIssues((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getIssueSeverity = (issue: string, index: number) => {
    const lower = issue.toLowerCase();
    if (
      lower.includes("table") ||
      lower.includes("column") ||
      lower.includes("unparsed") ||
      lower.includes("scramble") ||
      index === 0
    ) {
      return {
        level: "High Risk",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        icon: ShieldAlert,
        iconColor: "text-rose-400",
      };
    }
    if (
      lower.includes("header") ||
      lower.includes("date") ||
      lower.includes("metric") ||
      lower.includes("quantif")
    ) {
      return {
        level: "Moderate",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
      };
    }
    return {
      level: "Best Practice",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      icon: AlertCircle,
      iconColor: "text-blue-400",
    };
  };

  const resolvedCount = Object.values(resolvedIssues).filter(Boolean).length;

  return (
    <div className="rounded-3xl bg-[#121316] border border-white/[0.08] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Formatting & ATS Compliance Checklist
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Parser vulnerabilities and layout checks that could cause rejection in Workday, Greenhouse, or Taleo.
          </p>
        </div>

        {formattingIssues.length > 0 && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300">
            Resolved: <span className="text-[#FFE600] font-bold">{resolvedCount}</span> / {formattingIssues.length}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {formattingIssues.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-emerald-300">
              Zero Critical Formatting Flaws Detected!
            </p>
            <p className="text-xs text-gray-400">
              Your resume layout adheres closely to modern ATS parsing standards.
            </p>
          </div>
        ) : (
          formattingIssues.map((issue, idx) => {
            const isResolved = Boolean(resolvedIssues[idx]);
            const severity = getIssueSeverity(issue, idx);
            const Icon = severity.icon;

            return (
              <div
                key={idx}
                onClick={() => toggleResolved(idx)}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isResolved
                    ? "bg-white/[0.02] border-white/[0.05] opacity-60 line-through"
                    : "bg-[#16181d] border-white/[0.08] hover:border-[#FFE600]/40 hover:bg-[#1a1c22]"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {isResolved ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-500 group-hover:text-[#FFE600] transition-colors" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${severity.badgeColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      {severity.level}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      Audit Rule #{idx + 1}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isResolved ? "text-gray-500" : "text-gray-200"
                    }`}
                  >
                    {issue}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
