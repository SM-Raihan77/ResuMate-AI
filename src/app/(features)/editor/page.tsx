import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/shared";
import { ResumeEditor } from "@/components/features/editor/ResumeEditor";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Editor",
  description: "Step-by-step resume creation and editing powered by AI and PostgreSQL persistence.",
};

function EditorFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-[#FFE600]" />
      <p className="text-xs font-mono text-gray-400">Loading Resume Editor...</p>
    </div>
  );
}

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE600]/6 blur-[200px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FFE600]/4 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 relative z-10">
          <Suspense fallback={<EditorFallback />}>
            <ResumeEditor />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
