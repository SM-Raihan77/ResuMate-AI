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
    <section id="how-it-works" className="py-20 lg:py-24 bg-transparent text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            How It <span className="text-yellow-400">Works</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A simple 3-step path to accelerate your professional growth.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div 
                key={index} 
                className="bg-[#0b0f19]/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-yellow-500/40 hover:shadow-[0_12px_35px_rgba(234,179,8,0.1)] group flex flex-col items-center text-center space-y-3.5"
              >
                {/* Glowing Icon Badge */}
                <div className="w-14 h-14 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform mx-auto mb-4">
                  <IconComp className="w-7 h-7 stroke-[1.8]" />
                </div>

                {/* Step Badge */}
                <div className="text-xs font-semibold tracking-widest text-yellow-400 uppercase">
                  {item.step}
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
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
