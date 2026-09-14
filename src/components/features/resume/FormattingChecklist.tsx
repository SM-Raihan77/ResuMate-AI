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
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
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
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
      };
    }
    return {
      level: "Best Practice",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: AlertCircle,
      iconColor: "text-blue-400",
    };
  };

  const resolvedCount = Object.values(resolvedIssues).filter(Boolean).length;

  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 lg:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Formatting & ATS Compliance Checklist
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Parser vulnerabilities and layout checks that could cause rejection in Workday, Greenhouse, or Taleo.
          </p>
        </div>

        {formattingIssues.length > 0 && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
            Resolved: <span className="text-[#FFE600] font-bold">{resolvedCount}</span> / {formattingIssues.length}
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {formattingIssues.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-emerald-300">
              Zero Critical Formatting Flaws Detected!
            </p>
            <p className="text-xs text-neutral-400">
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
                className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isResolved
                    ? "bg-neutral-950/40 border-neutral-900 opacity-60 line-through"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950/80"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {isResolved ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-600 group-hover:text-[#FFE600] transition-colors" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${severity.badgeColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      {severity.level}
                    </span>
                    <span className="text-xs font-semibold text-neutral-400">
                      Audit Rule #{idx + 1}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isResolved ? "text-neutral-500" : "text-neutral-300"
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
