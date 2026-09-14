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
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#08090C] overflow-hidden pt-10 pb-20 lg:py-24">
      {/* Background Graphic & Golden Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#FFE600]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#FFE600]/4 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

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
            <div className="relative rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200">
              {/* Card Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                      AI Diagnostic HUD
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Live Telemetry & Evaluation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ATS Ready</span>
                </div>
              </div>

              {/* Central ATS Score Dial */}
              <div className="py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                    <svg className="w-18 h-18 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-neutral-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#FFE600] transition-all duration-1000 ease-out"
                        strokeDasharray="94, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-white leading-none">94</span>
                      <span className="text-[9px] font-medium text-neutral-400">/ 100</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#FFE600]">Top 3% Candidate Tier</span>
                      <Award className="w-3.5 h-3.5 text-[#FFE600]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      Senior Software Engineer
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Optimized for FAANG & High-Growth ATS
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="px-2 py-1 rounded bg-neutral-950 text-[10px] font-mono text-neutral-400 border border-neutral-800">
                    SCAN #8824-A
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex rounded-lg bg-neutral-950 p-1 border border-neutral-800 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('insights')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'insights' 
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  AI Insights
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('compare')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'compare' 
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Before vs After
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('roles')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'roles' 
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Target Fit
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[150px]">
                {activeTab === 'insights' && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-neutral-200 font-medium">Impact & Metric Density</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">+38% Quantified</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-[#FFE600] shrink-0" />
                        <span className="text-xs text-neutral-200 font-medium">Keywords: Distributed Systems, Next.js</span>
                      </div>
                      <span className="text-xs font-semibold text-[#FFE600]">96% Matched</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className="text-xs text-neutral-200 font-medium">ATS Parser Compatibility</span>
                      </div>
                      <span className="text-xs font-semibold text-yellow-300">100% Validated</span>
                    </div>
                  </div>
                )}

                {activeTab === 'compare' && (
                  <div className="space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-neutral-300 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-rose-400">
                        <span>Original Bullet</span>
                        <span>ATS Score: 42</span>
                      </div>
                      <p className="italic text-neutral-400">
                        &quot;Worked on React web application features and fixed bugs with team.&quot;
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-neutral-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          AI Optimized Bullet
                        </span>
                        <span>ATS Score: 98</span>
                      </div>
                      <p className="font-medium text-emerald-200">
                        &quot;Architected modular Next.js micro-frontends serving 2.4M MAU, reducing p99 latency by 42%.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'roles' && (
                  <div className="space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">Staff Frontend Engineer</span>
                          <span className="px-1.5 py-0.5 bg-[#FFE600]/15 text-[#FFE600] text-[10px] rounded font-semibold">96% Fit</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">Stripe • Remote • $190k - $240k</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">AI Solutions Architect</span>
                          <span className="px-1.5 py-0.5 bg-emerald-400/15 text-emerald-300 text-[10px] rounded font-semibold">92% Fit</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">Scale AI • Hybrid • $210k - $260k</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5 text-[11px]">
                  <RefreshCw className="w-3 h-3 text-[#FFE600] animate-spin" />
                  Auto-syncing ATS rules...
                </span>
                <Link 
                  href="/resume-analyzer" 
                  className="text-[#FFE600] font-semibold hover:text-yellow-300 transition-colors flex items-center gap-1"
                >
                  Audit My Resume Free →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
