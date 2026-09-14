"use client";

import React, { useState } from "react";
import { ResumeProject } from "@/types/builder";
import { AIBuilderService } from "@/services/ai-builder.service";
import { FolderGit2, Plus, Trash2, Sparkles, X, Loader2 } from "lucide-react";

interface ProjectsSectionProps {
  data: ResumeProject[];
  onChange: (updated: ResumeProject[]) => void;
}

export function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const [techInput, setTechInput] = useState<{ [projId: string]: string }>({});
  const [rewritingKey, setRewritingKey] = useState<string | null>(null);

  const handleAddProject = () => {
    const newProj: ResumeProject = {
      id: `proj-${Date.now()}`,
      title: "Project Title",
      techStack: ["React", "TypeScript", "Node.js"],
      link: "https://github.com/username/project",
      startDate: "2023",
      endDate: "2024",
      highlights: [
        "Architected full-stack web application with responsive UI and sub-second API endpoints.",
        "Implemented automated testing and deployed to cloud infrastructure with zero downtime.",
      ],
    };
    onChange([...data, newProj]);
  };

  const handleRemoveProject = (id: string) => {
    onChange(data.filter((p) => p.id !== id));
  };

  const handleUpdateProject = (id: string, field: keyof ResumeProject, value: any) => {
    onChange(
      data.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleAddTechTag = (projId: string) => {
    const val = (techInput[projId] || "").trim();
    if (!val) return;

    onChange(
      data.map((p) => {
        if (p.id === projId) {
          if (p.techStack.includes(val)) return p;
          return { ...p, techStack: [...p.techStack, val] };
        }
        return p;
      })
    );
    setTechInput((prev) => ({ ...prev, [projId]: "" }));
  };

  const handleRemoveTechTag = (projId: string, tag: string) => {
    onChange(
      data.map((p) => {
        if (p.id === projId) {
          return { ...p, techStack: p.techStack.filter((t) => t !== tag) };
        }
        return p;
      })
    );
  };

  const handleAddBullet = (projId: string) => {
    onChange(
      data.map((p) => {
        if (p.id === projId) {
          return {
            ...p,
            highlights: [...p.highlights, "Engineered key feature boosting application efficiency by 25%."],
          };
        }
        return p;
      })
    );
  };

  const handleUpdateBullet = (projId: string, bulletIdx: number, value: string) => {
    onChange(
      data.map((p) => {
        if (p.id === projId) {
          const updated = [...p.highlights];
          updated[bulletIdx] = value;
          return { ...p, highlights: updated };
        }
        return p;
      })
    );
  };

  const handleRemoveBullet = (projId: string, bulletIdx: number) => {
    onChange(
      data.map((p) => {
        if (p.id === projId) {
          return {
            ...p,
            highlights: p.highlights.filter((_, idx) => idx !== bulletIdx),
          };
        }
        return p;
      })
    );
  };

  const handleAIRewriteBullet = async (proj: ResumeProject, bulletIdx: number) => {
    const rawBullet = proj.highlights[bulletIdx];
    if (!rawBullet) return;

    const key = `${proj.id}-${bulletIdx}`;
    setRewritingKey(key);

    try {
      const res = await AIBuilderService.rewriteBullet(rawBullet, proj.title, "Open Source Project");
      if (res.success && res.improved) {
        handleUpdateBullet(proj.id, bulletIdx, res.improved);
      }
    } catch (err) {
      console.error("Failed to AI rewrite project bullet:", err);
    } finally {
      setRewritingKey(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#FFE600]" />
            <span>Key Projects ({data.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Highlight technical flagship projects with live URLs and quantified metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(255,230,0,0.25)] cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/[0.08] space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-bold text-[#FFE600]">
                Project #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveProject(proj.id)}
                title="Remove Project"
                className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                  placeholder="e.g. ResuMate AI Platform"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Project URL / GitHub
                </label>
                <input
                  type="text"
                  value={proj.link || ""}
                  onChange={(e) => handleUpdateProject(proj.id, "link", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-gray-300">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-1.5 items-center">
                {proj.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.1] text-xs text-gray-200"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechTag(proj.id, tech)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ Add tech tag"
                    value={techInput[proj.id] || ""}
                    onChange={(e) =>
                      setTechInput((prev) => ({ ...prev, [proj.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechTag(proj.id);
                      }
                    }}
                    className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-dashed border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] w-28"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTechTag(proj.id)}
                    className="p-1 rounded-md bg-white/[0.05] text-gray-300 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-300">
                  Project Highlights
                </span>
                <button
                  type="button"
                  onClick={() => handleAddBullet(proj.id)}
                  className="text-[11px] font-bold text-[#FFE600] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Highlight</span>
                </button>
              </div>

              <div className="space-y-2">
                {proj.highlights.map((bullet, bIdx) => {
                  const isRewriting = rewritingKey === `${proj.id}-${bIdx}`;

                  return (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-[#FFE600] font-bold text-sm mt-1.5">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(proj.id, bIdx, e.target.value)}
                        placeholder="Key architectural accomplishment or metric..."
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] leading-relaxed"
                      />

                      <button
                        type="button"
                        onClick={() => handleAIRewriteBullet(proj, bIdx)}
                        disabled={isRewriting}
                        title="AI Rewrite in Google XYZ format"
                        className="mt-1 flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#FFE600]/10 hover:bg-[#FFE600]/25 border border-[#FFE600]/30 text-[#FFE600] text-xs font-semibold transition-all shrink-0 disabled:opacity-50 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(255,230,0,0.15)]"
                      >
                        {isRewriting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 fill-[#FFE600]" />
                        )}
                        <span className="hidden sm:inline text-[11px]">
                          {isRewriting ? "Rewriting..." : "AI Enhance"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(proj.id, bIdx)}
                        title="Delete Bullet"
                        className="mt-1 p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
