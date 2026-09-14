"use client";

import React, { useState } from "react";
import { ResumeSkillCategory } from "@/types/builder";
import { Code, Plus, Trash2, X, Sparkles, Wand2 } from "lucide-react";

interface SkillsSectionProps {
  data: ResumeSkillCategory[];
  onChange: (updated: ResumeSkillCategory[]) => void;
  targetJobTitle?: string;
}

export function SkillsSection({ data, onChange, targetJobTitle }: SkillsSectionProps) {
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ categoryName: string; skills: string[] }[]>([]);

  const handleAddCategory = () => {
    const newCat: ResumeSkillCategory = {
      id: `skill-${Date.now()}`,
      categoryName: "New Skill Group",
      skills: ["Skill 1", "Skill 2"],
    };
    onChange([...data, newCat]);
  };

  const handleRemoveCategory = (catId: string) => {
    onChange(data.filter((c) => c.id !== catId));
  };

  const handleUpdateCategoryName = (catId: string, name: string) => {
    onChange(
      data.map((c) => (c.id === catId ? { ...c, categoryName: name } : c))
    );
  };

  const handleAddSkillTag = (catId: string) => {
    const val = (newSkillInput[catId] || "").trim();
    if (!val) return;

    onChange(
      data.map((c) => {
        if (c.id === catId) {
          if (c.skills.includes(val)) return c;
          return { ...c, skills: [...c.skills, val] };
        }
        return c;
      })
    );

    setNewSkillInput((prev) => ({ ...prev, [catId]: "" }));
  };

  const handleRemoveSkillTag = (catId: string, skillName: string) => {
    onChange(
      data.map((c) => {
        if (c.id === catId) {
          return { ...c, skills: c.skills.filter((s) => s !== skillName) };
        }
        return c;
      })
    );
  };

  const handleAISuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const res = await fetch("/api/builder/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest-skills",
          payload: { jobTitle: targetJobTitle || "Full Stack Engineer" },
        }),
      });
      const resData = await res.json();
      if (resData.categories && resData.categories.length > 0) {
        setAiSuggestions(resData.categories);
      }
    } catch (err) {
      console.error("Failed to suggest skills:", err);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  const handleApplyAllAISkills = () => {
    const formatted: ResumeSkillCategory[] = aiSuggestions.map((cat, idx) => ({
      id: `skill-ai-${Date.now()}-${idx}`,
      categoryName: cat.categoryName,
      skills: cat.skills,
    }));
    onChange(formatted);
    setAiSuggestions([]);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-[#FFE600]" />
            <span>Technical Skills & Competencies</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Organize core stack, frameworks, cloud databases, and tools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAISuggestSkills}
            disabled={isSuggestingSkills}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE600]/10 hover:bg-[#FFE600]/20 border border-[#FFE600]/30 text-xs font-bold text-[#FFE600] transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSuggestingSkills ? "animate-spin" : ""}`} />
            <span>{isSuggestingSkills ? "Recommending..." : "AI Suggest Skills"}</span>
          </button>

          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-white transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#17181c] border border-[#FFE600]/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FFE600] flex items-center gap-1.5">
              <Wand2 className="w-4 h-4" />
              AI Recommended Skills for &quot;{targetJobTitle || "Engineer"}&quot;
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleApplyAllAISkills}
                className="px-2.5 py-1 rounded-lg bg-[#FFE600] text-black font-bold hover:bg-[#FFD000]"
              >
                Apply All Groups
              </button>
              <button
                type="button"
                onClick={() => setAiSuggestions([])}
                className="text-gray-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {aiSuggestions.map((cat, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
                <p className="text-[11px] font-bold text-gray-200">{cat.categoryName}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.1] text-[10px] text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Categories */}
      <div className="space-y-4">
        {data.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-2xl bg-black/30 border border-white/[0.08] space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={cat.categoryName}
                onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
                placeholder="Category Name (e.g. Languages & Frameworks)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-bold text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
              />

              <button
                type="button"
                onClick={() => handleRemoveCategory(cat.id)}
                title="Remove Category"
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Skills Tag Pills */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillTag(cat.id, skill)}
                    className="text-[#FFE600]/60 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Add Tag Input */}
              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add skill (Press Enter)"
                  value={newSkillInput[cat.id] || ""}
                  onChange={(e) =>
                    setNewSkillInput((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkillTag(cat.id);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-dashed border-white/[0.15] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] w-36"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillTag(cat.id)}
                  className="p-1 rounded-lg bg-white/[0.06] text-gray-300 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
