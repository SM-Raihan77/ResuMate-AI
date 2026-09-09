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
            className="group rounded-2xl bg-[#121316] border border-white/[0.08] hover:border-[#FFE600]/40 p-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1b20] border border-white/[0.08] group-hover:border-[#FFE600]/50 flex items-center justify-center text-[#FFE600] transition-colors">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#FFE600] transition-colors">
                    {cat.title}
                  </h4>
                </div>

                <div className="text-right">
                  <span className={`text-2xl font-black font-mono ${textColor}`}>
                    {cat.score}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                  style={{ width: `${Math.min(Math.max(cat.score, 5), 100)}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-400">
              <span>Target Standard:</span>
              <span className="font-semibold text-gray-300">{cat.benchmark}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
