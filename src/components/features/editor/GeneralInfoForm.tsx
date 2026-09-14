"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generalInfoSchema, GeneralInfoValues } from "@/lib/validations";
import { Resume } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { FileText, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

interface GeneralInfoFormProps {
  resumeId: string;
  initialData: Partial<Resume>;
  onNext: () => void;
  onDataChange?: (data: Partial<Resume>) => void;
}

export function GeneralInfoForm({
  resumeId,
  initialData,
  onNext,
  onDataChange,
}: GeneralInfoFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: initialData.title || "Untitled Resume",
      description: initialData.description || "",
    },
  });

  const { control, handleSubmit, watch, reset } = form;

  // Reset when initialData changes externally
  useEffect(() => {
    reset({
      title: initialData.title || "Untitled Resume",
      description: initialData.description || "",
    });
  }, [initialData.id, reset]);

  // Persist update to API
  const persistChanges = useCallback(
    async (values: GeneralInfoValues, isManualSubmit = false) => {
      setSaveStatus("saving");
      setIsSaving(true);

      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title.trim(),
            description: values.description?.trim() || null,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to update resume.");
        }

        setSaveStatus("saved");
        if (onDataChange) {
          onDataChange(data.resume);
        }

        if (isManualSubmit) {
          toast.add({
            type: "success",
            title: "General info saved",
            description: "Moving to personal information.",
          });
          onNext();
        }
      } catch (error: any) {
        console.error("GeneralInfoForm save error:", error);
        setSaveStatus("error");
        toast.add({
          type: "error",
          title: "Save failed",
          description: error.message || "Failed to save general info.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, onDataChange, onNext]
  );

  // Debounced auto-save with watch
  useEffect(() => {
    const subscription = watch((values) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      if (!values.title || values.title.trim().length === 0) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        form.handleSubmit((validValues) => {
          persistChanges(validValues, false);
        })();
      }, 800);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [watch, form, persistChanges]);

  const onSubmit = async (values: GeneralInfoValues) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await persistChanges(values, true);
  };

  return (
    <div className="bg-[#121316] rounded-3xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
            <FileText className="w-5 h-5 text-[#FFE600]" />
            <span>General Information</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Set your resume title and internal notes to stay organized across applications.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-yellow-400 font-mono text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup className="space-y-4">
          {/* Resume Title */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <FieldLabel htmlFor="resume-title" className="text-xs font-semibold text-gray-300">
                  Resume Title <span className="text-[#FFE600]">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="resume-title"
                  placeholder="e.g. Senior Full-Stack Engineer — 2026"
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl"
                />
                <p className="text-[11px] text-gray-400">
                  A recognizable label for your reference (e.g. target role or company).
                </p>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Resume Description / Notes */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <FieldLabel htmlFor="resume-desc" className="text-xs font-semibold text-gray-300">
                  Description / Application Target (Optional)
                </FieldLabel>
                <Textarea
                  {...field}
                  id="resume-desc"
                  rows={4}
                  placeholder="e.g. Tailored for Tier-1 Tech Company cloud infrastructure and backend roles."
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 rounded-xl leading-relaxed resize-none"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
          <Button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black text-xs font-black transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save & Continue to Personal Info</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
