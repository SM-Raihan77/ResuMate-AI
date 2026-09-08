"use client";

import GeneralInfoForm from "./form/GeneralInfoForm";


export default function ResumeEditor() {
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
          <div className="w-full md:w-1/2 p-4">
            <GeneralInfoForm />
          </div>
          <div className="grow md:border-r border-card-border" />
          <div className="hidden md:flex w-1/2">Right</div>
        </div>
      </main>
      <div>Footer</div>
    </div>
  );
}
