"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Sliders,
  LogOut,
  Bot,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar(): React.JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch session data from better-auth
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  // Helper to generate user initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#08090c]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
          : "bg-[#08090c] border-b border-white/[0.05] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FFE600] text-black shadow-[0_0_20px_rgba(255,230,0,0.35)] transition-transform group-hover:scale-105">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              ResuMate<span className="text-[#FFE600]">.AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-white hover:text-[#FFE600] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/resume-analyzer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFE600]/10 text-xs font-bold text-[#FFE600] border border-[#FFE600]/30 hover:bg-[#FFE600]/20 transition-all shadow-[0_0_12px_rgba(255,230,0,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#FFE600]" />
              <span>Resume Analyzer</span>
            </Link>
            <Link
              href="/#tools"
              className="text-sm font-medium text-gray-300 hover:text-[#FFE600] transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-[#FFE600] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-gray-300 hover:text-[#FFE600] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium text-gray-300 hover:text-[#FFE600] transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/#cta"
              className="text-sm font-medium text-gray-300 hover:text-[#FFE600] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions (Auth state toggle) */}
          <div className="hidden sm:flex items-center gap-4">
            {!session ? (
              <div className="flex items-center gap-4">
                <Link
                  href={"/login"}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer px-2 py-1"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="relative group overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,230,0,0.3)] hover:shadow-[0_0_30px_rgba(255,230,0,0.5)] transition-all active:scale-[0.98] text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              /* Authenticated User Menu */
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#141519] border border-white/[0.1] hover:border-[#FFE600]/60 transition-all cursor-pointer focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FFE600] flex items-center justify-center text-black font-black text-xs">
                    {getInitials(session?.user?.name)}
                  </div>
                  <span className="text-xs font-semibold text-gray-200 pl-1 pr-0.5">
                    {session?.user?.name || "User"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-[#121316] border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-white/[0.08] mb-1">
                      <p className="text-xs font-semibold text-white">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {session?.user?.email || ""}
                      </p>
                    </div>

                    <Link
                      href="/resume-analyzer"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#FFE600] hover:bg-white/[0.06] transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Sparkles className="w-4 h-4 text-[#FFE600]" />
                      Resume Analyzer
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600] transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FFE600]" />
                      Candidate Dashboard
                    </Link>

                    <Link
                      href="/resumes"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600] transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FileText className="w-4 h-4 text-[#FFE600]" />
                      Saved Resumes
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600] transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Sliders className="w-4 h-4 text-[#FFE600]" />
                      AI Preferences
                    </Link>

                    <div className="my-1 border-t border-white/[0.08]" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Small screen mobile toggle if not authenticated */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#08090c]/98 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <Link
              href="/"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/[0.06] hover:text-[#FFE600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/resume-analyzer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4 fill-[#FFE600]" />
              <span>Resume Analyzer</span>
            </Link>
            <Link
              href="/#tools"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="/#how-it-works"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#features"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/#cta"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-[#FFE600]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            {!session ? (
              <>
                <Link
                  href={"/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.04] border border-white/[0.08] hover:text-white font-medium cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold rounded-xl shadow-lg"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
