import React from "react";
import { Navbar, Footer } from "@/components/shared";
import { ChatContainer } from "@/components/features/chat";
import { Sparkles, MessageSquare, Zap, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "AI Career & Interview Assistant | ResuMate AI",
  description:
    "Real-time AI coaching for resume improvements, STAR interview answers, and technical career roadmaps.",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-16 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE600]/6 blur-[200px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FFE600]/4 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                24/7 Career Intelligence
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-gray-300 font-medium">
                Google Gemini Flash Engine
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              AI Career Coach & <span className="text-[#FFE600]">Interview Strategist</span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              Ask targeted questions about resume bullet points, behavioral STAR frameworks, system design trade-offs, and tech offer negotiation tactics.
            </p>
          </div>

          {/* Chat Container */}
          <ChatContainer />
        </div>
      </main>

      <Footer />
    </div>
  );
}
