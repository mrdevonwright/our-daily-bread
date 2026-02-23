# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start local dev server (localhost:3000)
npm run build    # Production build — run this to catch type errors before deploying
npm run lint     # ESLint check
npm run start    # Run production build locally
```

There are no tests. Verify correctness by running `npm run build` (zero TypeScript/lint errors required) and checking `npm run dev`.

## Architecture

**Stack:** Next.js 14 App Router · Supabase (DB + Auth) · Stripe (donations) · Resend (email) · Tailwind CSS · shadcn/ui

**Hosting:** Vercel (auto-deploys from GitHub) at `ourdailybread.club`

### Auth & Roles

Three roles: `baker`, `church_admin`, `super_admin`. Stored in `profiles.role` (Supabase table that mirrors `auth.users`).

- `src/middleware.ts` — protects all `/dashboard/*` routes server-side; redirects unauthenticated users to `/login?redirectTo=...`
- After signup, users land on `/onboarding` to either create a church (becomes `church_admin`) or join one (becomes `baker`). Dashboard redirects back to `/onboarding` if `profile.role` or `profile.church_id` is missing.
- Google OAuth is configured via Supabase. Callback handled at `/auth/callback`.

### Supabase Clients

Always use the right client for the context:
- `src/lib/supabase/client.ts` — browser (client components, `"use client"`)
- `src/lib/supabase/server.ts` — exports `createClient()` (server components, API routes) and `createAdminClient()` (service role key, bypasses RLS — use only in trusted server code)

### External Service Initialization

Stripe and Resend are **lazily initialized** to avoid build-time failures when env vars aren't present:
- `src/lib/stripe.ts` → `getStripe()` factory function
- `src/lib/resend.ts` → `getResend()` factory function

Never call these at module level — always call inside request handlers.

### Static Rendering Gotcha

Routes that read env vars or use `request.url` at runtime must opt out of static prerendering:

```ts
export const dynamic = "force-dynamic";
```

This is already set on `src/app/page.tsx` and `src/app/api/churches/route.ts`. Add it to any new route that hits Supabase or reads request data.

### API Routes (`src/app/api/`)

| Route | Purpose |
|---|---|
| `/api/churches` | List approved churches; filterable by `?state=` |
| `/api/contact` | Contact form → saves to DB + Resend email to admin |
| `/api/donate/checkout` | Create Stripe Checkout session |
| `/api/donate/webhook` | Stripe webhook → sends thank-you email |
| `/api/messages` | Church admin sends email to bakers via Resend |
| `/api/sales` | Log a sale → updates `profiles` + `global_stats` via DB triggers |
| `/api/stats` | Fetch `global_stats` row (30s cache) |

All POST routes validate input with Zod. Auth is verified server-side via `supabase.auth.getUser()`.

### Database

Key tables: `profiles`, `churches`, `sales_logs`, `global_stats` (single row, powers the live ticker), `blog_posts`, `contact_messages`, `story_submissions`.

DB triggers auto-update `global_stats` and `profiles` aggregates when sales are logged — don't manually increment these counters.

### Content in Constants

Static content lives in `src/lib/constants.ts` rather than in page files:
- `RECIPE_INGREDIENTS` / `RECIPE_EQUIPMENT` / `RECIPE_STEPS` / `SELLING_TIPS` — recipe page
- `BIBLE_VERSES` — about page accordion
- `TESTIMONIALS` — homepage
- `NATIONAL_BREAD_STATS` / `CALCULATOR` — about page stats + impact calculator
- `US_STATES` — state dropdowns

When editing recipe content, ingredient/equipment links, or Bible verses, update `constants.ts`.

### Design System

Custom Tailwind tokens (defined in `tailwind.config.ts`):
- **Wheat** `#C8973A` — primary brand color (CTAs, accents, links)
- **Burgundy** `#7B2D42` — secondary accent
- **Cream** `#FDF6E3` — light backgrounds
- **Forest** `#2D5A27` — green accent

Fonts: **Lora** (serif, headings) and **Inter** (sans, body) — loaded via `next/font/google` in `src/app/layout.tsx`.

Utility class patterns used throughout:
- `section-padding` — consistent vertical padding
- `bg-wheat-texture` — cream textured background
- `font-serif` — Lora headings
- `scripture` — italic blockquote style for Bible verses

### Real-time Ticker

`src/components/home/StatsTicker.tsx` subscribes to Supabase Realtime `postgres_changes` on the `global_stats` table. Numbers animate up using a custom `useCountUp` hook. The server component fetches the initial value; the client component handles live updates.
