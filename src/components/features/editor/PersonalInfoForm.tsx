"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validations";
import { Resume } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AIBuilderService } from "@/services/ai-builder.service";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Check,
  Wand2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

interface PersonalInfoFormProps {
  resumeId: string;
  initialData: Partial<Resume>;
  onPrev: () => void;
  onDataChange?: (data: Partial<Resume>) => void;
}

export function PersonalInfoForm({
  resumeId,
  initialData,
  onPrev,
  onDataChange,
}: PersonalInfoFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData.photoUrl || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // AI summary assistance
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeAppliedIdx, setActiveAppliedIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      jobTitle: initialData.jobTitle || "",
      city: initialData.city || "",
      country: initialData.country || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      summary: initialData.summary || "",
      photoUrl: initialData.photoUrl || null,
    },
  });

  const { control, handleSubmit, watch, setValue, getValues, reset } = form;

  // Reset when initialData changes externally
  useEffect(() => {
    reset({
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      jobTitle: initialData.jobTitle || "",
      city: initialData.city || "",
      country: initialData.country || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      summary: initialData.summary || "",
      photoUrl: initialData.photoUrl || null,
    });
    setPhotoPreview(initialData.photoUrl || null);
  }, [initialData.id, reset]);

  // Persist changes to API
  const persistChanges = useCallback(
    async (values: PersonalInfoValues, isManualSubmit = false) => {
      setSaveStatus("saving");
      setIsSaving(true);

      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: values.firstName?.trim() || null,
            lastName: values.lastName?.trim() || null,
            jobTitle: values.jobTitle?.trim() || null,
            city: values.city?.trim() || null,
            country: values.country?.trim() || null,
            phone: values.phone?.trim() || null,
            email: values.email?.trim() || null,
            summary: values.summary?.trim() || null,
            photoUrl: values.photoUrl || null,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to update personal info.");
        }

        setSaveStatus("saved");
        if (onDataChange) {
          onDataChange(data.resume);
        }

        if (isManualSubmit) {
          toast.add({
            type: "success",
            title: "Personal info saved",
            description: "Resume updated successfully in PostgreSQL.",
          });
        }
      } catch (error: any) {
        console.error("PersonalInfoForm save error:", error);
        setSaveStatus("error");
        toast.add({
          type: "error",
          title: "Save failed",
          description: error.message || "Failed to save personal info.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, onDataChange]
  );

  // Debounced auto-save watching form changes
  useEffect(() => {
    const subscription = watch((values) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Check required field
      if (!values.firstName || values.firstName.trim().length === 0) return;

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

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB) & type
    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        type: "error",
        title: "File too large",
        description: "Photo must be less than 2MB.",
      });
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.add({
        type: "error",
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WEBP, or GIF image.",
      });
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || "Failed to upload photo.");
      }

      setPhotoPreview(data.url);
      setValue("photoUrl", data.url, { shouldValidate: true, shouldDirty: true });

      // Trigger instant save with new photo URL
      const currentValues = getValues();
      await persistChanges({ ...currentValues, photoUrl: data.url }, false);

      toast.add({
        type: "success",
        title: "Photo uploaded",
        description: "Profile photo saved to your resume.",
      });
    } catch (err: any) {
      console.error("Photo upload error:", err);
      toast.add({
        type: "error",
        title: "Upload failed",
        description: err.message || "Failed to upload photo.",
      });
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    setPhotoPreview(null);
    setValue("photoUrl", null, { shouldValidate: true, shouldDirty: true });
    const currentValues = getValues();
    await persistChanges({ ...currentValues, photoUrl: null }, false);
    toast.add({
      type: "info",
      title: "Photo removed",
      description: "Profile photo cleared.",
    });
  };

  // AI Summary Enhancement
  const handleEnhanceSummary = async () => {
    const jobTitle = getValues("jobTitle") || "Software Professional";
    const currentSummary = getValues("summary") || "";

    setIsEnhancingSummary(true);
    setActiveAppliedIdx(null);

    try {
      const res = await AIBuilderService.enhanceSummary(jobTitle, currentSummary);
      if (res.success && res.suggestions.length > 0) {
        setAiSuggestions(res.suggestions);
      } else {
        toast.add({
          type: "error",
          title: "AI Suggestion",
          description: res.error || "Unable to generate suggestions at this time.",
        });
      }
    } catch (err) {
      console.error("AI enhancement error:", err);
    } finally {
      setIsEnhancingSummary(false);
    }
  };

  const handleApplySuggestion = (sug: string, idx: number) => {
    setValue("summary", sug, { shouldValidate: true, shouldDirty: true });
    setActiveAppliedIdx(idx);
    const currentValues = getValues();
    persistChanges({ ...currentValues, summary: sug }, false);

    setTimeout(() => {
      setAiSuggestions([]);
      setActiveAppliedIdx(null);
    }, 400);
  };

  const onSubmit = async (values: PersonalInfoValues) => {
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
            <User className="w-5 h-5 text-[#FFE600]" />
            <span>Personal & Contact Information</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Provide your recruiter contact details, photo, and an executive profile summary.
          </p>
        </div>

        {/* Auto-save status */}
        <div className="flex items-center gap-1.5 text-xs">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-yellow-400 font-mono text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Auto-saving...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved to DB</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />

          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/[0.1] bg-white/[0.03] flex items-center justify-center shrink-0 relative group">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-600" />
            )}

            {isUploadingPhoto && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#FFE600]" />
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1 text-center sm:text-left">
            <h4 className="text-xs font-bold text-white">Profile Photo</h4>
            <p className="text-[11px] text-gray-400">
              Upload a professional portrait. Max size 2MB (JPEG, PNG, WEBP).
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto || isSaving}
                className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-xs font-semibold text-gray-200 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{photoPreview ? "Change Photo" : "Upload Photo"}</span>
              </Button>

              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Personal Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-gray-300">
                  First Name <span className="text-[#FFE600]">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="firstName"
                  placeholder="e.g. Alex"
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Last Name */}
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-gray-300">
                  Last Name
                </FieldLabel>
                <Input
                  {...field}
                  id="lastName"
                  placeholder="e.g. Rivera"
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Job Title */}
          <Controller
            name="jobTitle"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor="jobTitle" className="text-xs font-semibold text-gray-300">
                  Target Job Title
                </FieldLabel>
                <Input
                  {...field}
                  id="jobTitle"
                  placeholder="e.g. Senior Full-Stack Engineer"
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-gray-300">
                  Email Address
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="alex@example.com"
                    disabled={isSaving}
                    aria-invalid={fieldState.invalid}
                    className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl pl-9"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3.5" />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel htmlFor="phone" className="text-xs font-semibold text-gray-300">
                  Phone Number
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    disabled={isSaving}
                    aria-invalid={fieldState.invalid}
                    className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl pl-9"
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3.5" />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* City / Location */}
          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <FieldLabel htmlFor="city" className="text-xs font-semibold text-gray-300">
                    City
                  </FieldLabel>
                  <Input
                    {...field}
                    id="city"
                    placeholder="San Francisco"
                    disabled={isSaving}
                    aria-invalid={fieldState.invalid}
                    className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <FieldLabel htmlFor="country" className="text-xs font-semibold text-gray-300">
                    Country / State
                  </FieldLabel>
                  <Input
                    {...field}
                    id="country"
                    placeholder="CA, USA"
                    disabled={isSaving}
                    aria-invalid={fieldState.invalid}
                    className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 h-11 rounded-xl"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Professional Summary Section with Gemini AI */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="summary" className="text-xs font-semibold text-gray-300">
              Professional Summary
            </FieldLabel>

            <button
              type="button"
              onClick={handleEnhanceSummary}
              disabled={isEnhancingSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFE600]/10 hover:bg-[#FFE600]/20 border border-[#FFE600]/30 text-[11px] font-bold text-[#FFE600] transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-[0_0_12px_rgba(255,230,0,0.15)]"
            >
              {isEnhancingSummary ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFE600]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 fill-[#FFE600]" />
              )}
              <span>{isEnhancingSummary ? "Optimizing with AI..." : "Enhance with Gemini AI"}</span>
            </button>
          </div>

          <Controller
            name="summary"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <Textarea
                  {...field}
                  id="summary"
                  rows={4}
                  placeholder="Brief 2-3 sentence overview highlighting your core technical competencies, scale of systems built, and key quantified achievements."
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/[0.1] text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#FFE600]/50 rounded-xl leading-relaxed resize-none"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* AI Suggestions Accordion / Cards */}
          {aiSuggestions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#17181c] border border-[#FFE600]/40 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#FFE600] flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Gemini AI Summary Variations (Click to Apply)
                </span>
                <button
                  type="button"
                  onClick={() => setAiSuggestions([])}
                  className="text-[10px] text-gray-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>

              <div className="space-y-2">
                {aiSuggestions.map((sug, i) => {
                  const isSelected = activeAppliedIdx === i;
                  return (
                    <div
                      key={i}
                      onClick={() => handleApplySuggestion(sug, i)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-[#FFE600]/20 border-[#FFE600] shadow-[0_0_15px_rgba(255,230,0,0.2)]"
                          : "bg-white/[0.03] hover:bg-[#FFE600]/10 border-white/[0.06] hover:border-[#FFE600]/40"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? "bg-[#FFE600] text-black"
                            : "bg-white/[0.05] text-gray-400 group-hover:bg-[#FFE600] group-hover:text-black"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <p className="text-[11px] text-gray-300 leading-snug group-hover:text-white">
                        {sug}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between gap-3 border-t border-white/[0.08]">
          <Button
            type="button"
            onClick={onPrev}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to General Info</span>
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD000] text-black text-xs font-black transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Personal Info</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
