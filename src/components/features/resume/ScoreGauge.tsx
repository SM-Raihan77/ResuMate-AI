"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Award, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";

interface ScoreGaugeProps {
  score: number;
  overallFeedback: string;
  targetRole?: string;
  experienceLevel?: string;
  isDemo?: boolean;
}

export default function ScoreGauge({
  score,
  overallFeedback,
  targetRole,
  experienceLevel,
  isDemo,
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
        if (score >= 80) {
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#FFE600", "#10B981", "#ffffff"],
            });
          } catch {
            // Ignore if canvas-confetti is not loaded
          }
        }
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreDetails = (val: number) => {
    if (val >= 85) {
      return {
        tier: "Tier-1 / Top 5% ATS Ready",
        color: "text-[#FFE600]",
        stroke: "#FFE600",
        bg: "bg-[#FFE600]/10",
        border: "border-[#FFE600]/25",
        label: "Exceptional Match",
        icon: Award,
      };
    }
    if (val >= 70) {
      return {
        tier: "Competitive / Strong Candidate",
        color: "text-emerald-400",
        stroke: "#34D399",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        label: "Good ATS Compatibility",
        icon: ShieldCheck,
      };
    }
    if (val >= 55) {
      return {
        tier: "Fair / Action Needed",
        color: "text-amber-400",
        stroke: "#FBBF24",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        label: "Moderate Gaps",
        icon: TrendingUp,
      };
    }
    return {
      tier: "Low / At Risk of Filtering",
      color: "text-rose-400",
      stroke: "#F87171",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      label: "Needs Revision",
      icon: AlertTriangle,
    };
  };

  const details = getScoreDetails(score);
  const IconComponent = details.icon;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 lg:p-8 shadow-xl overflow-hidden backdrop-blur-xl">
      {isDemo && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Analysis Mode</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-neutral-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={details.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s ease",
                }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {animatedScore}
              </span>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${details.bg} ${details.border} border ${details.color} text-xs font-semibold`}>
            <IconComponent className="w-3.5 h-3.5" />
            <span>{details.label}</span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-medium text-neutral-300">
              🎯 {targetRole || "Target Role Identified"}
            </span>
            {experienceLevel && (
              <span className="px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-medium text-neutral-300">
                💼 {experienceLevel}
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/25 text-xs font-semibold text-[#FFE600]">
              {details.tier}
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Executive AI Audit Summary
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {overallFeedback}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Greenhouse & Lever ATS Compatible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FFE600]" />
              <span>Semantic XYZ Rubric Calibrated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
