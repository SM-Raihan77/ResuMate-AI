import {
  ResumeExperience,
  ResumeEducation,
  ResumeSkillCategory,
  ResumeProject,
  ResumeCertification,
  ResumeBuilderState,
  ResumeTemplateId,
} from "./builder";
import { GeneralInfoValues, PersonalInfoValues, ResumeUpdateValues } from "@/lib/validations";

export interface Resume {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  photoUrl: string | null;
  summary: string | null;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillCategory[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  customSections?: any[];
  template: ResumeTemplateId | string | null;
  accentColor: string | null;
  fontFamily: "sans" | "serif" | "mono" | string | null;
  spacing: "compact" | "normal" | "spacious" | string | null;
  colorHex: string | null;
  borderStyle: string | null;
  atsScore: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateResumeInput {
  title?: string;
  description?: string;
  initialData?: Partial<ResumeBuilderState>;
}

export interface CreateResumeResponse {
  success: boolean;
  id: string;
  resume: Resume;
  error?: string;
}

export interface ResumeResponse {
  success: boolean;
  resume: Resume;
  error?: string;
}

export interface ResumeListResponse {
  success: boolean;
  resumes: Resume[];
  error?: string;
}

export type {
  GeneralInfoValues,
  PersonalInfoValues,
  ResumeUpdateValues,
  ResumeExperience,
  ResumeEducation,
  ResumeSkillCategory,
  ResumeProject,
  ResumeCertification,
  ResumeBuilderState,
  ResumeTemplateId,
};
