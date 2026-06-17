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

```bash
npm install
npm run dev
```

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
