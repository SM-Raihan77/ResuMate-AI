import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validations";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
}: ResumePreviewSectionProps) {
  return (
    <div className="hidden md:flex w-1/2">
      <div className="flex w-full justify-center overflow-y-auto bg-white text-background p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
}
