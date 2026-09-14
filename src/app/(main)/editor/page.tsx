
import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Design your resume",
};

const EditorPage = () => {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ResumeEditor />
    </Suspense>
  );
};

export default EditorPage;
