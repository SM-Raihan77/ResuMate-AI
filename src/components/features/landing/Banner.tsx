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
    <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#08090C] overflow-hidden pt-8 pb-20 lg:py-24">
      {/* Background Graphic & Golden Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFE600]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#FFE600]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Powered by AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                Powered by AI
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-gray-300 font-medium">
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
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
                Resume analysis, job recommendations, interview prep, and personalized learning roadmaps — all in one intelligent platform.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/resume-analyzer"
                className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold rounded-xl shadow-[0_0_30px_rgba(255,230,0,0.35)] hover:shadow-[0_0_40px_rgba(255,230,0,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
              >
                <span>Audit Resume with AI</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
              </Link>

              <Link
                href="/#features"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-transparent hover:bg-white/[0.04] border border-neutral-700 hover:border-[#FFE600]/60 text-white font-semibold transition-all backdrop-blur-md active:scale-[0.98] text-base"
              >
                <span>Explore Features</span>
              </Link>
            </div>

            {/* Metrics Counters Strip */}
            <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6">
              {keyMetrics.map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {metric.value}
                  </div>
                  <div className="text-xs font-bold text-[#FFE600]">
                    {metric.label}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {metric.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live AI Diagnostic Card / HUD */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-2 bg-[#FFE600]/15 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

            <div className="relative rounded-2xl bg-[#121316] border border-white/[0.1] hover:border-[#FFE600]/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300">
              {/* Card Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/30 flex items-center justify-center text-[#FFE600]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                      AI Diagnostic HUD
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Live Telemetry & Evaluation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ATS Ready</span>
                </div>
              </div>

              {/* Central ATS Score Dial */}
              <div className="py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
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
                      <span className="text-xl font-black text-white">94</span>
                      <span className="text-[9px] font-semibold text-gray-400">/ 100</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#FFE600]">Top 3% Candidate Tier</span>
                      <Award className="w-3.5 h-3.5 text-[#FFE600]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      Senior Software Engineer
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Optimized for FAANG & High-Growth ATS
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-gray-300 border border-white/[0.06]">
                    SCAN #8824-A
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex rounded-xl bg-black/50 p-1 border border-white/[0.06] mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('insights')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    activeTab === 'insights' 
                      ? 'bg-[#FFE600] text-black font-bold shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  AI Insights
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('compare')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    activeTab === 'compare' 
                      ? 'bg-[#FFE600] text-black font-bold shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Before vs After
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('roles')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    activeTab === 'roles' 
                      ? 'bg-[#FFE600] text-black font-bold shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Target Fit
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[155px]">
                {activeTab === 'insights' && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-gray-200 font-medium">Impact & Metric Density</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">+38% Quantified</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-[#FFE600] shrink-0" />
                        <span className="text-xs text-gray-200 font-medium">Keywords: Distributed Systems, Next.js</span>
                      </div>
                      <span className="text-xs font-bold text-[#FFE600]">96% Matched</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className="text-xs text-gray-200 font-medium">ATS Parser Compatibility</span>
                      </div>
                      <span className="text-xs font-bold text-yellow-300">100% Validated</span>
                    </div>
                  </div>
                )}

                {activeTab === 'compare' && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-gray-300 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-rose-400">
                        <span>Original Bullet</span>
                        <span>ATS Score: 42</span>
                      </div>
                      <p className="italic text-gray-400">
                        &quot;Worked on React web application features and fixed bugs with team.&quot;
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-gray-200 space-y-1">
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
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">Staff Frontend Engineer</span>
                          <span className="px-1.5 py-0.2 bg-[#FFE600]/20 text-[#FFE600] text-[10px] rounded font-semibold">96% Fit</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Stripe • Remote • $190k - $240k</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#FFE600]" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">AI Solutions Architect</span>
                          <span className="px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 text-[10px] rounded font-semibold">92% Fit</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Scale AI • Hybrid • $210k - $260k</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#FFE600]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                  <RefreshCw className="w-3 h-3 text-[#FFE600] animate-spin" />
                  Auto-syncing ATS rules...
                </span>
                <Link 
                  href="/resume-analyzer" 
                  className="text-[#FFE600] font-bold hover:text-yellow-300 transition-colors flex items-center gap-1"
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
