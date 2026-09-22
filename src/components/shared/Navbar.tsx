"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  HelpCircle,
  Mail,
  Wrench,
  UserCheck,
  User,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar(): React.JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const featuresDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch session data from better-auth
  const { data: session } = useSession();
  const user = session?.user as
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        avatar?: string | null;
        picture?: string | null;
        avatarUrl?: string | null;
        image_url?: string | null;
      }
    | undefined;
  const avatarUrl =
    user?.image ||
    user?.avatar ||
    user?.picture ||
    user?.avatarUrl ||
    user?.image_url;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  useEffect(() => {
    if (session) {
      console.log("[Navbar] Auth Session:", session);
      console.log("[Navbar] Current User Data:", session.user);
      console.log("[Navbar] Resolved Avatar URL:", avatarUrl);
    }
  }, [session, avatarUrl]);

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isFeaturesActive =
    isActive("/resume-analyzer") || isActive("/chat");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        featuresDropdownRef.current &&
        !featuresDropdownRef.current.contains(target)
      ) {
        setIsFeaturesOpen(false);
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-[#070913]/70 backdrop-blur-md border-b border-white/10 shadow-lg ${
          isScrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.6)]" : ""
        }`}
      >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left (Brand) */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FFE600] text-black shadow-[0_0_20px_rgba(255,230,0,0.35)] transition-transform group-hover:scale-105">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            ResuMate<span className="text-[#FFE600]">.AI</span>
          </span>
        </Link>

        {/* Center (Nav Links) */}
        <nav className="hidden lg:flex items-center gap-2">
          <Link
            href="/resume-builder"
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isActive("/resume-builder")
                ? "text-white bg-white/[0.08] font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02] font-medium"
            }`}
          >
            Resume Builder
          </Link>

          <Link
            href="/interview"
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isActive("/interview")
                ? "text-white bg-white/[0.08] font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02] font-medium"
            }`}
          >
            Mock Interview
          </Link>

          <Link
            href="/pricing"
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isActive("/pricing")
                ? "text-white bg-white/[0.08] font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02] font-medium"
            }`}
          >
            Pricing
          </Link>

          {/* Dropdown Menu ("Features") */}
          <div
            className="relative"
            ref={featuresDropdownRef}
            onMouseEnter={() => setIsFeaturesOpen(true)}
            onMouseLeave={() => setIsFeaturesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsFeaturesOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer focus:outline-none ${
                isFeaturesActive || isFeaturesOpen
                  ? "text-white bg-white/[0.08] font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02] font-medium"
              }`}
              aria-expanded={isFeaturesOpen}
            >
              <span>Features</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isFeaturesOpen
                    ? "rotate-180 text-white"
                    : isFeaturesActive
                    ? "text-white"
                    : "text-neutral-500"
                }`}
              />
            </button>

            {/* Floating Dropdown Card */}
            {isFeaturesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                <div className="w-56 bg-neutral-900 border border-neutral-800 rounded-xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                  <Link
                    href="/resume-analyzer"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive("/resume-analyzer")
                        ? "text-white bg-neutral-800 font-semibold"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/60 font-medium"
                    }`}
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Resume Analyzer</span>
                  </Link>

                  <Link
                    href="/chat"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive("/chat")
                        ? "text-white bg-neutral-800 font-semibold"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/60 font-medium"
                    }`}
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    <Bot className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>AI Coach</span>
                  </Link>

                  <Link
                    href="/#tools"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Tools</span>
                  </Link>

                  <Link
                    href="/#how-it-works"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>How It Works</span>
                  </Link>

                  <Link
                    href="/#testimonials"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Testimonials</span>
                  </Link>

                  <Link
                    href="/#cta"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Contact</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right (User Profile / Auth) */}
        <div className="flex items-center gap-3">
          {!session ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/login"
                className={`text-sm transition-colors px-2 py-1 ${
                  isActive("/login")
                    ? "text-white font-semibold"
                    : "text-neutral-400 hover:text-white font-medium"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFE600] hover:bg-[#FFD000] text-black font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(255,230,0,0.25)] hover:shadow-[0_0_25px_rgba(255,230,0,0.4)] active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Authenticated User Actions */
            <div className="flex items-center gap-3">
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="relative p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFE600]/40 transition-transform active:scale-95 cursor-pointer"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  {avatarUrl && !imageError ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "User avatar"}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-md hover:border-[#FFE600]/60 transition-colors"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-md hover:border-[#FFE600]/60 transition-colors">
                      {user?.name ? (
                        getInitials(user.name)
                      ) : (
                        <User className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-neutral-800 mb-1 flex items-center gap-3">
                      {avatarUrl && !imageError ? (
                        <img
                          src={avatarUrl}
                          alt={user?.name || "User avatar"}
                          referrerPolicy="no-referrer"
                          onError={() => setImageError(true)}
                          className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {user?.name ? (
                            getInitials(user.name)
                          ) : (
                            <User className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                      )}
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                  <Link
                    href="/resume-analyzer"
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                      isActive("/resume-analyzer")
                        ? "text-[#FFE600] bg-neutral-800/80 font-semibold"
                        : "text-[#FFE600] hover:bg-neutral-800/60 font-medium"
                    }`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Resume Analyzer</span>
                  </Link>

                  <Link
                    href="/interview"
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                      isActive("/interview")
                        ? "text-white bg-neutral-800/80 font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-[#FFE600] font-medium"
                    }`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Bot className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Mock Interview</span>
                  </Link>

                  <Link
                    href="/chat"
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                      isActive("/chat")
                        ? "text-white bg-neutral-800/80 font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-[#FFE600] font-medium"
                    }`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Bot className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>AI Career Coach</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                      isActive("/dashboard")
                        ? "text-white bg-neutral-800/80 font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-[#FFE600] font-medium"
                    }`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Candidate Dashboard</span>
                  </Link>

                  <Link
                    href="/resumes"
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                      isActive("/resumes")
                        ? "text-white bg-neutral-800/80 font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-[#FFE600] font-medium"
                    }`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>Saved Resumes</span>
                  </Link>

                  <Link
                    href="/settings"
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                      isActive("/settings")
                        ? "text-white bg-neutral-800/80 font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-[#FFE600] font-medium"
                    }`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>AI Preferences</span>
                  </Link>

                  <div className="my-1 border-t border-neutral-800" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
              </div>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#070913]/90 backdrop-blur-xl px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <Link
              href="/resume-builder"
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive("/resume-builder")
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resume Builder
            </Link>

            <Link
              href="/interview"
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive("/interview")
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mock Interview
            </Link>

            <Link
              href="/pricing"
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive("/pricing")
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            <Link
              href="/resume-analyzer"
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive("/resume-analyzer")
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resume Analyzer
            </Link>

            <Link
              href="/chat"
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive("/chat")
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white font-medium"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Career Coach
            </Link>

            <Link
              href="/#tools"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tools
            </Link>

            <Link
              href="/#how-it-works"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>

            <Link
              href="/#testimonials"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>

            <Link
              href="/#cta"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            {!session ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 rounded-xl text-sm border font-medium cursor-pointer transition-colors ${
                    isActive("/login")
                      ? "text-white bg-neutral-800 border-neutral-700"
                      : "text-neutral-300 bg-neutral-900 border-neutral-800 hover:text-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFE600] hover:bg-[#FFD000] text-black font-semibold rounded-xl shadow-lg"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  {avatarUrl && !imageError ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "User avatar"}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {user?.name ? (
                        getInitials(user.name)
                      ) : (
                        <User className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                  )}
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </header>
      {/* Spacer to prevent fixed navbar from covering top content */}
      <div className="h-[73px] w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}
