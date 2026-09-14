import React from "react";
import { ResumeBuilderState } from "@/types/builder";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

interface TemplateProps {
  data: ResumeBuilderState;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications, accentColor } = data;

  return (
    <div className="text-slate-900 bg-white font-sans leading-normal text-[11px] select-text">
      {/* 1. Header Section */}
      <header className="border-b-2 pb-3.5 mb-3.5 resume-section" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
              {personal.fullName || "Your Full Name"}
            </h1>
            <p
              className="text-sm font-bold tracking-wide mt-0.5"
              style={{ color: accentColor === "#FFE600" ? "#b45309" : accentColor }}
            >
              {personal.jobTitle || "Target Job Title"}
            </p>
          </div>
        </div>

        {/* Contact info bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-600 mt-2">
          {personal.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500" />
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-500" />
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {personal.location}
            </span>
          )}
          {personal.website && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-500" />
              {personal.website.replace(/^https?:\/\//, "")}
            </span>
          )}
          {personal.linkedin && (
            <span className="inline-flex items-center gap-1">
              <FaLinkedin className="w-3 h-3 text-slate-500" />
              {personal.linkedin.replace(/^https?:\/\//, "")}
            </span>
          )}
          {personal.github && (
            <span className="inline-flex items-center gap-1">
              <FaGithub className="w-3 h-3 text-slate-500" />
              {personal.github.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {personal.summary && (
        <section className="mb-3.5 resume-section">
          <h2
            className="text-[11.5px] font-black uppercase tracking-wider pb-0.5 mb-1 border-b"
            style={{ borderColor: "#e2e8f0", color: accentColor === "#FFE600" ? "#92400e" : accentColor }}
          >
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">{personal.summary}</p>
        </section>
      )}

      {/* 3. Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2
            className="text-[11.5px] font-black uppercase tracking-wider pb-0.5 mb-2 border-b"
            style={{ borderColor: "#e2e8f0", color: accentColor === "#FFE600" ? "#92400e" : accentColor }}
          >
            Work Experience
          </h2>

          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1 resume-entry">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-[11.5px]">{exp.role}</span>
                    <span className="text-slate-700 font-medium"> — {exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-[10px]"> ({exp.location})</span>}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
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

      {/* 4. Projects Section */}
      {projects.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2
            className="text-[11.5px] font-black uppercase tracking-wider pb-0.5 mb-2 border-b"
            style={{ borderColor: "#e2e8f0", color: accentColor === "#FFE600" ? "#92400e" : accentColor }}
          >
            Key Projects
          </h2>

          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5 resume-entry">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span className="text-slate-500 text-[10px]"> | {proj.techStack.join(" • ")}</span>
                    )}
                  </div>
                  {proj.link && (
                    <span className="text-[10px] text-blue-600 underline">
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

      {/* 5. Technical Skills */}
      {skills.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2
            className="text-[11.5px] font-black uppercase tracking-wider pb-0.5 mb-1.5 border-b"
            style={{ borderColor: "#e2e8f0", color: accentColor === "#FFE600" ? "#92400e" : accentColor }}
          >
            Technical Skills
          </h2>

          <div className="space-y-1">
            {skills.map((cat) => (
              <div key={cat.id} className="flex items-baseline text-[10.5px] resume-entry">
                <span className="font-bold text-slate-900 w-36 shrink-0">{cat.categoryName}:</span>
                <span className="text-slate-700">{cat.skills.join(" • ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Education Section */}
      {education.length > 0 && (
        <section className="mb-3.5 resume-section">
          <h2
            className="text-[11.5px] font-black uppercase tracking-wider pb-0.5 mb-1.5 border-b"
            style={{ borderColor: "#e2e8f0", color: accentColor === "#FFE600" ? "#92400e" : accentColor }}
          >
            Education & Academic Background
          </h2>

          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline resume-entry">
                <div>
                  <span className="font-bold text-slate-900">
                    {edu.degree} in {edu.fieldOfStudy}
                  </span>
                  <p className="text-slate-600 text-[10px]">
                    {edu.institution} {edu.location && `— ${edu.location}`}
                    {edu.gpaOrHonors && ` • ${edu.gpaOrHonors}`}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                  {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Certifications */}
      {certifications.length > 0 && (
        <section className="mb-1 resume-section">
          <h2
            className="text-[11.5px] font-black uppercase tracking-wider pb-0.5 mb-1.5 border-b"
            style={{ borderColor: "#e2e8f0", color: accentColor === "#FFE600" ? "#92400e" : accentColor }}
          >
            Certifications & Credentials
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10.5px]">
            {certifications.map((cert) => (
              <div key={cert.id} className="resume-entry">
                <span className="font-bold text-slate-900">{cert.name}</span>
                <span className="text-slate-500 text-[10px]"> — {cert.issuer} ({cert.issueDate})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
