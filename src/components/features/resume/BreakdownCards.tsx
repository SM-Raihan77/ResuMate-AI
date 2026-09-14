"use client";

import React from "react";
import { ScoreBreakdown } from "@/types/analyzer";
import { Tag, Layout, Target } from "lucide-react";

interface BreakdownCardsProps {
  breakdown: ScoreBreakdown;
}

export default function BreakdownCards({ breakdown }: BreakdownCardsProps) {
  const categories = [
    {
      title: "Keywords Match",
      score: breakdown.keywordMatch,
      icon: Tag,
      description:
        "Measures technical terminology, tooling, and skills alignment against job descriptions and industry standards.",
      benchmark: "80%+ recommended",
    },
    {
      title: "Formatting Quality",
      score: breakdown.formattingQuality,
      icon: Layout,
      description:
        "Evaluates layout hierarchy, date formats, parser legibility, and absence of multi-column parsing traps.",
      benchmark: "85%+ recommended",
    },
    {
      title: "Experience Relevance",
      score: breakdown.experienceRelevance,
      icon: Target,
      description:
        "Analyzes quantifiable business results (revenue, %, latency) and senior scope in work history.",
      benchmark: "75%+ recommended",
    },
  ];

  const getColorClass = (val: number) => {
    if (val >= 80) return "text-[#FFE600] bg-[#FFE600]";
    if (val >= 65) return "text-emerald-400 bg-emerald-400";
    if (val >= 50) return "text-amber-400 bg-amber-400";
    return "text-rose-400 bg-rose-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        const colorClasses = getColorClass(cat.score);
        const textColor = colorClasses.split(" ")[0];
        const barColor = colorClasses.split(" ")[1];

        return (
          <div
            key={idx}
            className="group rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-6 transition-all duration-200 shadow-xl flex flex-col justify-between backdrop-blur-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[#FFE600] transition-colors">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FFE600] transition-colors">
                    {cat.title}
                  </h4>
                </div>

                <div className="text-right">
                  <span className={`text-xl font-extrabold font-mono ${textColor}`}>
                    {cat.score}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden mb-4 border border-neutral-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                  style={{ width: `${Math.min(Math.max(cat.score, 5), 100)}%` }}
                />
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Target Standard:</span>
              <span className="font-semibold text-neutral-300">{cat.benchmark}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
