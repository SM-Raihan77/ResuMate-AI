"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Bot,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { InterviewDifficulty, InterviewType } from "@/types/interview";

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export function MockInterviewModal({
  isOpen,
  onClose,
  defaultRole = "Senior Full-Stack & Distributed Systems Engineer",
}: MockInterviewModalProps) {
  if (!isOpen) return null;

  const router = useRouter();
  const [role, setRole] = useState(defaultRole);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("senior");
  const [interviewType, setInterviewType] = useState<InterviewType>("mixed");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/interview?role=${encodeURIComponent(role)}&difficulty=${difficulty}&type=${interviewType}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE600] flex items-center justify-center text-neutral-950">
              <Bot className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Launch AI Mock Interview
              </h3>
              <p className="text-[11px] text-neutral-400">
                Configure your interview panel parameters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleLaunch} className="space-y-4">
          {/* Target Role Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Target Position / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#FFE600]"
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Experience Seniority Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: "junior", label: "Junior" },
                  { id: "mid", label: "Mid-Level" },
                  { id: "senior", label: "Senior" },
                  { id: "lead", label: "Staff / Lead" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDifficulty(item.id)}
                  className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    difficulty === item.id
                      ? "bg-[#FFE600] text-neutral-950 border-[#FFE600] font-semibold"
                      : "bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Interview Track / Focus
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "technical", label: "Technical & Coding", desc: "Algorithms & Frameworks" },
                  { id: "behavioral", label: "Behavioral (STAR)", desc: "Leadership & Ownership" },
                  { id: "system-design", label: "System Design", desc: "Distributed Architecture" },
                  { id: "mixed", label: "Comprehensive", desc: "Full-Round Simulation" },
                ] as const
              ).map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setInterviewType(type.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    interviewType === type.id
                      ? "bg-[#FFE600]/10 border-[#FFE600]/50 text-white"
                      : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      interviewType === type.id ? "text-[#FFE600]" : "text-white"
                    }`}
                  >
                    {type.label}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-neutral-950 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-neutral-950" />
              <span>Enter Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
