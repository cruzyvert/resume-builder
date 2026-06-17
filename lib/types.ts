export type Tier = "free" | "full_access" | "premium";

export interface Resume {
  id: string;
  title: string;
  templateId: "classic" | "modern" | "minimal";
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export const TEMPLATES = {
  classic: { name: "Classic", tier: "free" as const },
  modern: { name: "Modern", tier: "free" as const },
  minimal: { name: "Minimal", tier: "free" as const },
};

export const DEFAULT_RESUME: Omit<Resume, "id" | "createdAt" | "updatedAt"> = {
  title: "My Resume",
  templateId: "classic",
  personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "" },
  experience: [],
  education: [],
  skills: [],
  summary: "",
};
