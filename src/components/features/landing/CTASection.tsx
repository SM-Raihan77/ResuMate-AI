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
    <section id="cta" className="py-20 lg:py-24 bg-transparent text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FFE600]/4 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-16">
        {/* Block 1: Main CTA */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Start Building Your <span className="text-[#FFE600]">Dream Career</span> Today
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Join thousands of professionals using AI to accelerate their careers. Free to start.
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold rounded-xl shadow-[0_0_25px_rgba(255,230,0,0.25)] hover:shadow-[0_0_35px_rgba(255,230,0,0.4)] transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Block 2: Newsletter */}
        <div id="newsletter" className="space-y-5 pt-10 border-t border-neutral-800 max-w-xl mx-auto">
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Stay Ahead in Your Career
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Get weekly AI career tips, job market insights, and curated resources.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFE600] text-xs sm:text-sm transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 text-xs sm:text-sm max-w-md mx-auto animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are subscribed! Thank you.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
