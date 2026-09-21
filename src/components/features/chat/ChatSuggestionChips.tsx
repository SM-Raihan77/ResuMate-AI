"use client";

import React from "react";
import { Sparkles, FileText, Target, TrendingUp, DollarSign, Wand2 } from "lucide-react";

interface SuggestionChip {
  label: string;
  prompt: string;
  icon: React.ElementType;
}

const DEFAULT_SUGGESTIONS: SuggestionChip[] = [
  {
    label: "Review my Resume",
    prompt: "How can I optimize my resume bullet points for Tier-1 tech ATS algorithms?",
    icon: FileText,
  },
  {
    label: "Prep for Interview",
    prompt: "Give me a mock interview question for a Senior Software Engineer using the STAR framework.",
    icon: Target,
  },
  {
    label: "Career Roadmap",
    prompt: "What are the essential milestones to level up from Mid-Level to Staff Engineer?",
    icon: TrendingUp,
  },
  {
    label: "Salary Negotiation",
    prompt: "What are the best counter-offer negotiation strategies for tech job offers?",
    icon: DollarSign,
  },
  {
    label: "Quantify Achievements",
    prompt: "How do I rewrite a passive bullet point into the Google XYZ achievement formula?",
    icon: Wand2,
  },
];

interface ChatSuggestionChipsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export default function ChatSuggestionChips({
  onSelectPrompt,
  disabled,
}: ChatSuggestionChipsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
        <span>Quick Suggested Prompts</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEFAULT_SUGGESTIONS.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPrompt(chip.prompt)}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Icon className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
