"use client";

import React, { useState } from "react";
import { ResumePersonal } from "@/types/builder";
import { AIBuilderService } from "@/services/ai-builder.service";
import { Sparkles, User, Mail, Phone, MapPin, Globe, Wand2, Check, Loader2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

interface PersonalInfoSectionProps {
  data: ResumePersonal;
  onChange: (updated: ResumePersonal) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeAppliedIdx, setActiveAppliedIdx] = useState<number | null>(null);

  const handleChange = (field: keyof ResumePersonal, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleEnhanceSummary = async () => {
    setIsEnhancing(true);
    setActiveAppliedIdx(null);
    try {
      const res = await AIBuilderService.enhanceSummary(data.jobTitle, data.summary);
      if (res.success && res.suggestions.length > 0) {
        setAiSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error("Failed to enhance summary:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApplySuggestion = (sug: string, idx: number) => {
    handleChange("summary", sug);
    setActiveAppliedIdx(idx);
    setTimeout(() => {
      setAiSuggestions([]);
      setActiveAppliedIdx(null);
    }, 400);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-white/[0.08] pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-[#FFE600]" />
          <span>Personal & Contact Information</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Provide recruiter contact info and a strong executive profile summary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Full Name <span className="text-[#FFE600]">*</span>
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Target Job Title <span className="text-[#FFE600]">*</span>
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Email Address <span className="text-[#FFE600]">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="alex@example.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
            />
            <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
            />
            <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
            />
            <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Portfolio Website */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Portfolio / Website
          </label>
          <div className="relative">
            <input
              type="url"
              value={data.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourportfolio.dev"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
            />
            <Globe className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            LinkedIn Profile
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/username"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
            />
            <FaLinkedin className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            GitHub Profile
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="github.com/username"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors"
            />
            <FaGithub className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* Summary with AI Assistant */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-300">
            Professional Summary
          </label>
          <button
            type="button"
            onClick={handleEnhanceSummary}
            disabled={isEnhancing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFE600]/10 hover:bg-[#FFE600]/20 border border-[#FFE600]/30 text-[11px] font-bold text-[#FFE600] transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-[0_0_12px_rgba(255,230,0,0.15)]"
          >
            {isEnhancing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFE600]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 fill-[#FFE600]" />
            )}
            <span>{isEnhancing ? "Optimizing with AI..." : "Enhance with AI"}</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Brief 2-3 sentence overview highlighting your core technical competencies, scale of systems built, and key quantified achievements."
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600] transition-colors leading-relaxed"
        />

        {/* AI Suggestions Dropdown Cards */}
        {aiSuggestions.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#17181c] border border-[#FFE600]/40 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#FFE600] flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                Gemini AI Summary Variations (Click to Apply)
              </span>
              <button
                type="button"
                onClick={() => setAiSuggestions([])}
                className="text-[10px] text-gray-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>

            <div className="space-y-2">
              {aiSuggestions.map((sug, i) => {
                const isSelected = activeAppliedIdx === i;
                return (
                  <div
                    key={i}
                    onClick={() => handleApplySuggestion(sug, i)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-[#FFE600]/20 border-[#FFE600] shadow-[0_0_15px_rgba(255,230,0,0.2)]"
                        : "bg-white/[0.03] hover:bg-[#FFE600]/10 border-white/[0.06] hover:border-[#FFE600]/40"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? "bg-[#FFE600] text-black"
                          : "bg-white/[0.05] text-gray-400 group-hover:bg-[#FFE600] group-hover:text-black"
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug group-hover:text-white">
                      {sug}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
