import React from "react";
import { ResumeBuilderState } from "@/types/builder";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

interface TemplateProps {
  data: ResumeBuilderState;
}

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications, accentColor } = data;

  const headerBg = accentColor === "#FFE600" ? "#1e293b" : accentColor;
  const headerText = "#ffffff";

  return (
    <div className="text-slate-900 bg-white font-sans leading-normal text-[11px] select-text">
      {/* Executive Header Banner */}
      <header
        className="p-4 mb-3.5 rounded-lg text-white resume-section"
        style={{ backgroundColor: headerBg, color: headerText }}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              {personal.fullName || "Your Full Name"}
            </h1>
            <p className="text-xs font-semibold text-amber-300 tracking-wider uppercase mt-0.5">
              {personal.jobTitle || "Target Job Title"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-200 mt-2.5 pt-2 border-t border-white/20">
          {personal.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-300" />
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-300" />
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-300" />
              {personal.location}
            </span>
          )}
          {personal.website && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-300" />
              {personal.website.replace(/^https?:\/\//, "")}
            </span>
          )}
          {personal.linkedin && (
            <span className="inline-flex items-center gap-1">
              <FaLinkedin className="w-3 h-3 text-amber-300" />
              {personal.linkedin.replace(/^https?:\/\//, "")}
            </span>
          )}
          {personal.github && (
            <span className="inline-flex items-center gap-1">
              <FaGithub className="w-3 h-3 text-amber-300" />
              {personal.github.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900 mb-1.5 pb-0.5 border-b-2 border-slate-800">
            Executive Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900 mb-2 pb-0.5 border-b-2 border-slate-800">
            Leadership & Experience
          </h2>

          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1 resume-entry">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-extrabold text-slate-900 text-[11.5px]">{exp.role}</span>
                    <span className="text-slate-700 font-semibold"> | {exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-[10px]"> — {exp.location}</span>}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 text-[10.5px]">
                    {exp.highlights.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900 mb-2 pb-0.5 border-b-2 border-slate-800">
            Strategic Initiatives & Projects
          </h2>

          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5 resume-entry">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span className="text-slate-500 text-[10px]"> ({proj.techStack.join(" • ")})</span>
                    )}
                  </div>
                  {proj.link && (
                    <span className="text-[10px] text-blue-700 underline">
                      {proj.link.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 text-[10.5px]">
                    {proj.highlights.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900 mb-1.5 pb-0.5 border-b-2 border-slate-800">
            Core Competencies & Stack
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10.5px]">
            {skills.map((cat) => (
              <div key={cat.id} className="resume-entry">
                <span className="font-bold text-slate-900">{cat.categoryName}: </span>
                <span className="text-slate-700">{cat.skills.join(" • ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900 mb-1.5 pb-0.5 border-b-2 border-slate-800">
            Education
          </h2>

          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline resume-entry">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <p className="text-slate-600 text-[10px]">
                    {edu.institution} {edu.location && `— ${edu.location}`}
                    {edu.gpaOrHonors && ` • ${edu.gpaOrHonors}`}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-1 resume-section">
          <h2 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900 mb-1.5 pb-0.5 border-b-2 border-slate-800">
            Certifications
          </h2>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px]">
            {certifications.map((cert) => (
              <span key={cert.id} className="resume-entry">
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.issueDate})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
