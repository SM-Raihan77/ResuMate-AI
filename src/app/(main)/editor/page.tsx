
import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";

export const metadata: Metadata = {
  title: "Design your resume",
};

const EditorPage = () => {
  return <ResumeEditor />;
};

export default EditorPage;
