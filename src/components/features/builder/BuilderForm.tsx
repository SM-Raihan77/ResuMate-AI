"use client";

import React, { useState } from "react";
import { ResumeBuilderState } from "@/types/builder";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { User, Briefcase, GraduationCap, Code, FolderGit2, Award } from "lucide-react";

interface BuilderFormProps {
  data: ResumeBuilderState;
  onChange: (updated: ResumeBuilderState) => void;
}

type TabKey = "personal" | "experience" | "education" | "skills" | "projects" | "certifications";

export function BuilderForm({ data, onChange }: BuilderFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  const tabs: { key: TabKey; label: string; icon: React.ElementType; count?: number }[] = [
    { key: "personal", label: "Personal", icon: User },
    { key: "experience", label: "Experience", icon: Briefcase, count: data.experience.length },
    { key: "education", label: "Education", icon: GraduationCap, count: data.education.length },
    { key: "skills", label: "Skills", icon: Code, count: data.skills.reduce((acc, c) => acc + c.skills.length, 0) },
    { key: "projects", label: "Projects", icon: FolderGit2, count: data.projects.length },
    { key: "certifications", label: "Certificates", icon: Award, count: data.certifications.length },
  ];

  return (
    <div className="flex flex-col h-full bg-[#121316] rounded-3xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-1.5 p-3 sm:p-4 border-b border-white/[0.08] bg-[#16181d] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.3)] font-black"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-gray-400"}`} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? "bg-black/20 text-black" : "bg-white/[0.08] text-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Form Body */}
      <div className="p-5 sm:p-6 overflow-y-auto flex-1 max-h-[calc(100vh-230px)] space-y-6">
        {activeTab === "personal" && (
          <PersonalInfoSection
            data={data.personal}
            onChange={(personal) => onChange({ ...data, personal })}
          />
        )}

        {activeTab === "experience" && (
          <ExperienceSection
            data={data.experience}
            onChange={(experience) => onChange({ ...data, experience })}
          />
        )}

        {activeTab === "education" && (
          <EducationSection
            data={data.education}
            onChange={(education) => onChange({ ...data, education })}
          />
        )}

        {activeTab === "skills" && (
          <SkillsSection
            data={data.skills}
            targetJobTitle={data.personal.jobTitle}
            onChange={(skills) => onChange({ ...data, skills })}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsSection
            data={data.projects}
            onChange={(projects) => onChange({ ...data, projects })}
          />
        )}

        {activeTab === "certifications" && (
          <CertificationsSection
            data={data.certifications}
            onChange={(certifications) => onChange({ ...data, certifications })}
          />
        )}
      </div>
    </div>
  );
}
