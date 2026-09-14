'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Briefcase, 
  BookOpen, 
  Award, 
  ArrowRight 
} from 'lucide-react';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

const featuresList: FeatureItem[] = [
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Conversational AI for real-time career guidance, resume improvement suggestions, and interview strategy.',
    linkText: 'Start Chat',
    href: '/chat'
  },
  {
    icon: FileText,
    title: 'AI Resume Analyzer',
    description: 'Instant ATS score breakdown, keyword gap detection, formatting checks, and bullet point rewrites.',
    linkText: 'Analyze Resume',
    href: '/resume-analyzer'
  },
  {
    icon: TrendingUp,
    title: 'Career Recommendation Engine',
    description: 'AI analyzes your verified skill stack, interests, and profile to recommend high-growth career trajectories.',
    linkText: 'Get Started',
    href: '/#cta'
  },
  {
    icon: Briefcase,
    title: 'Interview Simulator',
    description: 'Practice role-specific technical and behavioral interviews with real-time feedback and model answers.',
    linkText: 'Get Started',
    href: '/#cta'
  },
  {
    icon: BookOpen,
    title: 'Learning Planner',
    description: 'Personalized learning roadmaps with concrete milestones, curated study materials, and skill verification.',
    linkText: 'Get Started',
    href: '/#cta'
  },
  {
    icon: Award,
    title: 'Skill Assessment',
    description: 'Benchmark your skill stack and identify actionable gaps against top-tier tech hiring rubrics.',
    linkText: 'Get Started',
    href: '/#cta'
  }
];

export default function Features(): React.JSX.Element {
  return (
    <section id="features" className="py-20 lg:py-24 bg-[#08090C] text-white relative overflow-hidden border-t border-neutral-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FFE600]/3 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            AI-Powered <span className="text-[#FFE600]">Career Tools</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Our complete suite of AI-powered tools designed to accelerate your career growth... from resume optimization to interview preparation and skill development.
          </p>
        </div>

        {/* 6 Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="group rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Clean Icon Box */}
                  <div className="w-11 h-11 rounded-xl bg-neutral-800 border border-neutral-700 text-[#FFE600] flex items-center justify-center font-bold mb-5 group-hover:border-[#FFE600]/40 transition-colors">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFE600] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Link */}
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFE600] hover:text-yellow-300 transition-colors group/link pt-2"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
