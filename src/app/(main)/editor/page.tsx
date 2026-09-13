import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { getCachedSession } from "@/utils/session";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;
  const session = await getCachedSession();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null;

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
