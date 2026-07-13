# Kawasan Digital ID — Full Migration Plan

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task.

**Goal:** Migrate Vite/React/Supabase SPA → Next.js App Router + Prisma/Neon + NextAuth v5 + Tailwind v4. Production-hardened, admin panel + client portal + storefront.

**Architecture:** Next.js App Router (single codebase) with `(public)` and `(admin)` route groups. Prisma ORM to Neon Postgres. NextAuth v5 for auth (credentials + role-based session). Server Actions for mutations, Route Handlers for API (legacy/edge). Tailwind v4 CSS-based config.

**Tech Stack:** Next.js 15, TypeScript, Prisma, Neon Postgres, NextAuth v5, Tailwind CSS v4, shadcn/ui, Vitest, React Testing Library

---

## Global Constraints (bind all tasks)
- `DATABASE_URL` ONLY in `.env.local` — never in client bundle, never `NEXT_PUBLIC_*`
- No `@supabase/supabase-js`, no `supabase/` folder, no `VITE_SUPABASE_*` env vars after migration
- All DB queries server-side only (Server Component, Server Action, Route Handler)
- Every Server Action validates input with zod server-side
- Admin routes (`/(admin)/**`) require role check in middleware — not just UI hiding
- Delete operations: soft-delete (`deleted_at`) or confirmation dialog
- Commit messages: conventional commits format

### Task 1: Scaffold Next.js + Prisma + Neon

**Objective:** Create Next.js project with App Router, configure Tailwind v4, Prisma with Neon connection, install NextAuth v5.

**Files:**
- Create: new project (migration approach — copy src/ into new project)
- Modify: `package.json`, `tailwind.config.ts` → CSS `@theme`, `postcss.config.js`
- Create: `prisma/schema.prisma`, `prisma/seed.ts`
- Create: `.env.local`, update `.gitignore`

**Context:**
- Branch: `nextjs-migration` (worktree)
- Use `pnpm create next-app` with TypeScript, App Router, src-dir=false
- Tailwind v4: config via `@theme` in CSS, `postcss.config.js` uses `@tailwindcss/postcss` (not `tailwindcss` v3 plugin)
- Prisma schema from supabase migrations (22 tables)
- `DATABASE_URL=postgresql://neondb_owner:npg_V1ajYSweRkT6@ep-shy-surf-aopb7tzq-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- NextAuth v5: `pnpm add next-auth@beta @auth/prisma-adapter`
- After setup: `pnpm prisma db push` to create tables in Neon

### Task 2: Auth — NextAuth v5 Setup

**Objective:** Replace Supabase Auth with NextAuth v5 credentials provider. Session contains user role for middleware checks.

**Files:**
- Create: `src/auth.ts` (NextAuth v5 config)
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/middleware.ts` (route protection by role)
- Create: `src/components/auth/LoginForm.tsx`
- Modify: `prisma/schema.prisma` (add NextAuth adapter tables)

**Context:**
- Credentials provider: email + password, bcrypt verify
- Session callback adds `user.role` and `user.clientId` to token
- Middleware: `/admin/*` requires `role IN (super_admin, sales, project_manager, developer, finance, support, infra)`
- Middleware: `/dashboard/*` requires `role IN (client_admin, client_contact)`
- Public routes: `/`, `/templates/*`, `/store/*`, `/landing/*`, `/login`
- Use `@auth/prisma-adapter` — it auto-creates `Account`, `Session`, `VerificationToken` tables

### Task 3: Core Layout & Route Structure

**Objective:** Build Next.js route groups and layouts for public, admin, client, storefront.

**Files:**
- Create: `src/app/(public)/layout.tsx` (landing + storefront shared layout)
- Create: `src/app/(public)/page.tsx` (storefront home)
- Create: `src/app/(admin)/layout.tsx` (admin shell — sidebar, header)
- Create: `src/app/(admin)/dashboard/page.tsx`
- Create: `src/app/(client)/layout.tsx` (client portal shell)
- Create: `src/app/(client)/dashboard/page.tsx`
- Create: `src/app/api/trpc/[trpc]/route.ts` (if needed — placeholder)
- Create: `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx`

**Context:**
- Admin layout: sidebar navigation, header with user menu, breadcrumb
- Client layout: simplified header, client-specific navigation
- Public layout: header with nav + footer, minimal styling
- All layouts use `ThemeProvider` from `next-themes` for dark mode
- Store shadcn/ui components from old repo into `src/components/ui/`
- Migrate `@/shared/components/ui/*` → `src/components/ui/*`

### Task 4: Database Layer — Prisma Schema & Seed

**Objective:** Complete Prisma schema with all 22 tables from Supabase migrations. Create seed data.

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`

**Context:**
- Models from Supabase migrations (see docs/database-schema.md and actual migrations):
  - User, Profile, UserRole, Client, Inquiry, Quotation, Contract
  - Project, Milestone, Task, Revision (add if missing)
  - Invoice, Payment
  - SupportTicket
  - Domain, Hosting
  - ShowcaseProject, ServiceTemplate, TemplateFeature, Order, CartItem
  - Testimonial, StoreFaq, CustomInquiry
  - ActivityLog, ProjectDocument, ProjectFeedback, ContactMessage, MessageReply
- NextAuth adapter tables: Account, Session, VerificationToken
- Soft delete pattern: `deletedAt` on Client, Project, User
- Enums: use Prisma enum or string with validation

### Task 5: Migrate UI Components — shadcn/ui + Tailwind v4

**Objective:** Copy and adapt shadcn/ui components from old Vite project. Fix Tailwind v4 breaking changes.

**Files:**
- Create: `src/components/ui/*` (all shadcn components from old src/shared/components/ui/)
- Modify: `src/app/globals.css` (Tailwind v4 `@theme`, CSS variables)
- Create: `src/lib/utils.ts` (cn() helper)

**Context:**
- Tailwind v4: no `tailwind.config.ts` — use `@theme` in globals.css
- Key v4 changes: `@apply` still works, `theme()` → `--color-*` variables, no `dark:` modifier changes
- shadcn components use `cva()` from `class-variance-authority` — still compatible
- `tailwindcss-animate` v1 may not work with v4 — check compatibility or skip
- CSS variables from old `index.css` + shadcn default theme → port to `@theme`

### Task 6: Privatize .env from Git History

**Objective:** Remove `.env` from git history and rotate Neon password.

**Files:**
- Modify: `.gitignore` (add `.env*`)
- Terminal: `git filter-branch` or `git rm --cached .env` + BFG

**Context:**
- `.env` was committed in 2 commits (c95ca87, 8174be5)
- Contains only Supabase publishable key (not service_role) but still best practice to remove
- Use `git filter-branch --index-filter 'git rm --cached --ignore-unmatch .env' HEAD`
- Or just `git rm --cached .env` + amend last commit if we're doing a fresh branch anyway

### Task 7: Auth Forms & Profile Migration

**Objective:** Port login page, auth form components, and AuthContext logic to NextAuth v5 pattern.

**Files:**
- Create: `src/components/auth/LoginForm.tsx` (server action form with credentials)
- Create: `src/app/(public)/login/page.tsx`
- Create: `src/components/auth/AuthGuard.tsx` (client component that reads session)
- Create: `src/lib/auth-helpers.ts` (server-side helpers: getCurrentUser, requireAdmin, requireClient)

**Context:**
- NextAuth v5 credentials provider
- Server-side actions: `signIn()`, `signOut()` from NextAuth
- Client-side hook: `useSession()` from `next-auth/react`
- SessionProvider wraps admin and client layouts
- Role check middleware already handles route guards, but Server Actions also need explicit checks

### Task 8: Core Feature Migration — Storefront (Public)

**Objective:** Port storefront landing, templates, checkout, cart, and legal pages.

**Files:**
- Create: `src/app/(public)/page.tsx` (storefront home — HeroSection, FeaturedSection, etc.)
- Create: `src/app/(public)/templates/page.tsx`
- Create: `src/app/(public)/templates/[id]/page.tsx`
- Create: `src/app/(public)/checkout/page.tsx`
- Create: `src/app/(public)/cart/page.tsx`
- Create: `src/app/(public)/custom/page.tsx`
- Create: `src/app/(public)/track-order/page.tsx`
- Create: `src/app/(public)/help/page.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/(public)/terms/page.tsx`
- Create: `src/app/(public)/refund/page.tsx`
- Create: corresponding Server Actions for form submissions
- Create: corresponding Route Handler for track-order API

**Context:**
- Components to port from `src/features/storefront/components/*`
- Data fetching: Server Components with Prisma queries (no TanStack Query needed for initial load)
- Static storefront pages: use Server Components
- Interactive pages (checkout, cart): Client Components with Server Actions
- Track-order: port from Supabase Edge Function to Next.js Route Handler
- TanStack Query hooks from `src/features/storefront/hooks/*` → adapt to Server Actions or keep client-side with `useQuery` for cache needs
- `useCart` → implement as server-side session cart or local storage cart

### Task 9: Core Feature Migration — Landing Pages

**Objective:** Port company profile/landing pages (About, Services, Portfolio, Contact).

**Files:**
- Create: `src/app/(public)/landing/page.tsx`
- Create: `src/app/(public)/landing/about/page.tsx`
- Create: `src/app/(public)/landing/services/page.tsx`
- Create: `src/app/(public)/landing/portfolio/page.tsx`
- Create: `src/app/(public)/landing/contact/page.tsx`
- Create: Server Action for contact form

**Context:**
- Components from `src/pages/landing/*`
- Contact form: Server Action with zod validation, inserts to ContactMessage table
- Portfolio: Server Component fetching ShowcaseProject from Prisma
- Mostly static content — Server Components, minimal JS

### Task 10: Core Feature Migration — Admin Panel

**Objective:** Port admin dashboard, CRM, finance, projects, support, infrastructure pages.

**Files:**
- Create: `src/app/(admin)/admin/page.tsx` (dashboard redirect)
- Create: `src/app/(admin)/admin/sales/**`
- Create: `src/app/(admin)/admin/projects/**`
- Create: `src/app/(admin)/admin/finance/**`
- Create: `src/app/(admin)/admin/support/**`
- Create: `src/app/(admin)/admin/infrastructure/**`
- Create: `src/app/(admin)/admin/settings/**`
- Create: Server Actions for CRUD operations per module
- Create: Prisma queries for dashboard stats

**Context:**
- Admin routes from `src/pages/*` (Dashboard, Sales, Finance, etc.)
- Components from `src/features/*/components/*`
- Hooks from `src/features/*/hooks/*` — migrate to Server Actions or keep client hooks
- DataTable → use shadcn Table component with server-side pagination
- StatCards → fetch data in Server Component, pass as props
- Dashboard: aggregate queries (revenue, project count, ticket stats)
- Authorization: every Server Action checks `session.user.role` before allowing mutations

### Task 11: Core Feature Migration — Client Portal

**Objective:** Port client dashboard, projects view, invoices, support tickets, orders.

**Files:**
- Create: `src/app/(client)/dashboard/page.tsx`
- Create: `src/app/(client)/dashboard/projects/**`
- Create: `src/app/(client)/dashboard/invoices/**`
- Create: `src/app/(client)/dashboard/support/**`
- Create: `src/app/(client)/dashboard/infrastructure/**`
- Create: `src/app/(client)/dashboard/account/**`
- Create: `src/app/(client)/dashboard/orders/**`

**Context:**
- Routes from `src/pages/client/*`
- Row-level filtering: every Prisma query adds `WHERE clientId = session.user.clientId`
- Client users cannot access admin routes (middleware blocks)
- Client sees only: own projects, invoices, tickets, domains/hostings

### Task 12: Testing — Baseline & Coverage

**Objective:** Ensure vitest works, add tests for critical paths, verify migration didn't break core logic.

**Files:**
- Modify: `vitest.config.ts` (update for Next.js)
- Create: `src/__tests__/auth/login.test.ts`
- Create: `src/__tests__/api/track-order.test.ts`
- Create: `src/__tests__/components/*.test.tsx`
- Create: `__tests__/setup.ts`

**Context:**
- vitest + @testing-library/react
- Mock Prisma client for server action tests
- Test at minimum: auth flow, track-order API, contact form, admin CRUD permissions

### Task 13: Build & Deploy to Vercel

**Objective:** Build passes, lint clean, deploy to Vercel.

**Files:**
- Create: `vercel.json` (if needed)
- Terminal: `vercel link`, `vercel deploy`
- Configure: environment variables in Vercel dashboard

**Context:**
- `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` in Vercel env vars
- `pnpm build` must succeed
- `pnpm lint` must be clean
- Vercel project: `kawasan-digital-id`
- Deploy preview first, verify, then promote to production

### Task 14: Security Hardening & Cleanup

**Objective:** Final audit — remove Supabase remnants, verify no secrets leak, rotate Neon password.

**Files:**
- Delete: `supabase/` folder, `@supabase/supabase-js`, Vite config files
- Delete: `src/integrations/supabase/`, `src/lib/integrations/supabase/`
- Delete: `vite.config.ts`, `index.html`, `tailwind.config.ts` (old v3)
- Terminal: rotate Neon password
- Verify: build bundle has no DATABASE_URL

**Context:**
- Prune unused shadcn components
- Update `.gitignore` to exclude all `.env*`
- Check `npm audit` — fix high/critical
- Confirm no `NEXT_PUBLIC_DATABASE_URL` or similar exposure
