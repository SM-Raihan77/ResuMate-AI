"use client";

import React from "react";
import { ResumeEducation } from "@/types/builder";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface EducationSectionProps {
  data: ResumeEducation[];
  onChange: (updated: ResumeEducation[]) => void;
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
  const handleAddEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      institution: "University Name",
      location: "City, State",
      startDate: "2018",
      endDate: "2022",
      current: false,
      gpaOrHonors: "3.8 GPA",
    };
    onChange([...data, newEdu]);
  };

  const handleRemoveEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const handleUpdateEducation = (id: string, field: keyof ResumeEducation, value: any) => {
    onChange(
      data.map((edu) => {
        if (edu.id === id) {
          return { ...edu, [field]: value };
        }
        return edu;
      })
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#FFE600]" />
            <span>Education & Degrees ({data.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Add degrees, certifications, or academic honors.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/[0.08] space-y-3 relative group"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-bold text-[#FFE600]">
                Degree #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveEducation(edu.id)}
                title="Remove Education"
                className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Field of Study / Major
                </label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleUpdateEducation(edu.id, "fieldOfStudy", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Institution / University
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                  placeholder="e.g. UC Berkeley"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleUpdateEducation(edu.id, "location", e.target.value)}
                  placeholder="e.g. Berkeley, CA"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Graduation Year / Dates
                </label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => handleUpdateEducation(edu.id, "endDate", e.target.value)}
                  placeholder="e.g. 2021"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  GPA or Honors (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpaOrHonors || ""}
                  onChange={(e) => handleUpdateEducation(edu.id, "gpaOrHonors", e.target.value)}
                  placeholder="e.g. 3.9 GPA, Magna Cum Laude"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
