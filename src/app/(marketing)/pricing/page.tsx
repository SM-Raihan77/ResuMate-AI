"use client";

import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/shared";
import {
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface PlanUsage {
  isPremium: boolean;
  plan: "FREE" | "PREMIUM";
  status: string;
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<PlanUsage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data) {
          setUserPlan(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        if (res.status === 401) {
          window.location.href = "/auth/sign-in?callbackUrl=/pricing";
          return;
        }
        throw new Error(data.error || "Failed to initialize Stripe checkout.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("Upgrade error:", err);
      setError(err.message || "Failed to proceed to checkout.");
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      setError(null);

      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || "Failed to open billing portal.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("Portal error:", err);
      setError(err.message || "Failed to access billing portal.");
      setPortalLoading(false);
    }
  };

  const isCurrentPremium = userPlan?.isPremium;

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/25 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Invest in your career with{" "}
            <span className="text-[#FFE600]">ResuMate AI</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400">
            Start completely free or upgrade to Monthly Premium for unlimited AI power, ATS resume optimizations, and mock interview coaching.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch mb-20">
          {/* FREE PLAN */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur-md hover:border-neutral-700 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-neutral-300">Free Tier</span>
                {!isCurrentPremium && userPlan && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-sm font-medium text-neutral-400">/ forever</span>
              </div>

              <p className="text-sm text-neutral-400 mb-8">
                Essential tools to craft your first resume and test your interview skills.
              </p>

              {/* Free Features */}
              <div className="space-y-4 mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Included in Free:
                </div>
                {[
                  "3 Resumes in AI Resume Builder",
                  "3 Deep ATS Resume Analyses & Scores",
                  "3 AI Mock Interview practice sessions",
                  "Standard ATS Keyword detection",
                  "Community Support",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                    <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all text-sm"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* PREMIUM MONTHLY PLAN */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#FFE600]/80 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-8 backdrop-blur-md shadow-2xl shadow-[#FFE600]/5 transition-all">
            {/* Highlight Badge */}
            <div className="absolute -top-3.5 right-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFE600] text-black shadow-md">
                <Zap className="w-3.5 h-3.5" /> MOST POPULAR
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-[#FFE600]">Monthly Premium</span>
                {isCurrentPremium && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/30">
                    Active Subscription
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white">$19</span>
                <span className="text-sm font-medium text-neutral-400">/ month</span>
              </div>

              <p className="text-sm text-neutral-300 mb-8">
                Unlimited AI capabilities to accelerate your job search and ace interviews.
              </p>

              {/* Premium Features */}
              <div className="space-y-4 mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#FFE600]">
                  Everything in Free, plus:
                </div>
                {[
                  "Unlimited Resumes in Builder",
                  "Unlimited ATS Deep Resume Analyses",
                  "Unlimited AI Mock Interview sessions",
                  "Gemini AI Google XYZ bullet point rewrites",
                  "Live question audio/timer simulation",
                  "Priority AI Generation speed",
                  "Cancel anytime with one click",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-200">
                    <div className="w-5 h-5 rounded-full bg-[#FFE600]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#FFE600]" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {isCurrentPremium ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-all text-sm cursor-pointer"
                >
                  {portalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading Portal...
                    </>
                  ) : (
                    "Manage Stripe Subscription"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold bg-[#FFE600] text-black hover:bg-[#ffe600]/90 active:scale-[0.99] transition-all text-sm cursor-pointer shadow-lg shadow-[#FFE600]/15"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      Upgrade to Premium
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Monthly recurring billing. Cancel anytime from your account.</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-neutral-800/80 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#FFE600]" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h3 className="text-base font-semibold text-white mb-2">
                What happens when I reach the 3-item limit on Free?
              </h3>
              <p className="text-sm text-neutral-400">
                You can still view, edit, and download your existing 3 resumes, view past analyses, and review mock interview reports. To create a 4th resume, run another analysis, or take a new mock interview, you can upgrade to Premium.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h3 className="text-base font-semibold text-white mb-2">
                Can I cancel my subscription at any time?
              </h3>
              <p className="text-sm text-neutral-400">
                Yes! You can cancel your subscription instantly with a single click. When you cancel, you will maintain full Premium access until the end of your current monthly billing period.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h3 className="text-base font-semibold text-white mb-2">
                Is my payment secure?
              </h3>
              <p className="text-sm text-neutral-400">
                All transactions are encrypted and processed securely by Stripe. We never store or handle your credit card numbers directly on our servers.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
