"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar, Footer } from "@/components/shared";
import {
  InterviewSetup,
  InterviewRoom,
  InterviewReport,
} from "@/components/features/interview";
import {
  InterviewQuestion,
  InterviewAnswerEvaluation,
  InterviewFinalReport,
  InterviewDifficulty,
  InterviewType,
  GenerateQuestionsRequest,
} from "@/types/interview";
import { saveCompletedInterviewReport } from "@/lib/dashboard-store";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  Award,
  Volume2,
  CheckCircle2,
  Database,
  Loader2,
} from "lucide-react";

type SessionState = "setup" | "in-progress" | "completed";

function MockInterviewContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("sessionId") || undefined;

  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [sessionId, setSessionId] = useState<string | undefined>(urlSessionId);
  const [role, setRole] = useState<string>("Full Stack Engineer");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("senior");
  const [interviewType, setInterviewType] = useState<InterviewType>("mixed");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [finalReport, setFinalReport] = useState<InterviewFinalReport | null>(null);
  const [savedResumes, setSavedResumes] = useState<Array<{ id: string; title: string | null }>>([]);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isEvaluatingReport, setIsEvaluatingReport] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  // 1. Load user resumes on mount
  useEffect(() => {
    async function loadUserResumes() {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.resumes)) {
            setSavedResumes(data.resumes);
          }
        }
      } catch (err) {
        console.error("Failed to load user resumes for interview:", err);
      }
    }
    loadUserResumes();
  }, []);

  // 2. Load historical interview session if urlSessionId is provided
  useEffect(() => {
    if (!urlSessionId) return;

    async function loadPastSession() {
      try {
        const res = await fetch(`/api/interview?sessionId=${urlSessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const sess = data.data;
            setSessionId(sess.id);
            setRole(sess.role);
            setDifficulty(sess.difficulty as InterviewDifficulty);
            setInterviewType(sess.interviewType as InterviewType);

            if (sess.overallScore !== null && sess.grade) {
              // Convert DB session to InterviewFinalReport
              const report: InterviewFinalReport = {
                overallScore: sess.overallScore,
                grade: sess.grade,
                categoryScores: sess.categoryScores || {
                  technicalProficiency: 85,
                  communicationClarity: 85,
                  problemSolving: 85,
                  cultureAndSTAR: 85,
                },
                keyStrengths: sess.keyStrengths || [],
                criticalImprovements: sess.criticalImprovements || [],
                detailedFeedback: sess.detailedFeedback || "",
                readinessRecommendation: sess.readinessRecommendation || "",
                questionBreakdowns: (sess.questions || []).map((q: any) => ({
                  questionId: q.id,
                  question: q.question,
                  userAnswer: q.userAnswer || "Answer provided orally during speech round.",
                  score: q.score || 80,
                  feedback: (q.strengths || []).join(". ") || "Evaluated by AI recruiter.",
                  betterAlternative: q.idealAnswer || q.sampleAnswer || "Strong structured alternative.",
                })),
                completedAt: sess.updatedAt || sess.createdAt,
              };
              setFinalReport(report);
              setSessionState("completed");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load past interview session:", err);
      }
    }
    loadPastSession();
  }, [urlSessionId]);

  const handleStartInterview = async (payload: GenerateQuestionsRequest) => {
    setIsLoadingQuestions(true);
    setErrorMessage(null);
    setRole(payload.role);
    setDifficulty(payload.difficulty);
    setInterviewType(payload.interviewType);

    try {
      const response = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.questions || data.questions.length === 0) {
        throw new Error(data.error || "Failed to generate interview questions. Please try again.");
      }

      setQuestions(data.questions);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      setSessionState("in-progress");

      setTimeout(() => {
        stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      console.error("Generate questions error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while generating questions.");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleFinishInterview = async (evaluations: InterviewAnswerEvaluation[]) => {
    setIsEvaluatingReport(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/interview/final-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          difficulty,
          interviewType,
          evaluations,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.report) {
        throw new Error(data.error || "Failed to generate the final interview report.");
      }

      setFinalReport(data.report);
      setSessionState("completed");

      // Save real interview session to dashboard store
      try {
        saveCompletedInterviewReport(
          data.report,
          role,
          difficulty,
          interviewType,
          Math.max(15, evaluations.length * 4)
        );
      } catch (saveErr) {
        console.error("Failed to save real interview session to store:", saveErr);
      }

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error("Final report error:", err);
      setErrorMessage(err.message || "Failed to generate performance scorecard.");
    } finally {
      setIsEvaluatingReport(false);
    }
  };

  const handleReset = () => {
    setSessionState("setup");
    setSessionId(undefined);
    setQuestions([]);
    setFinalReport(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE600]/6 blur-[200px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FFE600]/4 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 relative z-10 space-y-10">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 shadow-sm">
              <Bot className="w-4 h-4 text-[#FFE600]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
                AI Mock Interview Simulator
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-gray-300 font-medium">
                PostgreSQL Backed
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              AI Mock Interview & <br />
              <span className="text-[#FFE600]">Live Performance Evaluator</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Simulate high-pressure technical, architecture, and behavioral rounds. Receive real-time audio question delivery, speech transcription, and Staff-level scoring rubrics saved to your candidate profile.
            </p>

            {/* Feature Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                <span>Live Audio Intercom</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant STAR Grading</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-400" />
                <span>PostgreSQL Session Storage</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Interview Engine Notice</p>
                <p className="text-xs text-rose-400/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Dynamic Stage Body */}
          <div ref={stageRef} className="max-w-4xl mx-auto">
            {sessionState === "setup" && (
              <InterviewSetup
                onStartInterview={handleStartInterview}
                isLoading={isLoadingQuestions}
                savedResumes={savedResumes}
              />
            )}

            {sessionState === "in-progress" && questions.length > 0 && (
              <InterviewRoom
                role={role}
                difficulty={difficulty}
                interviewType={interviewType}
                questions={questions}
                sessionId={sessionId}
                onFinishInterview={handleFinishInterview}
                onCancel={handleReset}
                isEvaluatingReport={isEvaluatingReport}
              />
            )}

            {sessionState === "completed" && finalReport && (
              <InterviewReport
                report={finalReport}
                role={role}
                difficulty={difficulty}
                interviewType={interviewType}
                sessionId={sessionId}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MockInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090C] text-gray-100 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFE600]" />
            <span className="text-sm font-semibold text-gray-400">Loading Mock Interview Simulator...</span>
          </div>
        </div>
      }
    >
      <MockInterviewContent />
    </Suspense>
  );
}
