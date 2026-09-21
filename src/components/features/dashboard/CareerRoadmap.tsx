"use client";

import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Target,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  BookOpen,
  Briefcase,
  Code,
  Users,
} from "lucide-react";
import { CareerMilestone, SkillGapItem } from "@/types/dashboard";

interface CareerRoadmapProps {
  milestones: CareerMilestone[];
  skillGaps: SkillGapItem[];
  targetRole: string;
  onToggleMilestone: (id: string) => void;
  onAddMilestone?: (milestone: Partial<CareerMilestone>) => void;
}

export function CareerRoadmap({
  milestones,
  skillGaps,
  targetRole,
  onToggleMilestone,
  onAddMilestone,
}: CareerRoadmapProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<CareerMilestone["category"]>("Coding");

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const categories = ["All", "Resume", "Portfolio", "Interview", "Coding", "Networking"];

  const filteredMilestones =
    filterCategory === "All"
      ? milestones
      : milestones.filter((m) => m.category === filterCategory);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onAddMilestone) {
      onAddMilestone({
        title: newTitle.trim(),
        description: "Custom candidate roadmap objective",
        category: newCategory,
        completed: false,
        dueDate: "In Progress",
        weight: 15,
      });
    }
    setNewTitle("");
    setIsAddingNew(false);
  };

  const getCategoryIcon = (category: CareerMilestone["category"]) => {
    switch (category) {
      case "Resume":
        return BookOpen;
      case "Portfolio":
        return Briefcase;
      case "Interview":
        return Sparkles;
      case "Coding":
        return Code;
      case "Networking":
        return Users;
      default:
        return Target;
    }
  };

  return (
    <div
      id="roadmap"
      className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 backdrop-blur-sm shadow-sm space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Career Planning & Roadmap Milestones
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Target Role: <strong className="text-neutral-200 font-medium">{targetRole}</strong> • Track your readiness path
          </p>
        </div>

        {/* Milestone Completion Badge */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800 self-start sm:self-auto">
          <div className="text-right">
            <p className="text-[10px] uppercase font-semibold text-neutral-400">Roadmap Progress</p>
            <p className="text-xs font-bold text-[#FFE600] font-mono">
              {completedCount} / {milestones.length} Completed ({progressPercent}%)
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/20 flex items-center justify-center text-[#FFE600] font-mono font-bold text-xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Milestones Checklist & Skill Gaps Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Milestone Checklist */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? "bg-[#FFE600] text-neutral-950 font-semibold"
                      : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FFE600] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          {/* New Milestone Inline Form */}
          {isAddingNew && (
            <form
              onSubmit={handleAddSubmit}
              className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-700 space-y-3 animate-in fade-in"
            >
              <p className="text-xs font-semibold text-white">Add Custom Milestone</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Complete System Design Primer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFE600]"
                  autoFocus
                />
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as CareerMilestone["category"])
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#FFE600]"
                >
                  <option value="Coding">Coding</option>
                  <option value="Interview">Interview</option>
                  <option value="Resume">Resume</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-[#FFE600] text-neutral-950 font-semibold hover:bg-[#FFE600]/90"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          )}

          {/* Checklist Items */}
          <div className="space-y-2">
            {filteredMilestones.map((milestone) => {
              const Icon = getCategoryIcon(milestone.category);
              return (
                <div
                  key={milestone.id}
                  onClick={() => onToggleMilestone(milestone.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                    milestone.completed
                      ? "bg-neutral-950/20 border-neutral-800/50 opacity-75"
                      : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/40"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      aria-label="Toggle milestone"
                      className="mt-0.5 shrink-0"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#FFE600] fill-[#FFE600]/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-500 group-hover:text-[#FFE600] transition-colors" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm font-medium transition-colors ${
                            milestone.completed
                              ? "line-through text-neutral-500"
                              : "text-white group-hover:text-[#FFE600]"
                          }`}
                        >
                          {milestone.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-medium bg-neutral-800 text-neutral-400">
                          {milestone.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      milestone.completed
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {milestone.dueDate || "In Progress"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Skill Gaps & Market Demand Radar */}
        <div className="lg:col-span-5 space-y-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FFE600]" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">
                Skill Gaps & Market Calibration
              </h3>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">Q1 2025 Index</span>
          </div>

          <div className="space-y-2.5">
            {skillGaps.map((skill, index) => {
              const isAcquired = skill.status === "Acquired";
              const isInProgress = skill.status === "In Progress";
              return (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{skill.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${
                        isAcquired
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isInProgress
                          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {skill.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Market Hiring Demand</span>
                      <span className="text-white font-mono font-medium">
                        {skill.marketDemandScore}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${skill.marketDemandScore}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-400 italic">
                    💡 <strong className="text-neutral-300 font-medium">Recommended:</strong>{" "}
                    {skill.recommendedCourseOrProject}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-800">
            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
              Targeted skill gap closure raises your hiring manager callback rate by{" "}
              <strong className="text-[#FFE600] font-medium">up to 3.4x</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
