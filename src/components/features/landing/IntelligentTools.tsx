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
    <section id="tools" className="py-20 lg:py-24 bg-[#08090C] text-white relative overflow-hidden border-t border-neutral-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#FFE600]/3 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFE600]/2 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Intelligent Tools, <span className="text-[#FFE600]">Real Outcomes</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Powerful features powered by cutting-edge AI to boost your career
          </p>
        </div>

        {/* 6 Minimalist Feature List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {outcomeTools.map((tool, idx) => {
            const IconComp = tool.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5 group p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/60 hover:border-neutral-700 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[#FFE600] shrink-0 transition-colors shadow-sm">
                  <IconComp className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFE600] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Live Playground Container */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 lg:p-8 shadow-xl backdrop-blur-xl">
          {/* Playground Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto mb-8 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTool('ats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTool === 'ats' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>ATS Optimizer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('interview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTool === 'interview' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>Mock Interview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTool === 'roadmap' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>Learning Roadmap</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('salary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTool === 'salary' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>Compensation</span>
            </button>
          </div>

          {/* Interactive Demo View */}
          {activeTool === 'ats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
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
                    <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                    <span>Calculates match confidence against live Job Descriptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                    <span>Eliminates formatting glitches that break Greenhouse & Lever</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    href="/resume-analyzer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-black font-bold hover:bg-[#FFD000] text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>Audit Resume in 10s</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Demo Card Right */}
              <div className="lg:col-span-6 rounded-xl bg-neutral-950 border border-neutral-800 p-5 space-y-3">
                <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1 text-xs">
                  <div className="flex justify-between text-rose-400 font-semibold text-[11px]">
                    <span>Original Input:</span>
                    <span>Score: 44/100</span>
                  </div>
                  <p className="text-neutral-400 italic">
                    &quot;Managed a database migration and improved performance of backend API endpoints.&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/25 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-[11px]">
                    <span className="text-[#FFE600] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-[#FFE600]" />
                      AI Engineered Replacement:
                    </span>
                    <span className="text-emerald-400 font-mono">Score: 98/100</span>
                  </div>
                  <p className="text-neutral-100 font-medium leading-relaxed">
                    &quot;Spearheaded zero-downtime PostgreSQL to DynamoDB migration for 12TB user data, cutting API p99 latency from 420ms to 48ms and saving $32,000/mo in cloud infrastructure costs.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'interview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-semibold">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-black font-bold hover:bg-[#FFD000] text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>Start Mock Interview</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-xl bg-neutral-950 border border-neutral-800 p-5 space-y-3 text-xs">
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>AI Interrogator</span>
                  <span className="text-[#FFE600] font-mono">STAR Method: 94%</span>
                </div>
                <p className="text-white font-medium leading-relaxed">
                  &quot;How do you architect a global distributed cache to prevent thundering herd during cache invalidation events?&quot;
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  ✓ Probabilistic Early Expiration (XFetch) cited correctly
                </div>
              </div>
            </div>
          )}

          {activeTool === 'roadmap' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-semibold">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-black font-bold hover:bg-[#FFD000] text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>Generate My Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-xl bg-neutral-950 border border-neutral-800 p-5 space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <span className="font-semibold text-white">1. Distributed Consensus & Raft</span>
                  <span className="text-emerald-400 font-semibold text-xs">Completed</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-between">
                  <span className="font-semibold text-[#FFE600]">2. Sharding & Geo-Replication</span>
                  <span className="text-[#FFE600] font-semibold text-xs">In Progress</span>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'salary' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-semibold">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-black font-bold hover:bg-[#FFD000] text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>Check Market Compensation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-xl bg-neutral-950 border border-neutral-800 p-5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Estimated Total Comp (TC):</span>
                  <span className="text-lg font-black text-[#FFE600] font-mono">$245,000 – $290,000</span>
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
    </section>
  );
}
