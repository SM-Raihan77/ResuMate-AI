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
    linkText: 'Practice Now',
    href: '/interview'
  },
  {
    icon: BookOpen,
    title: 'Learning Planner',
    description: 'Personalized learning roadmaps with concrete milestones, curated study materials, and skill verification.',
    linkText: 'Explore Roadmaps',
    href: '/#cta'
  },
  {
    icon: Award,
    title: 'Skill Assessment',
    description: 'Benchmark your skill stack and identify actionable gaps against top-tier tech hiring rubrics.',
    linkText: 'Benchmark Skills',
    href: '/#cta'
  }
];

export default function Features(): React.JSX.Element {
  return (
    <section id="features" className="py-20 lg:py-24 bg-transparent text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-yellow-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            AI-Powered <span className="text-yellow-400">Career Tools</span>
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
                className="bg-[#0b0f19]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-yellow-500/40 hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] group flex flex-col justify-between"
              >
                <div>
                  {/* Glowing Icon Badge */}
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform mb-5">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Action Link with Arrow Hover Animation */}
                <Link
                  href={item.href}
                  className="text-yellow-400 font-medium inline-flex items-center gap-2 text-sm pt-2"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

