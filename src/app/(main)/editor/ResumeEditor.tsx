"use client";

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./BreadCrumbs";
import { useState } from "react";
import { ResumeValues } from "@/lib/validations";
import ResumePreviewSection from "./ResumePreviewSection";
import Footer from "./Footer";
import { cn } from "@/utils";

export default function ResumeEditor() {
  const [resumeData, setResumeData] = useState<ResumeValues>({});
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0].key;
  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  function setStep(key: string) {
    const params = new URLSearchParams(searchParams);
    params.set("step", key);
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b border-card-border px-3 py-5 text-center text-foreground">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r border-card-border" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
      />
    </div>
  );
}
