import GeneralInfoForm from "./form/GeneralInfoForm";
import PersonalInfoForm from "./form/PersonalInfoForm";
import { EditorFormProps } from "@/lib/types";
import WorkExperienceForm from "./form/WorkExperienceForm";
import EducationInfoForm from "./form/EducationInfoForm";
import SkillsForm from "./form/SkillsForm";
import SummaryForm from "./form/SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  { title: "Education", component: EducationInfoForm, key: "education" },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skill",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
];
