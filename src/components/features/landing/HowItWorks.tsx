'use client';

import React from 'react';
import { 
  Compass, 
  Wand2, 
  Trophy 
} from 'lucide-react';

interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: StepItem[] = [
  {
    step: 'STEP 1',
    title: 'Define your goal',
    description: 'Share your skills, target roles, and career aspirations to calibrate your personalized AI benchmark.',
    icon: Compass
  },
  {
    step: 'STEP 2',
    title: 'Get AI guidance',
    description: 'Receive custom learning roadmaps, instant ATS resume rewrites, and realistic mock interview coaching.',
    icon: Wand2
  },
  {
    step: 'STEP 3',
    title: 'Land the role',
    description: 'Track your growth milestones, apply with quantified confidence, and negotiate top-tier compensation packages.',
    icon: Trophy
  }
];

export default function HowItWorks(): React.JSX.Element {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#08090C] text-white relative overflow-hidden border-t border-white/[0.04]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FFE600]/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFE600]">
            How It Works
          </h2>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            A simple 3-step path to accelerate your professional growth.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-[#FFE600]/20 via-[#FFE600]/40 to-[#FFE600]/20" />

          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center space-y-4 relative z-10"
              >
                {/* Circular Icon with Yellow Glow Ring */}
                <div className="w-24 h-24 rounded-full bg-[#121316] border-2 border-[#FFE600]/40 flex items-center justify-center text-[#FFE600] shadow-[0_0_25px_rgba(255,230,0,0.15)] group-hover:border-[#FFE600] transition-all">
                  <IconComp className="w-10 h-10 stroke-[2]" />
                </div>

                {/* Step Pill */}
                <div className="text-xs font-black tracking-widest text-[#FFE600] uppercase pt-1">
                  {item.step}
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
