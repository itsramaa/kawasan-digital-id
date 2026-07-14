# Features

## Storefront (Public)

The storefront is accessible to anyone at the root URL. It serves as the agency's e-commerce front for purchasing web development service packages.

### Service Templates

- Browse all active service packages (`/templates`)
- Filter by category, search by name/description
- View detailed template page with features, gallery, demo link, revision limit (`/templates/[id]`)
- Featured templates highlighted on the home page (up to 6)
- Related templates shown on detail pages

### Custom Project Builder

- Step-by-step estimator at `/custom`
- Select industry, website type, page count, desired features
- Instant price and timeline estimate (min/max range)
- Submit custom inquiry stored as `CustomInquiry`

### Shopping Cart & Checkout

- Add templates to cart (`CartItem` per user + template)
- Cart persists per logged-in user
- Checkout flow collects customer name, email, phone, company, notes
- Order created as `Order` record with `paymentStatus: Unpaid`

### Order Tracking

- Public order tracker at `/orders/track`
- Enter order ID to see current status and template info
- Post-order success page at `/orders/success`

### Storefront Content

- Portfolio showcase from `ShowcaseProject` records (with case study: challenge, solution, result)
- Client testimonials from `Testimonial` records
- FAQ section from `StoreFaq` records (categorised)
- Contact form submits to `CustomInquiry`

### Marketing / Landing Pages

- Agency landing: `/home`
- About page: `/about`
- Services overview: `/services`
- Portfolio: `/portfolio`
- Contact: `/contact`

### Static Pages

- Privacy Policy: `/privacy`
- Terms of Service: `/terms`
- Refund Policy: `/refund`
- Help Center: `/help`

---

## Client Portal (`/client/*`)

Accessible to `client_admin` and `client_contact` roles. All data is scoped to `session.user.clientId`.

| Page | Feature |
|------|---------|
| `/client` | Dashboard overview — project count, invoice summary, open tickets |
| `/client/projects` | View all projects, status, progress bar, deadline |
| `/client/invoices` | View all invoices with status and amounts |
| `/client/payments` | Submit payment proof against invoices |
| `/client/contracts` | View signed and active contracts |
| `/client/orders` | Storefront order history |
| `/client/support` | Submit and track support tickets |
| `/client/infrastructure` | View registered domains and hosting records |
| `/client/finance` | Financial summary |
| `/client/account` | Account and profile settings |

### Client Portal Actions

- `createTicket` — submit a new support ticket with priority
- `getClientProjects` / `getClientInvoices` / `getClientContracts` — read-only views
- `getClientDomains` / `getClientHostings` — infrastructure registry
- `getClientOrders` — orders linked via user IDs on the client

---

## Internal Dashboard (`/dashboard/*`)

Accessible to all staff roles: `super_admin`, `sales`, `project_manager`, `developer`, `finance`, `support`, `infra`.

### Overview

- KPI cards: total projects, active projects, total clients, open tickets, monthly revenue
- Data sourced from `getDashboardStats()` — runs 5 parallel Prisma queries

### Sales Pipeline

| Page | Feature |
|------|---------|
| `/dashboard/sales` | Pipeline overview |
| `/dashboard/sales/clients` | Client list with search, status badges |
| `/dashboard/sales/quotations` | Quotation list filtered by status |
| `/dashboard/sales/contracts` | Contract list filtered by status |

- Inquiry → Quotation → Contract workflow
- Assign inquiries to sales reps
- Track quote status: Draft → Sent → Accepted/Rejected

### Project Management

| Page | Feature |
|------|---------|
| `/dashboard/projects` | All projects with status filter and search |
| `/dashboard/projects/[id]` | Project detail: milestones, progress, PM assignment |
| `/dashboard/projects/[id]/tasks` | Task board per project |

- Create tasks with priority, due date, assignee
- Milestone ordering with `orderIndex`
- `isClientVisible` flag on tasks controls client portal visibility

### Finance

| Page | Feature |
|------|---------|
| `/dashboard/finance` | Invoice management, filter by status |
| `/dashboard/finance/payments` | Payment verification queue |

- Invoice statuses: Draft → Sent → Viewed → Paid / Overdue / Void / Bad_Debt
- Payment verification: mark `PaymentStatus` as Verified/Failed
- Monthly revenue aggregation by verified payments

### Support

- `/dashboard/support` — full ticket queue with status filter
- Assign tickets to support staff
- SLA deadline tracking (`slaDeadline`)
- Ticket status: Open → In_Progress → Escalated → Resolved → Closed

### Infrastructure

- `/dashboard/infrastructure` — combined domain and hosting registry
- Domains ordered by expiry date (earliest first)
- Hostings ordered by expiry date

### Settings

- `/dashboard/settings` — staff profile settings

---

## Admin Panel (`/admin/*`)

Accessible to `super_admin` only.

| Page | Feature |
|------|---------|
| `/admin` | Admin overview: total users, clients, templates, revenue |
| `/admin/users` | User management — list all users, filter by role |
| `/admin/clients` | Client management |
| `/admin/templates` | Service template management — create/edit/publish templates |

### Admin Actions

- `getUsers(role?)` — list users with optional role filter
- `getUserById(id)` — fetch single user
- `getAdminStats()` — platform-wide KPIs
- `getAllTemplates()` — all service templates regardless of active status
- `getSystemSettings()` / `updateSystemSetting()` — key-value system config
