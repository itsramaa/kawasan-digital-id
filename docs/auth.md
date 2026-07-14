# Authentication

## Auth Providers

NextAuth v5 (`next-auth@5.0.0-beta.31`) with the Prisma adapter (`@auth/prisma-adapter`).

| Provider | Type | Description |
|----------|------|-------------|
| Credentials | Username/password | Email + bcrypt-hashed password stored in `users.password_hash` |

OAuth providers are supported by the schema (`Account` model) but not yet configured.

## Strategy

JWT strategy — sessions are stored as signed JWTs in an HTTP-only cookie, not in the database. The `Session` table exists for the adapter but is not actively used.

## Role Hierarchy

| Role | Type | Access Level | Portal |
|------|------|-------------|--------|
| `super_admin` | Internal | Full platform access | `/admin/*` + `/dashboard/*` |
| `sales` | Internal | Sales pipeline | `/dashboard/*` |
| `project_manager` | Internal | Projects & tasks | `/dashboard/*` |
| `developer` | Internal | Projects & tasks | `/dashboard/*` |
| `finance` | Internal | Invoices & payments | `/dashboard/*` |
| `support` | Internal | Support tickets | `/dashboard/*` |
| `infra` | Internal | Domains & hosting | `/dashboard/*` |
| `client_admin` | Client | Full client portal | `/client/*` |
| `client_contact` | Client | Read-only client portal | `/client/*` |

**Role groups (from `middleware.ts`):**
```ts
const INTERNAL_ROLES = [
  'super_admin', 'sales', 'project_manager',
  'developer', 'finance', 'support', 'infra'
]
const CLIENT_ROLES = ['client_admin', 'client_contact']
```

## Route Protection Rules

| Path Pattern | Rule |
|-------------|------|
| `/admin/:path*` | Must have valid JWT **and** `role === 'super_admin'` |
| `/dashboard/:path*` | Must have valid JWT **and** `role` in `INTERNAL_ROLES` |
| `/client/:path*` | Must have valid JWT **and** `role` in `CLIENT_ROLES` |
| All other paths | Publicly accessible |

All checks are in `middleware.ts` at the edge using `getToken()` from `next-auth/jwt`.

## JWT Token Structure

Fields added to the JWT via the NextAuth `jwt` callback:

```ts
{
  // Standard NextAuth fields
  sub: string        // user.id
  email: string
  name: string | null
  picture: string | null
  iat: number        // issued at
  exp: number        // expiry
  jti: string        // JWT ID

  // Custom fields
  id: string         // user.id (duplicate of sub)
  role: UserRole     // e.g. 'sales'
  clientId: string | null  // set for client_admin / client_contact
}
```

## Session Object Shape

The `session.user` object available in Server Components via `auth()`:

```ts
{
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  clientId: string | null
}
```

## Auth Flow

1. User submits email + password to `/auth/login`
2. NextAuth `Credentials` provider calls `authorize()`
3. `authorize()` queries `users` table by email, runs `bcrypt.compare()`
4. On success, returns user object; NextAuth signs a JWT
5. Browser stores JWT in `__Secure-next-auth.session-token` cookie
6. `/auth/redirect` reads role from session and redirects:
   - `super_admin` → `/admin`
   - Internal roles → `/dashboard`
   - Client roles → `/client`
7. On each protected request, `middleware.ts` calls `getToken()` to validate

## Protecting Server Actions

Server Actions access the session via:

```ts
import { auth } from '@/src/lib/auth'

const session = await auth()
if (!session?.user) throw new Error('Unauthorized')
```
