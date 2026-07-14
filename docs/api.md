# API Routes & Server Actions

## API Routes

### `GET /api/orders/track`

Track a storefront order by ID.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | string | yes | UUID of the order |

**Responses**

```json
// 200 OK
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-1234567890",
    "customerName": "Budi Santoso",
    "customerEmail": "budi@example.com",
    "status": "Pending",
    "paymentStatus": "Unpaid",
    "total": 5000000,
    "template": { "id": "uuid", "name": "Company Profile Website" }
  }
}

// 400 Bad Request
{ "error": "orderId query parameter is required" }

// 404 Not Found
{ "error": "Order not found" }

// 500 Internal Server Error
{ "error": "Internal server error" }
```

### `GET /api/auth/[...nextauth]`
### `POST /api/auth/[...nextauth]`

NextAuth v5 catch-all handler. Manages login, logout, session, CSRF, and OAuth callbacks automatically.

---

## Server Actions

All server actions use `'use server'` and call Prisma directly. They are co-located in `app/actions/`.

### `app/actions/storefront.ts`

| Action | Signature | Description |
|--------|-----------|-------------|
| `getServiceTemplates` | `(filters?) → ServiceTemplate[]` | List active templates with optional category/search/featured filters |
| `getTemplateById` | `(id) → ServiceTemplate \| null` | Single template with features |
| `getFeaturedTemplates` | `() → ServiceTemplate[]` | Up to 6 featured templates |
| `getRelatedTemplates` | `(templateId, categoryId) → ServiceTemplate[]` | Up to 4 related templates in same category |
| `getTestimonials` | `() → Testimonial[]` | Published testimonials ordered by display_order |
| `getFAQs` | `(category?) → StoreFAQ[]` | Published FAQs with optional category filter |
| `createInquiry` | `(data) → boolean` | Submit a public contact/inquiry form |
| `getTemplateCategories` | `() → string[]` | Distinct category slugs from active templates |

**`createInquiry` input:**
```ts
{
  name: string
  email: string
  phone?: string
  company?: string
  serviceType?: string
  message: string
  budget?: string
}
```

### `app/actions/client-portal.ts`

| Action | Signature | Description |
|--------|-----------|-------------|
| `createTicket` | `(data) → SupportTicket \| null` | Create a support ticket for a client |
| `getClientProjects` | `(clientId) → Project[]` | All projects for a client |
| `getClientInvoices` | `(clientId) → Invoice[]` | All invoices for a client |
| `getClientContracts` | `(clientId) → Contract[]` | All contracts for a client |
| `getClientOrders` | `(clientId) → Order[]` | Orders linked to users of a client |
| `getClientDomains` | `(clientId) → Domain[]` | Domain records for a client |
| `getClientHostings` | `(clientId) → Hosting[]` | Hosting records for a client |
| `getClientTickets` | `(clientId) → SupportTicket[]` | Support tickets for a client |
| `getClientProfile` | `(clientId) → Client \| null` | Client profile data |

**`createTicket` input:**
```ts
{
  clientId: string
  subject: string
  description: string
  priority: string  // 'Low' | 'Medium' | 'High' | 'Critical'
}
```

### `app/actions/dashboard.ts`

| Action | Signature | Description |
|--------|-----------|-------------|
| `getProjects` | `(filters?) → Project[]` | Projects with client + PM, filterable by status/search |
| `getProjectById` | `(id) → Project \| null` | Project with tasks and milestones |
| `getProjectTasks` | `(projectId) → Task[]` | Tasks with assignee for a project |
| `createTask` | `(data) → Task \| null` | Create a task on a project |
| `getDashboardStats` | `() → Stats` | KPI counts: projects, clients, tickets, monthly revenue |
| `getClients` | `(search?) → Client[]` | All clients with optional search |
| `getInquiries` | `(status?) → Inquiry[]` | Inquiries with client + assigned user |
| `getQuotations` | `(status?) → Quotation[]` | Quotations with client + inquiry |
| `getContracts` | `(status?) → Contract[]` | Contracts with client + quotation |
| `getInvoices` | `(status?) → Invoice[]` | Invoices with client + project |
| `getPayments` | `() → Payment[]` | All payments with invoice + verifier |
| `getTickets` | `(status?) → SupportTicket[]` | Tickets with client + assignee + project |
| `getDomains` | `() → Domain[]` | All domains ordered by expiry date |
| `getHostings` | `() → Hosting[]` | All hostings ordered by expiry date |

**`getDashboardStats` response:**
```ts
{
  totalProjects: number
  activeProjects: number   // status = In_Progress
  totalClients: number     // status = Active
  openTickets: number      // status in [Open, In_Progress, Escalated]
  monthlyRevenue: Decimal  // verified payments this calendar month
}
```

### `app/actions/admin.ts`

| Action | Signature | Description |
|--------|-----------|-------------|
| `getUsers` | `(role?) → User[]` | All users with optional role filter |
| `getUserById` | `(id) → User \| null` | Single user by ID |
| `getAdminStats` | `() → AdminStats` | Total users, clients, templates, revenue |
| `getAllTemplates` | `() → ServiceTemplate[]` | All service templates |
| `getSystemSettings` | `() → any[]` | System settings (graceful fallback if model absent) |
| `updateSystemSetting` | `(key, value) → any \| null` | Upsert a system setting by key |

**`getAdminStats` response:**
```ts
{
  totalUsers: number
  totalClients: number
  totalTemplates: number
  totalRevenue: number  // sum of Paid invoices
}
```

### `app/auth/register/actions.ts`

Handles new user registration from the public register page.
