"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { ResumeBuilderState, ACCENT_COLOR_OPTIONS, ResumeTemplateId } from "@/types/builder";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Palette,
  Layout,
  Check,
  Sparkles,
  Loader2,
  FileCheck,
} from "lucide-react";

interface BuilderPreviewProps {
  data: ResumeBuilderState;
  onChange: (updated: ResumeBuilderState) => void;
}

export function BuilderPreview({ data, onChange }: BuilderPreviewProps) {
  const resumePrintRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(95);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Custom CSS injected during react-to-print execution
  const pageStyle = `
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    @media print {
      html, body {
        background-color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .printable-resume-page {
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        min-height: auto !important;
        transform: none !important;
      }
      .resume-section {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .resume-entry {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

  // react-to-print hook configuration
  const handlePrint = useReactToPrint({
    contentRef: resumePrintRef,
    documentTitle: `${data.personal.fullName.replace(/\s+/g, "_") || "Candidate"}_Resume`,
    pageStyle,
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const templates: { id: ResumeTemplateId; name: string }[] = [
    { id: "modern", name: "Modern Cyber" },
    { id: "minimalist", name: "Minimalist FAANG" },
    { id: "executive", name: "Executive" },
  ];

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(130, Math.max(70, prev + delta)));
  };

  return (
    <div className="flex flex-col h-full bg-[#121316] rounded-3xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Top Preview Controls Bar */}
      <div className="p-3 sm:p-4 border-b border-white/[0.08] bg-[#16181d] flex flex-wrap items-center justify-between gap-3">
        {/* Template Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.08]">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ ...data, template: t.id })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                data.template === t.id
                  ? "bg-[#FFE600] text-black shadow-sm font-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Accent Color Picker, Zoom & Print Action */}
        <div className="flex items-center gap-3">
          {/* Accent Palette */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.08]">
            {ACCENT_COLOR_OPTIONS.map((color) => {
              const isSelected = data.accentColor === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => onChange({ ...data, accentColor: color.value })}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: color.value }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3 h-3 ${
                        color.value === "#FFE600" ? "text-black" : "text-white"
                      } stroke-[3]`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/[0.08] text-gray-400">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              title="Zoom Out"
              className="p-1 hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 font-semibold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              title="Zoom In"
              className="p-1 hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download PDF / Print Button */}
          <button
            type="button"
            onClick={() => handlePrint()}
            disabled={isPrinting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] disabled:opacity-60 text-black text-xs font-black transition-all shadow-[0_0_20px_rgba(255,230,0,0.35)] hover:shadow-[0_0_30px_rgba(255,230,0,0.55)] cursor-pointer active:scale-95 shrink-0"
          >
            {isPrinting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isPrinting ? "Generating PDF..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Live A4 Sheet Preview Canvas */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#090a0d] flex justify-center items-start min-h-[550px] max-h-[calc(100vh-230px)]">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-sm overflow-hidden"
        >
          {/* Printable A4 Container (Fixed A4 paper standard: 210mm x 297mm) */}
          <div
            ref={resumePrintRef}
            className="w-[210mm] min-h-[297mm] p-[14mm] bg-white text-slate-900 shadow-2xl printable-resume-page"
            style={{ boxSizing: "border-box" }}
          >
            {data.template === "modern" && <ModernTemplate data={data} />}
            {data.template === "minimalist" && <MinimalistTemplate data={data} />}
            {data.template === "executive" && <ExecutiveTemplate data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}
