"use client";

import React from "react";
import { ResumeCertification } from "@/types/builder";
import { Award, Plus, Trash2 } from "lucide-react";

interface CertificationsSectionProps {
  data: ResumeCertification[];
  onChange: (updated: ResumeCertification[]) => void;
}

export function CertificationsSection({ data, onChange }: CertificationsSectionProps) {
  const handleAddCertification = () => {
    const newCert: ResumeCertification = {
      id: `cert-${Date.now()}`,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2024",
    };
    onChange([...data, newCert]);
  };

  const handleRemoveCertification = (id: string) => {
    onChange(data.filter((c) => c.id !== id));
  };

  const handleUpdateCertification = (id: string, field: keyof ResumeCertification, value: any) => {
    onChange(
      data.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FFE600]" />
            <span>Certifications & Credentials ({data.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Add industry certifications, cloud licenses, and achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCertification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.map((cert) => (
          <div
            key={cert.id}
            className="p-3.5 rounded-2xl bg-black/30 border border-white/[0.08] flex items-center justify-between gap-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
              <input
                type="text"
                value={cert.name}
                onChange={(e) => handleUpdateCertification(cert.id, "name", e.target.value)}
                placeholder="Certification Name"
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
              />
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleUpdateCertification(cert.id, "issuer", e.target.value)}
                placeholder="Issuing Organization (e.g. AWS)"
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
              />
              <input
                type="text"
                value={cert.issueDate}
                onChange={(e) => handleUpdateCertification(cert.id, "issueDate", e.target.value)}
                placeholder="Year (e.g. 2024)"
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFE600]"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveCertification(cert.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
