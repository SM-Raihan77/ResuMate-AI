import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/shared";
import { BuilderContainer } from "@/components/features/builder";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Resume Builder | Split-Screen ATS Resume Generator",
  description:
    "Build a job-winning, ATS-friendly resume with live A4 preview, Google XYZ bullet rewriting with Gemini AI, and instant PDF download.",
};

function BuilderFallback() {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 rounded-full text-[#FFE600] animate-spin" />
      <p className="text-xs font-mono text-gray-400">Loading Resume Builder Workspace...</p>
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE600]/6 blur-[200px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FFE600]/4 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 relative z-10 space-y-8">
          {/* Hero Banner Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                AI-Powered Resume Builder
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-gray-300 font-medium">
                Live A4 Split-Screen Editor
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Build Your ATS Resume in <br />
              <span className="text-[#FFE600]">Real-Time with Gemini AI</span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
              Draft your resume on the left and see it formatted on an A4 sheet on the right in real-time. Enhance bullets with Google XYZ formulas and export crisp PDFs instantly.
            </p>

            {/* Feature Pills */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                <span>Live Reactive Preview</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google XYZ AI Rewriter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Print-Ready A4 Download</span>
              </div>
            </div>
          </div>

          {/* Main Split-Screen Builder Container */}
          <Suspense fallback={<BuilderFallback />}>
            <BuilderContainer />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
