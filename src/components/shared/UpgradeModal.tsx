"use client";

import React, { useState } from "react";
import { Sparkles, Check, X, Zap, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: "resume" | "analysis" | "interview";
}

export function UpgradeModal({
  isOpen,
  onClose,
  title,
  description,
  feature,
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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
        throw new Error(data.error || "Failed to initialize checkout session.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const featureSpecificText = {
    resume: {
      headline: "Unlock Unlimited Resumes",
      subhead: "You've reached your free limit of 3 resumes. Upgrade to Premium for unlimited resume creation and ATS optimization.",
    },
    analysis: {
      headline: "Unlock Unlimited ATS Analyses",
      subhead: "You've reached your free limit of 3 resume analyses. Upgrade to Premium to scan and optimize unlimited resumes.",
    },
    interview: {
      headline: "Unlock Unlimited Mock Interviews",
      subhead: "You've reached your free limit of 3 mock interview sessions. Upgrade to Premium for unlimited AI interview practice.",
    },
  };

  const defaultText = feature && featureSpecificText[feature]
    ? featureSpecificText[feature]
    : {
        headline: title || "Upgrade to ResuMate AI Premium",
        subhead: description || "You've reached your free tier limit. Upgrade to unlock full unlimited power.",
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFE600]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/30 text-[#FFE600]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFE600]/15 text-[#FFE600] border border-[#FFE600]/30">
              <Zap className="w-3 h-3" /> PREMIUM
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {defaultText.headline}
            </h3>
          </div>
        </div>

        <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
          {defaultText.subhead}
        </p>

        {/* Plan Comparison List */}
        <div className="space-y-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Everything included in Premium:
          </div>
          {[
            "Unlimited AI Resume Builder drafts & exports",
            "Unlimited ATS Deep Resume Analyses & Keyword Matching",
            "Unlimited AI Mock Interview sessions with live feedback",
            "Instant Gemini AI optimizations & bullet re-writers",
            "Cancel anytime — recurring monthly subscription",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-sm text-neutral-200">
              <div className="w-4 h-4 rounded-full bg-[#FFE600]/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#FFE600]" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-[#FFE600] text-black hover:bg-[#ffe600]/90 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-[#FFE600]/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                Upgrade to Premium
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Secure checkout powered by Stripe. Cancel anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
