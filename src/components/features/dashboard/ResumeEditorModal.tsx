"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Save,
  Check,
  FileText,
  Briefcase,
  Code2,
  Wand2,
} from "lucide-react";
import { ResumeDocument } from "@/types/dashboard";

interface ResumeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeDocument | null;
  onSave: (updatedResume: ResumeDocument) => void;
}

export function ResumeEditorModal({
  isOpen,
  onClose,
  resume,
  onSave,
}: ResumeEditorModalProps) {
  if (!isOpen || !resume) return null;

  const [title, setTitle] = useState(resume.title);
  const [targetRole, setTargetRole] = useState(resume.targetRole);
  const [summary, setSummary] = useState(resume.summary);
  const [skillsText, setSkillsText] = useState(resume.skills.join(", "));
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleAIPolishSummary = () => {
    setIsPolishing(true);
    setTimeout(() => {
      setSummary(
        (prev) =>
          prev +
          " Engineered high-performance microservices delivering 99.99% SLA availability and reduced operational latency by 45% using Google XYZ metric quantification."
      );
      setIsPolishing(false);
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSkills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: ResumeDocument = {
      ...resume,
      title,
      targetRole,
      summary,
      skills: updatedSkills,
      lastUpdated: "Updated just now",
      atsScore: Math.min(100, resume.atsScore + 4),
    };

    onSave(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/20 flex items-center justify-center text-[#FFE600]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Edit Resume Document
              </h3>
              <p className="text-[11px] text-neutral-400">
                Adjust ATS parameters and polish executive bullet points
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

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Document Title / File Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#FFE600]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#FFE600]"
                required
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-300">
                Professional Summary
              </label>
              <button
                type="button"
                onClick={handleAIPolishSummary}
                disabled={isPolishing}
                className="text-[11px] text-[#FFE600] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>{isPolishing ? "Enhancing..." : "AI Enhance Bullets"}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#FFE600] leading-relaxed resize-none"
              required
            />
          </div>

          {/* Skills List */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#FFE600]"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-neutral-950 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
