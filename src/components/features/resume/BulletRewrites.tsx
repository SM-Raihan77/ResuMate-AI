"use client";

import React, { useState } from "react";
import { BulletPointRewrite } from "@/types/analyzer";
import { Sparkles, Copy, Check, Lightbulb, Zap } from "lucide-react";

interface BulletRewritesProps {
  rewrites: BulletPointRewrite[];
}

export default function BulletRewrites({ rewrites }: BulletRewritesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!rewrites || rewrites.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-[#121316] border border-white/[0.08] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-pulse" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              AI Bullet Point Rewrites (Google XYZ Formula)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Weak and passive experience statements transformed into quantified, high-impact achievements recruiters remember.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/30 text-xs font-bold text-[#FFE600]">
          <Zap className="w-3.5 h-3.5" />
          <span>{rewrites.length} Bullet Points Upgraded</span>
        </div>
      </div>

      <div className="space-y-6">
        {rewrites.map((item, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#0c0d10] border border-white/[0.08] hover:border-[#FFE600]/40 p-5 lg:p-6 transition-all duration-300 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-[#FFE600] bg-[#FFE600]/10 px-2.5 py-0.5 rounded-md border border-[#FFE600]/30">
                  REWRITE #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(item.improved, idx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(255,230,0,0.25)] hover:shadow-[0_0_20px_rgba(255,230,0,0.4)] active:scale-95 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Improved Bullet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                    <span>Original Resume Bullet</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      Unquantified / Low Impact
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                    &quot;{item.original}&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFE600]/[0.05] border border-[#FFE600]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#FFE600]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 fill-[#FFE600]" />
                      AI Engineered Replacement
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      ATS Optimized
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                    &quot;{item.improved}&quot;
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-[#FFE600] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#FFE600] uppercase tracking-wider block">
                    Strategic AI Rationale:
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
