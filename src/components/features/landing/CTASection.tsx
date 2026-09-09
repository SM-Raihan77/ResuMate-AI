'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CTASection(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <section id="cta" className="py-20 lg:py-28 bg-[#08090C] text-white relative overflow-hidden border-t border-white/[0.04]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#FFE600]/8 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-20">
        {/* Block 1: Main CTA */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FFE600]">
            Start Building Your Dream Career Today
          </h2>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
            Join thousands of professionals using AI to accelerate their careers. Free to start.
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold rounded-xl shadow-[0_0_30px_rgba(255,230,0,0.35)] hover:shadow-[0_0_40px_rgba(255,230,0,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Block 2: Newsletter */}
        <div id="newsletter" className="space-y-6 pt-10 border-t border-white/[0.08] max-w-2xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFE600]">
              Stay Ahead in Your Career
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Get weekly AI career tips, job market insights, and curated resources.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full px-4 py-3 rounded-xl bg-[#121316] border border-white/[0.12] text-white placeholder-gray-500 focus:outline-none focus:border-[#FFE600] text-sm transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold text-sm transition-all shrink-0 cursor-pointer shadow-md"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-2 text-sm max-w-md mx-auto animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are subscribed! Thank you.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
