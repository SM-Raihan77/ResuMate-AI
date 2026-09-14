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
    <section id="how-it-works" className="py-20 lg:py-24 bg-[#08090C] text-white relative overflow-hidden border-t border-neutral-900">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFE600]/3 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            How It <span className="text-[#FFE600]">Works</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A simple 3-step path to accelerate your professional growth.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[1px] bg-neutral-800" />

          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center space-y-3.5 relative z-10 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm"
              >
                {/* Circular Icon Container */}
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#FFE600] shadow-md transition-all">
                  <IconComp className="w-8 h-8 stroke-[1.8]" />
                </div>

                {/* Step Pill */}
                <div className="text-[11px] font-bold tracking-widest text-[#FFE600] uppercase pt-1">
                  {item.step}
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-white">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xs">
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
