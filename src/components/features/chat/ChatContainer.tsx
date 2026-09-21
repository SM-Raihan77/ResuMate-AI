"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import ChatMessageItem from "./ChatMessageItem";
import ChatSuggestionChips from "./ChatSuggestionChips";
import {
  Send,
  Sparkles,
  RotateCcw,
  StopCircle,
  AlertTriangle,
  Bot,
} from "lucide-react";

const INITIAL_GREETING: ChatMessage = {
  id: "greeting-1",
  role: "assistant",
  content:
    "Hello! I'm your **ResuMate AI Career Coach & Interview Strategist**.\n\nI can help you:\n- **Audit & optimize** your resume bullet points for ATS\n- **Conduct mock interview** drills using the STAR framework\n- **Design personalized career roadmaps** for senior engineering roles\n- **Calibrate tech salary negotiations** and counter-offers\n\nHow can I accelerate your career today?",
  createdAt: new Date(),
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom on new messages / streaming tokens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputValue).trim();
    if (!content || isLoading) return;

    setError(null);
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Placeholder for assistant stream
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessagePlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };

    setMessages([...newMessages, assistantMessagePlaceholder]);

    // Setup abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Send truncated history (last 6 messages)
      const historyToSend = newMessages.slice(-6).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyToSend }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response stream received from the server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        accumulatedText += chunkText;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedText }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Chat stream aborted by user.");
      } else {
        console.error("Chat streaming error:", err);
        setError(err.message || "Failed to receive response from AI. Please try again.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([INITIAL_GREETING]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl overflow-hidden relative backdrop-blur-xl">
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFE600] text-black flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                AI Career Coach & Interview Assistant
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-neutral-400">
              Powered by Google Gemini 2.5 • Concise & Actionable Advice
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title="Clear chat history"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Suggestion Chips Section */}
        {messages.length <= 1 && (
          <div className="mb-6 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 animate-in fade-in">
            <ChatSuggestionChips
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Message Bubble Feed */}
        {messages.map((msg, index) => {
          const isLatestStreaming =
            isLoading && index === messages.length - 1 && msg.role === "assistant";

          return (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isStreaming={isLatestStreaming}
            />
          );
        })}

        {/* Error notification banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSendMessage()}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Stop Button when Streaming */}
      {isLoading && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={handleStopStreaming}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <StopCircle className="w-4 h-4 text-rose-400" />
            <span>Stop Response</span>
          </button>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/95 z-10">
        <div className="relative flex items-center rounded-xl bg-neutral-950 border border-neutral-800 focus-within:border-[#FFE600] transition-colors p-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about resume bullet points, interview answers, or career strategy..."
            disabled={isLoading}
            className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none max-h-40 overflow-y-auto"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 rounded-lg bg-[#FFE600] hover:bg-[#FFD000] text-black font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 ml-1 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-2 px-1">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>Optimized for fast concise answers (&lt; 200 words)</span>
        </div>
      </div>
    </div>
  );
}
