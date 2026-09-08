import { buttonVariants } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your resumes",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <div className="mx-auto flex w-fit gap-2">
        <Link
          href="/editor"
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
        >
          <PlusSquare className="size-5" />
          New resume
        </Link>
      </div>
    </main>
  );
}
