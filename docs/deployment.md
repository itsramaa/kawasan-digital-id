# Deployment

## Environment Variables

All variables must be set in Vercel project settings (or `.env.local` for local dev).

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string (pooled) |
| `DATABASE_URL_UNPOOLED` | ✅ | Neon direct connection string (for migrations) |
| `AUTH_SECRET` | ✅ | Random secret for signing JWTs — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ (local) | Base URL, e.g. `http://localhost:3000` (Vercel sets this automatically) |
| `AUTH_TRUST_HOST` | ✅ (prod) | Set to `true` on Vercel to trust the host header |

### Neon Connection Strings

Neon provides two URLs:
- **Pooled** (`DATABASE_URL`): used by Prisma at runtime via `@prisma/adapter-neon` + `@neondatabase/serverless`
- **Direct** (`DATABASE_URL_UNPOOLED`): used for `prisma migrate` / `prisma db push`

## pnpm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start local dev server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build locally |
| `lint` | `eslint` | Run ESLint |
| `test` | `vitest run` | Run tests once |
| `test:watch` | `vitest` | Run tests in watch mode |
| `test:ui` | `vitest --ui` | Open Vitest UI |
| `postinstall` | `prisma generate` | Auto-generate Prisma client after install |
| `seed:admin` | `tsx scripts/seed-admin.ts` | Seed the initial super_admin user |
| `seed:dummy` | `tsx scripts/seed-dummy.ts` | Seed dummy/demo data |

## Vercel Deployment Steps

1. Push code to GitHub (`main` branch)
2. In Vercel dashboard, import the repository
3. Set **Framework Preset** to `Next.js`
4. Set **Install Command** to `pnpm install`
5. Set **Build Command** to `pnpm build`
6. Add all environment variables listed above
7. Deploy — Vercel runs `pnpm install` (triggers `postinstall → prisma generate`) then `pnpm build`

## Database Setup

```bash
# Push schema to Neon (no migration history)
pnpm prisma db push

# Or use migrations
pnpm prisma migrate deploy
```

## Seed Commands

```bash
# Create the first super_admin user
pnpm seed:admin

# Populate with demo data (clients, projects, templates, etc.)
pnpm seed:dummy
```

## Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env template
cp .env.example .env.local
# Fill in DATABASE_URL, DATABASE_URL_UNPOOLED, AUTH_SECRET

# 3. Push schema
pnpm prisma db push

# 4. Seed admin
pnpm seed:admin

# 5. Start dev server
pnpm dev
# → http://localhost:3000
```

## Prisma Client Generation

The Prisma client is generated automatically on every `pnpm install` via the `postinstall` script. To regenerate manually:

```bash
pnpm prisma generate
```
