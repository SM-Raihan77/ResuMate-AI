"use client";

import React, { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { Bot, User, Copy, Check, Sparkles } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export default function ChatMessageItem({
  message,
  isStreaming = false,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format basic markdown-like content (bold, bullet points, paragraphs, code blocks)
  const formatContent = (content: string) => {
    if (!content) return null;

    const lines = content.split("\n");
    return lines.map((line, lineIndex) => {
      // Empty lines
      if (!line.trim()) {
        return <div key={lineIndex} className="h-2" />;
      }

      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const bulletText = line.trim().substring(2);
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[#FFE600] text-sm mt-0.5">•</span>
            <span className="flex-1 text-neutral-200 text-xs sm:text-sm leading-relaxed">
              {renderFormattedInline(bulletText)}
            </span>
          </div>
        );
      }

      // Numbered list (e.g. "1. ")
      const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[#FFE600] font-mono text-xs font-bold mt-0.5">
              {numberedMatch[1]}.
            </span>
            <span className="flex-1 text-neutral-200 text-xs sm:text-sm leading-relaxed">
              {renderFormattedInline(numberedMatch[2])}
            </span>
          </div>
        );
      }

      // Standard paragraph
      return (
        <p key={lineIndex} className="text-neutral-200 text-xs sm:text-sm leading-relaxed my-1">
          {renderFormattedInline(line)}
        </p>
      );
    });
  };

  // Inline formatter for **bold** and `code`
  const renderFormattedInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-neutral-950 text-[#FFE600] font-mono text-[11px] border border-neutral-800"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`group flex items-start gap-3 sm:gap-3.5 p-4 rounded-xl transition-all ${
        isAssistant
          ? "bg-neutral-900/90 border border-neutral-800 shadow-sm"
          : "bg-neutral-950 border border-neutral-800/80 ml-auto max-w-2xl"
      }`}
    >
      {/* Role Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
          isAssistant
            ? "bg-[#FFE600] text-black font-bold"
            : "bg-neutral-800 text-neutral-300 border border-neutral-700"
        }`}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4 stroke-[2.2]" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold ${
                isAssistant ? "text-[#FFE600]" : "text-neutral-300"
              }`}
            >
              {isAssistant ? "ResuMate AI Coach" : "You"}
            </span>

            {isAssistant && (
              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                <Sparkles className="w-3 h-3 text-[#FFE600]" />
                Career Advisor
              </span>
            )}
          </div>

          {/* Copy Button */}
          {message.content && !isStreaming && (
            <button
              type="button"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="pt-0.5">
          {formatContent(message.content)}
          {isStreaming && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#FFE600] animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
