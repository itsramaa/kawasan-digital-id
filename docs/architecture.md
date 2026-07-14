# Architecture

## System Overview

Kawasan Digital ID is a monolithic Next.js 16 App Router application deployed on Vercel. All three personas (Storefront, Client Portal, Internal Dashboard) are served from a single codebase, separated by route groups and protected by edge middleware.

## Full System Diagram

```mermaid
graph TD
    Browser["Browser / Client"]
    Vercel["Vercel Edge Network"]
    MW["Next.js Middleware\n(JWT route guard)"]
    AppRouter["App Router"]

    subgraph RouteGroups["Route Groups"]
        Public["(public) — Storefront"]
        Landing["(landing) — Marketing pages"]
        Auth["auth/ — Login & Register"]
        Client["client/ — Client Portal"]
        Dashboard["dashboard/ — Internal Ops"]
        Admin["admin/ — Super Admin"]
    end

    subgraph ServerLayer["Server Layer"]
        Actions["Server Actions\n(app/actions/)"]
        APIRoutes["API Routes\n(app/api/)"]
        NextAuthAPI["NextAuth API\n(/api/auth/...)"]
    end

    subgraph DataLayer["Data Layer"]
        Prisma["Prisma v7 Client\n(@prisma/adapter-neon)"]
        Neon[("Neon PostgreSQL\n(serverless)")]
    end

    Browser --> Vercel
    Vercel --> MW
    MW --> AppRouter
    AppRouter --> Public
    AppRouter --> Landing
    AppRouter --> Auth
    AppRouter --> Client
    AppRouter --> Dashboard
    AppRouter --> Admin
    Public --> Actions
    Client --> Actions
    Dashboard --> Actions
    Admin --> Actions
    Browser --> APIRoutes
    Browser --> NextAuthAPI
    Actions --> Prisma
    APIRoutes --> Prisma
    NextAuthAPI --> Prisma
    Prisma --> Neon
```

## Route Groups

| Route Group | Path Prefix | Access | Purpose |
|-------------|-------------|--------|---------|
| `(public)` | `/` | Anyone | Storefront: templates, cart, checkout, orders |
| `(landing)` | `/home`, `/about`, `/services`, `/portfolio`, `/contact` | Anyone | Marketing / landing pages |
| `auth` | `/auth/login`, `/auth/register`, `/auth/redirect` | Anyone | Authentication flows |
| `client` | `/client/*` | `client_admin`, `client_contact` | Client self-service portal |
| `dashboard` | `/dashboard/*` | All staff roles | Internal operations dashboard |
| `admin` | `/admin/*` | `super_admin` only | Platform administration |

### Storefront `(public)` Pages

| Route | Page |
|-------|------|
| `/` | Home / storefront landing |
| `/templates` | Service template catalogue |
| `/templates/[id]` | Template detail |
| `/custom` | Custom project inquiry builder |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/orders/track` | Public order tracker |
| `/orders/success` | Post-order confirmation |
| `/help` | Help & FAQs |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/refund` | Refund policy |

### Marketing `(landing)` Pages

| Route | Page |
|-------|------|
| `/home` | Agency landing page |
| `/about` | About the agency |
| `/services` | Services overview |
| `/portfolio` | Portfolio showcase |
| `/contact` | Contact form |

### Client Portal `/client/*`

| Route | Page |
|-------|------|
| `/client` | Client dashboard overview |
| `/client/projects` | Project tracker |
| `/client/invoices` | Invoice list |
| `/client/payments` | Payment submission |
| `/client/contracts` | Signed contracts |
| `/client/orders` | Order history |
| `/client/support` | Support tickets |
| `/client/infrastructure` | Domains & hosting |
| `/client/finance` | Finance summary |
| `/client/account` | Account settings |

### Internal Dashboard `/dashboard/*`

| Route | Page |
|-------|------|
| `/dashboard` | KPI overview |
| `/dashboard/projects` | All projects list |
| `/dashboard/projects/[id]` | Project detail |
| `/dashboard/projects/[id]/tasks` | Task board |
| `/dashboard/sales` | Sales pipeline |
| `/dashboard/sales/clients` | Client management |
| `/dashboard/sales/quotations` | Quotation management |
| `/dashboard/sales/contracts` | Contract management |
| `/dashboard/finance` | Invoice management |
| `/dashboard/finance/payments` | Payment verification |
| `/dashboard/support` | Support ticket queue |
| `/dashboard/infrastructure` | Domain & hosting registry |
| `/dashboard/settings` | Staff settings |

### Admin Panel `/admin/*`

| Route | Page |
|-------|------|
| `/admin` | Admin overview |
| `/admin/users` | User management |
| `/admin/clients` | Client management |
| `/admin/templates` | Service template management |

## Middleware Flow

```mermaid
flowchart TD
    Request["Incoming Request"]
    CheckPath{"Path starts with?"}
    Admin["/admin/*"]
    Dashboard["/dashboard/*"]
    ClientPath["/client/*"]
    GetToken["getToken() from JWT"]
    NoToken{"token exists?"}
    CheckRole{"role matches?"}
    Redirect["Redirect → /auth/login"]
    Allow["NextResponse.next()"]

    Request --> CheckPath
    CheckPath -- "/admin/*" --> Admin
    CheckPath -- "/dashboard/*" --> Dashboard
    CheckPath -- "/client/*" --> ClientPath
    CheckPath -- "other" --> Allow

    Admin --> GetToken
    Dashboard --> GetToken
    ClientPath --> GetToken

    GetToken --> NoToken
    NoToken -- "no" --> Redirect
    NoToken -- "yes" --> CheckRole

    CheckRole -- "/admin: role !== super_admin" --> Redirect
    CheckRole -- "/dashboard: role not in INTERNAL_ROLES" --> Redirect
    CheckRole -- "/client: role not in CLIENT_ROLES" --> Redirect
    CheckRole -- "role matches" --> Allow
```

**Role groups defined in `middleware.ts`:**

```ts
const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES   = ['client_admin', 'client_contact']
```

## Auth Flow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant MW as Middleware
    participant NA as NextAuth
    participant DB as Neon DB

    U->>B: Navigate to /auth/login
    B->>NA: POST /api/auth/callback/credentials
    NA->>DB: SELECT user WHERE email = ?
    DB-->>NA: User row (with passwordHash)
    NA->>NA: bcrypt.compare(password, hash)
    alt credentials valid
        NA->>NA: Sign JWT { id, email, role, clientId }
        NA-->>B: Set session cookie (JWT)
        B->>B: Redirect to /auth/redirect
        B->>NA: GET session
        NA-->>B: { role }
        alt role in INTERNAL_ROLES
            B->>B: Redirect → /dashboard
        else role in CLIENT_ROLES
            B->>B: Redirect → /client
        else role === super_admin
            B->>B: Redirect → /admin
        end
    else invalid credentials
        NA-->>B: Return error
        B->>U: Show error message
    end

    Note over MW: On subsequent requests
    U->>B: Navigate to /dashboard/*
    B->>MW: Request with session cookie
    MW->>MW: getToken() — verify JWT
    alt JWT valid + role in INTERNAL_ROLES
        MW-->>B: NextResponse.next()
    else
        MW-->>B: Redirect → /auth/login
    end
```
