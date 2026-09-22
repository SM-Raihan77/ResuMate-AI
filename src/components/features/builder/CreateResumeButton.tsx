"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Plus, Loader2 } from "lucide-react";
import { UpgradeModal } from "@/components/shared/UpgradeModal";

interface CreateResumeButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "navbar";
  title?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  children?: React.ReactNode;
}

export function CreateResumeButton({
  className = "",
  variant = "primary",
  title = "Create Resume",
  defaultTitle,
  defaultDescription,
  children,
}: CreateResumeButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleCreate = async () => {
    if (!session) {
      toast.add({
        type: "info",
        title: "Sign in required",
        description: "Please log in or register to create and save your resume in PostgreSQL.",
      });
      router.push("/login?redirect=/resumes");
      return;
    }

    if (isCreating) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: defaultTitle || "Untitled Resume",
          description: defaultDescription || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.id) {
        if (data?.code === "PREMIUM_REQUIRED") {
          const err: any = new Error(data.message || "Free limit reached.");
          err.code = "PREMIUM_REQUIRED";
          throw err;
        }
        throw new Error(data.error || "Failed to create resume.");
      }

      toast.add({
        type: "success",
        title: "Resume initialized in PostgreSQL",
        description: "Opening workspace...",
      });

      router.push(`/resume-builder?resumeId=${data.id}`);
    } catch (error: any) {
      console.error("CreateResumeButton error:", error);
      if (error?.code === "PREMIUM_REQUIRED") {
        setShowUpgrade(true);
      } else {
        toast.add({
          type: "error",
          title: "Error creating resume",
          description: error.message || "Failed to create resume. Please try again.",
        });
      }
      setIsCreating(false);
    }
  };

  let baseStyle = "px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2";

  if (variant === "primary") {
    baseStyle += " bg-[#FFE600] hover:bg-[#FFD000] text-black shadow-[0_0_20px_rgba(255,230,0,0.3)] hover:shadow-[0_0_25px_rgba(255,230,0,0.45)] active:scale-95";
  } else if (variant === "secondary") {
    baseStyle += " bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.1]";
  } else if (variant === "outline") {
    baseStyle += " bg-transparent hover:bg-[#FFE600]/10 border border-[#FFE600]/40 text-[#FFE600]";
  } else if (variant === "navbar") {
    baseStyle = "px-3.5 py-1.5 rounded-lg bg-[#FFE600] hover:bg-[#FFD000] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(255,230,0,0.25)] active:scale-95 inline-flex items-center gap-1.5";
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleCreate}
        disabled={isCreating}
        className={`${baseStyle} ${className}`}
      >
        {isCreating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Initializing...</span>
          </>
        ) : children ? (
          children
        ) : (
          <>
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{title}</span>
          </>
        )}
      </Button>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="resume"
      />
    </>
  );
}
