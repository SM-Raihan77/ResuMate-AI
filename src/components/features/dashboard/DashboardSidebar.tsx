"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  FileText,
  Compass,
  Sliders,
  LogOut,
  Zap,
  TrendingUp,
  X,
  UserCheck,
  Edit3,
  Activity,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export function DashboardSidebar({
  isOpenMobile,
  onCloseMobile,
  activeTab = "overview",
  onSelectTab,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      isTab: true,
      badge: null,
    },
    {
      id: "resume-analyzer",
      label: "Resume Analyzer",
      icon: Sparkles,
      href: "/resume-analyzer",
      isTab: false,
      badge: "AI Powered",
    },
    {
      id: "resume-builder",
      label: "Resume Builder",
      icon: Edit3,
      href: "/resume-builder",
      isTab: false,
      badge: "Live A4",
    },
    {
      id: "interview",
      label: "Mock Interview",
      icon: Bot,
      href: "/interview",
      isTab: false,
      badge: "Live Simulation",
    },
    {
      id: "chat",
      label: "AI Career Coach",
      icon: Bot,
      href: "/chat",
      isTab: false,
      badge: null,
    },
    {
      id: "roadmap",
      label: "Career Roadmap",
      icon: Compass,
      href: "/dashboard#roadmap",
      isTab: true,
      badge: "Milestones",
    },
    {
      id: "resumes",
      label: "Saved Resumes",
      icon: FileText,
      href: "/dashboard#resume-preview",
      isTab: true,
      badge: "Saved",
    },
    {
      id: "analytics",
      label: "Analytics & Progress",
      icon: TrendingUp,
      href: "/dashboard#analytics",
      isTab: true,
      badge: null,
    },
    {
      id: "activity",
      label: "Recent Activity",
      icon: Activity,
      href: "/dashboard#activity",
      isTab: true,
      badge: "Live",
    },
  ];


  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Top Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFE600] text-neutral-950 font-bold transition-transform group-hover:scale-105">
              <Bot className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                ResuMate<span className="text-[#FFE600]">.AI</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">
                Career Intelligence
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Main Hub
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.isTab && activeTab === item.id) ||
              (!item.isTab && pathname === item.href);

            const content = (
              <div
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/25"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#FFE600]" : "text-neutral-400 group-hover:text-neutral-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] rounded uppercase font-semibold tracking-wide ${
                      isActive
                        ? "bg-[#FFE600]/20 text-[#FFE600]"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700/50"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );

            if (item.isTab && onSelectTab) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className="block"
              >
                {content}
              </Link>
            );
          })}
        </div>

        {/* AI Capabilities Card / Credits */}
        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-white">
              <Zap className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
              <span>Gemini AI Engine</span>
            </div>
            <span className="text-[10px] text-[#FFE600] font-mono font-medium">Pro Tier</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Weekly AI Credits</span>
              <span className="text-neutral-200 font-mono font-medium">38 / 50</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFE600] rounded-full"
                style={{ width: "76%" }}
              />
            </div>
          </div>

          <p className="text-[10px] text-neutral-400 leading-tight">
            ATS parsing & mock voice interviews reset weekly on Monday.
          </p>
        </div>
      </div>

      {/* User Profile & Footer Actions */}
      <div className="pt-3 border-t border-neutral-800">
        <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#FFE600] flex items-center justify-center text-neutral-950 font-bold text-xs shrink-0">
              {getInitials(session?.user?.name)}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">
                {session?.user?.name || "Candidate"}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-neutral-400 truncate">
                  {session?.user?.email || "candidate@resumate.ai"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 bg-neutral-950/70 backdrop-blur-xl border-r border-white/[0.08] min-h-screen sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 max-w-[85vw] h-full bg-neutral-950/95 backdrop-blur-xl border-r border-neutral-800 shadow-xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
