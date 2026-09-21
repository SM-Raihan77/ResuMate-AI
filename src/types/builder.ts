export interface ResumePersonal {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpaOrHonors?: string;
}

export interface ResumeSkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  techStack: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  link?: string;
}

export type ResumeTemplateId = "modern" | "minimalist" | "executive";

export interface ResumeBuilderState {
  personal: ResumePersonal;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillCategory[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  template: ResumeTemplateId;
  accentColor: string;
  fontFamily: "sans" | "serif" | "mono";
  spacing: "compact" | "normal" | "spacious";
}

export const INITIAL_RESUME_DATA: ResumeBuilderState = {
  personal: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Full-Stack & Cloud Systems Engineer",
    email: "alex.rivera@techscale.io",
    phone: "+1 (555) 382-9012",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    linkedin: "linkedin.com/in/alexrivera-dev",
    github: "github.com/alexrivera-cloud",
    summary:
      "Results-driven Senior Full-Stack Engineer with 6+ years of experience architecting resilient, cloud-native distributed microservices and reactive Next.js frontends. Proven track record reducing API latencies by 42% and scaling SaaS platforms to 500k+ monthly active users.",
  },
  experience: [
    {
      id: "exp-1",
      role: "Senior Full-Stack Engineer",
      company: "TechScale Cloud Solutions",
      location: "San Francisco, CA",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      highlights: [
        "Architected real-time event streaming pipeline processing 12M+ daily events using Node.js, Redis Streams, and PostgreSQL, reducing end-to-end latency by 42%.",
        "Spearheaded Next.js 15 SSR migration for flagship SaaS web application, elevating Core Web Vitals to 99/100 and driving a 28% increase in user retention.",
        "Engineered automated CI/CD deployment pipelines on AWS ECS and Docker, reducing production deployment rollouts from 45 minutes to 4 minutes.",
      ],
    },
    {
      id: "exp-2",
      role: "Software Engineer",
      company: "Nexus Digital Systems",
      location: "San Jose, CA",
      startDate: "2021-03",
      endDate: "2022-12",
      current: false,
      highlights: [
        "Built 14+ responsive enterprise web dashboards using TypeScript, React, and Tailwind CSS serving 150k+ business customers.",
        "Implemented Redis distributed caching layer and query optimization on PostgreSQL database, lowering database CPU load by 35%.",
        "Authored end-to-end integration test suites with Playwright and Jest, increasing overall code coverage from 62% to 88%.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2017-09",
      endDate: "2021-05",
      current: false,
      gpaOrHonors: "3.85 GPA • Magna Cum Laude",
    },
  ],
  skills: [
    {
      id: "skill-1",
      categoryName: "Languages & Frameworks",
      skills: ["TypeScript", "JavaScript (ESNext)", "React 19", "Next.js 15", "Node.js", "Python", "Go"],
    },
    {
      id: "skill-2",
      categoryName: "Cloud & Databases",
      skills: ["PostgreSQL", "Prisma ORM", "Redis", "Docker", "AWS (ECS, S3, Lambda)", "Kubernetes (K8s)"],
    },
    {
      id: "skill-3",
      categoryName: "Tools & Methodologies",
      skills: ["GraphQL", "RESTful APIs", "CI/CD (GitHub Actions)", "System Design", "Microservices", "Jest", "Tailwind CSS"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "ResuMate AI — Career Intelligence & Mock Interview Engine",
      techStack: ["Next.js 15", "TypeScript", "Google Gemini API", "Tailwind CSS", "Prisma"],
      link: "https://resumate.ai",
      startDate: "2024-08",
      endDate: "2024-11",
      highlights: [
        "Built autonomous AI mock interview simulator with real-time speech synthesis, STAR framework grading, and comprehensive performance scorecard generation.",
        "Implemented deterministic ATS resume analyzer parsing PDF/Word documents against Tier-1 recruiting algorithms.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2024",
    },
  ],
  template: "modern",
  accentColor: "#FFE600",
  fontFamily: "sans",
  spacing: "normal",
};

export const ACCENT_COLOR_OPTIONS = [
  { name: "ResuMate Gold", value: "#FFE600", border: "#FFE600" },
  { name: "Cyber Cyan", value: "#06b6d4", border: "#06b6d4" },
  { name: "Emerald Pro", value: "#10b981", border: "#10b981" },
  { name: "Royal Purple", value: "#8b5cf6", border: "#8b5cf6" },
  { name: "Rose Crimson", value: "#f43f5e", border: "#f43f5e" },
  { name: "Slate Corporate", value: "#334155", border: "#334155" },
];
