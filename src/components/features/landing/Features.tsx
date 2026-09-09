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
    linkText: 'Get Started',
    href: '/#cta'
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
    <section id="features" className="py-20 lg:py-28 bg-[#08090C] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFE600]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFE600]">
            AI-Powered Career Tools
          </h2>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
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
                className="group rounded-2xl bg-[#121316] border border-white/[0.08] hover:border-[#FFE600]/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(255,230,0,0.1)] flex flex-col justify-between"
              >
                <div>
                  {/* Yellow Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-[#FFE600] text-black flex items-center justify-center font-bold mb-6 shadow-[0_0_20px_rgba(255,230,0,0.25)] group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#FFE600] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Link */}
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FFE600] hover:text-yellow-300 transition-colors group/link pt-2"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
