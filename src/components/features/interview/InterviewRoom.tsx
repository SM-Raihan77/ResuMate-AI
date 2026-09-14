"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Clock,
  HelpCircle,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Brain,
} from "lucide-react";
import {
  InterviewQuestion,
  InterviewAnswerEvaluation,
  InterviewDifficulty,
  InterviewType,
} from "@/types/interview";
import { InterviewFeedbackCard } from "./InterviewFeedbackCard";

interface InterviewRoomProps {
  role: string;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  questions: InterviewQuestion[];
  sessionId?: string;
  onFinishInterview: (evaluations: InterviewAnswerEvaluation[]) => Promise<void>;
  onCancel: () => void;
  isEvaluatingReport: boolean;
}

export function InterviewRoom({
  role,
  difficulty,
  interviewType,
  questions,
  sessionId,
  onFinishInterview,
  onCancel,
  isEvaluatingReport,
}: InterviewRoomProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [evaluations, setEvaluations] = useState<InterviewAnswerEvaluation[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewAnswerEvaluation | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Audio / Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Timers
  const [questionSeconds, setQuestionSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  const activeQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Question & Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionSeconds((prev) => prev + 1);
      setTotalSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset per-question timer & hint when changing question
  useEffect(() => {
    setQuestionSeconds(0);
    setUserAnswer("");
    setShowHint(false);
    setCurrentEvaluation(null);
    setErrorMessage(null);

    // Automatically speak the question if speech synthesis is available
    if (typeof window !== "undefined" && "speechSynthesis" in window && activeQuestion) {
      speakQuestion(activeQuestion.question);
    }
  }, [currentIndex]);

  // Speech-To-Text setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else if (activeQuestion) {
      speakQuestion(activeQuestion.question);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMessage("Speech Recognition is not supported on this browser (Chrome / Edge recommended).");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setErrorMessage(null);
      } catch (err) {
        console.error("Failed to start voice recognition:", err);
        setIsRecording(false);
      }
    }
  };

  const handleInsertScaffold = (type: "situation" | "task" | "action" | "result") => {
    const prefixes = {
      situation: "\n[Situation]: ",
      task: "\n[Task]: ",
      action: "\n[Action]: ",
      result: "\n[Result]: ",
    };
    setUserAnswer((prev) => `${prev.trim()}${prefixes[type]}`);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isSubmittingAnswer) return;

    // Stop recording if still on
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsSubmittingAnswer(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/interview/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          difficulty,
          interviewType,
          question: activeQuestion,
          userAnswer: userAnswer.trim(),
          sessionId,
          questionIndex: currentIndex,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.evaluation) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      const evalResult: InterviewAnswerEvaluation = data.evaluation;
      setCurrentEvaluation(evalResult);
      setEvaluations((prev) => [...prev, evalResult]);
    } catch (err: any) {
      console.error("Answer evaluation error:", err);
      setErrorMessage(err.message || "Failed to grade answer. Please try again.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      await onFinishInterview(evaluations);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  if (isEvaluatingReport) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 space-y-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 p-8 shadow-xl backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600]">
          <Brain className="w-7 h-7 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Synthesizing Your Executive Interview Scorecard...
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Aggregating STAR compliance, technical precision, and communication clarity to generate your hiring verdict.
          </p>
        </div>
        <div className="w-40 h-1.5 mx-auto rounded-full bg-neutral-950 overflow-hidden">
          <div className="w-full h-full bg-[#FFE600] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600] font-bold font-mono text-xs">
            Q{currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs font-semibold text-[#FFE600] uppercase">
                {role} ({difficulty})
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-44 h-1 rounded-full bg-neutral-950 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#FFE600] transition-all duration-300"
                style={{
                  width: `${((currentIndex + (currentEvaluation ? 1 : 0)) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Timers & Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>Q: {formatTime(questionSeconds)}</span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400">Total: {formatTime(totalSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-rose-500/10 hover:text-rose-400 border border-neutral-800 text-xs text-neutral-400 transition-colors cursor-pointer"
          >
            End Early
          </button>
        </div>
      </div>

      {/* Center Stage: AI Interviewer & Active Question Card */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 space-y-5 shadow-xl relative overflow-hidden backdrop-blur-xl">
        {/* Intercom Persona Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#FFE600] text-black flex items-center justify-center font-bold shadow-sm">
                <Brain className="w-4 h-4 stroke-[2.5]" />
              </div>
              {isPlayingAudio && (
                <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>AI Hiring Bar Raiser</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFE600]/10 text-[#FFE600] font-mono font-semibold">
                  Active Intercom
                </span>
              </p>
              <p className="text-[11px] text-neutral-400">
                Evaluating against Tier-1 Engineering benchmarks
              </p>
            </div>
          </div>

          {/* Audio TTS toggle button */}
          <button
            type="button"
            onClick={toggleAudio}
            title={isPlayingAudio ? "Stop speaking" : "Read question aloud"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-[#FFE600] text-black border-[#FFE600] shadow-sm"
                : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>Read Aloud</span>
              </>
            )}
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-2.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300 text-[11px] font-mono uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
            <span>Category: {activeQuestion.category}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            &ldquo;{activeQuestion.question}&rdquo;
          </h2>

          {activeQuestion.context && (
            <p className="text-xs text-neutral-400 italic">
              Context: {activeQuestion.context}
            </p>
          )}
        </div>

        {/* Expected Concept Chips & Hint Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-neutral-400 font-medium">Key Concepts:</span>
            {activeQuestion.expectedKeywords.map((kw, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono"
              >
                {kw}
              </span>
            ))}
          </div>

          {activeQuestion.hint && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1 text-xs text-[#FFE600] hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
            </button>
          )}
        </div>

        {/* Hint Box (if open) */}
        {showHint && activeQuestion.hint && (
          <div className="p-3 rounded-xl bg-[#FFE600]/5 border border-[#FFE600]/25 text-xs text-neutral-200 animate-in fade-in">
            <span className="font-semibold text-[#FFE600]">Interviewer Hint: </span>
            {activeQuestion.hint}
          </div>
        )}
      </div>

      {/* Immediate Feedback Card (If current question was graded) */}
      {currentEvaluation ? (
        <InterviewFeedbackCard
          evaluation={currentEvaluation}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={isLastQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      ) : (
        /* Answer Input Form */
        <form
          onSubmit={handleSubmitAnswer}
          className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 space-y-5 shadow-xl backdrop-blur-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Your Spoken or Written Response
              </h3>
              <p className="text-xs text-neutral-400">
                Structure your thoughts clearly. Use the mic button to speak naturally or type directly.
              </p>
            </div>

            {/* Mic speech-to-text toggle */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isRecording
                  ? "bg-rose-500 text-white shadow-md animate-pulse"
                  : "bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-800"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Listening... (Click to Stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Voice Answer (Speech to Text)</span>
                </>
              )}
            </button>
          </div>

          {/* STAR Scaffold Quick-Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <span className="text-[11px] text-neutral-400 font-medium px-2">STAR Helper:</span>
            <button
              type="button"
              onClick={() => handleInsertScaffold("situation")}
              className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              + [Situation]
            </button>
            <button
              type="button"
              onClick={() => handleInsertScaffold("task")}
              className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              + [Task]
            </button>
            <button
              type="button"
              onClick={() => handleInsertScaffold("action")}
              className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              + [Action]
            </button>
            <button
              type="button"
              onClick={() => handleInsertScaffold("result")}
              className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              + [Result]
            </button>
          </div>

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer with concrete technical mechanisms, quantitative metrics ($ saved, % latency cut), and trade-off considerations..."
              className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#FFE600] text-xs sm:text-sm text-white placeholder-neutral-500 leading-relaxed focus:outline-none transition-colors resize-y"
            />

            <div className="absolute bottom-3 right-4 flex items-center gap-2 text-[11px] text-neutral-500 font-mono pointer-events-none">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{userAnswer.length} chars</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submission Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>Answers are graded on technical correctness, STAR depth, and conciseness.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAnswer || !userAnswer.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingAnswer ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
