'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Briefcase, 
  BookOpen, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  GitBranch, 
  DollarSign
} from 'lucide-react';

interface ToolHighlight {
  icon: React.ElementType;
  title: string;
  description: string;
}

const outcomeTools: ToolHighlight[] = [
  {
    icon: FileText,
    title: 'AI Resume Analysis',
    description: 'Automated ATS scoring and quantified bullet point optimization.'
  },
  {
    icon: TrendingUp,
    title: 'Recommendation Engine',
    description: 'Smart job matches and career trajectory suggestions.'
  },
  {
    icon: MessageSquare,
    title: 'Career Chat Assistant',
    description: 'Conversational AI for 24/7 offer and interview coaching.'
  },
  {
    icon: Briefcase,
    title: 'Interview Simulator',
    description: 'Role-specific practice with instant audio and STAR feedback.'
  },
  {
    icon: BookOpen,
    title: 'Learning Roadmaps',
    description: 'Personalized engineering tracks tailored to your dream roles.'
  },
  {
    icon: Sliders,
    title: 'Skill Gap Analysis',
    description: 'Benchmark your stack against Tier-1 hiring manager rubrics.'
  }
];

type ToolKey = 'ats' | 'interview' | 'roadmap' | 'salary';

export default function IntelligentTools(): React.JSX.Element {
  const [activeTool, setActiveTool] = useState<ToolKey>('ats');

  return (
    <section id="tools" className="py-20 lg:py-24 bg-transparent text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#FFE600]/3 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFE600]/2 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Intelligent Tools, <span className="text-yellow-400">Real Outcomes</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Powerful features powered by cutting-edge AI to boost your career
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {outcomeTools.map((tool, idx) => {
            const IconComp = tool.icon;
            return (
              <div
                key={idx}
                className="bg-[#0b0f19]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-yellow-500/40 hover:shadow-[0_12px_35px_rgba(234,179,8,0.1)] group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform">
                  <IconComp className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Live Showcase Container */}
        <div className="relative">
          {/* Subtle background glow for floating effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/15 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

          {/* Outer Showcase Card */}
          <div className="bg-[#0b0f19]/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Ambient inner card glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Navigation Tabs Bar */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto mb-10 bg-[#070913]/80 border border-white/10 p-1.5 rounded-full backdrop-blur-md relative z-10">
              <button
                type="button"
                onClick={() => setActiveTool('ats')}
                className={`flex items-center gap-2 text-xs transition-all cursor-pointer ${
                  activeTool === 'ats' 
                    ? 'bg-yellow-500 text-black font-semibold shadow-[0_0_20px_rgba(234,179,8,0.3)] rounded-full px-5 py-2' 
                    : 'text-slate-400 hover:text-white transition-colors px-5 py-2'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${activeTool === 'ats' ? 'text-black' : 'text-yellow-400'}`} />
                <span>ATS Optimizer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('interview')}
                className={`flex items-center gap-2 text-xs transition-all cursor-pointer ${
                  activeTool === 'interview' 
                    ? 'bg-yellow-500 text-black font-semibold shadow-[0_0_20px_rgba(234,179,8,0.3)] rounded-full px-5 py-2' 
                    : 'text-slate-400 hover:text-white transition-colors px-5 py-2'
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${activeTool === 'interview' ? 'text-black' : 'text-yellow-400'}`} />
                <span>Mock Interview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('roadmap')}
                className={`flex items-center gap-2 text-xs transition-all cursor-pointer ${
                  activeTool === 'roadmap' 
                    ? 'bg-yellow-500 text-black font-semibold shadow-[0_0_20px_rgba(234,179,8,0.3)] rounded-full px-5 py-2' 
                    : 'text-slate-400 hover:text-white transition-colors px-5 py-2'
                }`}
              >
                <GitBranch className={`w-3.5 h-3.5 ${activeTool === 'roadmap' ? 'text-black' : 'text-yellow-400'}`} />
                <span>Learning Roadmap</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('salary')}
                className={`flex items-center gap-2 text-xs transition-all cursor-pointer ${
                  activeTool === 'salary' 
                    ? 'bg-yellow-500 text-black font-semibold shadow-[0_0_20px_rgba(234,179,8,0.3)] rounded-full px-5 py-2' 
                    : 'text-slate-400 hover:text-white transition-colors px-5 py-2'
                }`}
              >
                <DollarSign className={`w-3.5 h-3.5 ${activeTool === 'salary' ? 'text-black' : 'text-yellow-400'}`} />
                <span>Compensation</span>
              </button>
            </div>

            {/* Interactive Demo View */}
            {activeTool === 'ats' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200 relative z-10">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real-time ATS Rule Engine</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Deterministic ATS Parsing & Bullet Rewriting
                  </h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Most resumes fail due to unparsed tables or non-quantified bullets. ResuMate rewrites your achievements using the exact semantic keywords top recruiters seek.
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      <span>Calculates match confidence against live Job Descriptions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      <span>Eliminates formatting glitches that break Greenhouse & Lever</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/resume-analyzer"
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:scale-105 inline-flex items-center gap-2"
                    >
                      <span>Audit Resume in 10s</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Inner Preview Comparison Boxes (Original vs AI Replacement) */}
                <div className="lg:col-span-6 bg-[#070913]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-300 space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-[11px] text-red-400">
                      <span>Original Input:</span>
                      <span>Score: 44/100</span>
                    </div>
                    <p className="italic text-red-200/80 leading-relaxed">
                      &quot;Managed a database migration and improved performance of backend API endpoints.&quot;
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.1)] space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[11px]">
                      <span className="text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        AI Engineered Replacement:
                      </span>
                      <span className="text-emerald-400 font-mono">Score: 98/100</span>
                    </div>
                    <p className="text-emerald-100 font-medium leading-relaxed">
                      &quot;Spearheaded zero-downtime PostgreSQL to DynamoDB migration for 12TB user data, cutting API p99 latency from 420ms to 48ms and saving $32,000/mo in cloud infrastructure costs.&quot;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'interview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200 relative z-10">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-semibold">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Real-Time Voice Evaluator</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Simulate Tough Technical & Behavioral Rounds
                  </h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Practice with realistic questions based on your specific level. Receive immediate scoring on the STAR framework and technical conciseness.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/interview"
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:scale-105 inline-flex items-center gap-2"
                    >
                      <span>Start Mock Interview</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#070913]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3.5 text-xs">
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span className="font-semibold text-slate-300">AI Interrogator</span>
                    <span className="text-yellow-400 font-mono font-bold">STAR Method: 94%</span>
                  </div>
                  <p className="text-white font-medium leading-relaxed">
                    &quot;How do you architect a global distributed cache to prevent thundering herd during cache invalidation events?&quot;
                  </p>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                    ✓ Probabilistic Early Expiration (XFetch) cited correctly
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'roadmap' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200 relative z-10">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-semibold">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Autonomous Skill Tree</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Targeted Learning Paths With Real Milestones
                  </h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    ResuMate maps exact gaps against Staff & Lead rubrics, curating RFC blueprints and weekly milestones.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/#cta"
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:scale-105 inline-flex items-center gap-2"
                    >
                      <span>Generate My Roadmap</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#070913]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-white">1. Distributed Consensus & Raft</span>
                    <span className="text-emerald-400 font-semibold text-xs">Completed</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-between">
                    <span className="font-semibold text-yellow-400">2. Sharding & Geo-Replication</span>
                    <span className="text-yellow-400 font-semibold text-xs">In Progress</span>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'salary' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200 relative z-10">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Market Intelligence</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Calibrate Your Real Market Value & Equity
                  </h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Access verified compensation bands across Tier-1 tech hubs and receive AI counter-offer negotiation scripts.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/#cta"
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:scale-105 inline-flex items-center gap-2"
                    >
                      <span>Check Market Compensation</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#070913]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-slate-400">Estimated Total Comp (TC):</span>
                    <span className="text-lg font-black text-yellow-400 font-mono">$245,000 – $290,000</span>
                  </div>
                  <div className="flex justify-between text-neutral-300 py-1">
                    <span>Base Salary:</span>
                    <span className="text-white font-semibold">$195,000 / yr</span>
                  </div>
                  <div className="flex justify-between text-neutral-300 py-1">
                    <span>Annual Equity:</span>
                    <span className="text-white font-semibold">$75,000 / yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
