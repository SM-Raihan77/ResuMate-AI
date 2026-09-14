"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface CreateResumeButtonProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export function CreateResumeButton({
  variant = "default",
  className = "",
  title,
  children,
}: CreateResumeButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <Link
      href="/editor"
      title={title}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children ?? (
        <>
          <Plus className="h-4 w-4" />
          Create Resume
        </>
      )}
    </Link>
  );
}
