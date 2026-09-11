import useDimensions from "@/hooks/useDimentions";
import { ResumeValues } from "@/lib/validations";
import { cn } from "@/utils";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <pre>{JSON.stringify(resumeData, null, 2)}</pre>
        <PersonalInfoHeader resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email } =
    resumeData;

  // Derive photoSrc during render without setting state
  const photoSrc = useMemo(() => {
    if (photo instanceof File) {
      return URL.createObjectURL(photo);
    }
    return photo || "";
  }, [photo]);

  // Clean up the created blob URL when photoSrc changes or component unmounts
  useEffect(() => {
    return () => {
      if (photoSrc.startsWith("blob:")) {
        URL.revokeObjectURL(photoSrc);
      }
    };
  }, [photoSrc]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold">
            {firstName} {lastName}
          </p>
          <p className="font-medium">{jobTitle}</p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}
