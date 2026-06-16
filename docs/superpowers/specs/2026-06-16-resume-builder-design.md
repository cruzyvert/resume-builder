# Resume Builder SaaS — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan from this spec.

## Goal

A full-stack web application where users create professional resumes via a guided wizard or live editor, with subscription-based access to premium features.

## Architecture

Monolithic Next.js (App Router) application with React Server Components and Client Components. Backend logic lives in NextAuth API routes. PostgreSQL database via Prisma ORM. Stripe handles subscription billing. OpenAI powers Premium AI features.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Frontend | React, Tailwind CSS, shadcn/ui |
| Backend | Next.js API routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (Google, Facebook, Apple OAuth) |
| Billing | Stripe (Checkout + Customer Portal + Webhooks) |
| AI | OpenAI API (GPT-4o-mini) |
| PDF | @react-pdf/renderer |
| Word | docx npm package |
| Deployment | Vercel (app) + Supabase/Railway (PostgreSQL) |

## Subscription Tiers

| Feature | Free | Full Access (~$9.99/mo) | Premium (~$19.99/mo) |
|---------|------|--------------------------|----------------------|
| Resumes | 1 | Unlimited | Unlimited |
| Templates | 3 basic | All (8-10) | All (8-10) |
| PDF download | With watermark | No watermark | No watermark |
| Word download | ✗ | ✓ | ✓ |
| Plain text download | ✗ | ✓ | ✓ |
| Customization | Font + color | Full (fonts, colors, spacing, layout) | Full |
| ATS score | ✗ | ✓ | ✓ |
| Cover letter builder | ✗ | Basic | Basic |
| AI bullet generation | ✗ | ✗ | ✓ |
| AI text improvement | ✗ | ✗ | ✓ |
| LinkedIn import | ✗ | ✗ | ✓ |
| Priority support | ✗ | ✗ | ✓ |

## Database Schema

### User
- `id`: UUID, primary key
- `email`: string, unique
- `name`: string
- `image`: string (avatar URL), nullable
- `subscriptionTier`: enum `FREE | FULL_ACCESS | PREMIUM`, default `FREE`
- `stripeCustomerId`: string, nullable, unique
- `stripeSubscriptionId`: string, nullable, unique
- `createdAt`: datetime
- `updatedAt`: datetime

### Resume
- `id`: UUID, primary key
- `userId`: UUID → User.id
- `title`: string
- `templateId`: string (e.g. "modern", "classic", "minimal")
- `customization`: JSON (primaryColor, fontFamily, sectionSpacing, etc.)
- `createdAt`: datetime
- `updatedAt`: datetime

### ResumeSection
- `id`: UUID, primary key
- `resumeId`: UUID → Resume.id
- `type`: enum `PERSONAL_INFO | EXPERIENCE | EDUCATION | SKILLS | SUMMARY | CUSTOM`
- `order`: int
- `data`: JSON (flexible per section type)

### SubscriptionEvent
- `id`: UUID, primary key
- `userId`: UUID → User.id
- `eventType`: string (Stripe event type)
- `stripeEventId`: string, unique (idempotency key)
- `data`: JSON (full Stripe event payload)
- `createdAt`: datetime

## Application Structure

```
/app
  /(auth)
    /signin/page.tsx                    # OAuth sign-in page
  /(dashboard)
    /dashboard/page.tsx                 # User's resume list
    /resumes/new/page.tsx               # Wizard flow (5 steps)
    /resumes/[id]/page.tsx              # Resume editor (live preview)
    /settings/page.tsx                  # Account + subscription management
    /api
      /auth/[...nextauth]/route.ts      # NextAuth handler
      /resumes/route.ts                 # GET list, POST create
      /resumes/[id]/route.ts            # GET, PUT, DELETE single resume
      /resumes/[id]/download/route.ts   # Generate & stream file (PDF/Word/Text)
      /resumes/[id]/ai/route.ts         # AI suggestions (Premium only)
      /stripe/checkout/route.ts         # Create Stripe Checkout session
      /stripe/portal/route.ts           # Stripe Customer Portal redirect
      /stripe/webhook/route.ts          # Stripe webhook handler
/components
  /wizard/                              # Step-by-step form components
  /editor/                              # Live editor + preview components
  /templates/                           # Resume template renderers
  /ui/                                  # Shared UI (shadcn/ui)
/lib
  /prisma.ts                            # Prisma client singleton
  /stripe.ts                            # Stripe client + helpers
  /openai.ts                            # OpenAI client + prompts
  /auth.ts                              # NextAuth config
  /pdf-generator.ts                     # PDF generation logic
  /docx-generator.ts                    # Word document generation
/types
  /resume.ts                            # TypeScript types for resume data
  /api.ts                               # API request/response types
/prisma/schema.prisma
```

## Key Flows

### Auth Flow
1. User visits `/signin`
2. Chooses Google, Facebook, or Apple OAuth
3. NextAuth handles OAuth callback
4. First sign-in: create User record with `subscriptionTier: FREE`
5. Subsequent sign-ins: find existing user, create JWT session
6. Middleware protects all authenticated routes

### Wizard Flow (5 steps)
1. **Personal Info**: name, email, phone, location, LinkedIn URL
2. **Experience**: add multiple entries (company, title, dates, description/bullets)
3. **Education**: school, degree, dates
4. **Skills**: tag-style input
5. **Review**: pick template → save resume

### Editor Flow
- Split-pane: form fields on left, live resume preview on right
- Real-time updates as user types
- Drag-and-drop section reordering
- Template switcher (preview updates instantly)

### Download Flow
1. User clicks "Download" on a resume
2. Modal asks: "Which format?" → PDF / Word / Plain Text
3. Server generates file on-demand using selected template + resume data
4. File streams to browser as download
5. Free tier: PDF includes watermark overlay

### Subscription Flow
1. User clicks "Upgrade" → `/api/stripe/checkout` creates Stripe Checkout Session
2. User completes payment on Stripe-hosted page
3. Stripe sends `checkout.session.completed` webhook
4. Webhook handler sets `subscriptionTier` and `stripeCustomerId` on User
5. User redirected back to `/dashboard` with success message
6. Customer Portal for self-service management (upgrade/downgrade/cancel)

### AI Features Flow (Premium only)
1. User in editor clicks "Generate bullets" or "Improve text"
2. Request hits `/api/resumes/[id]/ai`
3. Server checks `user.subscriptionTier === 'PREMIUM'` → 403 if not
4. Calls OpenAI GPT-4o-mini with structured prompt
5. Returns suggestions → user can accept/reject

## API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/auth/[...nextauth]` | ALL | — | NextAuth handler |
| `/api/resumes` | GET | ✓ | List user's resumes |
| `/api/resumes` | POST | ✓ | Create new resume |
| `/api/resumes/[id]` | GET | ✓ | Get single resume |
| `/api/resumes/[id]` | PUT | ✓ | Update resume |
| `/api/resumes/[id]` | DELETE | ✓ | Delete resume |
| `/api/resumes/[id]/download` | POST | ✓ | Download resume (body: `{ format: 'pdf' | 'docx' | 'txt' }`) |
| `/api/resumes/[id]/ai` | POST | ✓ Premium | AI suggestions (body: `{ action: 'generate' | 'improve', context: string }`) |
| `/api/stripe/checkout` | POST | ✓ | Create Checkout Session (body: `{ tier: 'full_access' | 'premium' }`) |
| `/api/stripe/portal` | POST | ✓ | Redirect to Customer Portal |
| `/api/stripe/webhook` | POST | — | Stripe webhook (signature verified) |

## Error Handling

- **Auth failures**: Redirect to `/signin` with error query param
- **Resume not found / unauthorized**: 404 (don't leak existence)
- **Free tier resume limit**: 403 with upgrade CTA
- **Non-Premium AI access**: 403 with upgrade CTA
- **Stripe webhook sig fail**: 400
- **Duplicate Stripe event**: 200 (idempotent)
- **OpenAI errors**: Return friendly "AI is busy, try again" message
- **All API errors**: Consistent JSON format `{ error: string, code: string }`
- **Frontend**: Global error boundary, loading states on all async ops

## ATS Optimization

Simple keyword/structure analysis:
- Check for action verbs in bullet points
- Check for quantifiable metrics (numbers, percentages)
- Verify standard section headers present
- Verify contact info present
- Flag use of tables/images (ATS-unfriendly)
- Display score 0-100 + actionable improvement tips

## Security Considerations

- All authenticated routes protected by NextAuth middleware
- API routes verify user owns requested resource (resume userId match)
- Stripe webhook signature verification
- OAuth state parameter validation (handled by NextAuth)
- Input validation on all API routes
- Rate limiting on AI endpoints (per-user)
- No email/password auth (OAuth only) — reduces attack surface
