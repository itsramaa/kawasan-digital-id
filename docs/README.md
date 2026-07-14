# Kawasan Digital ID — Wiki

Kawasan Digital ID is a full-stack web platform for a digital agency, combining a public-facing storefront, a client portal, and an internal operations dashboard into one Next.js 16 App Router application.

## Live URLs

| Environment | URL |
|-------------|-----|
| Production  | https://kawasan-digital-id.vercel.app |
| Repository  | https://github.com/itsramaa/kawasan-digital-id |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Runtime | Node.js 24 |
| Package Manager | pnpm 11 |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| ORM | Prisma v7 |
| Database | Neon (serverless PostgreSQL) |
| Auth | NextAuth v5 (JWT strategy) |
| Forms | React Hook Form + Zod v4 |
| Charts | Recharts |
| Data Fetching | TanStack Query v5 |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

## Documentation Index

| Doc | Description |
|-----|-------------|
| [architecture.md](./architecture.md) | System architecture, route groups, middleware & auth flow diagrams |
| [database.md](./database.md) | All 22 Prisma models, ER diagram, enums, relationships |
| [api.md](./api.md) | API routes and Server Actions with request/response examples |
| [auth.md](./auth.md) | Auth providers, role hierarchy, route protection, JWT structure |
| [deployment.md](./deployment.md) | Environment variables, Vercel setup, seed commands, pnpm scripts |
| [features.md](./features.md) | Feature breakdown per persona: Storefront, Client Portal, Dashboard, Admin |

## Three Personas

```
┌─────────────────────────────────────────────────────┐
│              kawasan-digital-id.vercel.app           │
├──────────────┬──────────────────┬────────────────────┤
│  Storefront  │  Client Portal   │  Internal Ops      │
│  (public)    │  /client/*       │  /dashboard/*      │
│              │                  │  /admin/*          │
│  Anyone      │  client_admin    │  Staff roles       │
│              │  client_contact  │  super_admin       │
└──────────────┴──────────────────┴────────────────────┘
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push schema to database
pnpm prisma db push

# Seed admin user
pnpm seed:admin

# Run development server
pnpm dev
```
