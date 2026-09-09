'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

const testimonials: TestimonialItem[] = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Engineer @ TechCorp',
    quote: 'The resume AI analysis was spot on! It identified phrasing gaps and missing ATS keywords that got me 4 callbacks in two weeks.'
  },
  {
    name: 'Marcus Vance',
    role: 'DevOps Lead @ CloudScale',
    quote: 'The learning roadmaps and interview simulations are game changers. The system design audio feedback helped me ace my staff-level loop.'
  },
  {
    name: 'Sarah Chen',
    role: 'ML Engineer @ DataGen Labs',
    quote: 'Interview practice with instant feedback made me feel completely prepared. I went into the offer negotiation stage with absolute confidence.'
  }
];

export default function Testimonials(): React.JSX.Element {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#08090C] text-white relative overflow-hidden border-t border-white/[0.04]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFE600]/4 rounded-full blur-[190px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFE600]">
            Loved by Job Seekers
          </h2>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Real success stories from professionals who accelerated their careers.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#121316] border border-white/[0.08] hover:border-[#FFE600]/40 p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            >
              <div className="space-y-4">
                {/* 5 Yellow Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFE600] text-[#FFE600]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-white/[0.06] space-y-0.5">
                <h4 className="text-sm font-bold text-[#FFE600]">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-400">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
