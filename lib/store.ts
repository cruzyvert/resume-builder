import { Resume, Tier } from "./types";
export type { Tier };

const KEYS = {
  resumes: "rb_resumes",
  user: "rb_user",
  tier: "rb_tier",
};

// --- User / Auth (localStorage-based) ---

export interface LocalUser {
  email: string;
  name: string;
  createdAt: string;
}

export function getUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user: LocalUser) {
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function signIn(email: string, name: string): LocalUser {
  const user: LocalUser = { email, name, createdAt: new Date().toISOString() };
  saveUser(user);
  if (!getTier()) setTier("free");
  return user;
}

export function signOut() {
  localStorage.removeItem(KEYS.user);
}

// --- Tier ---

export function getTier(): Tier {
  if (typeof window === "undefined") return "free";
  return (localStorage.getItem(KEYS.tier) as Tier) || "free";
}

export function setTier(tier: Tier) {
  localStorage.setItem(KEYS.tier, tier);
}

export function hasTierAccess(required: Tier): boolean {
  const hierarchy: Record<Tier, number> = { free: 0, full_access: 1, premium: 2 };
  return hierarchy[getTier()] >= hierarchy[required];
}

// --- Resumes ---

export function getResumes(): Resume[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.resumes);
  return raw ? JSON.parse(raw) : [];
}

function saveResumes(resumes: Resume[]) {
  localStorage.setItem(KEYS.resumes, JSON.stringify(resumes));
}

export function getResume(id: string): Resume | undefined {
  return getResumes().find((r) => r.id === id);
}

export function saveResume(resume: Resume) {
  const resumes = getResumes();
  const idx = resumes.findIndex((r) => r.id === resume.id);
  resume.updatedAt = new Date().toISOString();
  if (idx >= 0) resumes[idx] = resume;
  else resumes.push(resume);
  saveResumes(resumes);
}

export function createResume(data: Omit<Resume, "id" | "createdAt" | "updatedAt">): Resume {
  const resume: Resume = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const resumes = getResumes();
  resumes.push(resume);
  saveResumes(resumes);
  return resume;
}

export function deleteResume(id: string) {
  saveResumes(getResumes().filter((r) => r.id !== id));
}

export function getResumeCount(): number {
  return getResumes().length;
}
