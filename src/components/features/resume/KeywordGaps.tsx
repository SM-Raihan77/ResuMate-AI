"use client";

import React, { useState } from "react";
import { Copy, Check, Search, PlusCircle, CheckCircle2, Sparkles } from "lucide-react";

interface KeywordGapsProps {
  missingKeywords: string[];
  matchedKeywords?: string[];
}

export default function KeywordGaps({
  missingKeywords,
  matchedKeywords = [],
}: KeywordGapsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"missing" | "matched">("missing");

  const filteredMissing = missingKeywords.filter((kw) =>
    kw.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMatched = matchedKeywords.filter((kw) =>
    kw.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleCopyAll = () => {
    const textToCopy = missingKeywords.join(", ");
    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-[#121316] border border-white/[0.08] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-pulse" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Keyword Gap Analysis
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Critical industry and job-specific keywords to bridge ATS ranking gaps. Click any tag to copy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-black/60 p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab("missing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "missing"
                  ? "bg-[#FFE600] text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Missing ({missingKeywords.length})
            </button>
            {matchedKeywords.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("matched")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "matched"
                    ? "bg-[#FFE600] text-black shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Matched ({matchedKeywords.length})
              </button>
            )}
          </div>

          {activeTab === "missing" && missingKeywords.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied All</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter keywords (e.g. Docker, System Design, GraphQL)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-[#FFE600]/60 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
        />
      </div>

      {activeTab === "missing" ? (
        <div>
          {filteredMissing.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No matching missing keywords found.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {filteredMissing.map((keyword, idx) => {
                const isCopied = copiedKeyword === keyword;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopy(keyword)}
                    className="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/[0.08] hover:bg-rose-500/[0.18] border border-rose-500/25 hover:border-rose-500/50 text-xs font-medium text-rose-300 transition-all cursor-pointer active:scale-95"
                    title="Click to copy keyword"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-90 transition-transform" />
                    <span>{keyword}</span>
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-5 p-3.5 rounded-xl bg-[#FFE600]/5 border border-[#FFE600]/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#FFE600] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-[#FFE600] font-semibold">Optimization Tip: </strong>
              Naturally integrate these missing keywords into your Skills section and bullet point action statements. Never keyword-stuff in invisible text, as modern ATS flags hidden text as fraudulent.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {filteredMatched.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No matching detected keywords found.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {filteredMatched.map((keyword, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25 text-xs font-medium text-emerald-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{keyword}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
