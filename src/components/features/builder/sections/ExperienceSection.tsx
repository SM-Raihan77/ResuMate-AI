"use client";

import React, { useState } from "react";
import { ResumeExperience } from "@/types/builder";
import { AIBuilderService } from "@/services/ai-builder.service";
import { Briefcase, Plus, Trash2, Sparkles, Loader2, Check, Wand2, X } from "lucide-react";

interface ExperienceSectionProps {
  data: ResumeExperience[];
  onChange: (updated: ResumeExperience[]) => void;
}

export function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
  const [rewritingKey, setRewritingKey] = useState<string | null>(null);
  const [bulletAlternatives, setBulletAlternatives] = useState<{
    expId: string;
    bulletIdx: number;
    options: string[];
  } | null>(null);

  const handleAddExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      role: "Software Engineer",
      company: "Company Name",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "Present",
      current: true,
      highlights: [
        "Spearheaded technical development of core product features, improving system performance by 30%.",
        "Collaborated with cross-functional product and engineering teams to deploy microservices.",
      ],
    };
    onChange([...data, newExp]);
  };

  const handleRemoveExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const handleUpdateExperience = (id: string, field: keyof ResumeExperience, value: any) => {
    onChange(
      data.map((exp) => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      })
    );
  };

  const handleAddBullet = (expId: string) => {
    onChange(
      data.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            highlights: [...exp.highlights, "Engineered scalable feature resulting in measurable performance improvement."],
          };
        }
        return exp;
      })
    );
  };

  const handleUpdateBullet = (expId: string, bulletIdx: number, value: string) => {
    onChange(
      data.map((exp) => {
        if (exp.id === expId) {
          const updatedBullets = [...exp.highlights];
          updatedBullets[bulletIdx] = value;
          return { ...exp, highlights: updatedBullets };
        }
        return exp;
      })
    );
  };

  const handleRemoveBullet = (expId: string, bulletIdx: number) => {
    onChange(
      data.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            highlights: exp.highlights.filter((_, idx) => idx !== bulletIdx),
          };
        }
        return exp;
      })
    );
  };

  const handleAIRewriteBullet = async (exp: ResumeExperience, bulletIdx: number) => {
    const rawBullet = exp.highlights[bulletIdx];
    if (!rawBullet) return;

    const key = `${exp.id}-${bulletIdx}`;
    setRewritingKey(key);
    setBulletAlternatives(null);

    try {
      const res = await AIBuilderService.rewriteBullet(rawBullet, exp.role, exp.company);
      if (res.success && res.improved) {
        handleUpdateBullet(exp.id, bulletIdx, res.improved);
        if (res.alternatives && res.alternatives.length > 0) {
          setBulletAlternatives({
            expId: exp.id,
            bulletIdx,
            options: [res.improved, ...res.alternatives],
          });
        }
      }
    } catch (err) {
      console.error("Failed to AI rewrite bullet:", err);
    } finally {
      setRewritingKey(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#FFE600]" />
            <span>Work Experience ({data.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Optimize bullets with the Google XYZ Formula: &quot;Accomplished [X], measured by [Y], by doing [Z]&quot;.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(255,230,0,0.25)] cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.map((exp, expIdx) => (
          <div
            key={exp.id}
            className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/[0.08] space-y-4 relative group"
          >
            {/* Position header & Delete */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-bold text-[#FFE600]">
                Position #{expIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExperience(exp.id)}
                title="Remove Experience"
                className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Job Role / Title
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                  placeholder="e.g. Google / TechScale"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
                  placeholder="San Francisco, CA or Remote"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                    placeholder="2022-01"
                    className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? "Present" : exp.endDate}
                    onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                    placeholder="Present"
                    className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Currently working checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => {
                  handleUpdateExperience(exp.id, "current", e.target.checked);
                  if (e.target.checked) {
                    handleUpdateExperience(exp.id, "endDate", "Present");
                  }
                }}
                className="w-4 h-4 rounded border-white/[0.2] bg-black/40 text-[#FFE600] focus:ring-0 cursor-pointer"
              />
              <label htmlFor={`current-${exp.id}`} className="text-xs text-gray-300 cursor-pointer">
                I currently work in this role
              </label>
            </div>

            {/* Highlights Bullet Points */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">
                  Accomplishment Bullets ({exp.highlights.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddBullet(exp.id)}
                  className="text-[11px] font-bold text-[#FFE600] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Bullet</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {exp.highlights.map((bullet, bIdx) => {
                  const key = `${exp.id}-${bIdx}`;
                  const isRewriting = rewritingKey === key;
                  const hasAlternatives =
                    bulletAlternatives?.expId === exp.id &&
                    bulletAlternatives?.bulletIdx === bIdx;

                  return (
                    <div key={bIdx} className="space-y-1.5">
                      <div className="flex items-start gap-2 group/bullet">
                        <span className="text-[#FFE600] font-bold text-sm mt-1.5">•</span>
                        <div className="flex-1 space-y-1">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                            placeholder="Draft achievement (e.g. Built streaming pipeline reducing latency by 40%)..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] leading-relaxed transition-colors"
                          />
                        </div>

                        {/* Enhance with AI Button */}
                        <button
                          type="button"
                          onClick={() => handleAIRewriteBullet(exp, bIdx)}
                          disabled={isRewriting}
                          title="Enhance with AI (Google XYZ Formula)"
                          className="mt-1 flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#FFE600]/10 hover:bg-[#FFE600]/25 border border-[#FFE600]/30 text-[#FFE600] text-xs font-semibold transition-all shrink-0 disabled:opacity-50 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(255,230,0,0.15)]"
                        >
                          {isRewriting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 fill-[#FFE600]" />
                          )}
                          <span className="hidden sm:inline text-[11px]">
                            {isRewriting ? "Optimizing..." : "AI Enhance"}
                          </span>
                        </button>

                        {/* Delete bullet */}
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(exp.id, bIdx)}
                          title="Delete Bullet"
                          className="mt-1 p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Alternatives selector if generated */}
                      {hasAlternatives && bulletAlternatives.options.length > 1 && (
                        <div className="ml-5 p-3 rounded-xl bg-[#181920] border border-[#FFE600]/30 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between text-[11px] text-[#FFE600] font-bold">
                            <span className="flex items-center gap-1.5">
                              <Wand2 className="w-3.5 h-3.5" />
                              AI Google XYZ Variations
                            </span>
                            <button
                              type="button"
                              onClick={() => setBulletAlternatives(null)}
                              className="text-gray-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {bulletAlternatives.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  handleUpdateBullet(exp.id, bIdx, opt);
                                  setBulletAlternatives(null);
                                }}
                                className="w-full text-left p-2 rounded-lg bg-black/40 hover:bg-[#FFE600]/15 border border-white/[0.06] hover:border-[#FFE600]/40 text-[11px] text-gray-300 hover:text-white transition-all flex items-start gap-2"
                              >
                                <span className="text-[#FFE600] mt-0.5 font-bold">#{optIdx + 1}</span>
                                <span>{opt}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
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
