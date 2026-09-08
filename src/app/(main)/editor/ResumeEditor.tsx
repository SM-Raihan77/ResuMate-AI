"use client";

export default function ResumeEditor() {
  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div className="w-full md:w-1/2">Left</div>
          <div className="grow md:border-r" />
          <div className="hidden md:flex w-1/2">Right</div>
        </div>
      </main>
      <div>Footer</div>
    </div>
  );
}
