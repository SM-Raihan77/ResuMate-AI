'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  sub: string;
}

const keyMetrics: MetricItem[] = [
  { value: '50K+', label: 'Resumes Analyzed', sub: 'Across 40+ countries' },
  { value: '98.4%', label: 'ATS Pass Rate', sub: 'Bypasses legacy filters' },
  { value: '3.4x', label: 'More Callbacks', sub: 'Within first 14 days' },
  { value: '+$38k', label: 'Avg. Salary Uplift', sub: 'Reported by alumni' },
];

export default function Banner(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'insights' | 'compare' | 'roles'>('insights');

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center pt-10 pb-20 lg:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Powered by AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFE600]">
                Powered by AI
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-neutral-300 font-medium">
                Next-Gen Career Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Your AI-Powered <br />
                <span className="text-[#FFE600]">
                  Career Growth Partner
                </span>
              </h1>
              <p className="text-neutral-300 text-base sm:text-lg font-normal leading-relaxed max-w-2xl">
                Resume analysis, job recommendations, interview prep, and personalized learning roadmaps — all in one intelligent platform.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/resume-analyzer"
                className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold rounded-xl shadow-[0_0_25px_rgba(255,230,0,0.25)] hover:shadow-[0_0_35px_rgba(255,230,0,0.4)] transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer"
              >
                <span>Audit Resume with AI</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
              </Link>

              <Link
                href="/#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white font-medium transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer"
              >
                <span>Explore Features</span>
              </Link>
            </div>

            {/* Metrics Counters Strip */}
            <div className="pt-8 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {keyMetrics.map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-[#FFE600]">
                    {metric.label}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {metric.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live AI Diagnostic Card / HUD */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Glow for Floating Effect */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/15 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

            {/* Outer Container Card */}
            <div className="bg-[#0b0f19]/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-[0_0_50px_rgba(234,179,8,0.08)] relative transition-all duration-300 hover:border-yellow-500/30 overflow-hidden">
              {/* Inner ambient glow blobs */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Card Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                      AI Diagnostic HUD
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Live Telemetry & Evaluation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ATS Ready</span>
                </div>
              </div>

              {/* Central ATS Score Dial */}
              <div className="py-5 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                    <svg className="w-18 h-18 -rotate-90 drop-shadow-[0_0_10px_rgba(234,179,8,0.25)]" viewBox="0 0 36 36">
                      <path
                        className="text-white/10"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-yellow-400 transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                        strokeDasharray="94, 100"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-white leading-none tracking-tight">94</span>
                      <span className="text-[9px] font-semibold text-slate-400 mt-0.5">/ 100</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-yellow-400">Top 3% Candidate Tier</span>
                      <Award className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      Senior Software Engineer
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Optimized for FAANG & High-Growth ATS
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-[#070913]/90 text-[10px] font-mono text-slate-400 border border-white/10 shadow-inner">
                    SCAN #8824-A
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex rounded-full bg-[#070913]/80 border border-white/10 p-1 backdrop-blur-md mb-4 relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveTab('insights')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === 'insights' 
                      ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Insights
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('compare')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === 'compare' 
                      ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Before vs After
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('roles')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === 'roles' 
                      ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Target Fit
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[150px] relative z-10">
                {activeTab === 'insights' && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div className="bg-[#070913]/50 border border-white/5 hover:border-white/20 rounded-xl p-3 backdrop-blur-sm transition-all flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-slate-200 font-medium">Impact & Metric Density</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">+38% Quantified</span>
                    </div>

                    <div className="bg-[#070913]/50 border border-white/5 hover:border-white/20 rounded-xl p-3 backdrop-blur-sm transition-all flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className="text-xs text-slate-200 font-medium">Keywords: Distributed Systems, Next.js</span>
                      </div>
                      <span className="text-xs font-semibold text-yellow-400">96% Matched</span>
                    </div>

                    <div className="bg-[#070913]/50 border border-white/5 hover:border-white/20 rounded-xl p-3 backdrop-blur-sm transition-all flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className="text-xs text-slate-200 font-medium">ATS Parser Compatibility</span>
                      </div>
                      <span className="text-xs font-semibold text-yellow-300">100% Validated</span>
                    </div>
                  </div>
                )}

                {activeTab === 'compare' && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-red-300 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-red-400">
                        <span>Original Bullet</span>
                        <span>ATS Score: 42</span>
                      </div>
                      <p className="italic text-red-200/80 leading-relaxed">
                        &quot;Worked on React web application features and fixed bugs with team.&quot;
                      </p>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.08)] space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          AI Optimized Bullet
                        </span>
                        <span className="font-mono">ATS Score: 98</span>
                      </div>
                      <p className="font-medium text-emerald-100 leading-relaxed">
                        &quot;Architected modular Next.js micro-frontends serving 2.4M MAU, reducing p99 latency by 42%.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'roles' && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="bg-[#070913]/50 border border-white/5 hover:border-white/20 rounded-xl p-3 backdrop-blur-sm transition-all flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">Staff Frontend Engineer</span>
                          <span className="px-1.5 py-0.5 bg-yellow-500/15 text-yellow-400 text-[10px] rounded-md font-semibold border border-yellow-500/20">96% Fit</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Stripe • Remote • $190k - $240k</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="bg-[#070913]/50 border border-white/5 hover:border-white/20 rounded-xl p-3 backdrop-blur-sm transition-all flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">AI Solutions Architect</span>
                          <span className="px-1.5 py-0.5 bg-emerald-400/15 text-emerald-300 text-[10px] rounded-md font-semibold border border-emerald-400/20">92% Fit</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Scale AI • Hybrid • $210k - $260k</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <RefreshCw className="w-3 h-3 text-yellow-400 animate-spin" />
                  Auto-syncing ATS rules...
                </span>
                <Link 
                  href="/resume-analyzer" 
                  className="text-yellow-400 hover:text-yellow-300 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all text-xs"
                >
                  <span>Audit My Resume Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
