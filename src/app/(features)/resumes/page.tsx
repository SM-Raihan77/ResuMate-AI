"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Footer } from "@/components/shared";
import { CreateResumeButton } from "@/components/features/builder";
import { useSession } from "@/lib/auth-client";
import { Resume } from "@/types/resume";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Edit3,
  Trash2,
  Calendar,
  Sparkles,
  Loader2,
  User,
  ArrowRight,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function SavedResumesPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.resumes)) {
        setResumes(data.resumes);
      } else {
        throw new Error(data.error || "Failed to load resumes.");
      }
    } catch (err: any) {
      console.error("Fetch resumes error:", err);
      toast.add({
        type: "error",
        title: "Load Error",
        description: err.message || "Failed to load saved resumes.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!isSessionLoading) {
      fetchResumes();
    }
  }, [isSessionLoading, fetchResumes]);

  const handleDeleteResume = async (resumeId: string, title: string | null) => {
    if (!confirm(`Are you sure you want to delete "${title || "this resume"}"?`)) {
      return;
    }

    setDeletingId(resumeId);

    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete resume.");
      }

      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      toast.add({
        type: "success",
        title: "Resume deleted",
        description: "The resume was removed from PostgreSQL.",
      });
    } catch (err: any) {
      console.error("Delete resume error:", err);
      toast.add({
        type: "error",
        title: "Delete failed",
        description: err.message || "Could not delete resume.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE600]/6 blur-[200px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FFE600]/4 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 relative z-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#121316] border border-white/[0.08] shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFE600]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                  PostgreSQL Resume Store
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Saved Resumes
              </h1>
              <p className="text-xs text-gray-400">
                Manage, edit, and create persistent candidate profiles stored in PostgreSQL.
              </p>
            </div>

            <div className="shrink-0">
              <CreateResumeButton variant="primary" title="Create New Resume" />
            </div>
          </div>

          {/* Unauthenticated view */}
          {!isSessionLoading && !session && (
            <div className="p-12 text-center rounded-3xl bg-[#121316] border border-white/[0.08] max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFE600]/10 border border-[#FFE600]/30 flex items-center justify-center mx-auto text-[#FFE600]">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white">Log in to view saved resumes</h2>
              <p className="text-xs text-gray-400">
                Sign in to your ResuMate account to access your saved resumes and create new ones.
              </p>
              <Link href="/login?redirect=/resumes">
                <Button className="px-6 py-2.5 rounded-xl bg-[#FFE600] text-black font-bold text-xs">
                  Log In / Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFE600]" />
              <p className="text-xs font-mono text-gray-400">Loading your resumes from database...</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && session && resumes.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-[#121316] border border-white/[0.08] max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto text-gray-400">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">No Resumes Created Yet</h3>
              <p className="text-xs text-gray-400">
                Click below to initialize your first ATS-optimized resume.
              </p>
              <CreateResumeButton variant="primary" title="Create Resume Now" />
            </div>
          )}

          {/* Resumes Grid */}
          {!isLoading && resumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="p-6 rounded-3xl bg-[#121316] border border-white/[0.08] hover:border-[#FFE600]/40 transition-all group flex flex-col justify-between space-y-5 shadow-lg relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/30 flex items-center justify-center text-[#FFE600] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteResume(resume.id, resume.title)}
                        disabled={deletingId === resume.id}
                        className="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete resume"
                      >
                        {deletingId === resume.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#FFE600] transition-colors truncate">
                        {resume.title || "Untitled Resume"}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {resume.description || resume.summary || "No description provided."}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-[11px] text-gray-400">
                      {resume.jobTitle && (
                        <p className="text-gray-300 font-medium truncate">
                          Target: <span className="text-white">{resume.jobTitle}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href={`/resume-builder?resumeId=${resume.id}`}
                      className="w-full py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black text-xs font-bold transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,230,0,0.25)]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open in Split-Screen Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/editor?resumeId=${resume.id}&step=general-info`}
                      className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white text-[11px] font-semibold transition-all inline-flex items-center justify-center gap-1.5 border border-white/[0.08]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Info in Step Editor</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
