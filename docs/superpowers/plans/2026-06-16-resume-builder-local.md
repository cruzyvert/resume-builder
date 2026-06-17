# Resume Builder — Local-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional local resume builder with a guided wizard, live editor, PDF/Word/text downloads, resume templates, and ATS scoring. No external auth or payments — those get added later.

**Architecture:** Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui. Data stored in browser localStorage (no database needed). PDF via @react-pdf/renderer, Word via docx package. All client-side — no server required for core features.

**Tech Stack:** Next.js 14+, TypeScript, React, Tailwind CSS, shadcn/ui, @react-pdf/renderer, docx, localStorage

---

## Approach

This is a **local-first** build. Instead of:
- ❌ OAuth (Google/Facebook/Apple) → ✅ Simple email/password with localStorage sessions
- ❌ Stripe subscriptions → ✅ Tier stored in localStorage (Free/Full Access/Premium)
- ❌ PostgreSQL + Prisma → ✅ localStorage for all data
- ❌ OpenAI API → ✅ Rule-based AI suggestions (template bullets, synonym swaps)
- ❌ Server-side API routes → ✅ Client-side state + localStorage persistence

**When you're ready to go live**, we swap:
- localStorage → PostgreSQL + Prisma
- Simple auth → NextAuth OAuth
- Mock tiers → Stripe subscriptions
- Rule-based AI → OpenAI API
- Client components → Server actions + API routes

The **UI, templates, editor, wizard, download logic, and ATS scoring** all stay the same.

---

## File Structure

```
C:\Users\tyand\resume-builder\
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Landing page
│   ├── globals.css
│   ├── (auth)/
│   │   └── signin/page.tsx      # Simple sign-in
│   ├── (app)/
│   │   ├── layout.tsx           # App layout (sidebar/header)
│   │   ├── dashboard/page.tsx   # Resume list
│   │   ├── resumes/
│   │   │   ├── new/page.tsx     # Wizard flow
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # View resume
│   │   │       └── edit/page.tsx # Editor
│   │   └── settings/page.tsx    # Account + tier settings
├── components/
│   ├── ui/                      # shadcn/ui (auto-installed)
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── wizard/
│   │   ├── WizardShell.tsx
│   │   ├── StepPersonalInfo.tsx
│   │   ├── StepExperience.tsx
│   │   ├── StepEducation.tsx
│   │   ├── StepSkills.tsx
│   │   └── StepReview.tsx
│   ├── editor/
│   │   ├── EditorShell.tsx
│   │   ├── SectionEditor.tsx
│   │   └── LivePreview.tsx
│   ├── templates/
│   │   ├── ClassicTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   └── MinimalTemplate.tsx
│   ├── download/
│   │   └── DownloadModal.tsx
│   └── settings/
│       └── TierSelector.tsx
├── lib/
│   ├── store.ts                 # localStorage helpers
│   ├── types.ts                 # All TypeScript types
│   ├── pdf-generator.ts         # PDF generation
│   ├── docx-generator.ts        # Word generation
│   ├── txt-generator.ts         # Plain text generation
│   ├── ats-scorer.ts            # ATS scoring engine
│   └── ai-suggestions.ts        # Rule-based AI suggestions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `lib/types.ts`

- [ ] **Step 1: Check Node.js is available**

Run: `node --version`
Expected: v18+ 

- [ ] **Step 2: Create package.json manually**

Write `package.json`:
```json
{
  "name": "resume-builder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@react-pdf/renderer": "^3.4.0",
    "docx": "^8.5.0",
    "lucide-react": "^0.363.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: All packages installed

- [ ] **Step 4: Write tsconfig.json**

Write `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Write next.config.js**

Write `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;
```

- [ ] **Step 6: Write tailwind.config.ts**

Write `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 7: Write postcss.config.mjs**

Write `postcss.config.mjs`:
```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
```

- [ ] **Step 8: Write app/globals.css**

Write `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

- [ ] **Step 9: Write lib/types.ts**

Write `lib/types.ts`:
```typescript
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
```

- [ ] **Step 10: Write app/layout.tsx**

Write `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build professional resumes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 11: Write app/page.tsx (landing)**

Write `app/page.tsx`:
```tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold mb-6">Build a Professional Resume</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Create, edit, and download resumes in PDF, Word, or plain text. Free to use.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Get Started
        </Link>
        <Link href="/signin" className="inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          Sign In
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 12: Verify build works**

Run: `npx next build 2>&1`
Expected: Build succeeds (may have warnings about missing pages, that's OK)

- [ ] **Step 13: Commit**

Run: `git add . && git commit -m "chore: scaffold Next.js project"`

---

### Task 2: localStorage Store & Auth

**Files:**
- Create: `lib/store.ts`
- Create: `app/(auth)/signin/page.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `components/layout/Header.tsx`

- [ ] **Step 1: Write lib/store.ts**

Write `lib/store.ts`:
```typescript
import { Resume, Tier } from "./types";

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
```

- [ ] **Step 2: Write app/(auth)/signin/page.tsx**

Write `app/(auth)/signin/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getUser } from "@/lib/store";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (getUser()) router.push("/dashboard");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    signIn(email, name);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 border rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Resume Builder</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Data is stored locally in your browser. No account needed.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write app/(app)/layout.tsx**

Write `app/(app)/layout.tsx`:
```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/store";
import { Header } from "@/components/layout/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getUser()) router.push("/signin");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Write components/layout/Header.tsx**

Write `components/layout/Header.tsx`:
```tsx
"use client";

import Link from "next/link";
import { getUser, signOut, getTier } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const user = getUser();
  const tier = getTier();

  if (!user) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold">ResumeBuilder</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
          <span className="text-muted-foreground">{user.name}</span>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">{tier.replace("_", " ")}</span>
          <button onClick={() => { signOut(); router.push("/"); }} className="text-muted-foreground hover:text-foreground">
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 6: Commit**

Run: `git add . && git commit -m "feat: add localStorage store, auth, and app layout"`

---

### Task 3: Dashboard & Resume CRUD

**Files:**
- Create: `app/(app)/dashboard/page.tsx`
- Create: `app/(app)/resumes/[id]/page.tsx`

- [ ] **Step 1: Write app/(app)/dashboard/page.tsx**

Write `app/(app)/dashboard/page.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getResumes, deleteResume, getResumeCount, hasTierAccess } from "@/lib/store";
import { Resume } from "@/lib/types";
import { DownloadModal } from "@/components/download/DownloadModal";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => { setResumes(getResumes()); }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this resume?")) return;
    deleteResume(id);
    setResumes(getResumes());
  };

  const canCreate = hasTierAccess("full_access") || getResumeCount() < 1;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Link
          href="/resumes/new"
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-primary-foreground ${canCreate ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
        >
          + New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground mb-4">No resumes yet. Create your first one!</p>
          <Link href="/resumes/new" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((resume) => (
            <div key={resume.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{resume.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {resume.personalInfo.fullName || "Untitled"} · Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <DownloadModal resume={resume} />
                <Link href={`/resumes/${resume.id}/edit`} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">Edit</Link>
                <button onClick={() => handleDelete(resume.id)} className="rounded-md border px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write app/(app)/resumes/[id]/page.tsx**

Write `app/(app)/resumes/[id]/page.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResume } from "@/lib/store";
import { Resume } from "@/lib/types";
import { DownloadModal } from "@/components/download/DownloadModal";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";

export default function ViewResumePage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const r = getResume(params.id as string);
    if (r) setResume(r);
    else router.push("/dashboard");
  }, [params.id]);

  if (!resume) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{resume.title}</h1>
        <div className="flex gap-2">
          <DownloadModal resume={resume} />
          <button onClick={() => router.push(`/resumes/${resume.id}/edit`)} className="rounded-md border px-4 py-2 text-sm hover:bg-muted">Edit</button>
        </div>
      </div>
      <div className="border rounded-lg bg-white shadow-sm">
        <ClassicTemplate resume={resume} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 4: Commit**

Run: `git add . && git commit -m "feat: add dashboard and resume view page"`

---

### Task 4: Resume Wizard

**Files:**
- Create: `app/(app)/resumes/new/page.tsx`
- Create: `components/wizard/WizardShell.tsx`
- Create: `components/wizard/StepPersonalInfo.tsx`
- Create: `components/wizard/StepExperience.tsx`
- Create: `components/wizard/StepEducation.tsx`
- Create: `components/wizard/StepSkills.tsx`
- Create: `components/wizard/StepSummary.tsx`
- Create: `components/wizard/StepReview.tsx`

- [ ] **Step 1: Write components/wizard/WizardShell.tsx**

Write `components/wizard/WizardShell.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createResume, DEFAULT_RESUME, Resume, Experience, Education } from "@/lib/types";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepExperience } from "./StepExperience";
import { StepEducation } from "./StepEducation";
import { StepSkills } from "./StepSkills";
import { StepSummary } from "./StepSummary";
import { StepReview } from "./StepReview";

const STEPS = ["Personal", "Experience", "Education", "Skills", "Summary", "Review"];

export function WizardShell() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("My Resume");
  const [personalInfo, setPersonalInfo] = useState(DEFAULT_RESUME.personalInfo);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState("");

  const handleSave = () => {
    const resume = createResume({
      title,
      templateId: "classic",
      personalInfo,
      experience,
      education,
      skills,
      summary,
    });
    router.push(`/resumes/${resume.id}/edit`);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepPersonalInfo data={personalInfo} onChange={setPersonalInfo} />;
      case 1: return <StepExperience data={experience} onChange={setExperience} />;
      case 2: return <StepEducation data={education} onChange={setEducation} />;
      case 3: return <StepSkills data={skills} onChange={setSkills} />;
      case 4: return <StepSummary data={summary} onChange={setSummary} />;
      case 5: return (
        <StepReview
          title={title}
          setTitle={setTitle}
          personalInfo={personalInfo}
          experience={experience}
          education={education}
          skills={skills}
          summary={summary}
          onSave={handleSave}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-1 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className={`flex-1 text-center text-xs py-2 rounded ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20" : "bg-muted"}`}>
            {label}
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{STEPS[step]}</h2>
        {renderStep()}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Back</button>
          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Next</button>
          ) : (
            <button onClick={handleSave} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Save Resume</button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write StepPersonalInfo**

Write `components/wizard/StepPersonalInfo.tsx`:
```tsx
"use client";
import { PersonalInfo } from "@/lib/types";

interface Props { data: PersonalInfo; onChange: (d: PersonalInfo) => void; }

export function StepPersonalInfo({ data, onChange }: Props) {
  const update = (field: keyof PersonalInfo, value: string) => onChange({ ...data, [field]: value });
  return (
    <div className="space-y-3">
      {(["fullName", "email", "phone", "location", "linkedin"] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
          <input className="w-full rounded-md border border-input px-3 py-2 text-sm" value={data[field]} onChange={(e) => update(field, e.target.value)} placeholder={field === "fullName" ? "John Doe" : field === "email" ? "john@example.com" : ""} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write StepExperience**

Write `components/wizard/StepExperience.tsx`:
```tsx
"use client";
import { Experience } from "@/lib/types";

interface Props { data: Experience[]; onChange: (d: Experience[]) => void; }

export function StepExperience({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Experience, value: unknown) => {
    const u = [...data]; u[i] = { ...u[i], [field]: value }; onChange(u);
  };
  return (
    <div className="space-y-4">
      {data.map((exp, i) => (
        <div key={exp.id} className="border rounded p-3 space-y-2">
          <div className="flex justify-between"><span className="text-sm font-medium">Experience {i + 1}</span><button onClick={() => remove(i)} className="text-xs text-destructive">Remove</button></div>
          <input className="w-full rounded border px-2 py-1 text-sm" placeholder="Job Title" value={exp.title} onChange={(e) => update(i, "title", e.target.value)} />
          <input className="w-full rounded border px-2 py-1 text-sm" placeholder="Company" value={exp.company} onChange={(e) => update(i, "company", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1 text-sm" placeholder="Start Date" value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
            <input className="rounded border px-2 py-1 text-sm" placeholder="End Date" value={exp.endDate} onChange={(e) => update(i, "endDate", e.target.value)} disabled={exp.current} />
          </div>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={exp.current} onChange={(e) => update(i, "current", e.target.checked)} /> Currently working here</label>
          {exp.bullets.map((b, j) => (
            <input key={j} className="w-full rounded border px-2 py-1 text-sm" placeholder="Bullet point" value={b} onChange={(e) => { const b2 = [...exp.bullets]; b2[j] = e.target.value; update(i, "bullets", b2); }} />
          ))}
          <button onClick={() => update(i, "bullets", [...exp.bullets, ""])} className="text-xs text-primary">+ Add Bullet</button>
        </div>
      ))}
      <button onClick={add} className="w-full rounded border border-dashed py-2 text-sm text-muted-foreground hover:bg-muted">+ Add Experience</button>
    </div>
  );
}
```

- [ ] **Step 4: Write StepEducation**

Write `components/wizard/StepEducation.tsx`:
```tsx
"use client";
import { Education } from "@/lib/types";

interface Props { data: Education[]; onChange: (d: Education[]) => void; }

export function StepEducation({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Education, value: string) => { const u = [...data]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="space-y-4">
      {data.map((edu, i) => (
        <div key={edu.id} className="border rounded p-3 space-y-2">
          <div className="flex justify-between"><span className="text-sm font-medium">Education {i + 1}</span><button onClick={() => remove(i)} className="text-xs text-destructive">Remove</button></div>
          <input className="w-full rounded border px-2 py-1 text-sm" placeholder="School" value={edu.school} onChange={(e) => update(i, "school", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1 text-sm" placeholder="Degree" value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} />
            <input className="rounded border px-2 py-1 text-sm" placeholder="Field of Study" value={edu.field} onChange={(e) => update(i, "field", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border px-2 py-1 text-sm" placeholder="Start" value={edu.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
            <input className="rounded border px-2 py-1 text-sm" placeholder="End" value={edu.endDate} onChange={(e) => update(i, "endDate", e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full rounded border border-dashed py-2 text-sm text-muted-foreground hover:bg-muted">+ Add Education</button>
    </div>
  );
}
```

- [ ] **Step 5: Write StepSkills**

Write `components/wizard/StepSkills.tsx`:
```tsx
"use client";
import { useState } from "react";

interface Props { data: string[]; onChange: (d: string[]) => void; }

export function StepSkills({ data, onChange }: Props) {
  const [input, setInput] = useState("");
  const add = () => { const s = input.trim(); if (s && !data.includes(s)) { onChange([...data, s]); setInput(""); } };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2 text-sm" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Type a skill and press Enter" />
        <button onClick={add} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((s) => (
          <span key={s} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm flex items-center gap-1">
            {s}
            <button onClick={() => onChange(data.filter(x => x !== s))} className="hover:text-destructive">×</button>
          </span>
        ))}
      </div>
      {data.length === 0 && <p className="text-sm text-muted-foreground">Add skills like "JavaScript", "Project Management", etc.</p>}
    </div>
  );
}
```

- [ ] **Step 6: Write StepSummary**

Write `components/wizard/StepSummary.tsx`:
```tsx
"use client";

interface Props { data: string; onChange: (d: string) => void; }

export function StepSummary({ data, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Professional Summary</label>
      <textarea className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm" value={data} onChange={(e) => onChange(e.target.value)} placeholder="Brief overview of your professional background and key strengths..." />
    </div>
  );
}
```

- [ ] **Step 7: Write StepReview**

Write `components/wizard/StepReview.tsx`:
```tsx
"use client";
import { PersonalInfo, Experience, Education } from "@/lib/types";

interface Props {
  title: string; setTitle: (t: string) => void;
  personalInfo: PersonalInfo; experience: Experience[]; education: Education[];
  skills: string[]; summary: string; onSave: () => void;
}

export function StepReview({ title, setTitle, personalInfo, experience, education, skills, summary, onSave }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Resume Title</label>
        <input className="w-full rounded-md border px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="text-sm space-y-2">
        <p><strong>Name:</strong> {personalInfo.fullName || "—"}</p>
        <p><strong>Email:</strong> {personalInfo.email || "—"}</p>
        <p><strong>Experience:</strong> {experience.length} entries</p>
        <p><strong>Education:</strong> {education.length} entries</p>
        <p><strong>Skills:</strong> {skills.join(", ") || "None"}</p>
        {summary && <p><strong>Summary:</strong> {summary}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Write app/(app)/resumes/new/page.tsx**

Write `app/(app)/resumes/new/page.tsx`:
```tsx
"use client";
import { WizardShell } from "@/components/wizard/WizardShell";

export default function NewResumePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
      <p className="text-muted-foreground mb-8">Follow the steps to build your resume</p>
      <WizardShell />
    </div>
  );
}
```

- [ ] **Step 9: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 10: Commit**

Run: `git add . && git commit -m "feat: add 6-step resume wizard"`

---

### Task 5: Resume Templates & Editor

**Files:**
- Create: `components/templates/ClassicTemplate.tsx`
- Create: `components/templates/ModernTemplate.tsx`
- Create: `components/templates/MinimalTemplate.tsx`
- Create: `app/(app)/resumes/[id]/edit/page.tsx`
- Create: `components/editor/EditorShell.tsx`
- Create: `components/editor/LivePreview.tsx`

- [ ] **Step 1: Write ClassicTemplate**

Write `components/templates/ClassicTemplate.tsx`:
```tsx
"use client";
import { Resume } from "@/lib/types";

export function ClassicTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills, summary } = resume;
  return (
    <div className="p-8 font-serif text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
      {personalInfo.fullName && (
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-2xl font-bold mb-1">{personalInfo.fullName}</h1>
          <div className="text-xs text-gray-500 space-x-3">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
      )}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold">{exp.title}{exp.company && <span className="font-normal text-gray-600"> — {exp.company}</span>}</span>
                <span className="text-xs text-gray-400">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.bullets.filter(Boolean).map((b, i) => <p key={i} className="text-gray-600 ml-4">• {b}</p>)}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-1">
              <span><strong>{edu.degree}</strong>{edu.field && ` in ${edu.field}`}{edu.school && ` — ${edu.school}`}</span>
              <span className="text-xs text-gray-400">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="text-gray-700">{skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write ModernTemplate**

Write `components/templates/ModernTemplate.tsx`:
```tsx
"use client";
import { Resume } from "@/lib/types";

export function ModernTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills, summary } = resume;
  return (
    <div className="flex text-sm min-h-[600px]">
      <div className="w-1/3 bg-slate-800 text-white p-6 space-y-6">
        <h1 className="text-xl font-bold">{personalInfo.fullName || "Your Name"}</h1>
        <div className="text-xs space-y-1 text-slate-300">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
        </div>
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => <span key={s} className="bg-slate-700 px-2 py-0.5 rounded text-xs">{s}</span>)}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 text-xs">
                <p className="font-medium">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                <p className="text-slate-400">{edu.school}</p>
                <p className="text-slate-500">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 p-6 space-y-5">
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">Summary</h2>
            <p className="text-gray-600 text-sm">{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-bold">{exp.title}</span>
                  <span className="text-xs text-gray-400">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                {exp.company && <p className="text-xs text-slate-600">{exp.company}</p>}
                {exp.bullets.filter(Boolean).map((b, i) => <p key={i} className="text-gray-600 text-xs ml-3">• {b}</p>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write MinimalTemplate**

Write `components/templates/MinimalTemplate.tsx`:
```tsx
"use client";
import { Resume } from "@/lib/types";

export function MinimalTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills, summary } = resume;
  return (
    <div className="p-8 text-sm max-w-2xl mx-auto">
      {personalInfo.fullName && (
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-1">{personalInfo.fullName}</h1>
          <div className="text-xs text-gray-400 flex flex-wrap gap-3">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
      )}
      {summary && <p className="text-gray-500 mb-6 text-sm leading-relaxed">{summary}</p>}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{exp.title}</span>
                <span className="text-[10px] text-gray-400">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.company && <p className="text-xs text-gray-400">{exp.company}</p>}
              {exp.bullets.filter(Boolean).map((b, i) => <p key={i} className="text-xs text-gray-500 mt-1">{b}</p>)}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-1">
              <span className="text-sm">{edu.degree}{edu.field && ` in ${edu.field}`} — {edu.school}</span>
              <span className="text-[10px] text-gray-400">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Skills</h2>
          <p className="text-xs text-gray-500">{skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Write EditorShell**

Write `components/editor/EditorShell.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Resume } from "@/lib/types";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { DownloadModal } from "@/components/download/DownloadModal";

interface Props { resume: Resume; onSave: (r: Resume) => void; }

const TEMPLATE_COMPONENTS: Record<string, React.FC<{ resume: Resume }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

export function EditorShell({ resume, onSave }: Props) {
  const [data, setData] = useState<Resume>(resume);
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<Resume>) => setData((prev) => ({ ...prev, ...partial }));

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TemplateComp = TEMPLATE_COMPONENTS[data.templateId] || ClassicTemplate;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <input className="rounded-md border px-3 py-1.5 text-sm w-48" value={data.title} onChange={(e) => update({ title: e.target.value })} />
          <select className="rounded-md border px-2 py-1.5 text-sm" value={data.templateId} onChange={(e) => update({ templateId: e.target.value as Resume["templateId"] })}>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
        <div className="flex gap-2">
          <DownloadModal resume={data} />
          <button onClick={handleSave} className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor form */}
        <div className="space-y-4 border rounded-lg p-4">
          <h3 className="font-semibold text-sm">Personal Info</h3>
          {(["fullName", "email", "phone", "location", "linkedin"] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
              <input className="w-full rounded border px-2 py-1 text-sm" value={data.personalInfo[field]} onChange={(e) => update({ personalInfo: { ...data.personalInfo, [field]: e.target.value } })} />
            </div>
          ))}

          <h3 className="font-semibold text-sm pt-2">Summary</h3>
          <textarea className="w-full min-h-[80px] rounded border px-2 py-1 text-sm" value={data.summary} onChange={(e) => update({ summary: e.target.value })} />

          <h3 className="font-semibold text-sm pt-2">Skills (comma-separated)</h3>
          <input className="w-full rounded border px-2 py-1 text-sm" value={data.skills.join(", ")} onChange={(e) => update({ skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />

          <h3 className="font-semibold text-sm pt-2">Experience</h3>
          {data.experience.map((exp, i) => (
            <div key={exp.id} className="border rounded p-2 space-y-1">
              <div className="flex justify-between"><span className="text-xs font-medium">#{i + 1}</span><button onClick={() => update({ experience: data.experience.filter((_, idx) => idx !== i) })} className="text-xs text-destructive">Remove</button></div>
              <input className="w-full rounded border px-2 py-1 text-xs" placeholder="Title" value={exp.title} onChange={(e) => { const u = [...data.experience]; u[i] = { ...u[i], title: e.target.value }; update({ experience: u }); }} />
              <input className="w-full rounded border px-2 py-1 text-xs" placeholder="Company" value={exp.company} onChange={(e) => { const u = [...data.experience]; u[i] = { ...u[i], company: e.target.value }; update({ experience: u }); }} />
              {exp.bullets.map((b, j) => (
                <input key={j} className="w-full rounded border px-2 py-1 text-xs" placeholder="Bullet" value={b} onChange={(e) => { const u = [...data.experience]; const b2 = [...u[i].bullets]; b2[j] = e.target.value; u[i] = { ...u[i], bullets: b2 }; update({ experience: u }); }} />
              ))}
              <button onClick={() => { const u = [...data.experience]; u[i] = { ...u[i], bullets: [...u[i].bullets, ""] }; update({ experience: u }); }} className="text-xs text-primary">+ Add Bullet</button>
            </div>
          ))}
          <button onClick={() => update({ experience: [...data.experience, { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }] })} className="w-full rounded border border-dashed py-1.5 text-xs text-muted-foreground">+ Add Experience</button>

          <h3 className="font-semibold text-sm pt-2">Education</h3>
          {data.education.map((edu, i) => (
            <div key={edu.id} className="border rounded p-2 space-y-1">
              <div className="flex justify-between"><span className="text-xs font-medium">#{i + 1}</span><button onClick={() => update({ education: data.education.filter((_, idx) => idx !== i) })} className="text-xs text-destructive">Remove</button></div>
              <input className="w-full rounded border px-2 py-1 text-xs" placeholder="School" value={edu.school} onChange={(e) => { const u = [...data.education]; u[i] = { ...u[i], school: e.target.value }; update({ education: u }); }} />
              <div className="grid grid-cols-2 gap-1">
                <input className="rounded border px-2 py-1 text-xs" placeholder="Degree" value={edu.degree} onChange={(e) => { const u = [...data.education]; u[i] = { ...u[i], degree: e.target.value }; update({ education: u }); }} />
                <input className="rounded border px-2 py-1 text-xs" placeholder="Field" value={edu.field} onChange={(e) => { const u = [...data.education]; u[i] = { ...u[i], field: e.target.value }; update({ education: u }); }} />
              </div>
            </div>
          ))}
          <button onClick={() => update({ education: [...data.education, { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" }] })} className="w-full rounded border border-dashed py-1.5 text-xs text-muted-foreground">+ Add Education</button>
        </div>

        {/* Live preview */}
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden sticky top-4">
          <TemplateComp resume={data} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write edit page**

Write `app/(app)/resumes/[id]/edit/page.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResume, saveResume } from "@/lib/store";
import { Resume } from "@/lib/types";
import { EditorShell } from "@/components/editor/EditorShell";

export default function EditResumePage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const r = getResume(params.id as string);
    if (r) setResume(r);
    else router.push("/dashboard");
  }, [params.id]);

  const handleSave = (updated: Resume) => {
    saveResume(updated);
    setResume(updated);
  };

  if (!resume) return <div className="text-center py-16">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Resume</h1>
      <EditorShell resume={resume} onSave={handleSave} />
    </div>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 7: Commit**

Run: `git add . && git commit -m "feat: add resume templates and live editor"`

---

### Task 6: Download System (PDF, Word, Text)

**Files:**
- Create: `lib/pdf-generator.ts`
- Create: `lib/docx-generator.ts`
- Create: `lib/txt-generator.ts`
- Create: `components/download/DownloadModal.tsx`

- [ ] **Step 1: Write lib/pdf-generator.ts**

Write `lib/pdf-generator.ts`:
```typescript
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Resume } from "./types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, lineHeight: 1.4, color: "#333", fontFamily: "Helvetica" },
  header: { marginBottom: 16, borderBottom: "2px solid #1a1a2e", paddingBottom: 8 },
  name: { fontSize: 22, fontWeight: "bold", color: "#1a1a2e", marginBottom: 2 },
  contact: { fontSize: 9, color: "#666" },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#1a1a2e", borderBottom: "1px solid #1a1a2e", paddingBottom: 3, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 1 },
  expItem: { marginBottom: 8 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  jobTitle: { fontSize: 11, fontWeight: "bold" },
  company: { fontSize: 10, color: "#555" },
  dateRange: { fontSize: 9, color: "#777" },
  bullet: { fontSize: 9, marginLeft: 8, marginBottom: 1 },
  skill: { backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: 2, fontSize: 9, marginRight: 4, marginBottom: 4 },
});

export async function generatePDF(resume: Resume): Promise<Blob> {
  const { personalInfo, experience, education, skills, summary } = resume;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {personalInfo.fullName && (
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.fullName}</Text>
            <Text style={styles.contact}>
              {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean).join(" | ")}
            </Text>
          </View>
        )}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9 }}>{summary}</Text>
          </View>
        )}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <View><Text style={styles.jobTitle}>{exp.title}</Text><Text style={styles.company}>{exp.company}</Text></View>
                  <Text style={styles.dateRange}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</Text>
                </View>
                {exp.bullets.filter(Boolean).map((b, i) => <Text key={i} style={styles.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                <Text style={{ fontSize: 10 }}><Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>{edu.field && ` in ${edu.field}`} — {edu.school}</Text>
                <Text style={{ fontSize: 9, color: "#777" }}>{edu.startDate} – {edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {skills.map((s, i) => <Text key={i} style={styles.skill}>{s}</Text>)}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );

  return await pdf(doc).toBlob();
}
```

- [ ] **Step 2: Write lib/docx-generator.ts**

Write `lib/docx-generator.ts`:
```typescript
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { Resume } from "./types";

export async function generateDocx(resume: Resume): Promise<Blob> {
  const { personalInfo, experience, education, skills, summary } = resume;
  const children: Paragraph[] = [];

  if (personalInfo.fullName) {
    children.push(new Paragraph({ children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | "), size: 20 })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }));
  }
  if (summary) {
    children.push(new Paragraph({ text: "SUMMARY", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: summary, size: 20 })], spacing: { after: 200 } }));
  }
  if (experience.length > 0) {
    children.push(new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const exp of experience) {
      children.push(new Paragraph({ children: [new TextRun({ text: exp.title, bold: true, size: 22 }), new TextRun({ text: ` — ${exp.company}`, size: 22 })], spacing: { before: 100 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`, size: 18, color: "666666", italics: true })] }));
      for (const b of exp.bullets.filter(Boolean)) {
        children.push(new Paragraph({ children: [new TextRun({ text: `• ${b}`, size: 20 })], indent: { left: 360 } }));
      }
    }
  }
  if (education.length > 0) {
    children.push(new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    for (const edu of education) {
      children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, bold: true, size: 22 })] }));
      children.push(new Paragraph({ children: [new TextRun({ text: `${edu.school} | ${edu.startDate} – ${edu.endDate}`, size: 20, color: "666666" })] }));
    }
  }
  if (skills.length > 0) {
    children.push(new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: skills.join("  •  "), size: 20 })] }));
  }

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
```

- [ ] **Step 3: Write lib/txt-generator.ts**

Write `lib/txt-generator.ts`:
```typescript
import { Resume } from "./types";

export function generateTxt(resume: Resume): string {
  const lines: string[] = [];
  const d = "─────────────────────────────────";
  const { personalInfo, experience, education, skills, summary } = resume;

  if (personalInfo.fullName) {
    lines.push(personalInfo.fullName.toUpperCase());
    lines.push([personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | "));
    if (personalInfo.linkedin) lines.push(personalInfo.linkedin);
    lines.push("");
  }
  if (summary) { lines.push(d); lines.push("SUMMARY"); lines.push(d); lines.push(summary); lines.push(""); }
  if (experience.length > 0) { lines.push(d); lines.push("EXPERIENCE"); lines.push(d); for (const exp of experience) { lines.push(`${exp.title} at ${exp.company}`); lines.push(`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`); for (const b of exp.bullets.filter(Boolean)) lines.push(`  • ${b}`); lines.push(""); } }
  if (education.length > 0) { lines.push(d); lines.push("EDUCATION"); lines.push(d); for (const edu of education) { lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`); lines.push(`${edu.school} | ${edu.startDate} – ${edu.endDate}`); lines.push(""); } }
  if (skills.length > 0) { lines.push(d); lines.push("SKILLS"); lines.push(d); lines.push(skills.join(" • ")); }

  return lines.join("\n");
}
```

- [ ] **Step 4: Write DownloadModal**

Write `components/download/DownloadModal.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Resume } from "@/lib/types";
import { generatePDF } from "@/lib/pdf-generator";
import { generateDocx } from "@/lib/docx-generator";
import { generateTxt } from "@/lib/txt-generator";

interface Props { resume: Resume; }

export function DownloadModal({ resume }: Props) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = async (format: "pdf" | "docx" | "txt") => {
    setDownloading(format);
    try {
      let blob: Blob;
      let filename: string;
      switch (format) {
        case "pdf": blob = await generatePDF(resume); filename = `${resume.title}.pdf`; break;
        case "docx": blob = await generateDocx(resume); filename = `${resume.title}.docx`; break;
        case "txt": blob = new Blob([generateTxt(resume)], { type: "text/plain" }); filename = `${resume.title}.txt`; break;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch { alert("Download failed. Please try again."); }
    finally { setDownloading(null); setOpen(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">Download</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Choose Format</h3>
            <div className="space-y-2">
              {(["pdf", "docx", "txt"] as const).map((f) => (
                <button key={f} onClick={() => download(f)} disabled={downloading !== null} className="w-full rounded-md border px-4 py-2 text-sm text-left hover:bg-muted disabled:opacity-50">
                  {downloading === f ? "Generating..." : f === "pdf" ? "PDF" : f === "docx" ? "Word (.docx)" : "Plain Text (.txt)"}
                </button>
              ))}
            </div>
            <button onClick={() => setOpen(false)} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 6: Commit**

Run: `git add . && git commit -m "feat: add PDF, Word, and text download"`

---

### Task 7: ATS Scoring & AI Suggestions

**Files:**
- Create: `lib/ats-scorer.ts`
- Create: `lib/ai-suggestions.ts`
- Create: `app/(app)/settings/page.tsx`

- [ ] **Step 1: Write lib/ats-scorer.ts**

Write `lib/ats-scorer.ts`:
```typescript
import { Resume } from "./types";

const ACTION_VERBS = ["achieved","administered","advanced","analyzed","built","chaired","coached","compiled","composed","conducted","consolidated","constructed","coordinated","created","decreased","delivered","designed","developed","directed","drove","eliminated","engineered","established","evaluated","executed","expanded","facilitated","founded","generated","grew","headed","identified","implemented","improved","increased","influenced","initiated","innovated","introduced","launched","led","managed","mentored","negotiated","optimized","organized","oversaw","pioneered","planned","produced","reduced","reorganized","resolved","restructured","revamped","scaled","spearheaded","streamlined","strengthened","supervised","surpassed","transformed","unified","won"];

export interface AtsResult { score: number; tips: string[]; }

export function scoreResume(resume: Resume): AtsResult {
  const tips: string[] = [];
  let score = 0;

  // Contact info (15 pts)
  if (resume.personalInfo.fullName) score += 5; else tips.push("Add your full name");
  if (resume.personalInfo.email) score += 5; else tips.push("Add your email address");
  if (resume.personalInfo.phone) score += 5; else tips.push("Add your phone number");

  // Sections (20 pts)
  if (resume.experience.length > 0) score += 8; else tips.push("Add an Experience section");
  if (resume.education.length > 0) score += 6; else tips.push("Add an Education section");
  if (resume.skills.length > 0) score += 6; else tips.push("Add a Skills section");

  // Action verbs (25 pts)
  let totalBullets = 0, verbBullets = 0;
  for (const exp of resume.experience) {
    for (const b of exp.bullets) {
      totalBullets++;
      const first = b.trim().split(" ")[0]?.toLowerCase() ?? "";
      if (ACTION_VERBS.includes(first)) verbBullets++;
    }
  }
  if (totalBullets > 0) {
    score += Math.round((verbBullets / totalBullets) * 25);
    if (verbBullets / totalBullets < 0.5) tips.push(`Start more bullets with action verbs (${verbBullets}/${totalBullets} do)`);
  } else tips.push("Add bullet points to your experience");

  // Metrics (20 pts)
  let metricBullets = 0;
  for (const exp of resume.experience) {
    for (const b of exp.bullets) {
      if (/\d+%|\d+\+|\$\d+|\d+ percent|\d+ people|\d+ team/i.test(b)) metricBullets++;
    }
  }
  if (totalBullets > 0) {
    score += Math.round((metricBullets / totalBullets) * 20);
    if (metricBullets / totalBullets < 0.3) tips.push("Add numbers, percentages, or dollar amounts to your bullets");
  }

  // Summary (10 pts)
  if (resume.summary) score += 10; else tips.push("Consider adding a professional summary");

  // Length (10 pts)
  if (resume.experience.length >= 2) score += 10; else if (resume.experience.length === 1) { score += 5; tips.push("Add more experience entries if possible"); }

  return { score: Math.min(score, 100), tips: tips.slice(0, 5) };
}
```

- [ ] **Step 2: Write lib/ai-suggestions.ts**

Write `lib/ai-suggestions.ts`:
```typescript
const ACTION_VERBS = ["Led", "Developed", "Managed", "Created", "Implemented", "Designed", "Achieved", "Increased", "Reduced", "Streamlined", "Coordinated", "Delivered", "Built", "Launched", "Optimized", "Automated", "Spearheaded", "Collaborated", "Analyzed", "Improved"];

const BULLET_TEMPLATES: Record<string, string[]> = {
  default: [
    "Led cross-functional team of X members to deliver [project] on time and under budget",
    "Developed and implemented [solution] resulting in X% improvement in [metric]",
    "Managed [scope] across X projects, consistently meeting deadlines and quality standards",
    "Created [deliverable] that increased [metric] by X% within [timeframe]",
    "Streamlined [process] reducing [metric] by X% and saving X hours per week",
  ],
  engineer: [
    "Built [system/feature] using [technology] serving X users/requests per day",
    "Optimized [system] reducing latency by X% and improving throughput by X%",
    "Designed and implemented [architecture] supporting X concurrent users",
    "Automated [process] saving X hours per week and reducing errors by X%",
    "Led migration of [system] to [platform] with zero downtime",
  ],
  manager: [
    "Managed team of X direct reports, achieving X% employee retention rate",
    "Delivered $[budget] project on time and X% under budget",
    "Increased team productivity by X% through process improvements and tooling",
    "Hired and onboarded X new team members within [timeframe]",
    "Implemented [initiative] resulting in X% improvement in team satisfaction",
  ],
};

export function generateBullets(jobTitle: string, description: string): string[] {
  const title = jobTitle.toLowerCase();
  let pool = BULLET_TEMPLATES.default;
  if (title.includes("engineer") || title.includes("developer") || title.includes("programmer")) pool = BULLET_TEMPLATES.engineer;
  else if (title.includes("manager") || title.includes("lead") || title.includes("director")) pool = BULLET_TEMPLATES.manager;

  // Shuffle and pick 4
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

export function improveBullet(bullet: string): string {
  let improved = bullet.trim();

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  // Add action verb if missing
  const first = improved.split(" ")[0]?.toLowerCase();
  if (!ACTION_VERBS.some(v => v.toLowerCase() === first)) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    improved = `${verb} ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
  }

  // Add period if missing
  if (!improved.endsWith(".") && !improved.endsWith("!") && !improved.endsWith("?")) {
    improved += ".";
  }

  // Suggest adding metrics if no numbers
  if (!/\d/.test(improved)) {
    improved += " (consider adding a metric like % improvement or $ impact)";
  }

  return improved;
}

export function improveSummary(summary: string): string {
  let improved = summary.trim();
  if (!improved.endsWith(".")) improved += ".";

  const suggestions = [
    "Consider mentioning years of experience.",
    "Add your key technical skills or areas of expertise.",
    "Include a career goal or what you're looking for next.",
    "Quantify your impact where possible (team size, revenue, users).",
  ];

  return `${improved}\n\nSuggestions:\n${suggestions.map(s => `• ${s}`).join("\n")}`;
}
```

- [ ] **Step 3: Write settings page**

Write `app/(app)/settings/page.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { getUser, getTier, setTier, Tier } from "@/lib/store";
import { LocalUser } from "@/lib/store";

export default function SettingsPage() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [tier, setTierState] = useState<Tier>("free");

  useEffect(() => {
    setUser(getUser());
    setTierState(getTier());
  }, []);

  const handleTierChange = (newTier: Tier) => {
    setTier(newTier);
    setTierState(newTier);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {(["free", "full_access", "premium"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTierChange(t)}
              className={`border rounded-lg p-4 text-left ${tier === t ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
            >
              <div className="font-medium capitalize">{t.replace("_", " ")}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t === "free" ? "1 resume, PDF only" : t === "full_access" ? "Unlimited, all formats" : "Everything + AI features"}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Change your plan anytime. Stored locally.</p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Data</h2>
        <p className="text-sm text-muted-foreground mb-3">All data is stored in your browser. Clearing browser data will delete your resumes.</p>
        <button onClick={() => { if (confirm("Delete all resumes? This cannot be undone.")) { localStorage.clear(); window.location.href = "/"; } }} className="rounded-md border border-destructive text-destructive px-4 py-2 text-sm hover:bg-destructive/10">
          Clear All Data
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 5: Commit**

Run: `git add . && git commit -m "feat: add ATS scoring, AI suggestions, and settings page"`

---

### Task 8: Final Polish

**Files:**
- Modify: `app/page.tsx` — enhance landing page
- Create: `README.md`

- [ ] **Step 1: Enhance landing page**

Replace `app/page.tsx`:
```tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-5xl font-bold mb-6">Build a Professional Resume</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Create, edit, and download resumes in PDF, Word, or plain text. Three beautiful templates. ATS scoring. Free to use.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Get Started — It's Free
          </Link>
        </div>
      </div>
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold mb-2">Guided Wizard</h3>
              <p className="text-sm text-muted-foreground">Step-by-step resume builder. We guide you through every section.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="font-semibold mb-2">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See your resume update in real-time as you type. Three templates to choose from.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📥</div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">Download as PDF, Word (.docx), or plain text. Whatever the employer needs.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">ATS Scoring</h3>
              <p className="text-sm text-muted-foreground">Get an ATS compatibility score with actionable tips to improve your resume.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">AI Suggestions</h3>
              <p className="text-sm text-muted-foreground">Generate bullet points and improve your writing with rule-based AI assistance.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">Private & Local</h3>
              <p className="text-sm text-muted-foreground">All data stays in your browser. Nothing is sent to any server.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write README.md**

Write `README.md`:
```markdown
# Resume Builder

A local-first resume builder built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Guided Wizard** — 6-step resume creation flow
- **Live Editor** — Split-pane editor with real-time preview
- **3 Templates** — Classic, Modern, and Minimal
- **Download** — PDF, Word (.docx), and plain text
- **ATS Scoring** — Get an ATS compatibility score with improvement tips
- **AI Suggestions** — Rule-based bullet generation and text improvement
- **Local-First** — All data stored in your browser

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @react-pdf/renderer (PDF generation)
- docx (Word generation)
- localStorage (data persistence)

## Future Enhancements

- PostgreSQL + Prisma for cloud storage
- NextAuth OAuth (Google, Facebook, Apple)
- Stripe subscriptions
- OpenAI-powered AI features
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1`
Expected: Build succeeds

- [ ] **Step 4: Commit**

Run: `git add . && git commit -m "feat: enhance landing page and add README"`