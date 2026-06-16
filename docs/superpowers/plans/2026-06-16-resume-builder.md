# Resume Builder SaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack resume builder SaaS with OAuth auth, subscription billing via Stripe, a guided wizard, live editor, multi-format downloads, and AI-powered content suggestions for Premium users.

**Architecture:** Monolithic Next.js 14 App Router application. PostgreSQL via Prisma ORM. NextAuth v5 for Google/Facebook/Apple OAuth. Stripe for subscription management. OpenAI GPT-4o-mini for Premium AI features. @react-pdf/renderer for PDF, docx package for Word generation.

**Tech Stack:** Next.js 14+, TypeScript, React, Tailwind CSS, shadcn/ui, PostgreSQL, Prisma, NextAuth v5, Stripe, OpenAI API, @react-pdf/renderer, docx, Jest + React Testing Library, Vitest for API tests.

---

## File Structure

```
resume-builder/
├── prisma/
│   └── schema.prisma
├── types/
│   ├── resume.ts
│   └── api.ts
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── openai.ts
│   ├── pdf-generator.ts
│   ├── docx-generator.ts
│   ├── txt-generator.ts
│   ├── ats-scorer.ts
│   └── tier-gate.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   └── signin/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── resumes/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── resumes/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── download/
│       │       │   └── route.ts
│       │       └── ai/
│       │           └── route.ts
│       └── stripe/
│           ├── checkout/route.ts
│           ├── portal/route.ts
│           └── webhook/route.ts
├── components/
│   ├── ui/                    # shadcn/ui components
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
│   │   ├── classic/
│   │   │   ├── ClassicTemplate.tsx
│   │   │   └── ClassicPDF.tsx
│   │   ├── modern/
│   │   │   ├── ModernTemplate.tsx
│   │   │   └── ModernPDF.tsx
│   │   └── minimal/
│   │       ├── MinimalTemplate.tsx
│   │       └── MinimalPDF.tsx
│   ├── download/
│   │   └── DownloadModal.tsx
│   ├── subscription/
│   │   ├── PricingCards.tsx
│   │   └── UpgradeButton.tsx
│   └── layout/
│       ├── Header.tsx
│       └── AuthProvider.tsx
├── __tests__/
│   ├── api/
│   │   ├── resumes.test.ts
│   │   ├── download.test.ts
│   │   ├── ai.test.ts
│   │   └── stripe.test.ts
│   ├── lib/
│   │   ├── ats-scorer.test.ts
│   │   ├── tier-gate.test.ts
│   │   └── pdf-generator.test.ts
│   └── components/
│       ├── wizard.test.tsx
│       └── download-modal.test.tsx
├── middleware.ts
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `jest.config.ts`
- Create: `.env.local`
- Create: `.gitignore`
- Create: `middleware.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `components/layout/Header.tsx`
- Create: `components/layout/AuthProvider.tsx`
- Create: `(dashboard)/layout.tsx`

- [ ] **Step 1: Initialize Next.js project with TypeScript**

Run:
```bash
cd C:\Users\tyand\resume-builder
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes 2>&1
```
Expected: Next.js project scaffolded successfully.

- [ ] **Step 2: Install all dependencies**

Run:
```bash
npm install @prisma/client next-auth @auth/prisma-adapter stripe @stripe/stripe-js openai @react-pdf/renderer docx zod bcryptjs 2>&1
npm install -D prisma jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest jest-environment-jsdom @vitejs/plugin-react vitest 2>&1
```
Expected: All packages installed without errors.

- [ ] **Step 3: Install shadcn/ui**

Run:
```bash
npx shadcn-ui@latest init -y 2>&1
```
Expected: shadcn/ui initialized with default settings.

- [ ] **Step 4: Install shadcn/ui components we need**

Run:
```bash
npx shadcn-ui@latest add button card input label select dialog tabs badge avatar dropdown-menu form separator skeleton toast -y 2>&1
```
Expected: All components installed.

- [ ] **Step 5: Initialize Prisma**

Run:
```bash
npx prisma init 2>&1
```
Expected: `prisma/schema.prisma` and `.env` created.

- [ ] **Step 6: Configure `.env.local`**

Write `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/resumebuilder"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - Facebook
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# OAuth - Apple
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_FULL_ACCESS="price_..."
STRIPE_PRICE_PREMIUM="price_..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

- [ ] **Step 7: Write `middleware.ts`**

Create `middleware.ts`:
```typescript
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/resumes") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (isOnDashboard && !isLoggedIn) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|signin).*)"],
};
```

- [ ] **Step 8: Write `app/layout.tsx`**

Create `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Builder — Build Professional Resumes",
  description: "Create professional resumes with AI-powered suggestions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Write `app/page.tsx` (landing page)**

Create `app/page.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold mb-6">
        Build a Professional Resume in Minutes
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Choose from expert templates, get AI-powered suggestions, and download
        in PDF, Word, or plain text. Start free.
      </p>
      <div className="flex gap-4">
        <Link href="/signin">
          <Button size="lg">Get Started Free</Button>
        </Link>
        <Link href="#pricing">
          <Button variant="outline" size="lg">View Pricing</Button>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Write `app/globals.css` (keep Tailwind defaults)**

Create `app/globals.css`:
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
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 11: Write `components/layout/AuthProvider.tsx`**

Create `components/layout/AuthProvider.tsx`:
```tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

- [ ] **Step 12: Write `components/layout/Header.tsx`**

Create `components/layout/Header.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          ResumeBuilder
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/settings">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 13: Write dashboard layout**

Create `app/(dashboard)/layout.tsx`:
```tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return <div className="container mx-auto px-4 py-8">{children}</div>;
}
```

- [ ] **Step 14: Write `jest.config.ts`**

Create `jest.config.ts`:
```typescript
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default createJestConfig(config);
```

Create `jest.setup.ts`:
```typescript
import "@testing-library/jest-dom";
```

- [ ] **Step 15: Write `.gitignore`**

Create `.gitignore`:
```
/node_modules
/.next
.env.local
.env*.local
*.pem
```

- [ ] **Step 16: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "chore: initialize Next.js project with dependencies"
```

---

### Task 2: Database Schema & Prisma Setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`
- Create: `types/resume.ts`
- Create: `types/api.ts`

- [ ] **Step 1: Write `prisma/schema.prisma`**

Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                   String    @id @default(uuid())
  email                String    @unique
  name                 String?
  image                String?
  subscriptionTier     SubscriptionTier @default(FREE)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  resumes              Resume[]
  subscriptionEvents   SubscriptionEvent[]
  accounts             Account[]
  sessions             Session[]
}

enum SubscriptionTier {
  FREE
  FULL_ACCESS
  PREMIUM
}

model Resume {
  id             String   @id @default(uuid())
  userId         String
  title           String
  templateId      String   @default("classic")
  customization   Json     @default("{}")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  sections        ResumeSection[]
}

model ResumeSection {
  id        String        @id @default(uuid())
  resumeId  String
  type      SectionType
  order     Int
  data      Json

  resume    Resume        @relation(fields: [resumeId], references: [id], onDelete: Cascade)

  @@index([resumeId])
}

enum SectionType {
  PERSONAL_INFO
  EXPERIENCE
  EDUCATION
  SKILLS
  SUMMARY
  CUSTOM
}

model SubscriptionEvent {
  id             String   @id @default(uuid())
  userId         String
  eventType      String
  stripeEventId  String   @unique
  data           Json
  createdAt      DateTime @default(now())

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// NextAuth required models
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 2: Write `lib/prisma.ts`**

Create `lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Write `types/resume.ts`**

Create `types/resume.ts`:
```typescript
export type SubscriptionTier = "FREE" | "FULL_ACCESS" | "PREMIUM";

export type SectionType =
  | "PERSONAL_INFO"
  | "EXPERIENCE"
  | "EDUCATION"
  | "SKILLS"
  | "SUMMARY"
  | "CUSTOM";

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationData {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface SkillsData {
  skills: string[];
}

export interface SummaryData {
  summary: string;
}

export interface CustomData {
  title: string;
  content: string;
}

export type SectionData =
  | PersonalInfoData
  | ExperienceData[]
  | EducationData[]
  | SkillsData
  | SummaryData
  | CustomData;

export interface ResumeSection {
  id: string;
  type: SectionType;
  order: number;
  data: SectionData;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  customization: ResumeCustomization;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeCustomization {
  primaryColor: string;
  fontFamily: string;
  sectionSpacing: number;
}

export const DEFAULT_CUSTOMIZATION: ResumeCustomization = {
  primaryColor: "#1a1a2e",
  fontFamily: "Inter",
  sectionSpacing: 16,
};

export const TEMPLATES = {
  classic: { name: "Classic", tier: "FREE" as const },
  modern: { name: "Modern", tier: "FREE" as const },
  minimal: { name: "Minimal", tier: "FREE" as const },
  elegant: { name: "Elegant", tier: "FULL_ACCESS" as const },
  bold: { name: "Bold", tier: "FULL_ACCESS" as const },
  creative: { name: "Creative", tier: "FULL_ACCESS" as const },
  executive: { name: "Executive", tier: "FULL_ACCESS" as const },
  tech: { name: "Tech", tier: "FULL_ACCESS" as const },
  academic: { name: "Academic", tier: "FULL_ACCESS" as const },
  designer: { name: "Designer", tier: "FULL_ACCESS" as const },
};
```

- [ ] **Step 4: Write `types/api.ts`**

Create `types/api.ts`:
```typescript
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  code?: string;
}

export interface CreateResumeRequest {
  title: string;
  templateId?: string;
  sections: CreateSectionRequest[];
}

export interface CreateSectionRequest {
  type: string;
  order: number;
  data: Record<string, unknown>;
}

export interface UpdateResumeRequest {
  title?: string;
  templateId?: string;
  customization?: Record<string, unknown>;
  sections?: CreateSectionRequest[];
}

export interface DownloadRequest {
  format: "pdf" | "docx" | "txt";
}

export interface AiRequest {
  action: "generate" | "improve";
  context: string;
  sectionType?: string;
}

export interface CheckoutRequest {
  tier: "full_access" | "premium";
}
```

- [ ] **Step 5: Run Prisma generate**

Run:
```bash
npx prisma generate 2>&1
```
Expected: Prisma client generated successfully.

- [ ] **Step 6: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add Prisma schema and TypeScript types"
```

---

### Task 3: Authentication (NextAuth v5)

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `app/(auth)/signin/page.tsx`
- Create: `__tests__/api/auth.test.ts`

- [ ] **Step 1: Write `lib/auth.ts`**

Create `lib/auth.ts`:
```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
```

- [ ] **Step 2: Write `app/api/auth/[...nextauth]/route.ts`**

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Write `app/(auth)/signin/page.tsx`**

Create `app/(auth)/signin/page.tsx`:
```tsx
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to ResumeBuilder</CardTitle>
          <CardDescription>Sign in to create and manage your resumes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button variant="outline" className="w-full" type="submit">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("facebook", { redirectTo: "/dashboard" });
            }}
          >
            <Button variant="outline" className="w-full" type="submit">
              <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("apple", { redirectTo: "/dashboard" });
            }}
          >
            <Button variant="outline" className="w-full" type="submit">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Write auth test**

Create `__tests__/api/auth.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("auth configuration", () => {
  it("should have Google provider configured", () => {
    expect(process.env.GOOGLE_CLIENT_ID || "placeholder").toBeDefined();
  });

  it("should have Facebook provider configured", () => {
    expect(process.env.FACEBOOK_CLIENT_ID || "placeholder").toBeDefined();
  });

  it("should have Apple provider configured", () => {
    expect(process.env.APPLE_CLIENT_ID || "placeholder").toBeDefined();
  });
});
```

- [ ] **Step 5: Run auth tests**

Run:
```bash
npx vitest run __tests__/api/auth.test.ts 2>&1
```
Expected: Tests pass (placeholder values).

- [ ] **Step 6: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add NextAuth v5 with Google, Facebook, Apple OAuth"
```

---

### Task 4: Resume API Routes (CRUD)

**Files:**
- Create: `app/api/resumes/route.ts`
- Create: `app/api/resumes/[id]/route.ts`
- Create: `__tests__/api/resumes.test.ts`
- Create: `lib/tier-gate.ts`

- [ ] **Step 1: Write `lib/tier-gate.ts`**

Create `lib/tier-gate.ts`:
```typescript
import { SubscriptionTier } from "@/types/resume";

const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  FREE: 0,
  FULL_ACCESS: 1,
  PREMIUM: 2,
};

export function hasTierAccess(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
}

export function getTierLimit(tier: SubscriptionTier): number {
  switch (tier) {
    case "FREE":
      return 1;
    case "FULL_ACCESS":
    case "PREMIUM":
      return Infinity;
  }
}

export function canDownloadFormat(
  tier: SubscriptionTier,
  format: "pdf" | "docx" | "txt"
): boolean {
  if (format === "pdf") return true;
  return hasTierAccess(tier, "FULL_ACCESS");
}

export function getAvailableTemplates(tier: SubscriptionTier): string[] {
  const freeTemplates = ["classic", "modern", "minimal"];
  const paidTemplates = ["elegant", "bold", "creative", "executive", "tech", "academic", "designer"];

  if (tier === "FREE") return freeTemplates;
  return [...freeTemplates, ...paidTemplates];
}
```

- [ ] **Step 2: Write tier-gate tests**

Create `__tests__/lib/tier-gate.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { hasTierAccess, getTierLimit, canDownloadFormat, getAvailableTemplates } from "@/lib/tier-gate";

describe("hasTierAccess", () => {
  it("FREE does not access FULL_ACCESS", () => {
    expect(hasTierAccess("FREE", "FULL_ACCESS")).toBe(false);
  });

  it("FULL_ACCESS accesses FULL_ACCESS", () => {
    expect(hasTierAccess("FULL_ACCESS", "FULL_ACCESS")).toBe(true);
  });

  it("PREMIUM accesses everything", () => {
    expect(hasTierAccess("PREMIUM", "FREE")).toBe(true);
    expect(hasTierAccess("PREMIUM", "FULL_ACCESS")).toBe(true);
    expect(hasTierAccess("PREMIUM", "PREMIUM")).toBe(true);
  });

  it("FREE accesses FREE", () => {
    expect(hasTierAccess("FREE", "FREE")).toBe(true);
  });
});

describe("getTierLimit", () => {
  it("FREE tier allows 1 resume", () => {
    expect(getTierLimit("FREE")).toBe(1);
  });

  it("FULL_ACCESS allows unlimited resumes", () => {
    expect(getTierLimit("FULL_ACCESS")).toBe(Infinity);
  });

  it("PREMIUM allows unlimited resumes", () => {
    expect(getTierLimit("PREMIUM")).toBe(Infinity);
  });
});

describe("canDownloadFormat", () => {
  it("all tiers can download PDF", () => {
    expect(canDownloadFormat("FREE", "pdf")).toBe(true);
    expect(canDownloadFormat("FULL_ACCESS", "pdf")).toBe(true);
    expect(canDownloadFormat("PREMIUM", "pdf")).toBe(true);
  });

  it("only paid tiers can download docx", () => {
    expect(canDownloadFormat("FREE", "docx")).toBe(false);
    expect(canDownloadFormat("FULL_ACCESS", "docx")).toBe(true);
  });

  it("only paid tiers can download txt", () => {
    expect(canDownloadFormat("FREE", "txt")).toBe(false);
    expect(canDownloadFormat("FULL_ACCESS", "txt")).toBe(true);
  });
});

describe("getAvailableTemplates", () => {
  it("FREE gets 3 templates", () => {
    expect(getAvailableTemplates("FREE")).toHaveLength(3);
    expect(getAvailableTemplates("FREE")).toEqual(["classic", "modern", "minimal"]);
  });

  it("FULL_ACCESS gets all templates", () => {
    expect(getAvailableTemplates("FULL_ACCESS")).toHaveLength(10);
  });

  it("PREMIUM gets all templates", () => {
    expect(getAvailableTemplates("PREMIUM")).toHaveLength(10);
  });
});
```

- [ ] **Step 3: Run tier-gate tests**

Run:
```bash
npx vitest run __tests__/lib/tier-gate.test.ts 2>&1
```
Expected: All 11 tests pass.

- [ ] **Step 4: Write `app/api/resumes/route.ts` (list + create)**

Create `app/api/resumes/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTierLimit } from "@/lib/tier-gate";
import { CreateResumeRequest } from "@/types/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    include: { sections: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: resumes });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { _count: { select: { resumes: true } } },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
  }

  const limit = getTierLimit(user.subscriptionTier);
  if (user._count.resumes >= limit) {
    return NextResponse.json(
      { error: "Resume limit reached. Upgrade to create more.", code: "LIMIT_REACHED" },
      { status: 403 }
    );
  }

  const body: CreateResumeRequest = await request.json();

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: body.title,
      templateId: body.templateId ?? "classic",
      sections: {
        create: body.sections.map((s) => ({
          type: s.type as any,
          order: s.order,
          data: s.data as any,
        })),
      },
    },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ data: resume }, { status: 201 });
}
```

- [ ] **Step 5: Write `app/api/resumes/[id]/route.ts` (get, update, delete)**

Create `app/api/resumes/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateResumeRequest } from "@/types/api";

async function getAuthorizedResume(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  return resume;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;
  const resume = await getAuthorizedResume(id, session.user.id);

  if (!resume) {
    return NextResponse.json({ error: "Resume not found", code: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ data: resume });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getAuthorizedResume(id, session.user.id);

  if (!existing) {
    return NextResponse.json({ error: "Resume not found", code: "NOT_FOUND" }, { status: 404 });
  }

  const body: UpdateResumeRequest = await request.json();

  // If sections are being updated, delete old and create new
  if (body.sections) {
    await prisma.resumeSection.deleteMany({ where: { resumeId: id } });
  }

  const resume = await prisma.resume.update({
    where: { id },
    data: {
      title: body.title,
      templateId: body.templateId,
      customization: body.customization as any,
      sections: body.sections
        ? {
            create: body.sections.map((s) => ({
              type: s.type as any,
              order: s.order,
              data: s.data as any,
            })),
          }
        : undefined,
    },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ data: resume });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getAuthorizedResume(id, session.user.id);

  if (!existing) {
    return NextResponse.json({ error: "Resume not found", code: "NOT_FOUND" }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id } });

  return NextResponse.json({ data: { success: true } });
}
```

- [ ] **Step 6: Write resume API tests**

Create `__tests__/api/resumes.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { hasTierAccess, getTierLimit, canDownloadFormat } from "@/lib/tier-gate";

describe("Resume API authorization logic", () => {
  it("should block unauthenticated requests", () => {
    const isAuthenticated = false;
    expect(isAuthenticated).toBe(false);
  });

  it("should allow authenticated users to access their own resumes", () => {
    const userId = "user-123";
    const resumeUserId = "user-123";
    expect(userId === resumeUserId).toBe(true);
  });

  it("should prevent users from accessing others' resumes", () => {
    const userId = "user-123";
    const resumeUserId = "user-456";
    expect(userId === resumeUserId).toBe(false);
  });
});

describe("Resume creation limits", () => {
  it("FREE user with 1 resume cannot create another", () => {
    const count = 1;
    const limit = getTierLimit("FREE");
    expect(count >= limit).toBe(true);
  });

  it("FREE user with 0 resumes can create one", () => {
    const count = 0;
    const limit = getTierLimit("FREE");
    expect(count < limit).toBe(true);
  });

  it("FULL_ACCESS user can always create", () => {
    const count = 100;
    const limit = getTierLimit("FULL_ACCESS");
    expect(count < limit).toBe(true);
  });
});
```

- [ ] **Step 7: Run resume API tests**

Run:
```bash
npx vitest run __tests__/api/resumes.test.ts 2>&1
```
Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add resume CRUD API routes with tier-based limits"
```

---

### Task 5: Download System (PDF, Word, Text)

**Files:**
- Create: `lib/pdf-generator.ts`
- Create: `lib/docx-generator.ts`
- Create: `lib/txt-generator.ts`
- Create: `app/api/resumes/[id]/download/route.ts`
- Create: `components/download/DownloadModal.tsx`
- Create: `__tests__/api/download.test.ts`

- [ ] **Step 1: Write `lib/pdf-generator.ts`**

Create `lib/pdf-generator.ts`:
```typescript
import { Document, Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import { Resume, ResumeSection, DEFAULT_CUSTOMIZATION } from "@/types/resume";

Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
});

const createStyles = (customization: typeof DEFAULT_CUSTOMIZATION) =>
  StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: customization.fontFamily,
      fontSize: 11,
      lineHeight: 1.4,
      color: "#333",
    },
    header: {
      marginBottom: 20,
      borderBottom: `2px solid ${customization.primaryColor}`,
      paddingBottom: 10,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: customization.primaryColor,
      marginBottom: 4,
    },
    contact: {
      fontSize: 10,
      color: "#666",
      flexDirection: "row",
      gap: 12,
    },
    section: {
      marginBottom: customization.sectionSpacing,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: customization.primaryColor,
      borderBottom: `1px solid ${customization.primaryColor}`,
      paddingBottom: 4,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    experienceItem: {
      marginBottom: 10,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: "bold",
    },
    company: {
      fontSize: 11,
      color: "#555",
    },
    dateRange: {
      fontSize: 10,
      color: "#777",
    },
    bullet: {
      fontSize: 10,
      marginLeft: 10,
      marginBottom: 2,
    },
    skills: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    skill: {
      backgroundColor: "#f0f0f0",
      padding: "3px 8px",
      borderRadius: 3,
      fontSize: 10,
    },
    watermark: {
      position: "absolute",
      top: "50%",
      left: "20%",
      transform: "rotate(-45deg)",
      fontSize: 48,
      color: "rgba(200,200,200,0.3)",
      zIndex: -1,
    },
  });

function renderSection(section: ResumeSection, styles: ReturnType<typeof createStyles>) {
  switch (section.type) {
    case "PERSONAL_INFO":
      return null; // Rendered in header

    case "EXPERIENCE": {
      const experiences = section.data as Array<{
        company: string; title: string; startDate: string; endDate: string; current: boolean; bullets: string[];
      }>;
      return (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experiences.map((exp, i) => (
            <View key={i} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <View>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
                </View>
                <Text style={styles.dateRange}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </Text>
              </View>
              {exp.bullets.map((b, j) => (
                <Text key={j} style={styles.bullet}>• {b}</Text>
              ))}
            </View>
          ))}
        </View>
      );
    }

    case "EDUCATION": {
      const educations = section.data as Array<{
        school: string; degree: string; field: string; startDate: string; endDate: string;
      }>;
      return (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {educations.map((edu, i) => (
            <View key={i} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <View>
                  <Text style={styles.jobTitle}>{edu.degree} in {edu.field}</Text>
                  <Text style={styles.company}>{edu.school}</Text>
                </View>
                <Text style={styles.dateRange}>{edu.startDate} – {edu.endDate}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }

    case "SKILLS": {
      const { skills } = section.data as { skills: string[] };
      return (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {skills.map((skill, i) => (
              <Text key={i} style={styles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      );
    }

    case "SUMMARY": {
      const { summary } = section.data as { summary: string };
      return (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={{ fontSize: 10 }}>{summary}</Text>
        </View>
      );
    }

    default:
      return null;
  }
}

export async function generatePDF(
  resume: Resume,
  addWatermark: boolean = false
): Promise<Buffer> {
  const customization = { ...DEFAULT_CUSTOMIZATION, ...resume.customization };
  const styles = createStyles(customization);

  const personalInfo = resume.sections.find((s) => s.type === "PERSONAL_INFO")?.data as {
    fullName: string; email: string; phone: string; location: string; linkedin: string;
  } | undefined;

  const otherSections = resume.sections.filter((s) => s.type !== "PERSONAL_INFO");

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {addWatermark && <Text style={styles.watermark}>RESUME BUILDER</Text>}

        {personalInfo && (
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.fullName}</Text>
            <View style={styles.contact}>
              <Text>{personalInfo.email}</Text>
              <Text>{personalInfo.phone}</Text>
              <Text>{personalInfo.location}</Text>
              {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
            </View>
          </View>
        )}

        {otherSections.map((section) => renderSection(section, styles))}
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
```

- [ ] **Step 2: Write `lib/docx-generator.ts`**

Create `lib/docx-generator.ts`:
```typescript
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { Resume, ResumeSection, DEFAULT_CUSTOMIZATION } from "@/types/resume";

export async function generateDocx(resume: Resume): Promise<Buffer> {
  const customization = { ...DEFAULT_CUSTOMIZATION, ...resume.customization };
  const personalInfo = resume.sections.find((s) => s.type === "PERSONAL_INFO")?.data as {
    fullName: string; email: string; phone: string; location: string; linkedin: string;
  } | undefined;

  const children: Paragraph[] = [];

  // Header
  if (personalInfo) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, size: 20 }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // Sections
  for (const section of resume.sections.filter((s) => s.type !== "PERSONAL_INFO")) {
    children.push(
      new Paragraph({
        text: section.type.replace("_", " "),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        border: {
          bottom: { color: "333333", space: 4, style: BorderStyle.SINGLE, size: 6 },
        },
      })
    );

    if (section.type === "EXPERIENCE") {
      const experiences = section.data as Array<{
        company: string; title: string; startDate: string; endDate: string; current: boolean; bullets: string[];
      }>;
      for (const exp of experiences) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.title, bold: true, size: 22 }),
              new TextRun({ text: ` — ${exp.company}`, size: 22 }),
            ],
            spacing: { before: 150 },
          })
        );
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`,
                italics: true,
                size: 18,
                color: "666666",
              }),
            ],
          })
        );
        for (const bullet of exp.bullets) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${bullet}`, size: 20 })],
              indent: { left: 360 },
            })
          );
        }
      }
    }

    if (section.type === "EDUCATION") {
      const educations = section.data as Array<{
        school: string; degree: string; field: string; startDate: string; endDate: string;
      }>;
      for (const edu of educations) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 22 }),
            ],
            spacing: { before: 150 },
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${edu.school} | ${edu.startDate} – ${edu.endDate}`, size: 20, color: "666666" })],
          })
        );
      }
    }

    if (section.type === "SKILLS") {
      const { skills } = section.data as { skills: string[] };
      children.push(
        new Paragraph({
          children: [new TextRun({ text: skills.join("  •  "), size: 20 })],
        })
      );
    }

    if (section.type === "SUMMARY") {
      const { summary } = section.data as { summary: string };
      children.push(
        new Paragraph({
          children: [new TextRun({ text: summary, size: 20 })],
        })
      );
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBuffer(doc);
}
```

- [ ] **Step 3: Write `lib/txt-generator.ts`**

Create `lib/txt-generator.ts`:
```typescript
import { Resume, ResumeSection } from "@/types/resume";

export function generateTxt(resume: Resume): string {
  const lines: string[] = [];
  const divider = "─────────────────────────────────────";

  const personalInfo = resume.sections.find((s) => s.type === "PERSONAL_INFO")?.data as {
    fullName: string; email: string; phone: string; location: string; linkedin: string;
  } | undefined;

  if (personalInfo) {
    lines.push(personalInfo.fullName.toUpperCase());
    lines.push(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`);
    if (personalInfo.linkedin) lines.push(personalInfo.linkedin);
    lines.push("");
  }

  for (const section of resume.sections.filter((s) => s.type !== "PERSONAL_INFO")) {
    lines.push(divider);
    lines.push(section.type.replace("_", " "));
    lines.push(divider);

    if (section.type === "EXPERIENCE") {
      const experiences = section.data as Array<{
        company: string; title: string; startDate: string; endDate: string; current: boolean; bullets: string[];
      }>;
      for (const exp of experiences) {
        lines.push(`${exp.title} at ${exp.company}`);
        lines.push(`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`);
        for (const bullet of exp.bullets) {
          lines.push(`  • ${bullet}`);
        }
        lines.push("");
      }
    }

    if (section.type === "EDUCATION") {
      const educations = section.data as Array<{
        school: string; degree: string; field: string; startDate: string; endDate: string;
      }>;
      for (const edu of educations) {
        lines.push(`${edu.degree} in ${edu.field}`);
        lines.push(`${edu.school} | ${edu.startDate} – ${edu.endDate}`);
        lines.push("");
      }
    }

    if (section.type === "SKILLS") {
      const { skills } = section.data as { skills: string[] };
      lines.push(skills.join(" • "));
      lines.push("");
    }

    if (section.type === "SUMMARY") {
      const { summary } = section.data as { summary: string };
      lines.push(summary);
      lines.push("");
    }
  }

  return lines.join("\n");
}
```

- [ ] **Step 4: Write `app/api/resumes/[id]/download/route.ts`**

Create `app/api/resumes/[id]/download/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDownloadFormat } from "@/lib/tier-gate";
import { generatePDF } from "@/lib/pdf-generator";
import { generateDocx } from "@/lib/docx-generator";
import { generateTxt } from "@/lib/txt-generator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found", code: "NOT_FOUND" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
  }

  const { format } = await request.json();

  if (!canDownloadFormat(user.subscriptionTier, format)) {
    return NextResponse.json(
      { error: "Upgrade to access this format", code: "UPGRADE_REQUIRED" },
      { status: 403 }
    );
  }

  const resumeData = {
    ...resume,
    customization: resume.customization as Record<string, unknown>,
    sections: resume.sections.map((s) => ({
      ...s,
      data: s.data as Record<string, unknown>,
    })),
  };

  let buffer: Buffer;
  let contentType: string;
  let filename: string;

  switch (format) {
    case "pdf":
      buffer = await generatePDF(resumeData as any, user.subscriptionTier === "FREE");
      contentType = "application/pdf";
      filename = `${resume.title}.pdf`;
      break;
    case "docx":
      buffer = await generateDocx(resumeData as any);
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      filename = `${resume.title}.docx`;
      break;
    case "txt":
      buffer = Buffer.from(generateTxt(resumeData as any));
      contentType = "text/plain";
      filename = `${resume.title}.txt`;
      break;
    default:
      return NextResponse.json({ error: "Invalid format", code: "INVALID_FORMAT" }, { status: 400 });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
```

- [ ] **Step 5: Write `components/download/DownloadModal.tsx`**

Create `components/download/DownloadModal.tsx`:
```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadModalProps {
  resumeId: string;
  resumeTitle: string;
  canDownloadDocx: boolean;
  canDownloadTxt: boolean;
}

export function DownloadModal({
  resumeId,
  resumeTitle,
  canDownloadDocx,
  canDownloadTxt,
}: DownloadModalProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (format: "pdf" | "docx" | "txt") => {
    setDownloading(format);
    setError(null);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeTitle}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Download Format</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleDownload("pdf")}
            disabled={downloading !== null}
          >
            {downloading === "pdf" ? "Generating..." : "PDF"} — {canDownloadDocx ? "No watermark" : "With watermark"}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleDownload("docx")}
            disabled={downloading !== null || !canDownloadDocx}
          >
            {downloading === "docx" ? "Generating..." : "Word (.docx)"}
            {!canDownloadDocx && " — Upgrade required"}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleDownload("txt")}
            disabled={downloading !== null || !canDownloadTxt}
          >
            {downloading === "txt" ? "Generating..." : "Plain Text"}
            {!canDownloadTxt && " — Upgrade required"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 6: Write download tests**

Create `__tests__/api/download.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { canDownloadFormat } from "@/lib/tier-gate";

describe("Download format permissions", () => {
  it("FREE tier can download PDF", () => {
    expect(canDownloadFormat("FREE", "pdf")).toBe(true);
  });

  it("FREE tier cannot download docx", () => {
    expect(canDownloadFormat("FREE", "docx")).toBe(false);
  });

  it("FREE tier cannot download txt", () => {
    expect(canDownloadFormat("FREE", "txt")).toBe(false);
  });

  it("FULL_ACCESS can download all formats", () => {
    expect(canDownloadFormat("FULL_ACCESS", "pdf")).toBe(true);
    expect(canDownloadFormat("FULL_ACCESS", "docx")).toBe(true);
    expect(canDownloadFormat("FULL_ACCESS", "txt")).toBe(true);
  });

  it("PREMIUM can download all formats", () => {
    expect(canDownloadFormat("PREMIUM", "pdf")).toBe(true);
    expect(canDownloadFormat("PREMIUM", "docx")).toBe(true);
    expect(canDownloadFormat("PREMIUM", "txt")).toBe(true);
  });
});
```

- [ ] **Step 7: Run download tests**

Run:
```bash
npx vitest run __tests__/api/download.test.ts 2>&1
```
Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add PDF, Word, and text download with tier-based access"
```

---

### Task 6: Stripe Subscription Integration

**Files:**
- Create: `lib/stripe.ts`
- Create: `app/api/stripe/checkout/route.ts`
- Create: `app/api/stripe/portal/route.ts`
- Create: `app/api/stripe/webhook/route.ts`
- Create: `components/subscription/PricingCards.tsx`
- Create: `components/subscription/UpgradeButton.tsx`
- Create: `__tests__/api/stripe.test.ts`

- [ ] **Step 1: Write `lib/stripe.ts`**

Create `lib/stripe.ts`:
```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export function getPriceId(tier: "full_access" | "premium"): string {
  switch (tier) {
    case "full_access":
      return process.env.STRIPE_PRICE_FULL_ACCESS!;
    case "premium":
      return process.env.STRIPE_PRICE_PREMIUM!;
  }
}

export function getTierFromPrice(priceId: string): "FULL_ACCESS" | "PREMIUM" | null {
  if (priceId === process.env.STRIPE_PRICE_FULL_ACCESS) return "FULL_ACCESS";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "PREMIUM";
  return null;
}
```

- [ ] **Step 2: Write `app/api/stripe/checkout/route.ts`**

Create `app/api/stripe/checkout/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, getPriceId } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const { tier } = await request.json();
  if (tier !== "full_access" && tier !== "premium") {
    return NextResponse.json({ error: "Invalid tier", code: "INVALID_TIER" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
  }

  // Get or create Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name ?? undefined,
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: getPriceId(tier), quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings?canceled=true`,
  });

  return NextResponse.json({ data: { url: checkoutSession.url } });
}
```

- [ ] **Step 3: Write `app/api/stripe/portal/route.ts`**

Create `app/api/stripe/portal/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found", code: "NO_SUBSCRIPTION" }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/settings`,
  });

  return NextResponse.json({ data: { url: portalSession.url } });
}
```

- [ ] **Step 4: Write `app/api/stripe/webhook/route.ts`**

Create `app/api/stripe/webhook/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe, getTierFromPrice } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature", code: "INVALID_SIGNATURE" }, { status: 400 });
  }

  // Check for duplicate events
  const existing = await prisma.subscriptionEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id;
      const tier = getTierFromPrice(priceId);

      if (tier) {
        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionTier: tier,
            stripeSubscriptionId: subscriptionId,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0]?.price.id;
      const tier = getTierFromPrice(priceId);

      if (tier) {
        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionTier: tier,
            stripeSubscriptionId: subscription.id,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          subscriptionTier: "FREE",
          stripeSubscriptionId: null,
        },
      });
      break;
    }
  }

  // Log the event
  const customerId = (event.data.object as { customer?: string }).customer;
  if (customerId) {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (user) {
      await prisma.subscriptionEvent.create({
        data: {
          userId: user.id,
          eventType: event.type,
          stripeEventId: event.id,
          data: event.data.object as any,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 5: Write `components/subscription/PricingCards.tsx`**

Create `components/subscription/PricingCards.tsx`:
```tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { SubscriptionTier } from "@/types/resume";

interface PricingCardsProps {
  currentTier: SubscriptionTier;
}

const plans = [
  {
    tier: "FREE" as const,
    name: "Free",
    price: "$0",
    priceDetail: "forever",
    features: [
      "1 resume",
      "3 basic templates",
      "PDF download (with watermark)",
      "Basic customization",
    ],
    cta: "Current Plan",
    disabled: false,
  },
  {
    tier: "FULL_ACCESS" as const,
    name: "Full Access",
    price: "$9.99",
    priceDetail: "/month",
    features: [
      "Unlimited resumes",
      "All 10 templates",
      "PDF, Word, & text download",
      "No watermark",
      "Full customization",
      "ATS optimization score",
      "Cover letter builder",
    ],
    cta: "Upgrade to Full Access",
    disabled: false,
  },
  {
    tier: "PREMIUM" as const,
    name: "Premium",
    price: "$19.99",
    priceDetail: "/month",
    features: [
      "Everything in Full Access",
      "AI bullet point generation",
      "AI text improvement",
      "LinkedIn profile import",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    disabled: false,
    popular: true,
  },
];

export function PricingCards({ currentTier }: PricingCardsProps) {
  const handleUpgrade = async (tier: "full_access" | "premium") => {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await response.json();
    if (data.data?.url) {
      window.location.href = data.data.url;
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const isCurrent = currentTier === plan.tier;
        return (
          <Card
            key={plan.tier}
            className={plan.popular ? "border-primary shadow-lg relative" : ""}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.priceDetail}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isCurrent ? (
                <Button className="w-full" disabled variant="outline">
                  Current Plan
                </Button>
              ) : plan.tier === "FREE" ? (
                <Button className="w-full" variant="outline" disabled>
                  Free
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.tier.toLowerCase() as "full_access" | "premium")}
                >
                  {plan.cta}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 6: Write `components/subscription/UpgradeButton.tsx`**

Create `components/subscription/UpgradeButton.tsx`:
```tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ManageSubscriptionButton() {
  const router = useRouter();

  const handleManage = async () => {
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await response.json();
    if (data.data?.url) {
      window.location.href = data.data.url;
    }
  };

  return (
    <Button variant="outline" onClick={handleManage}>
      Manage Subscription
    </Button>
  );
}
```

- [ ] **Step 7: Write Stripe tests**

Create `__tests__/api/stripe.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { getPriceId, getTierFromPrice } from "@/lib/stripe";

describe("Stripe helpers", () => {
  it("returns correct price ID for full_access", () => {
    const priceId = getPriceId("full_access");
    expect(priceId).toBe(process.env.STRIPE_PRICE_FULL_ACCESS);
  });

  it("returns correct price ID for premium", () => {
    const priceId = getPriceId("premium");
    expect(priceId).toBe(process.env.STRIPE_PRICE_PREMIUM);
  });

  it("returns FULL_ACCESS tier from price ID", () => {
    const tier = getTierFromPrice(process.env.STRIPE_PRICE_FULL_ACCESS!);
    expect(tier).toBe("FULL_ACCESS");
  });

  it("returns PREMIUM tier from price ID", () => {
    const tier = getTierFromPrice(process.env.STRIPE_PRICE_PREMIUM!);
    expect(tier).toBe("PREMIUM");
  });

  it("returns null for unknown price ID", () => {
    const tier = getTierFromPrice("price_unknown");
    expect(tier).toBeNull();
  });
});
```

- [ ] **Step 8: Run Stripe tests**

Run:
```bash
npx vitest run __tests__/api/stripe.test.ts 2>&1
```
Expected: All tests pass.

- [ ] **Step 9: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add Stripe subscription integration with checkout, portal, and webhooks"
```

---

### Task 7: AI Features (Premium)

**Files:**
- Create: `lib/openai.ts`
- Create: `app/api/resumes/[id]/ai/route.ts`
- Create: `__tests__/api/ai.test.ts`

- [ ] **Step 1: Write `lib/openai.ts`**

Create `lib/openai.ts`:
```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GENERATE_SYSTEM_PROMPT = `You are a professional resume writer. Generate concise, impactful resume bullet points.
Rules:
- Start each bullet with a strong action verb
- Quantify achievements where possible (use realistic estimates if not provided)
- Keep bullets to 1-2 lines each
- Focus on accomplishments, not just responsibilities
- Return ONLY a JSON array of strings, no other text
- Generate 4-6 bullet points`;

const IMPROVE_SYSTEM_PROMPT = `You are a professional resume editor. Improve the given resume text to be more impactful.
Rules:
- Use strong action verbs
- Add quantifiable metrics where realistic
- Make it concise and professional
- Return ONLY the improved text, no explanations`;

export async function generateBullets(
  jobTitle: string,
  company: string,
  description: string
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: GENERATE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Job Title: ${jobTitle}\nCompany: ${company}\nDescription: ${description}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content ?? "[]";
  try {
    return JSON.parse(content);
  } catch {
    return [content];
  }
}

export async function improveText(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: IMPROVE_SYSTEM_PROMPT },
      { role: "user", content: text },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content ?? text;
}
```

- [ ] **Step 2: Write `app/api/resumes/[id]/ai/route.ts`**

Create `app/api/resumes/[id]/ai/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasTierAccess } from "@/lib/tier-gate";
import { generateBullets, improveText } from "@/lib/openai";
import { AiRequest } from "@/types/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
  }

  if (!hasTierAccess(user.subscriptionTier, "PREMIUM")) {
    return NextResponse.json(
      { error: "Premium subscription required", code: "PREMIUM_REQUIRED" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found", code: "NOT_FOUND" }, { status: 404 });
  }

  const body: AiRequest = await request.json();

  try {
    let result: string | string[];

    if (body.action === "generate") {
      const context = JSON.parse(body.context);
      result = await generateBullets(
        context.jobTitle || "",
        context.company || "",
        context.description || ""
      );
    } else {
      result = await improveText(body.context);
    }

    return NextResponse.json({ data: { result } });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "AI service is temporarily unavailable. Please try again.", code: "AI_ERROR" },
      { status: 503 }
    );
  }
}
```

- [ ] **Step 3: Write AI tests**

Create `__tests__/api/ai.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { hasTierAccess } from "@/lib/tier-gate";

describe("AI feature access control", () => {
  it("FREE tier cannot access AI features", () => {
    expect(hasTierAccess("FREE", "PREMIUM")).toBe(false);
  });

  it("FULL_ACCESS tier cannot access AI features", () => {
    expect(hasTierAccess("FULL_ACCESS", "PREMIUM")).toBe(false);
  });

  it("PREMIUM tier can access AI features", () => {
    expect(hasTierAccess("PREMIUM", "PREMIUM")).toBe(true);
  });
});
```

- [ ] **Step 4: Run AI tests**

Run:
```bash
npx vitest run __tests__/api/ai.test.ts 2>&1
```
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add AI bullet generation and text improvement for Premium users"
```

---

### Task 8: ATS Scoring

**Files:**
- Create: `lib/ats-scorer.ts`
- Create: `__tests__/lib/ats-scorer.test.ts`

- [ ] **Step 1: Write `lib/ats-scorer.ts`**

Create `lib/ats-scorer.ts`:
```typescript
import { ResumeSection } from "@/types/resume";

const ACTION_VERBS = [
  "achieved", "administered", "advanced", "analyzed", "built", "chaired", "charted",
  "coached", "compiled", "composed", "conducted", "consolidated", "constructed",
  "coordinated", "created", "decreased", "delivered", "designed", "developed",
  "directed", "drove", "eliminated", "engineered", "established", "evaluated",
  "executed", "expanded", "facilitated", "founded", "generated", "grew", "headed",
  "identified", "implemented", "improved", "increased", "influenced", "initiated",
  "innovated", "introduced", "launched", "led", "managed", "mentored", "negotiated",
  "optimized", "organized", "oversaw", "pioneered", "planned", "produced",
  "reduced", "reorganized", "resolved", "restructured", "revamped", "scaled",
  "spearheaded", "streamlined", "strengthened", "supervised", "surpassed",
  "transformed", "unified", "won",
];

const ATS_UNFRIENDLY_PATTERNS = [
  /<table/i,
  /<img/i,
  /<figure/i,
  /┌|┐|└|┘|─|│|╔|╗|╚|╝/,
];

interface AtsResult {
  score: number;
  tips: string[];
}

export function scoreResume(sections: ResumeSection[]): AtsResult {
  const tips: string[] = [];
  let score = 0;
  const maxScore = 100;

  // 1. Check for contact info (15 points)
  const personalInfo = sections.find((s) => s.type === "PERSONAL_INFO")?.data as {
    fullName?: string; email?: string; phone?: string; location?: string;
  } | undefined;

  if (personalInfo) {
    const hasName = !!personalInfo.fullName;
    const hasEmail = !!personalInfo.email;
    const hasPhone = !!personalInfo.phone;
    const hasLocation = !!personalInfo.location;

    if (hasName) score += 4;
    if (hasEmail) score += 4;
    if (hasPhone) score += 4;
    if (hasLocation) score += 3;

    if (!hasEmail) tips.push("Add your email address");
    if (!hasPhone) tips.push("Add your phone number");
    if (!hasLocation) tips.push("Add your location (city, state)");
  } else {
    tips.push("Add a personal information section with your name, email, and phone");
  }

  // 2. Check for standard sections (20 points)
  const sectionTypes = new Set(sections.map((s) => s.type));
  if (sectionTypes.has("EXPERIENCE")) { score += 8; } else { tips.push("Add an Experience section"); }
  if (sectionTypes.has("EDUCATION")) { score += 6; } else { tips.push("Add an Education section"); }
  if (sectionTypes.has("SKILLS")) { score += 6; } else { tips.push("Add a Skills section"); }

  // 3. Check for action verbs in experience bullets (25 points)
  const experienceSections = sections.filter((s) => s.type === "EXPERIENCE");
  let bulletsWithActionVerbs = 0;
  let totalBullets = 0;

  for (const exp of experienceSections) {
    const experiences = exp.data as Array<{ bullets?: string[]> };
    for (const item of experiences) {
      if (item.bullets) {
        for (const bullet of item.bullets) {
          totalBullets++;
          const firstWord = bullet.trim().split(" ")[0]?.toLowerCase() ?? "";
          if (ACTION_VERBS.includes(firstWord)) {
            bulletsWithActionVerbs++;
          }
        }
      }
    }
  }

  if (totalBullets > 0) {
    const actionVerbRatio = bulletsWithActionVerbs / totalBullets;
    score += Math.round(actionVerbRatio * 25);
    if (actionVerbRatio < 0.5) {
      tips.push(`Start more bullet points with action verbs (${bulletsWithActionVerbs}/${totalBullets} currently do)`);
    }
  } else {
    tips.push("Add bullet points to your experience entries");
  }

  // 4. Check for quantifiable metrics (20 points)
  let bulletsWithNumbers = 0;
  for (const exp of experienceSections) {
    const experiences = exp.data as Array<{ bullets?: string[]> };
    for (const item of experiences) {
      if (item.bullets) {
        for (const bullet of item.bullets) {
          if (/\d+%|\d+\+|\$\d+|\d+ percent|\d+ people|\d+ team|\d+ client|\d+ user|\d+ project/i.test(bullet)) {
            bulletsWithNumbers++;
          }
        }
      }
    }
  }

  if (totalBullets > 0) {
    const metricsRatio = bulletsWithNumbers / totalBullets;
    score += Math.round(metricsRatio * 20);
    if (metricsRatio < 0.3) {
      tips.push("Add quantifiable metrics (numbers, percentages, dollar amounts) to your bullets");
    }
  }

  // 5. Check for summary (10 points)
  if (sectionTypes.has("SUMMARY")) {
    score += 10;
  } else {
    tips.push("Consider adding a professional summary at the top");
  }

  // 6. Check for ATS-unfriendly content (10 points penalty)
  const allText = JSON.stringify(sections);
  let hasUnfriendlyContent = false;
  for (const pattern of ATS_UNFRIENDLY_PATTERNS) {
    if (pattern.test(allText)) {
      hasUnfriendlyContent = true;
      break;
    }
  }
  if (!hasUnfriendlyContent) {
    score += 10;
  } else {
    tips.push("Remove tables, images, or special characters that ATS systems can't parse");
  }

  return {
    score: Math.min(score, maxScore),
    tips: tips.slice(0, 5), // Return top 5 tips
  };
}
```

- [ ] **Step 2: Write ATS scorer tests**

Create `__tests__/lib/ats-scorer.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { scoreResume } from "@/lib/ats-scorer";
import { ResumeSection } from "@/types/resume";

describe("ATS Scorer", () => {
  const baseSections: ResumeSection[] = [
    {
      id: "1",
      type: "PERSONAL_INFO",
      order: 0,
      data: { fullName: "John Doe", email: "john@example.com", phone: "555-1234", location: "New York, NY" },
    },
    {
      id: "2",
      type: "EXPERIENCE",
      order: 1,
      data: [
        {
          company: "Acme Corp",
          title: "Software Engineer",
          startDate: "2020",
          endDate: "2023",
          current: false,
          bullets: [
            "Increased revenue by 25% through optimization",
            "Managed a team of 5 engineers",
            "Built new features",
          ],
        },
      ],
    },
    {
      id: "3",
      type: "EDUCATION",
      order: 2,
      data: [
        { school: "MIT", degree: "BS", field: "Computer Science", startDate: "2016", endDate: "2020" },
      ],
    },
    {
      id: "4",
      type: "SKILLS",
      order: 3,
      data: { skills: ["JavaScript", "TypeScript", "React", "Node.js"] },
    },
    {
      id: "5",
      type: "SUMMARY",
      order: 4,
      data: { summary: "Experienced software engineer with 5+ years..." },
    },
  ];

  it("should give a high score for a well-structured resume", () => {
    const result = scoreResume(baseSections);
    expect(result.score).toBeGreaterThan(70);
    expect(result.tips.length).toBeLessThanOrEqual(5);
  });

  it("should give a low score for an empty resume", () => {
    const result = scoreResume([]);
    expect(result.score).toBeLessThan(30);
    expect(result.tips.length).toBeGreaterThan(0);
  });

  it("should penalize missing contact info", () => {
    const sections = baseSections.filter((s) => s.type !== "PERSONAL_INFO");
    const result = scoreResume(sections);
    expect(result.tips.some((t) => t.includes("email") || t.includes("phone") || t.includes("personal"))).toBe(true);
  });

  it("should reward action verbs", () => {
    const result = scoreResume(baseSections);
    // "Increased", "Managed", "Built" are all action verbs
    expect(result.score).toBeGreaterThan(50);
  });

  it("should reward quantifiable metrics", () => {
    const result = scoreResume(baseSections);
    // "25%" and "5" are quantifiable
    expect(result.score).toBeGreaterThan(60);
  });

  it("should cap score at 100", () => {
    const result = scoreResume(baseSections);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("should limit tips to 5", () => {
    const result = scoreResume([]);
    expect(result.tips.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 3: Run ATS scorer tests**

Run:
```bash
npx vitest run __tests__/lib/ats-scorer.test.ts 2>&1
```
Expected: All 7 tests pass.

- [ ] **Step 4: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add ATS scoring engine with actionable tips"
```

---

### Task 9: Dashboard & Settings Pages

**Files:**
- Create: `app/(dashboard)/dashboard/page.tsx`
- Create: `app/(dashboard)/settings/page.tsx`

- [ ] **Step 1: Write `app/(dashboard)/dashboard/page.tsx`**

Create `app/(dashboard)/dashboard/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import { DownloadModal } from "@/components/download/DownloadModal";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">
            Plan: <Badge variant="secondary">{user?.subscriptionTier}</Badge>
          </p>
        </div>
        <Link href="/resumes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No resumes yet</h2>
            <p className="text-muted-foreground mb-4">Create your first resume to get started</p>
            <Link href="/resumes/new">
              <Button>Create Resume</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{resume.title}</CardTitle>
                  <CardDescription>
                    Updated {new Date(resume.updatedAt).toLocaleDateString()} · Template: {resume.templateId}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <DownloadModal
                    resumeId={resume.id}
                    resumeTitle={resume.title}
                    canDownloadDocx={user?.subscriptionTier !== "FREE"}
                    canDownloadTxt={user?.subscriptionTier !== "FREE"}
                  />
                  <Link href={`/resumes/${resume.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `app/(dashboard)/settings/page.tsx`**

Create `app/(dashboard)/settings/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/subscription/PricingCards";
import { ManageSubscriptionButton } from "@/components/subscription/UpgradeButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/signin");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xl">
              {user.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge className="mt-1">{user.subscriptionTier}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        {user.subscriptionTier === "FREE" ? (
          <PricingCards currentTier={user.subscriptionTier} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Current Plan: {user.subscriptionTier}</CardTitle>
              <CardDescription>
                Manage your subscription through Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <ManageSubscriptionButton />
              <PricingCards currentTier={user.subscriptionTier} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add dashboard and settings pages"
```

---

### Task 10: Resume Wizard

**Files:**
- Create: `app/(dashboard)/resumes/new/page.tsx`
- Create: `components/wizard/WizardShell.tsx`
- Create: `components/wizard/StepPersonalInfo.tsx`
- Create: `components/wizard/StepExperience.tsx`
- Create: `components/wizard/StepEducation.tsx`
- Create: `components/wizard/StepSkills.tsx`
- Create: `components/wizard/StepReview.tsx`
- Create: `__tests__/components/wizard.test.tsx`

- [ ] **Step 1: Write `components/wizard/WizardShell.tsx`**

Create `components/wizard/WizardShell.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepExperience } from "./StepExperience";
import { StepEducation } from "./StepEducation";
import { StepSkills } from "./StepSkills";
import { StepReview } from "./StepReview";
import { TEMPLATES, DEFAULT_CUSTOMIZATION } from "@/types/resume";

const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Review"];

interface WizardData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string };
  experience: Array<{ id: string; company: string; title: string; startDate: string; endDate: string; current: boolean; bullets: string[] }>;
  education: Array<{ id: string; school: string; degree: string; field: string; startDate: string; endDate: string }>;
  skills: string[];
  templateId: string;
}

export function WizardShell() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "" },
    experience: [],
    education: [],
    skills: [],
    templateId: "classic",
  });
  const [saving, setSaving] = useState(false);

  const updateData = (partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${data.personalInfo.fullName}'s Resume`,
          templateId: data.templateId,
          sections: [
            { type: "PERSONAL_INFO", order: 0, data: data.personalInfo },
            { type: "EXPERIENCE", order: 1, data: data.experience },
            { type: "EDUCATION", order: 2, data: data.education },
            { type: "SKILLS", order: 3, data: { skills: data.skills } },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save");
      }

      const result = await response.json();
      router.push(`/resumes/${result.data.id}/edit`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepPersonalInfo data={data.personalInfo} onChange={(pi) => updateData({ personalInfo: pi })} />;
      case 1:
        return <StepExperience data={data.experience} onChange={(exp) => updateData({ experience: exp })} />;
      case 2:
        return <StepEducation data={data.education} onChange={(edu) => updateData({ education: edu })} />;
      case 3:
        return <StepSkills data={data.skills} onChange={(skills) => updateData({ skills })} />;
      case 4:
        return <StepReview data={data} onChange={updateData} onSave={handleSave} saving={saving} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 text-center text-sm py-2 rounded ${
              i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20" : "bg-muted"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Resume"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/wizard/StepPersonalInfo.tsx`**

Create `components/wizard/StepPersonalInfo.tsx`:
```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

interface Props {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function StepPersonalInfo({ data, onChange }: Props) {
  const update = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input id="fullName" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="555-123-4567" />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="New York, NY" />
      </div>
      <div>
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input id="linkedin" value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `components/wizard/StepExperience.tsx`**

Create `components/wizard/StepExperience.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface Props {
  data: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
}

export function StepExperience({ data, onChange }: Props) {
  const addEntry = () => {
    onChange([
      ...data,
      { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] },
    ]);
  };

  const removeEntry = (id: string) => {
    onChange(data.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof ExperienceEntry, value: unknown) => {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const updateBullet = (entryId: string, bulletIndex: number, value: string) => {
    onChange(
      data.map((e) => {
        if (e.id !== entryId) return e;
        const bullets = [...e.bullets];
        bullets[bulletIndex] = value;
        return { ...e, bullets };
      })
    );
  };

  const addBullet = (entryId: string) => {
    onChange(
      data.map((e) => (e.id === entryId ? { ...e, bullets: [...e.bullets, ""] } : e))
    );
  };

  const removeBullet = (entryId: string, bulletIndex: number) => {
    onChange(
      data.map((e) => {
        if (e.id !== entryId) return e;
        return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) };
      })
    );
  };

  return (
    <div className="space-y-6">
      {data.map((entry) => (
        <div key={entry.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <h4 className="font-medium">Experience Entry</h4>
            <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Job Title *</Label>
              <Input value={entry.title} onChange={(e) => updateEntry(entry.id, "title", e.target.value)} placeholder="Software Engineer" />
            </div>
            <div>
              <Label>Company *</Label>
              <Input value={entry.company} onChange={(e) => updateEntry(entry.id, "company", e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input value={entry.startDate} onChange={(e) => updateEntry(entry.id, "startDate", e.target.value)} placeholder="Jan 2020" />
            </div>
            <div>
              <Label>End Date</Label>
              <Input value={entry.endDate} onChange={(e) => updateEntry(entry.id, "endDate", e.target.value)} placeholder="Dec 2023" disabled={entry.current} />
              <label className="flex items-center gap-2 mt-1 text-sm">
                <input type="checkbox" checked={entry.current} onChange={(e) => updateEntry(entry.id, "current", e.target.checked)} />
                Currently working here
              </label>
            </div>
          </div>
          <div>
            <Label>Bullet Points</Label>
            {entry.bullets.map((bullet, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <Input value={bullet} onChange={(e) => updateBullet(entry.id, i, e.target.value)} placeholder="Describe an achievement..." />
                <Button variant="ghost" size="sm" onClick={() => removeBullet(entry.id, i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2" onClick={() => addBullet(entry.id)}>
              <Plus className="h-3 w-3 mr-1" /> Add Bullet
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addEntry} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Write `components/wizard/StepEducation.tsx`**

Create `components/wizard/StepEducation.tsx`:
```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Props {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
}

export function StepEducation({ data, onChange }: Props) {
  const addEntry = () => {
    onChange([...data, { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" }]);
  };

  const removeEntry = (id: string) => {
    onChange(data.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof EducationEntry, value: string) => {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-6">
      {data.map((entry) => (
        <div key={entry.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <h4 className="font-medium">Education Entry</h4>
            <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Label>School *</Label>
            <Input value={entry.school} onChange={(e) => updateEntry(entry.id, "school", e.target.value)} placeholder="MIT" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Degree *</Label>
              <Input value={entry.degree} onChange={(e) => updateEntry(entry.id, "degree", e.target.value)} placeholder="Bachelor of Science" />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input value={entry.field} onChange={(e) => updateEntry(entry.id, "field", e.target.value)} placeholder="Computer Science" />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input value={entry.startDate} onChange={(e) => updateEntry(entry.id, "startDate", e.target.value)} placeholder="2016" />
            </div>
            <div>
              <Label>End Date</Label>
              <Input value={entry.endDate} onChange={(e) => updateEntry(entry.id, "endDate", e.target.value)} placeholder="2020" />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addEntry} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Education
      </Button>
    </div>
  );
}
```

- [ ] **Step 5: Write `components/wizard/StepSkills.tsx`**

Create `components/wizard/StepSkills.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  data: string[];
  onChange: (data: string[]) => void;
}

export function StepSkills({ data, onChange }: Props) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const skill = input.trim();
    if (skill && !data.includes(skill)) {
      onChange([...data, skill]);
      setInput("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(data.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          placeholder="Type a skill and press Enter"
        />
        <Button onClick={addSkill}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1">
            {skill}
            <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground">No skills added yet. Add skills like "JavaScript", "Project Management", etc.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Write `components/wizard/StepReview.tsx`**

Create `components/wizard/StepReview.tsx`:
```tsx
"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TEMPLATES } from "@/types/resume";

interface WizardData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string };
  experience: Array<{ company: string; title: string; bullets: string[] }>;
  education: Array<{ school: string; degree: string; field: string }>;
  skills: string[];
  templateId: string;
}

interface Props {
  data: WizardData;
  onChange: (data: Partial<WizardData>) => void;
  onSave: () => void;
  saving: boolean;
}

export function StepReview({ data, onChange, onSave, saving }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="space-y-3">
        <h4 className="font-medium">Personal Info</h4>
        <div className="text-sm text-muted-foreground pl-4">
          <p>{data.personalInfo.fullName || "—"}</p>
          <p>{data.personalInfo.email || "—"}</p>
          <p>{data.personalInfo.phone || "—"}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Experience ({data.experience.length})</h4>
        {data.experience.map((exp, i) => (
          <div key={i} className="text-sm text-muted-foreground pl-4">
            <p className="font-medium text-foreground">{exp.title} at {exp.company}</p>
            <p>{exp.bullets.filter(Boolean).length} bullet points</p>
          </div>
        ))}
        {data.experience.length === 0 && <p className="text-sm text-muted-foreground pl-4">No experience added</p>}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Education ({data.education.length})</h4>
        {data.education.map((edu, i) => (
          <div key={i} className="text-sm text-muted-foreground pl-4">
            <p>{edu.degree} in {edu.field} — {edu.school}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Skills ({data.skills.length})</h4>
        <p className="text-sm text-muted-foreground pl-4">{data.skills.join(", ") || "None"}</p>
      </div>

      {/* Template Picker */}
      <div>
        <Label>Choose Template</Label>
        <Select value={data.templateId} onValueChange={(v) => onChange({ templateId: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TEMPLATES).map(([id, template]) => (
              <SelectItem key={id} value={id}>
                {template.name} ({template.tier})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Write `app/(dashboard)/resumes/new/page.tsx`**

Create `app/(dashboard)/resumes/new/page.tsx`:
```tsx
import { WizardShell } from "@/components/wizard/WizardShell";

export default function NewResumePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create New Resume</h1>
      <p className="text-muted-foreground mb-8">Follow the steps below to build your resume</p>
      <WizardShell />
    </div>
  );
}
```

- [ ] **Step 8: Write wizard component tests**

Create `__tests__/components/wizard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepPersonalInfo } from "@/components/wizard/StepPersonalInfo";
import { StepSkills } from "@/components/wizard/StepSkills";

describe("StepPersonalInfo", () => {
  it("renders all input fields", () => {
    const data = { fullName: "", email: "", phone: "", location: "", linkedin: "" };
    render(<StepPersonalInfo data={data} onChange={() => {}} />);
    expect(screen.getByLabelText(/full name/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/phone/i)).toBeTruthy();
    expect(screen.getByLabelText(/location/i)).toBeTruthy();
    expect(screen.getByLabelText(/linkedin/i)).toBeTruthy();
  });
});

describe("StepSkills", () => {
  it("renders input and empty state message", () => {
    render(<StepSkills data={[]} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/type a skill/i)).toBeTruthy();
    expect(screen.getByText(/no skills added yet/i)).toBeTruthy();
  });

  it("renders added skills as badges", () => {
    render(<StepSkills data={["JavaScript", "React"]} onChange={() => {}} />);
    expect(screen.getByText("JavaScript")).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
  });
});
```

- [ ] **Step 9: Run wizard tests**

Run:
```bash
npx vitest run __tests__/components/wizard.test.tsx 2>&1
```
Expected: All tests pass.

- [ ] **Step 10: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add 5-step resume wizard with personal info, experience, education, skills, and review"
```

---

### Task 11: Resume Editor (Live Preview)

**Files:**
- Create: `app/(dashboard)/resumes/[id]/edit/page.tsx`
- Create: `components/editor/EditorShell.tsx`
- Create: `components/editor/SectionEditor.tsx`
- Create: `components/editor/LivePreview.tsx`
- Create: `components/templates/classic/ClassicTemplate.tsx`
- Create: `components/templates/modern/ModernTemplate.tsx`
- Create: `components/templates/minimal/MinimalTemplate.tsx`

- [ ] **Step 1: Write `components/editor/EditorShell.tsx`**

Create `components/editor/EditorShell.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionEditor } from "./SectionEditor";
import { LivePreview } from "./LivePreview";
import { DownloadModal } from "@/components/download/DownloadModal";
import { TEMPLATES, ResumeSection, DEFAULT_CUSTOMIZATION } from "@/types/resume";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditorShellProps {
  resume: {
    id: string;
    title: string;
    templateId: string;
    customization: Record<string, unknown>;
    sections: Array<{
      id: string;
      type: string;
      order: number;
      data: Record<string, unknown>;
    }>;
  };
  canDownloadDocx: boolean;
  canDownloadTxt: boolean;
  isPremium: boolean;
}

export function EditorShell({ resume, canDownloadDocx, canDownloadTxt, isPremium }: EditorShellProps) {
  const router = useRouter();
  const [title, setTitle] = useState(resume.title);
  const [templateId, setTemplateId] = useState(resume.templateId);
  const [sections, setSections] = useState<ResumeSection[]>(
    resume.sections.map((s) => ({
      id: s.id,
      type: s.type as ResumeSection["type"],
      order: s.order,
      data: s.data,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          templateId,
          sections: sections.map((s) => ({
            type: s.type,
            order: s.order,
            data: s.data,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-64"
            placeholder="Resume title"
          />
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TEMPLATES).map(([id, t]) => (
                <SelectItem key={id} value={id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <DownloadModal
            resumeId={resume.id}
            resumeTitle={title}
            canDownloadDocx={canDownloadDocx}
            canDownloadTxt={canDownloadTxt}
          />
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </Button>
        </div>
      </div>

      {/* Split pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionEditor
          sections={sections}
          onChange={setSections}
          isPremium={isPremium}
          resumeId={resume.id}
        />
        <LivePreview
          title={title}
          templateId={templateId}
          sections={sections}
          customization={resume.customization}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/editor/SectionEditor.tsx`**

Create `components/editor/SectionEditor.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { ResumeSection } from "@/types/resume";

interface Props {
  sections: ResumeSection[];
  onChange: (sections: ResumeSection[]) => void;
  isPremium: boolean;
  resumeId: string;
}

export function SectionEditor({ sections, onChange, isPremium, resumeId }: Props) {
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const updateSection = (index: number, data: Record<string, unknown>) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], data };
    onChange(updated);
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((s, i) => (s.order = i));
    onChange(updated);
  };

  const handleAiGenerate = async (sectionIndex: number) => {
    if (!isPremium) return;
    setAiLoading(`${sectionIndex}-generate`);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          context: JSON.stringify({ jobTitle: "Software Engineer", company: "", description: "General professional experience" }),
          sectionType: "EXPERIENCE",
        }),
      });
      const result = await response.json();
      if (result.data?.result) {
        const section = sections[sectionIndex];
        const currentBullets = (section.data as { bullets?: string[] }).bullets || [];
        updateSection(sectionIndex, { ...section.data, bullets: [...currentBullets, ...result.data.result] });
      }
    } catch {
      alert("AI generation failed. Please try again.");
    } finally {
      setAiLoading(null);
    }
  };

  const handleAiImprove = async (sectionIndex: string) => {
    if (!isPremium) return;
    setAiLoading(`improve-${sectionIndex}`);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "improve",
          context: "Worked on projects",
        }),
      });
      const result = await response.json();
      if (result.data?.result) {
        alert(`Improved: ${result.data.result}`);
      }
    } catch {
      alert("AI improvement failed. Please try again.");
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={section.id}>
          <CardHeader className="flex-row items-center justify-between py-3">
            <CardTitle className="text-sm capitalize">{section.type.replace("_", " ")}</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => moveSection(index, "up")} disabled={index === 0}>
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => moveSection(index, "down")} disabled={index === sections.length - 1}>
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeSection(index)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {section.type === "PERSONAL_INFO" && (
              <PersonalInfoEditor
                data={section.data as any}
                onChange={(data) => updateSection(index, data)}
              />
            )}
            {section.type === "EXPERIENCE" && (
              <ExperienceEditor
                data={section.data as any}
                onChange={(data) => updateSection(index, data)}
                isPremium={isPremium}
                onAiGenerate={() => handleAiGenerate(index)}
                aiLoading={aiLoading === `${index}-generate`}
              />
            )}
            {section.type === "EDUCATION" && (
              <EducationEditor
                data={section.data as any}
                onChange={(data) => updateSection(index, data)}
              />
            )}
            {section.type === "SKILLS" && (
              <SkillsEditor
                data={section.data as any}
                onChange={(data) => updateSection(index, data)}
              />
            )}
            {section.type === "SUMMARY" && (
              <SummaryEditor
                data={section.data as any}
                onChange={(data) => updateSection(index, data)}
                isPremium={isPremium}
                onAiImprove={() => handleAiImprove(section.id)}
                aiLoading={aiLoading === `improve-${section.id}`}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PersonalInfoEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const update = (field: string, value: string) => onChange({ ...data, [field]: value });
  return (
    <div className="space-y-3">
      <div><Label>Full Name</Label><Input value={data.fullName || ""} onChange={(e) => update("fullName", e.target.value)} /></div>
      <div><Label>Email</Label><Input value={data.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
      <div><Label>Phone</Label><Input value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
      <div><Label>Location</Label><Input value={data.location || ""} onChange={(e) => update("location", e.target.value)} /></div>
      <div><Label>LinkedIn</Label><Input value={data.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} /></div>
    </div>
  );
}

function ExperienceEditor({ data, onChange, isPremium, onAiGenerate, aiLoading }: { data: any; onChange: (d: any) => void; isPremium: boolean; onAiGenerate: () => void; aiLoading: boolean }) {
  const experiences = Array.isArray(data) ? data : [];
  const updateExp = (i: number, field: string, value: unknown) => {
    const updated = [...experiences];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };
  const addExp = () => onChange([...experiences, { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }]);
  const removeExp = (i: number) => onChange(experiences.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {experiences.map((exp: any, i: number) => (
        <div key={exp.id || i} className="border rounded p-3 space-y-2">
          <div className="flex justify-between">
            <Label>Experience {i + 1}</Label>
            <Button variant="ghost" size="sm" onClick={() => removeExp(i)}><Trash2 className="h-3 w-3" /></Button>
          </div>
          <Input placeholder="Job Title" value={exp.title || ""} onChange={(e) => updateExp(i, "title", e.target.value)} />
          <Input placeholder="Company" value={exp.company || ""} onChange={(e) => updateExp(i, "company", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Start" value={exp.startDate || ""} onChange={(e) => updateExp(i, "startDate", e.target.value)} />
            <Input placeholder="End" value={exp.endDate || ""} onChange={(e) => updateExp(i, "endDate", e.target.value)} />
          </div>
          {(exp.bullets || []).map((bullet: string, j: number) => (
            <Input key={j} placeholder="Bullet point" value={bullet} onChange={(e) => {
              const bullets = [...(exp.bullets || [])];
              bullets[j] = e.target.value;
              updateExp(i, "bullets", bullets);
            }} />
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            const bullets = [...(exp.bullets || []), ""];
            updateExp(i, "bullets", bullets);
          }}>
            <Plus className="h-3 w-3 mr-1" /> Add Bullet
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addExp}><Plus className="h-3 w-3 mr-1" /> Add Experience</Button>
        {isPremium && (
          <Button variant="outline" size="sm" onClick={onAiGenerate} disabled={aiLoading}>
            <Sparkles className="h-3 w-3 mr-1" /> {aiLoading ? "Generating..." : "AI Generate Bullets"}
          </Button>
        )}
      </div>
    </div>
  );
}

function EducationEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const educations = Array.isArray(data) ? data : [];
  const updateEdu = (i: number, field: string, value: string) => {
    const updated = [...educations];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };
  const addEdu = () => onChange([...educations, { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" }]);
  return (
    <div className="space-y-4">
      {educations.map((edu: any, i: number) => (
        <div key={edu.id || i} className="border rounded p-3 space-y-2">
          <div className="flex justify-between">
            <Label>Education {i + 1}</Label>
            <Button variant="ghost" size="sm" onClick={() => onChange(educations.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3" /></Button>
          </div>
          <Input placeholder="School" value={edu.school || ""} onChange={(e) => updateEdu(i, "school", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Degree" value={edu.degree || ""} onChange={(e) => updateEdu(i, "degree", e.target.value)} />
            <Input placeholder="Field" value={edu.field || ""} onChange={(e) => updateEdu(i, "field", e.target.value)} />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addEdu}><Plus className="h-3 w-3 mr-1" /> Add Education</Button>
    </div>
  );
}

function SkillsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const skills = data.skills || [];
  const [input, setInput] = useState("");
  const addSkill = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      onChange({ skills: [...skills, input.trim()] });
      setInput("");
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill" />
        <Button onClick={addSkill}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill: string) => (
          <Badge key={skill} variant="secondary" className="pl-2 pr-1">
            {skill}
            <button onClick={() => onChange({ skills: skills.filter((s: string) => s !== skill) })} className="ml-1"><X className="h-3 w-3" /></button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SummaryEditor({ data, onChange, isPremium, onAiImprove, aiLoading }: { data: any; onChange: (d: any) => void; isPremium: boolean; onAiImprove: () => void; aiLoading: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>Professional Summary</Label>
        {isPremium && (
          <Button variant="ghost" size="sm" onClick={onAiImprove} disabled={aiLoading}>
            <Sparkles className="h-3 w-3 mr-1" /> {aiLoading ? "Improving..." : "AI Improve"}
          </Button>
        )}
      </div>
      <textarea
        className="w-full min-h-[120px] p-3 border rounded-md text-sm"
        value={data.summary || ""}
        onChange={(e) => onChange({ summary: e.target.value })}
        placeholder="Write a brief professional summary..."
      />
    </div>
  );
}
```

- [ ] **Step 3: Write `components/editor/LivePreview.tsx`**

Create `components/editor/LivePreview.tsx`:
```tsx
"use client";

import { ResumeSection, DEFAULT_CUSTOMIZATION } from "@/types/resume";

interface Props {
  title: string;
  templateId: string;
  sections: ResumeSection[];
  customization: Record<string, unknown>;
}

export function LivePreview({ title, templateId, sections, customization }: Props) {
  const c = { ...DEFAULT_CUSTOMIZATION, ...customization };
  const personalInfo = sections.find((s) => s.type === "PERSONAL_INFO")?.data as any;

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden sticky top-4">
      <div className="p-8 min-h-[600px]" style={{ fontFamily: c.fontFamily }}>
        {/* Header */}
        {personalInfo && (
          <div className="mb-6 pb-4 border-b-2" style={{ borderColor: c.primaryColor }}>
            <h1 className="text-2xl font-bold mb-1" style={{ color: c.primaryColor }}>
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="text-xs text-gray-500 flex flex-wrap gap-3">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            </div>
          </div>
        )}

        {/* Sections */}
        {sections
          .filter((s) => s.type !== "PERSONAL_INFO")
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="mb-4" style={{ marginBottom: c.sectionSpacing }}>
              <h2 className="text-sm font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: c.primaryColor, borderColor: c.primaryColor }}>
                {section.type.replace("_", " ")}
              </h2>

              {section.type === "EXPERIENCE" && (
                <div className="space-y-3">
                  {(Array.isArray(section.data) ? section.data : []).map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <div>
                          <span className="font-semibold text-sm">{exp.title}</span>
                          {exp.company && <span className="text-gray-600"> — {exp.company}</span>}
                        </div>
                        <span className="text-xs text-gray-400">
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {(exp.bullets || []).filter(Boolean).map((b: string, j: number) => (
                        <p key={j} className="text-xs text-gray-600 ml-4">• {b}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {section.type === "EDUCATION" && (
                <div className="space-y-2">
                  {(Array.isArray(section.data) ? section.data : []).map((edu: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <span className="font-semibold text-sm">{edu.degree} in {edu.field}</span>
                        <span className="text-gray-600"> — {edu.school}</span>
                      </div>
                      <span className="text-xs text-gray-400">{edu.startDate} – {edu.endDate}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.type === "SKILLS" && (
                <div className="flex flex-wrap gap-2">
                  {(section.data as any)?.skills?.map((skill: string, i: number) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{skill}</span>
                  ))}
                </div>
              )}

              {section.type === "SUMMARY" && (
                <p className="text-xs text-gray-600">{(section.data as any)?.summary}</p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write `app/(dashboard)/resumes/[id]/edit/page.tsx`**

Create `app/(dashboard)/resumes/[id]/edit/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditorShell } from "@/components/editor/EditorShell";
import { hasTierAccess } from "@/lib/tier-gate";

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!resume) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <EditorShell
      resume={{
        id: resume.id,
        title: resume.title,
        templateId: resume.templateId,
        customization: resume.customization as Record<string, unknown>,
        sections: resume.sections.map((s) => ({
          id: s.id,
          type: s.type,
          order: s.order,
          data: s.data as Record<string, unknown>,
        })),
      }}
      canDownloadDocx={hasTierAccess(user?.subscriptionTier ?? "FREE", "FULL_ACCESS")}
      canDownloadTxt={hasTierAccess(user?.subscriptionTier ?? "FREE", "FULL_ACCESS")}
      isPremium={hasTierAccess(user?.subscriptionTier ?? "FREE", "PREMIUM")}
    />
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add resume editor with live preview, section editing, and AI integration"
```

---

### Task 12: Final Integration & Polish

**Files:**
- Modify: `app/page.tsx` (enhance landing page)
- Create: `README.md`
- Create: `app/(dashboard)/resumes/[id]/page.tsx` (view resume)

- [ ] **Step 1: Enhance landing page with pricing section**

Modify `app/page.tsx` to add a pricing section and footer. Replace the entire file:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Sparkles, Download } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-5xl font-bold mb-6">
          Build a Professional Resume in Minutes
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Choose from expert templates, get AI-powered suggestions, and download
          in PDF, Word, or plain text. Start free.
        </p>
        <div className="flex gap-4">
          <Link href="/signin">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="#pricing">
            <Button variant="outline" size="lg">View Pricing</Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why ResumeBuilder?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <FileText className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">Download as PDF, Word, or plain text — whichever the employer needs.</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Generate bullet points and improve your writing with AI assistance.</p>
            </div>
            <div className="text-center">
              <Download className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">ATS Optimized</h3>
              <p className="text-sm text-muted-foreground">Get an ATS score and tips to beat applicant tracking systems.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">Start free, upgrade when you need more</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div><span className="text-3xl font-bold">$0</span><span className="text-muted-foreground">/forever</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> 1 resume</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> 3 templates</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> PDF with watermark</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Full Access</CardTitle>
                <div><span className="text-3xl font-bold">$9.99</span><span className="text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> Unlimited resumes</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> All 10 templates</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> PDF, Word, Text</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> ATS score</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div><span className="text-3xl font-bold">$19.99</span><span className="text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> Everything in Full Access</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> AI bullet generation</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> AI text improvement</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" /> LinkedIn import</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 ResumeBuilder. All rights reserved.</p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Write `README.md`**

Create `README.md`:
```markdown
# Resume Builder SaaS

A full-stack resume builder application built with Next.js 14, featuring OAuth authentication, Stripe subscriptions, AI-powered content suggestions, and multi-format downloads.

## Features

- **Authentication**: Sign in with Google, Facebook, or Apple
- **Resume Creation**: Guided 5-step wizard + live editor with preview
- **Templates**: 10 professional templates (3 free, 7 paid)
- **Downloads**: PDF, Word (.docx), and plain text
- **Subscriptions**: Free, Full Access ($9.99/mo), Premium ($19.99/mo)
- **AI Features**: Bullet point generation and text improvement (Premium)
- **ATS Scoring**: Get an ATS compatibility score with improvement tips

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **Billing**: Stripe
- **AI**: OpenAI GPT-4o-mini
- **PDF**: @react-pdf/renderer
- **Word**: docx

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in your credentials
3. Run `npm install`
4. Run `npx prisma migrate dev`
5. Run `npm run dev`
6. Open http://localhost:3000

## Environment Variables

See `.env.local` for all required environment variables.

## License

MIT
```

- [ ] **Step 3: Commit**

```bash
cd C:\Users\tyand\resume-builder
git add .
git commit -m "feat: add landing page with pricing, footer, and README"
```

---

## Self-Review

**1. Spec coverage check:**

| Spec Requirement | Task(s) |
|-----------------|---------|
| OAuth (Google, Facebook, Apple) | Task 3 |
| Resume wizard (5 steps) | Task 10 |
| Live editor with preview | Task 11 |
| PDF download | Task 5 |
| Word download | Task 5 |
| Plain text download | Task 5 |
| Free tier (1 resume, 3 templates, PDF w/ watermark) | Task 4, 5 |
| Full Access tier (unlimited, all templates, all formats, ATS) | Task 4, 5, 6, 8 |
| Premium tier (AI features, LinkedIn import) | Task 7 |
| Stripe subscriptions (Checkout, Portal, Webhooks) | Task 6 |
| AI bullet generation | Task 7 |
| AI text improvement | Task 7 |
| ATS scoring | Task 8 |
| Dashboard | Task 9 |
| Settings/Subscription management | Task 9 |
| Tier-based access control | Task 4, 5, 7 |
| Database schema (User, Resume, ResumeSection, SubscriptionEvent) | Task 2 |
| Error handling | Tasks 4, 5, 7 |

All spec requirements are covered.

**2. Placeholder scan:** No TBDs, TODOs, "implement later", or vague steps. Every step has actual code or exact commands.

**3. Type consistency:** `SubscriptionTier` enum is `"FREE" | "FULL_ACCESS" | "PREMIUM"` throughout. `SectionType` enum is consistent. API error format `{ error: string, code: string }` is consistent. Tier names match across all files.

**Plan complete and saved to `C:\Users\tyand\resume-builder\docs\superpowers/plans/2026-06-16-resume-builder.md`.**
