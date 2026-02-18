# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is
Overture — an AI-powered proposal and SOW generator for freelancers, consultants, and agencies. Users paste a client brief, the AI researches the client and generates a professional proposal, the user reviews/edits, then exports as a branded PDF or shareable link.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Server Components by default, Turbopack)
- **Language:** TypeScript (strict mode, no `any`)
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style, neutral palette)
- **Database:** Supabase (PostgreSQL + Auth + Storage + Row Level Security)
- **AI:** Anthropic Claude API (`claude-opus-4-6` with extended thinking for planning steps, `claude-sonnet-4-5-20250929` for content generation)
- **PDF:** @react-pdf/renderer for proposal PDF export
- **Payments:** Stripe (Checkout + Customer Portal + Webhooks)
- **Email:** React Email + Resend for transactional emails
- **Validation:** Zod for all runtime validation
- **State:** nuqs for URL search params, React Hook Form for forms
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run typecheck` — TypeScript check (`tsc --noEmit`)
- `npm run lint` — ESLint

## Architecture

### Route Groups
The app uses Next.js App Router with three route groups under `src/app/`:
- `(app)/` — Protected routes (dashboard, proposals, clients, settings, templates). Layout checks auth and redirects to `/login` if unauthenticated.
- `(auth)/` — Public auth pages (login, signup, forgot-password, callback)
- `(marketing)/` — Public pages (homepage, pricing)
- `api/` — Route handlers (Stripe webhooks, PDF generation, share responses)
- `share/[token]` — Public proposal sharing (no auth required)

### Data Flow Pattern
1. **Server Actions** (`src/actions/`) handle all mutations — auth, proposals, clients, settings, templates
2. **Data Access Layer** (`src/lib/supabase/queries.ts`) — ALL database reads/writes go through this single file
3. **Validation Schemas** (`src/lib/validations/`) — Zod schemas for auth, proposals, templates, clients, settings
4. **Types** (`src/types/index.ts`) — All shared TypeScript interfaces

### AI Proposal Generation Pipeline
`src/lib/ai/proposal-generator.ts` runs a multi-step pipeline:
1. Analyze client brief → 2. Research client company → 3. Draft scope (extended thinking) → 4. Create timeline → 5. Calculate investment → 6. Write executive summary → 7. Finalize

AI client setup is in `src/lib/ai/client.ts`. Extended thinking (budget 8192 tokens) is used for complex planning steps. Progress is tracked via `generation_metadata` on the proposal row.

### Auth
Supabase Auth with email/password and Google OAuth. Middleware in `src/lib/supabase/middleware.ts` handles session refresh and route protection. Three Supabase client variants:
- `server.ts` — SSR client with cookies (most common)
- `admin.ts` — Service role client for background/system operations
- `client.ts` — Browser client (`"use client"`)

### Stripe Plans
- **Free:** $0 — 5 proposals/month
- **Pro:** $29/month — 50 proposals/month
- **Agency:** $99/month — unlimited

### Key Types
- `ProposalStatus`: generating → draft → review → sent → accepted/declined/expired
- `PlanType`: free | pro | agency
- Monetary values stored as `_cents` (integer cents, not floats)

### Path Alias
`@/*` maps to `./src/*`

## Code Standards
- ES modules only, never CommonJS
- All functions must have TypeScript return types
- Server Components by default, `"use client"` only when needed (interactivity, hooks, browser APIs)
- Server Actions for mutations (forms, data writes)
- Route Handlers only for webhooks and external API callbacks
- Zod validation on every form, every API input, every external data source
- ALL database queries go through `src/lib/supabase/queries.ts` — never raw Supabase calls in components or actions
- Components under 150 lines — split if larger
- One component per file
- Use `cn()` utility for conditional Tailwind classes (from shadcn)
- ALL colors via CSS variables / Tailwind theme — zero hardcoded hex/rgb
- Mobile-first responsive design on every component
- Every user-facing page must have: loading state (skeleton), error state, empty state
- No default exports except pages/layouts

## Rules
- ALWAYS run `npm run typecheck` after code changes
- ALWAYS use Supabase Row Level Security — no unprotected tables
- ALWAYS validate with Zod before database writes
- ALWAYS handle loading, error, and empty states in UI
- NEVER store secrets in client code
- NEVER use `any` type
- NEVER hardcode colors — use Tailwind theme tokens
- NEVER skip mobile responsiveness
- Commit messages: imperative mood, concise (e.g., "Add proposal editor with autosave")
