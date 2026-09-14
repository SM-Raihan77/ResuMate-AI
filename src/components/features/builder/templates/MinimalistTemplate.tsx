import React from "react";
import { ResumeBuilderState } from "@/types/builder";

interface TemplateProps {
  data: ResumeBuilderState;
}

export function MinimalistTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications } = data;

  return (
    <div className="text-slate-900 bg-white font-serif leading-relaxed text-[11px] select-text">
      {/* Header */}
      <header className="text-center pb-3.5 mb-3.5 border-b border-slate-300 resume-section">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase font-sans">
          {personal.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mt-1 font-sans">
          {personal.jobTitle || "Target Job Title"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-slate-600 mt-2 font-sans">
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.email && <span>• {personal.email}</span>}
          {personal.website && <span>• {personal.website.replace(/^https?:\/\//, "")}</span>}
          {personal.linkedin && <span>• {personal.linkedin.replace(/^https?:\/\//, "")}</span>}
          {personal.github && <span>• {personal.github.replace(/^https?:\/\//, "")}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5 font-sans">
            Profile Summary
          </h2>
          <p className="text-slate-800 leading-normal text-justify">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-200 pb-0.5 font-sans">
            Professional Experience
          </h2>

          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1 resume-entry">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 font-sans">{exp.company}</span>
                    <span className="text-slate-700 italic"> — {exp.role}</span>
                    {exp.location && <span className="text-slate-500 text-[10px]">, {exp.location}</span>}
                  </div>
                  <span className="text-[10px] text-slate-600 font-sans whitespace-nowrap">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 text-[10.5px]">
                    {exp.highlights.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
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
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-200 pb-0.5 font-sans">
            Technical Projects
          </h2>

          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5 resume-entry">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 font-sans">{proj.title}</span>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span className="text-slate-600 text-[10px]"> [{proj.techStack.join(", ")}]</span>
                    )}
                  </div>
                  {proj.link && (
                    <span className="text-[10px] text-slate-600 font-sans">
                      {proj.link.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 text-[10.5px]">
                    {proj.highlights.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
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
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5 font-sans">
            Skills & Competencies
          </h2>

          <div className="space-y-0.5 text-[10.5px]">
            {skills.map((cat) => (
              <p key={cat.id} className="resume-entry">
                <strong className="font-sans font-bold text-slate-900">{cat.categoryName}: </strong>
                <span className="text-slate-800">{cat.skills.join(", ")}</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5 font-sans">
            Education
          </h2>

          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline resume-entry">
                <div>
                  <span className="font-bold text-slate-900 font-sans">{edu.institution}</span>
                  <span className="text-slate-700 italic"> — {edu.degree}, {edu.fieldOfStudy}</span>
                  {edu.gpaOrHonors && <span className="text-slate-600 text-[10px]"> ({edu.gpaOrHonors})</span>}
                </div>
                <span className="text-[10px] text-slate-600 font-sans whitespace-nowrap">
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
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5 font-sans">
            Certifications
          </h2>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px]">
            {certifications.map((cert) => (
              <span key={cert.id} className="resume-entry">
                <strong>{cert.name}</strong> – {cert.issuer} ({cert.issueDate})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
