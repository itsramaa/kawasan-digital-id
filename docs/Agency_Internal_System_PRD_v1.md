# PRODUCT REQUIREMENTS DOCUMENT
## Agency Internal + Client Portal Web Application

**Version:** 1.0  
**Date:** February 2026  
**Status:** Implementation Ready  
**Audience:** Engineering, Product, Stakeholders  

## DETAILED DESIGN DOCUMENTS
For technical implementation details, please refer to the following documents:
- **[System Architecture Hub](docs/system-architecture.md)** (Start Here)
- **[Frontend Architecture](docs/frontend-architecture.md)**
- **[Backend Architecture](docs/backend-architecture.md)**
- **[Domain State Machines](docs/domain-state-machines.md)**
- **[Security Architecture](docs/security-architecture.md)**
- **[Deployment & Infrastructure](docs/deployment-infrastructure.md)**
- **[Testing Strategy](docs/testing-strategy.md)**
- **[Database Schema & ERD](docs/database-schema.md)**
- **[API Specification](docs/api-specification.md)**

---

## TABLE OF CONTENTS
1. Executive Summary
2. Business Objectives & Context
3. Scope Definition (Phase 1 vs Phase 2)
4. Architectural Decisions & Constraints
5. System Architecture Overview
6. Role & Permission Matrix
7. Detailed Module Breakdown
8. Functional Requirements
9. Non-Functional Requirements
10. Data Model Overview
11. KPI & Reporting Framework
12. Risk Analysis & Mitigation
13. Rollout Strategy
14. Glossary & Definitions

---

## 1. EXECUTIVE SUMMARY

### Product Definition
A hybrid **internal operations + client portal** web application for website development agencies (5-20 person teams). The system consolidates:
- Sales pipeline (inquiry → contract)
- Project delivery (project → completion)
- Finance (invoicing → payment reconciliation)
- Support (SLA → ticket resolution)
- Infrastructure (domain, hosting, environment management)
- Analytics (KPI, resource utilization, financial performance)

### Strategic Value
- **End-to-end visibility**: Sales to delivery to payment in single system
- **Reduced manual overhead**: Automated workflow, audit trails, state machines
- **Client transparency**: Clients see project status, milestones, invoices, tickets without portal fatigue
- **Financial accuracy**: Payment reconciliation, dispute handling, margin tracking
- **Team coordination**: Task management, revision control, asset versioning
- **Compliance-ready**: UU PDP compliance, tax data export, audit logging

### Target Users
- **Internal (5-25 people)**: Sales, Project Manager, Developer, Finance, Support
- **External (20-100 active clients/month)**: Business contacts, technical contacts, stakeholders

### Key Metrics (Success)
- Invoice payment cycle reduction: Target 50% (from 45 days to 22 days)
- Support ticket resolution time: Target <24h for critical, <7d for standard
- Resource utilization visibility: >90% task allocation clarity
- Financial forecast accuracy: ±5% variance month-to-month

---

## 2. BUSINESS OBJECTIVES & CONTEXT

### Agency Operating Model
```
Sales → Proposal → Contract → Project Execution → Delivery → Payment → Support
                                ↓
                         Task Execution
                         Revision Management
                         Asset Control
                         Timeline Tracking
```

### Core Business Processes Automated
1. **Sales to Contract**: Inquiry → Quotation → Proposal → Contract signature
2. **Project Execution**: Project creation → Milestone planning → Task execution → Revision cycles
3. **Financial**: Invoice generation → Payment tracking → Refund/dispute handling
4. **Support**: Ticket creation → SLA tracking → Resolution → Knowledge base
5. **Infrastructure**: Domain registration → Hosting setup → Environment management → Renewal tracking
6. **Analytics**: Revenue reporting, resource utilization, SLA compliance, margin analysis

### Business Rules Enforced
- **Contract Prerequisite**: Project cannot start without signed contract
- **Invoice Prerequisite**: Invoice requires completed milestone + approval
- **Payment Logic**: Invoice transitions to "Paid" only via verified payment or manual approval
- **Refund Rules**: Refund requires invoice reference + dispute justification + approval
- **SLA Escalation**: Ticket escalates automatically if SLA breached
- **Revision Limits**: Project revision limits enforced per contract
- **Overdue Management**: Payment reminder automation at +7, +14, +21 days

---

## 3. SCOPE DEFINITION

### PHASE 1 (Weeks 1-8, Implementation Ready)
*Core operational modules, internal + basic client portal. See [Project Roadmap](docs/project-roadmap.md) for detailed weekly breakdown.*

#### Included Modules:
1. **CRM & Sales**: Client, Inquiry, Quotation, Proposal, Contract
2. **Finance**: Invoice, Payment, Refund/Dispute
3. **Project Delivery**: Project, Milestone, Task, Revision, Asset
4. **Support & SLA**: SLA Policy, Support Ticket, Maintenance
5. **Infrastructure**: Domain, Hosting, Environment
6. **Analytics & KPI**: Dashboard, Reports, Team Resource
7. **Access Control**: Role-based permissions, audit logging

#### Deliverables:
- Internal admin portal (100% feature access)
- Client portal (filtered visibility)
- **Design System**: "Industrial Productivity" aesthetic for Internal, "Swiss Minimal" for Client Portal (Semantic Color Palette)
- Mobile-responsive UI
- PostgreSQL data model
- REST API (internal)
- Email notifications
- PDF export (invoice, proposal, contract)

### PHASE 2 (Months 5-12, Architectural Design Only)
*Advanced features, external integrations, scaling*

#### Included Modules:
1. **Security**: Encryption, secret management, compliance automation
2. **Backup & Disaster Recovery**: Point-in-time recovery, multi-region failover
3. **Integration**: Accounting software, email providers, Slack, Google Workspace
4. **Automation**: Workflow automation, recurring tasks, bulk operations
5. **Knowledge Management**: Internal wiki, FAQ, process documentation
6. **Access & Credentials**: Password manager integration, MFA, SSO
7. **Ownership Transfer**: Client handoff, project migration, data portability
8. **Offboarding**: Client exit, data archival, SLA termination
9. **GDPR/PDP Compliance**: Automated DSAR processing, consent management logs

**Phase 2 Status in This Document**: Architecture overview only. Detailed requirements deferred to Phase 2 PRD.

---

## 4. ARCHITECTURAL DECISIONS & CONSTRAINTS

### Technology Stack (Phase 1)
| Layer | Decision | Rationale |
|-------|----------|-----------|
| **Frontend** | React 18 + TypeScript | Type safety, ecosystem maturity |
| **Design System** | Tailwind CSS + Radix UI | Utility-first, accessible primitives, semantic color palette |
| **Backend** | Node.js (NestJS recommended) | Modular architecture, strict typing, easy testing |
| **Database** | PostgreSQL 14+ | ACID compliance, JSON support, RLS for multi-tenancy |
| **Storage** | S3-compatible (MinIO or AWS) | Unstructured file management, 100GB-1TB capacity |
| **Cache** | Redis | Session management, real-time updates, rate limiting |
| **Task Queue** | BullMQ (Node) | Async payment webhooks, report generation, email jobs |
| **Auth** | JWT (Access + Refresh) | Secure stateless auth with rotation, RLS integration |
| **Deployment** | Docker + CI/CD Pipeline | Reproducible builds, automated testing, zero-downtime |
| **Monitoring** | Prometheus + Grafana | Operational visibility, error tracking (Sentry) |

### Architectural Patterns
1. **Modular Monolith**: Single deployable, logically separated modules by feature domain.
2. **Layered Architecture**: Controller → Service → Repository → Database.
3. **State Machine Pattern**: Lifecycle management (Invoice, Project, Ticket).
4. **Event-Driven Inter-Module Communication**: Decoupled modules via internal event bus.
5. **Domain-Driven Design**: Entities organized by business domain (Sales, Finance, Project).
6. **Intentional Frontend Design**: Distinct aesthetics for different user personas (Internal vs Client).

### Compliance & Data Privacy (GDPR/UU PDP)
- **Right to Access (DSAR)**: System must support exporting all user data (Phase 1: Manual SQL script, Phase 2: Automated).
- **Consent Management**: Explicit consent tracking for marketing communications and data processing.
- **Data Retention**: Automated cleanup of inactive data based on retention policies.
- **Data Minimization**: Only collect strictly necessary data.

### Data Scoping Strategy
- **Internal Users**: Full visibility per permission role
- **Client Users**: Row-level filtering on `client_id`
  - Can see: Own projects, milestones, invoices, tickets
  - Cannot see: Internal costs, margins, other clients' data, internal notes
- **Query Filter Pattern**: `WHERE client_id = :current_user_client_id` on all client-visible queries

### Constraints & Trade-offs
| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| Single PostgreSQL instance | No horizontal scaling until 10K+ clients | Monitor CPU/RAM, plan vertical scaling or read replicas at year 2 |
| No multi-currency Phase 1 | International invoices need manual FX | Document process, plan currency support in Phase 2 |
| Internal API only | No third-party integrations | Keep API design clean, plan public API in Phase 2 |
| Single-region hosting | No disaster recovery | Implement daily backups, document RTO/RPO in Phase 2 |
| UU PDP compliance Phase 1 | Data deletion requests delay | Manual process acceptable for <1000 clients, automate in Phase 2 |

---

## 5. SYSTEM ARCHITECTURE OVERVIEW

> **Note:** For a detailed breakdown of the technology stack, security architecture, and deployment strategy, please refer to **[System Architecture Design](docs/system-architecture.md)** and **[API Specification](docs/api-specification.md)**.

### High-Level Architecture Diagram (Text)
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
├─────────────────────────────────────────────────────────┤
│  Web UI (React)           Mobile UI          Admin UI    │
│  ├─ Client Portal         (Responsive)       ├─ Dashboard│
│  ├─ Login/Auth            ├─ Project Status  ├─ Reports │
│  └─ Self-Service          ├─ Invoice View    └─ Settings│
└──────────────────────────────────────────────────────────┘
                           ↓
                    (HTTPS/REST API)
                           ↓
┌──────────────────────────────────────────────────────────┐
│                  API GATEWAY / ROUTER                    │
├──────────────────────────────────────────────────────────┤
│  Authentication  Rate Limiting  CORS  Logging           │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Services)               │
├──────────────────────────────────────────────────────────┤
│ CRM Service  │ Finance Service  │ Project Service      │
│ Support Service │ Infrastructure Service │ Analytics   │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│              DATA ACCESS LAYER (Repositories)           │
├──────────────────────────────────────────────────────────┤
│  ORM (Prisma/SQLAlchemy)  Query Builders  Migrations  │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                       │
├──────────────────────────────────────────────────────────┤
│  PostgreSQL       Redis Cache      Object Storage       │
│  (Relational)     (Session/Cache)   (Files/Assets)      │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS                       │
├──────────────────────────────────────────────────────────┤
│  Payment Gateway   Email Service   File Upload Service  │
│  (Midtrans/Xendit) (SendGrid/AWS)  (MinIO/AWS S3)      │
└──────────────────────────────────────────────────────────┘
```

### Deployment Architecture
```
Development Environment
├─ Local Docker Compose
├─ PostgreSQL 14 (local)
├─ Redis (local)
├─ MinIO (local S3)
└─ Hot-reload enabled

Staging Environment (CI/CD)
├─ Docker image build
├─ Automated tests
├─ PostgreSQL (separate instance)
├─ Staging database seed
└─ Integration tests

Production Environment
├─ Container orchestration (Docker Compose or K8s-ready)
├─ PostgreSQL 14 (managed or dedicated instance)
├─ Redis (managed or dedicated)
├─ Object storage (AWS S3 or MinIO)
├─ Backup automation (daily, 30-day retention)
├─ Log aggregation
└─ Monitoring (Prometheus/Grafana)
```

### Cross-Cutting Concerns
- **Authentication**: JWT token + session management, separate auth context for internal vs client
- **Authorization**: Role-based access control (RBAC) + row-level access (RLS) for multi-tenancy
- **Audit Logging**: All state changes logged with user, timestamp, old value, new value
- **Error Handling**: Centralized error mapper, user-friendly messages, dev-friendly stacktraces
- **Validation**: Input validation at API boundary, domain validation in service layer
- **Caching**: Query result caching (Redis) for dashboards, real-time cache invalidation on writes
- **Async Processing**: Payment webhooks, report generation, email queues via task scheduler
- **Data Backup**: Daily automated backups, 30-day retention, documented recovery procedure

---

## 6. ROLE & PERMISSION MATRIX

### System Roles Defined

| Role | Internal? | Client? | Primary Responsibility | Key Permissions |
|------|-----------|---------|------------------------|-----------------|
| **Super Admin** | ✓ | - | System configuration, audit | All permissions, no restrictions |
| **Sales Manager** | ✓ | - | Lead pipeline, quotations | Create/edit/delete inquiries, quotations, contracts; view client |
| **Project Manager** | ✓ | - | Project planning, execution | Create/manage projects, milestones, tasks; manage revisions |
| **Developer** | ✓ | - | Task execution, asset upload | Create/update tasks, upload assets, mark tasks complete |
| **Finance Manager** | ✓ | - | Invoicing, payment reconciliation | Create/send invoices, verify payments, handle refunds, view financials |
| **Support Agent** | ✓ | - | Ticket management, SLA tracking | Create/resolve tickets, update SLA, communicate with clients |
| **Infra Admin** | ✓ | - | Domain, hosting, environment | Register domains, manage hosting, configure environments |
| **Client Contact** | - | ✓ | Client-side project visibility | View own projects, milestones, invoices, tickets; submit support tickets |
| **Client Admin** | - | ✓ | Client organization management | View all client data, manage client team members, approve deliverables |

### Permission Matrix (Phase 1)

| Feature | Super | Sales | PM | Dev | Finance | Support | Infra | Client | Client Admin |
|---------|-------|-------|----|----|---------|---------|-------|--------|-------------|
| **Client** | CRUD | R | R | - | R | R | - | Self | R |
| **Inquiry** | CRUD | CRUD | R | - | - | - | - | - | - |
| **Quotation** | CRUD | CRUD | R | - | R | - | - | - | - |
| **Proposal** | CRUD | CRUD | R | - | R | - | - | R | R |
| **Contract** | CRUD | CRUD | CRUD | - | R | - | - | R | R |
| **Project** | CRUD | - | CRUD | R | R | - | - | R | R |
| **Milestone** | CRUD | - | CRUD | R | R | - | - | R | R |
| **Task** | CRUD | - | CRUD | CRUD | - | - | - | RO* | RO* |
| **Revision** | CRUD | - | CRUD | CRUD | - | - | - | R | R |
| **Asset** | CRUD | - | R | CRUD | - | - | - | R | R |
| **Invoice** | CRUD | - | R | - | CRUD | - | - | R | R |
| **Payment** | CRUD | - | - | - | CRUD | - | - | R | R |
| **Refund** | CRUD | - | - | - | CRUD | - | - | - | - |
| **Support Ticket** | CRUD | - | R | - | - | CRUD | - | CRUD | CRUD |
| **SLA Policy** | CRUD | - | - | - | - | R | - | - | - |
| **Domain** | CRUD | - | - | - | - | - | CRUD | R | R |
| **Hosting** | CRUD | - | - | - | - | - | CRUD | R | R |
| **Environment** | CRUD | - | - | R | - | - | CRUD | - | - |
| **Dashboard** | CRUD | R | R | R | R | R | R | R | R |
| **Report** | CRUD | R | R | - | R | - | - | R | R |
| **Team** | CRUD | - | R | R | R | R | R | - | - |
| **Settings** | CRUD | - | - | - | - | - | - | Self | Self |

**Legend**: CRUD = Create/Read/Update/Delete, R = Read-only, RO* = Read-only, client-facing tasks only, - = No access

### Permission Scoping Rules
1. **Internal Users**: No client_id filter; can see all data
2. **Client Users**: Filtered by client_id; cannot see other clients' data
3. **Task Visibility**: Client sees only "client-facing" tasks (flag: `is_client_visible`)
4. **Financial Data**: Clients see only their own invoices/payments, not internal costs
5. **Notes**: Internal notes hidden from client users
6. **Audit Log**: Super Admin only (Phase 2: configurable audit visibility)

---

## 7. DETAILED MODULE BREAKDOWN

### 7.1 CRM & SALES MODULE

#### 7.1.1 Client Lifecycle
**States**: Active, Inactive, Archived, Suspended

**State Transitions**:
```
Active (Initial)
  ↓ (On last project completion)
  Inactive
  ↓ (No activity for 6 months)
  Archived
  ↓ (Admin action for issues)
  Suspended (can be reactivated)
```

**Entity Structure**:
- `id` (UUID)
- `name` (string, unique per agency)
- `email` (string, primary contact)
- `phone` (string)
- `company_name` (string)
- `industry` (string, enum: tech, retail, services, other)
- `location` (string)
- `website` (string, optional)
- `npwp` (string, optional, for tax)
- `tax_status` (enum: individual, company, tax_exempt)
- `primary_contact_id` (FK to Contact)
- `status` (enum: Active, Inactive, Archived, Suspended)
- `lifetime_value_usd` (decimal, read-only, calculated)
- `outstanding_balance_usd` (decimal, read-only, calculated)
- `created_at`, `updated_at`, `deleted_at` (soft delete)

**Business Rules**:
- Client cannot be deleted (soft delete only)
- Client `status` auto-transitions to Inactive 30 days after last project completion
- Cannot create duplicate clients (check by email)
- Outstanding balance > 0 triggers finance alert
- NPWP required if tax_status = "company"

**Validation**:
- Email format validation
- Phone format validation (support Indonesia +62)
- Unique constraint on email

**Audit Requirements**:
- Log all status changes with reason
- Log all contact updates (GDPR/UU PDP compliance)
- Track lifetime_value calculation history

---

#### 7.1.2 Inquiry Lifecycle
**States**: New, Qualified, Rejected, Converted

**State Transitions**:
```
New (initial)
  ↓ (Sales review)
  Qualified / Rejected
  ↓ (If Qualified, create Quotation)
  Converted (when Contract signed)
```

**Entity Structure**:
- `id` (UUID)
- `client_id` (FK to Client)
- `title` (string, e.g., "Website Redesign")
- `description` (text)
- `budget_estimate_usd` (decimal, optional)
- `budget_currency` (string, default: IDR)
- `source` (enum: website_form, email, referral, phone, linkedin)
- `status` (enum: New, Qualified, Rejected, Converted)
- `qualified_at` (timestamp, null initially)
- `rejection_reason` (text, null if not rejected)
- `quoted_quotation_id` (FK to Quotation, null if not quoted yet)
- `sales_manager_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- New inquiry triggers notification to sales team
- Cannot convert inquiry without Quotation
- Quotation can only be created from Qualified inquiry
- Inquiry auto-archived if no activity for 90 days

**Validation**:
- `title` required, min 5 chars
- `budget_estimate_usd` must be > 0 if provided
- `sales_manager_id` required for Qualified status

**Audit Requirements**:
- Log all status transitions
- Track source attribution
- Log qualification criteria met

---

#### 7.1.3 Quotation Lifecycle
**States**: Draft, Sent, Accepted, Rejected, Expired

**State Transitions**:
```
Draft (initial)
  ↓ (Sales finalizes pricing)
  Sent
  ↓ (Client accepts)
  Accepted / Rejected / Expired (after 30 days)
  ↓ (If Accepted, create Proposal)
  (move to Proposal flow)
```

**Entity Structure**:
- `id` (UUID)
- `inquiry_id` (FK to Inquiry)
- `client_id` (FK to Client)
- `quote_number` (string, unique, auto-generated: QT-YYYY-MMM-####)
- `title` (string)
- `description` (text)
- `line_items` (JSONB array):
  - `id`, `description`, `quantity`, `unit_price`, `amount`
- `subtotal_usd` (decimal, calculated)
- `tax_percentage` (decimal, default: 11 for PPN)
- `tax_amount_usd` (decimal, calculated)
- `total_usd` (decimal, calculated)
- `discount_usd` (decimal, optional)
- `final_total_usd` (decimal, calculated)
- `currency` (enum: IDR, USD, SGD)
- `validity_days` (int, default: 30)
- `valid_until` (date, calculated from created_at + validity_days)
- `status` (enum: Draft, Sent, Accepted, Rejected, Expired)
- `sent_at` (timestamp, null initially)
- `accepted_at` (timestamp, null if not accepted)
- `rejection_reason` (text, null if not rejected)
- `created_by_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Quotation can only be created from Qualified Inquiry
- Price fields auto-calculated from line items
- Tax percentage enforced per Indonesia tax rules (PPN 11%)
- Quotation auto-expires 30 days after sent_at
- Cannot modify quotation after Sent status
- Line items cannot be empty

**Validation**:
- `line_items` array, min 1 item
- Each line_item: `quantity` > 0, `unit_price` > 0
- `validity_days` between 7 and 90
- Currency must be one of: IDR, USD, SGD

**Audit Requirements**:
- Log all line item changes (Draft status only)
- Log send timestamp
- Log acceptance/rejection with timestamp
- Track price modifications

---

#### 7.1.4 Proposal Lifecycle
**States**: Draft, Sent, Signed, Rejected, Expired

**State Transitions**:
```
Draft (initial)
  ↓ (PM finalizes scope)
  Sent
  ↓ (Client signs)
  Signed / Rejected / Expired (after 14 days)
  ↓ (If Signed, create Contract)
```

**Entity Structure**:
- `id` (UUID)
- `quotation_id` (FK to Quotation)
- `client_id` (FK to Client)
- `proposal_number` (string, unique, auto-generated: PROP-YYYY-MMM-####)
- `title` (string)
- `executive_summary` (text)
- `scope_of_work` (text, rich text / markdown)
- `deliverables` (JSONB array):
  - `id`, `description`, `due_date`, `acceptance_criteria`
- `timeline_summary` (text)
- `estimated_duration_days` (int)
- `team_composition` (JSONB array):
  - `id`, `role`, `name`
- `terms_and_conditions` (text, default template)
- `payment_schedule` (JSONB array):
  - `id`, `milestone`, `percentage`, `due_days_after_start`
- `revision_limit` (int, default: 3)
- `support_period_days` (int, default: 30)
- `status` (enum: Draft, Sent, Signed, Rejected, Expired)
- `sent_at` (timestamp)
- `signed_at` (timestamp)
- `signed_by_client_email` (string, captured on signature)
- `rejection_reason` (text)
- `valid_until` (date, calculated: sent_at + 14 days)
- `created_by_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Proposal must reference Accepted Quotation
- Deliverables describe client-facing milestones
- Payment schedule auto-calculated from quotation total and payment_schedule percentages
- Auto-expire 14 days after Sent
- Cannot sign without accepted quotation
- E-signature required (Phase 1: manual upload, Phase 2: DocuSign/HelloSign integration)

**Validation**:
- `scope_of_work` required, min 100 chars
- `deliverables` array, min 1 item
- `payment_schedule` percentages sum to 100%
- `revision_limit` > 0
- `support_period_days` >= 7

**Audit Requirements**:
- Log signature timestamp and client email
- Log all deliverable changes (Draft only)
- Log payment schedule changes (Draft only)
- Track proposal version history

---

#### 7.1.5 Contract Lifecycle
**States**: Draft, Signed, Active, Suspended, Completed, Terminated

**State Transitions**:
```
Draft (initial)
  ↓ (PM finalizes legal)
  Signed
  ↓ (Payment received or signed)
  Active
  ↓ (All deliverables completed)
  Completed
  ↓ (If breach)
  Suspended / Terminated
```

**Entity Structure**:
- `id` (UUID)
- `proposal_id` (FK to Proposal)
- `client_id` (FK to Client)
- `contract_number` (string, unique, auto-generated: CNT-YYYY-MMM-####)
- `title` (string)
- `project_id` (FK to Project, auto-created on Signed)
- `status` (enum: Draft, Signed, Active, Suspended, Completed, Terminated)
- `signed_at` (timestamp)
- `active_at` (timestamp, when payment received)
- `completed_at` (timestamp)
- `terminated_at` (timestamp)
- `termination_reason` (text)
- `contract_value_usd` (decimal, from proposal)
- `currency` (enum: IDR, USD, SGD)
- `start_date` (date)
- `estimated_end_date` (date)
- `payment_terms` (text, e.g., "50% upfront, 50% on completion")
- `revision_limit` (int, from proposal)
- `support_period_days` (int, from proposal)
- `signed_by_client_email` (string)
- `signed_by_agency_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Contract auto-created when Proposal is Signed
- Contract auto-transitions to Active when Invoice Paid
- Contract auto-transitions to Completed when all milestones completed
- Cannot modify contract after Signed (versioning via amendments in Phase 2)
- Project auto-created on Signed with milestones from proposal deliverables
- Start date can be in future (project triggers when active)

**Validation**:
- `signed_at` required
- `start_date` >= today
- `estimated_end_date` > `start_date`
- `contract_value_usd` > 0

**Audit Requirements**:
- Log signature timestamp and email
- Log auto-transition to Active with payment reference
- Log completion timestamp
- Log termination reason if terminated
- Track contract amendment history

---

### 7.2 FINANCE MODULE

#### 7.2.1 Invoice Lifecycle
**States**: Draft, Sent, Viewed, Partially Paid, Paid, Overdue, Disputed, Refunded

**State Transitions**:
```
Draft (initial)
  ↓ (Finance sends)
  Sent
  ↓ (Client opens email/portal)
  Viewed
  ↓ (Payment received)
  Partially Paid / Paid / Overdue / Disputed / Refunded
```

**Entity Structure**:
- `id` (UUID)
- `invoice_number` (string, unique, auto-generated: INV-YYYY-MMMM-####)
- `client_id` (FK to Client)
- `contract_id` (FK to Contract)
- `milestone_id` (FK to Milestone, optional)
- `type` (enum: Standard, Milestone, Retainer, Manual)
- `status` (enum: Draft, Sent, Viewed, Partially Paid, Paid, Overdue, Disputed, Refunded)
- `issue_date` (date)
- `due_date` (date)
- `viewed_at` (timestamp, null initially)
- `line_items` (JSONB array):
  - `id`, `description`, `quantity`, `unit_price`, `amount`
- `subtotal_usd` (decimal)
- `tax_percentage` (decimal, default: 11)
- `tax_amount_usd` (decimal)
- `total_usd` (decimal)
- `discount_usd` (decimal, optional)
- `final_total_usd` (decimal)
- `currency` (enum: IDR, USD, SGD)
- `payment_method` (enum: Bank Transfer, E-Wallet, Credit Card, Check)
- `bank_details` (text, for manual transfer)
- `amount_paid_usd` (decimal, default: 0)
- `amount_pending_usd` (decimal, calculated)
- `paid_at` (timestamp, when fully paid)
- `payment_reference` (string, e.g., transaction ID)
- `notes` (text, internal only)
- `send_reminder_count` (int, tracks reminders sent)
- `last_reminder_at` (timestamp)
- `dispute_reason` (text, if disputed)
- `disputed_at` (timestamp)
- `created_by_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Invoice auto-created when Contract Signed and Milestone Approved
- Cannot send invoice without approved milestone
- Auto-transitions to Viewed when client opens email link
- Auto-transitions to Overdue when due_date passed and amount_pending > 0
- Auto-sends reminder email at +7, +14, +21 days overdue
- Partial payment supported (amount_paid_usd < total)
- Dispute resets payment status to "Disputed" and notifies finance
- Refund reverts payment and creates Refund record
- Tax always 11% for Indonesia (UU PPN)

**Validation**:
- `line_items` array, min 1 item
- `due_date` >= `issue_date`
- `total_usd` > 0
- `amount_paid_usd` <= `total_usd`
- `invoice_number` globally unique

**Audit Requirements**:
- Log all status transitions with timestamp
- Log all payment receipts with amount, date, method
- Log dispute creation and resolution
- Log reminder sends
- Track PPN calculation for tax audit

---

#### 7.2.2 Payment Lifecycle
**States**: Pending Verification, Verified, Failed, Refunded

**State Transitions**:
```
Pending Verification (initial, from webhook or manual upload)
  ↓ (Finance verifies)
  Verified / Failed / Refunded
```

**Entity Structure**:
- `id` (UUID)
- `invoice_id` (FK to Invoice)
- `amount_usd` (decimal)
- `currency` (enum: IDR, USD, SGD)
- `exchange_rate_idr_per_usd` (decimal, snapshot for Phase 2 multi-currency)
- `amount_idr` (decimal, calculated: amount_usd * exchange_rate)
- `status` (enum: Pending Verification, Verified, Failed, Refunded)
- `payment_method` (enum: Bank Transfer, E-Wallet, Credit Card, Midtrans, Xendit)
- `payment_provider` (string, e.g., "midtrans", "xendit", "manual")
- `provider_reference_id` (string, transaction ID from provider)
- `payment_date` (date)
- `bank_account_name` (string, from payer)
- `bank_account_number` (string, masked)
- `proof_of_payment_url` (string, S3 path)
- `verified_by_id` (FK to User, finance staff)
- `verified_at` (timestamp)
- `failure_reason` (text, if failed)
- `webhook_payload` (JSONB, raw webhook data for audit)
- `idempotency_key` (string, unique: sha256(invoice_id + provider_reference_id))
- `notes` (text)
- `created_at`, `updated_at`

**Business Rules**:
- Payment can only be created for Sent/Viewed/Overdue invoice
- Payment auto-transitions to Verified on successful webhook (Midtrans/Xendit)
- Manual payments require finance verification (upload proof image)
- Amount must match invoice total or be recorded as partial
- Idempotency check: duplicate webhook calls don't create duplicate payments
- Verified payment auto-updates Invoice amount_paid and status
- Failed payment notification sent to client (retry request)

**Validation**:
- `amount_usd` > 0
- `payment_date` <= today
- `provider_reference_id` required for auto-verified payments
- `proof_of_payment_url` required for manual payments

**Audit Requirements**:
- Log idempotency key to detect duplicates
- Log webhook payload (full JSON)
- Log manual verification with approver ID
- Track exchange rate snapshot for FX reconciliation (Phase 2)

---

#### 7.2.3 Refund/Dispute Lifecycle
**States**: Requested, Investigating, Approved, Rejected, Processed, Closed

**State Transitions**:
```
Requested (initial)
  ↓ (Finance investigates)
  Investigating
  ↓ (Resolution)
  Approved / Rejected
  ↓ (If Approved)
  Processed / Closed
```

**Entity Structure**:
- `id` (UUID)
- `invoice_id` (FK to Invoice)
- `payment_id` (FK to Payment, if refunding payment)
- `client_id` (FK to Client)
- `type` (enum: Refund, Dispute, Credit Note)
- `status` (enum: Requested, Investigating, Approved, Rejected, Processed, Closed)
- `reason` (enum: Overpayment, Service Complaint, Payment Error, Quality Issue, Other)
- `reason_description` (text, detailed justification)
- `requested_amount_usd` (decimal)
- `approved_amount_usd` (decimal, null if not yet approved)
- `requested_at` (timestamp)
- `requested_by_client_id` (FK to Client, if client-initiated, can be null for internal refund)
- `investigating_by_id` (FK to User)
- `investigation_notes` (text)
- `approved_by_id` (FK to User)
- `approved_at` (timestamp)
- `rejection_reason` (text, if rejected)
- `rejected_by_id` (FK to User)
- `rejected_at` (timestamp)
- `refund_method` (enum: Bank Transfer, Credit Note, E-Wallet)
- `refund_bank_details` (text, if bank transfer)
- `processed_at` (timestamp)
- `process_reference_id` (string, e.g., bank transfer receipt)
- `closed_at` (timestamp)
- `created_at`, `updated_at`

**Business Rules**:
- Refund can be initiated by client or finance
- Client-initiated refund auto-creates support ticket
- Refund cannot exceed invoice amount
- Investigating status requires notes
- Approved refund auto-transitions to Processed on manual completion
- Processed refund updates Invoice status to Refunded
- Credit note is alternative to refund (Phase 2: detailed credit note management)
- Refund request notifies finance team (email alert)

**Validation**:
- `reason_description` required, min 20 chars
- `requested_amount_usd` > 0 and <= invoice total
- `approved_amount_usd` <= invoice total
- Client can only request refund within 30 days of payment

**Audit Requirements**:
- Log all status transitions with user ID and timestamp
- Log investigation notes (internal)
- Log approval/rejection decision with approver
- Track refund processing details for accounting

---

### 7.3 PROJECT & DELIVERY MODULE

#### 7.3.1 Project Lifecycle
**States**: Planning, In Progress, In Review, Completed, On Hold, Cancelled

**State Transitions**:
```
Planning (initial, auto-created from Signed Contract)
  ↓ (Contract Active + payment received)
  In Progress
  ↓ (Deliverables pending approval)
  In Review
  ↓ (All deliverables approved)
  Completed
  ↓ (If pause)
  On Hold / Cancelled
```

**Entity Structure**:
- `id` (UUID)
- `contract_id` (FK to Contract)
- `client_id` (FK to Client)
- `project_name` (string)
- `description` (text)
- `status` (enum: Planning, In Progress, In Review, Completed, On Hold, Cancelled)
- `project_type` (enum: Website, Mobile App, Design, Maintenance, Custom)
- `start_date` (date, auto-set from contract)
- `estimated_end_date` (date, auto-set from contract)
- `actual_end_date` (date, set on Completed)
- `project_manager_id` (FK to User)
- `team_members` (JSONB array of user_ids)
- `budget_usd` (decimal, from contract)
- `budget_spent_usd` (decimal, calculated from task hours)
- `revision_limit` (int, from contract)
- `revision_count` (int, tracked)
- `revision_requests_remaining` (int, calculated)
- `status_updated_at` (timestamp)
- `hold_reason` (text, if on hold)
- `cancellation_reason` (text, if cancelled)
- `created_at`, `updated_at`

**Business Rules**:
- Project auto-created from Signed Contract with name from Contract
- Cannot move from Planning to In Progress unless Contract Active
- Revision count tracked; warns PM when approaching limit
- Can move to On Hold from any state; can resume from On Hold
- Can cancel from Planning/On Hold only
- Completion requires all milestones completed and approved
- Budget spent auto-calculated from task hours * hourly rate (Phase 2)

**Validation**:
- `project_name` required, unique per client
- `estimated_end_date` >= `start_date`
- `team_members` array of valid user_ids

**Audit Requirements**:
- Log all status transitions with reason
- Log team member changes
- Track milestone completion dates

---

#### 7.3.2 Milestone Lifecycle
**States**: Planned, In Progress, Submitted, Approved, Rejected, Completed

**State Transitions**:
```
Planned (initial, auto-created from Proposal deliverables)
  ↓ (Work started)
  In Progress
  ↓ (Work complete)
  Submitted
  ↓ (Client review)
  Approved / Rejected
  ↓ (If Approved)
  Completed
```

**Entity Structure**:
- `id` (UUID)
- `project_id` (FK to Project)
- `contract_id` (FK to Contract)
- `client_id` (FK to Client)
- `title` (string, from proposal deliverable)
- `description` (text)
- `acceptance_criteria` (text)
- `status` (enum: Planned, In Progress, Submitted, Approved, Rejected, Completed)
- `order` (int, display order)
- `planned_start_date` (date)
- `planned_end_date` (date)
- `actual_start_date` (date)
- `actual_end_date` (date)
- `submitted_at` (timestamp)
- `approved_at` (timestamp)
- `approved_by_client_email` (string, captured on approval)
- `rejection_reason` (text, if rejected)
- `rejection_reason_detail` (text)
- `rejected_at` (timestamp)
- `rejection_count` (int, tracks resubmissions)
- `due_date` (date)
- `overdue` (boolean, calculated: due_date < today AND status < Completed)
- `assigned_to_id` (FK to User, primary owner)
- `created_at`, `updated_at`

**Business Rules**:
- Milestones auto-created from Proposal deliverables when Contract Signed
- Auto-transition from Planned to In Progress on first task assignment
- Cannot approve with unresolved revisions
- Rejection auto-reverts to In Progress
- Approval auto-triggers invoice generation (if tied to payment milestone)
- Overdue milestone triggers PM alert
- Rejection limit: max 3 times (configurable); 4th rejection requires escalation
- Milestone completion auto-updates Contract progress

**Validation**:
- `planned_end_date` >= `planned_start_date`
- `due_date` required
- `assigned_to_id` required before moving to In Progress

**Audit Requirements**:
- Log approval timestamp and email
- Log rejection reason and count
- Track actual duration vs planned
- Log resubmission dates

---

#### 7.3.3 Task Lifecycle
**States**: Backlog, To Do, In Progress, In Review, Completed, Blocked

**State Transitions**:
```
Backlog (initial)
  ↓ (PM assigns)
  To Do
  ↓ (Dev starts)
  In Progress
  ↓ (Work complete)
  In Review
  ↓ (PM approves)
  Completed / Rejected (back to In Progress)
  ↓ (If blocker)
  Blocked (any state)
```

**Entity Structure**:
- `id` (UUID)
- `project_id` (FK to Project)
- `milestone_id` (FK to Milestone, optional)
- `client_id` (FK to Client)
- `title` (string)
- `description` (text)
- `acceptance_criteria` (text)
- `status` (enum: Backlog, To Do, In Progress, In Review, Completed, Blocked)
- `priority` (enum: Critical, High, Medium, Low)
- `type` (enum: Feature, Bug, Design, Content, Testing, Deployment)
- `is_client_visible` (boolean, default: false; client sees if true)
- `estimated_hours` (int, optional)
- `actual_hours` (decimal, sum of time entries)
- `assigned_to_id` (FK to User, can be multiple in Phase 2)
- `assigned_at` (timestamp)
- `started_at` (timestamp)
- `completed_at` (timestamp)
- `blocked_at` (timestamp)
- `block_reason` (text, if blocked)
- `block_dependencies` (JSONB array of task_ids, if blocked by other tasks)
- `parent_task_id` (FK to Task, optional for sub-tasks Phase 2)
- `due_date` (date)
- `overdue` (boolean, calculated)
- `created_at`, `updated_at`

**Business Rules**:
- Task assigned to dev triggers notification
- Task start sets `started_at` automatically
- Blocked status suspends deadline clock (Phase 2)
- Overdue task triggers PM alert
- Cannot complete with unresolved revisions
- Time entries auto-calculate actual_hours
- Client-visible tasks show progress to client portal
- Backlog tasks not assigned to anyone (Planning state)

**Validation**:
- `title` required, min 5 chars
- `estimated_hours` > 0 if provided
- `due_date` >= today
- `assigned_to_id` required for To Do status

**Audit Requirements**:
- Log status transitions with timestamp
- Log assignment changes
- Track time entries (separate time-tracking entity)
- Log completion with approver

---

#### 7.3.4 Revision Lifecycle
**States**: Requested, Acknowledged, In Progress, Completed, Rejected, Closed

**State Transitions**:
```
Requested (initial, from client)
  ↓ (PM reviews)
  Acknowledged / Rejected
  ↓ (If Acknowledged)
  In Progress
  ↓ (Dev completes)
  Completed
  ↓ (Client approves)
  Closed / Requested again (if not accepted)
```

**Entity Structure**:
- `id` (UUID)
- `milestone_id` (FK to Milestone)
- `project_id` (FK to Project)
- `client_id` (FK to Client)
- `revision_number` (int, per milestone: 1, 2, 3...)
- `status` (enum: Requested, Acknowledged, In Progress, Completed, Rejected, Closed)
- `title` (string, e.g., "Change header color")
- `description` (text, detailed request)
- `requested_by_client_email` (string)
- `requested_at` (timestamp)
- `reason_for_revision` (enum: Requirement Change, Quality Issue, Scope Expansion, Other)
- `is_within_revision_limit` (boolean)
- `acknowledged_by_id` (FK to User, PM)
- `acknowledged_at` (timestamp)
- `rejection_reason` (text, if out of scope)
- `rejected_at` (timestamp)
- `assigned_to_id` (FK to User, dev)
- `work_started_at` (timestamp)
- `completed_at` (timestamp)
- `completion_notes` (text, what was changed)
- `closed_at` (timestamp)
- `impact_estimate` (text, e.g., "2 hours")
- `created_at`, `updated_at`

**Business Rules**:
- Revision created from client request (support ticket or direct email)
- Revision count tracked against contract limit
- Revision limit warning: alert PM when approaching limit
- Out-of-scope revisions rejected with explanation
- Revision requires acknowledgment before work starts
- Completion requires PM approval
- Rejection reverts revision request (client can resubmit)
- Contract completion blocked if unresolved revisions exist

**Validation**:
- `description` required, min 20 chars
- `revision_number` auto-incremented per milestone
- Cannot exceed revision limit from contract

**Audit Requirements**:
- Log revision count against contract limit
- Log client request source
- Log acknowledgment and rejection decisions
- Track impact estimates vs actual time

---

#### 7.3.5 Asset Lifecycle
**States**: Uploaded, Approved, In Use, Archived, Deleted

**State Transitions**:
```
Uploaded (initial)
  ↓ (PM reviews)
  Approved / Rejected (back to Uploaded)
  ↓ (If Approved)
  In Use
  ↓ (End of project)
  Archived / Deleted
```

**Entity Structure**:
- `id` (UUID)
- `project_id` (FK to Project)
- `milestone_id` (FK to Milestone, optional)
- `task_id` (FK to Task, optional)
- `client_id` (FK to Client)
- `filename` (string)
- `file_size_bytes` (bigint)
- `file_extension` (string, e.g., "jpg", "psd", "figma")
- `file_type` (enum: Design, Code, Document, Image, Video, Other)
- `storage_url` (string, S3 path)
- `storage_provider` (enum: AWS S3, MinIO, Google Drive Phase 2)
- `version` (int, auto-incremented per filename)
- `status` (enum: Uploaded, Approved, In Use, Archived, Deleted)
- `uploaded_by_id` (FK to User)
- `uploaded_at` (timestamp)
- `approved_by_id` (FK to User)
- `approved_at` (timestamp)
- `is_client_visible` (boolean, default: false)
- `description` (text)
- `tags` (JSONB array, for searching)
- `checksum` (string, SHA256 for integrity)
- `access_log` (JSONB array, tracks downloads by user_id + timestamp)
- `created_at`, `updated_at`

**Business Rules**:
- Asset uploaded triggers notification to PM
- Asset requires approval before client visibility
- Version tracking: same filename = new version
- Deleted assets soft-deleted; physically retained for 90 days
- Archived assets removed from active view but retained
- Checksum detects file tampering
- Access log tracks who downloaded asset (audit trail)
- Client-visible assets served via signed S3 URL (time-limited)
- File size limit: 500MB per file, 5GB per project

**Validation**:
- `filename` required, max 255 chars
- `file_size_bytes` > 0 and <= 500MB
- Supported extensions: jpg, png, gif, pdf, psd, figma, mp4, zip, doc, xls, etc.
- `storage_url` valid S3 path

**Audit Requirements**:
- Log version history with upload timestamp
- Log approval/rejection decision
- Log access log (download events)
- Track deletion and archival

---

### 7.4 SUPPORT & SLA MODULE

#### 7.4.1 SLA Policy Lifecycle
**States**: Draft, Active, Archived, Suspended

**State Transitions**:
```
Draft (initial)
  ↓ (Admin publishes)
  Active
  ↓ (Superseded)
  Archived
  ↓ (Breach handling)
  Suspended (rare)
```

**Entity Structure**:
- `id` (UUID)
- `policy_name` (string, e.g., "Standard Support")
- `description` (text)
- `status` (enum: Draft, Active, Archived, Suspended)
- `service_type` (enum: Bug Fix, Enhancement, Maintenance, Support)
- `response_time_critical_minutes` (int, e.g., 60)
- `response_time_high_minutes` (int, e.g., 240)
- `response_time_medium_minutes` (int, e.g., 1440)
- `response_time_low_minutes` (int, e.g., 2880)
- `resolution_time_critical_hours` (int, e.g., 8)
- `resolution_time_high_hours` (int, e.g., 48)
- `resolution_time_medium_hours` (int, e.g., 168)
- `resolution_time_low_hours` (int, e.g., 336)
- `supported_hours` (enum: 24/7, Business Hours 9-5, etc.)
- `escalation_rule` (text, e.g., "escalate to PM if breached")
- `applicable_services` (JSONB array of service types)
- `applicable_clients` (JSONB array of client_ids, null for all)
- `max_concurrent_tickets_per_client` (int, e.g., 5)
- `ticket_channel_priority` (JSONB: email, chat, phone priority ranking)
- `created_by_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Only one Active SLA policy per service_type
- SLA timers start from ticket creation
- Business Hours SLA excludes weekends (Phase 2: holiday calendar)
- Breach triggers escalation (email alert to support lead)
- SLA clock pauses if ticket blocked (waiting for client response)
- SLA applies to all clients unless explicitly limited to subset

**Validation**:
- `policy_name` unique, min 5 chars
- All response_time fields > 0
- All resolution_time fields >= response_time (for same priority)
- `max_concurrent_tickets_per_client` > 0

**Audit Requirements**:
- Log policy activation/archival
- Log SLA breach events
- Track SLA compliance metrics

---

#### 7.4.2 Support Ticket Lifecycle
**States**: New, Acknowledged, In Progress, Waiting for Client, Resolved, Closed, Reopened

**State Transitions**:
```
New (initial)
  ↓ (Support reviews)
  Acknowledged
  ↓ (Work starts)
  In Progress / Waiting for Client
  ↓ (Resolution ready)
  Resolved
  ↓ (Client confirms)
  Closed / Reopened (if unsatisfied)
```

**Entity Structure**:
- `id` (UUID)
- `ticket_number` (string, unique, auto-generated: TKT-YYYY-MMMM-####)
- `client_id` (FK to Client)
- `project_id` (FK to Project, optional)
- `milestone_id` (FK to Milestone, optional)
- `title` (string)
- `description` (text)
- `status` (enum: New, Acknowledged, In Progress, Waiting for Client, Resolved, Closed, Reopened)
- `priority` (enum: Critical, High, Medium, Low)
- `category` (enum: Bug, Enhancement, Question, Access Request, Other)
- `created_by_client_email` (string)
- `created_at` (timestamp)
- `channel` (enum: Email, Chat, Phone, Portal)
- `assigned_to_id` (FK to User, support agent)
- `assigned_at` (timestamp)
- `acknowledged_at` (timestamp)
- `started_at` (timestamp)
- `resolved_at` (timestamp)
- `closed_at` (timestamp)
- `reopened_at` (timestamp)
- `sla_policy_id` (FK to SLA Policy, auto-assigned)
- `sla_response_deadline` (timestamp, calculated)
- `sla_resolution_deadline` (timestamp, calculated)
- `sla_response_breached` (boolean, calculated)
- `sla_resolution_breached` (boolean, calculated)
- `response_time_minutes` (int, actual time to acknowledge)
- `resolution_time_hours` (int, actual time to resolve)
- `waiting_for_client` (boolean, true if in "Waiting" state)
- `waiting_since` (timestamp)
- `resolution_summary` (text, what was done to resolve)
- `reopened_reason` (text, if reopened)
- `internal_notes` (text, not visible to client)
- `created_at`, `updated_at`

**Business Rules**:
- Ticket auto-assigned SLA policy based on category and client contract
- New ticket triggers notification to support team
- Acknowledgment auto-sets acknowledged_at and calculates response_time
- Response time tracked even if ticket is in progress
- Waiting for Client state pauses resolution clock (Phase 2)
- Reopened ticket resets state to In Progress, increments reopened counter
- SLA breach triggers escalation email (e.g., "Page Manager")
- Resolved ticket moved to Closed after client confirmation
- Closed ticket cannot be modified (reopening creates new ticket)

**Validation**:
- `title` required, min 10 chars
- `description` required, min 20 chars
- `priority` should match impact (Phase 2: auto-categorization via ML)
- `assigned_to_id` required for Acknowledged status

**Audit Requirements**:
- Log all status transitions with timestamp
- Log SLA breach events
- Log internal notes (support staff only)
- Track reopened count
- Log resolution summary for knowledge base

---

#### 7.4.3 Maintenance Lifecycle
**States**: Scheduled, In Progress, Completed, Cancelled, Incident

**State Transitions**:
```
Scheduled (initial)
  ↓ (Start time)
  In Progress / Incident (if unplanned emergency)
  ↓ (Work complete)
  Completed / Cancelled
```

**Entity Structure**:
- `id` (UUID)
- `client_id` (FK to Client)
- `project_id` (FK to Project, optional)
- `type` (enum: Scheduled, Emergency, Patch, Upgrade, Routine)
- `status` (enum: Scheduled, In Progress, Completed, Cancelled, Incident)
- `title` (string)
- `description` (text)
- `expected_duration_minutes` (int)
- `scheduled_start_time` (timestamp)
- `scheduled_end_time` (timestamp)
- `actual_start_time` (timestamp)
- `actual_end_time` (timestamp)
- `impact_level` (enum: Critical, Major, Minor, None)
- `affected_services` (JSONB array, e.g., ["API", "Website Frontend"])
- `communication_sent` (boolean, true if notification sent to clients)
- `communication_message` (text)
- `assigned_to_id` (FK to User)
- `summary` (text, what was done)
- `incident_details` (text, if type = Incident)
- `status_updated_at` (timestamp)
- `created_at`, `updated_at`

**Business Rules**:
- Scheduled maintenance requires advance client notification (7+ days)
- Notification auto-sent 24 hours before scheduled start
- Emergency/Incident maintenance created without advance notice
- Incident auto-escalates to Infra Admin
- Maintenance window tracked for uptime SLA calculations (Phase 2)
- Cannot cancel In Progress maintenance
- Completion requires summary documentation

**Validation**:
- `scheduled_end_time` > `scheduled_start_time`
- `expected_duration_minutes` > 0
- Scheduled maintenance requires ≥7 days advance notice

**Audit Requirements**:
- Log maintenance window (start/end)
- Log client communications sent
- Log impact level and affected services
- Track incident details for root cause analysis

---

### 7.5 INFRASTRUCTURE MODULE

#### 7.5.1 Domain Lifecycle
**States**: Available, Registered, Active, Suspended, Expired, Transferred, Cancelled

**State Transitions**:
```
Available (query phase)
  ↓ (Register)
  Registered
  ↓ (Setup DNS)
  Active
  ↓ (Non-payment)
  Expired / Suspended
  ↓ (Renewal)
  Active (cycle)
  ↓ (Client takeover)
  Transferred
  ↓ (Decommission)
  Cancelled
```

**Entity Structure**:
- `id` (UUID)
- `domain_name` (string, unique, e.g., "example.com")
- `client_id` (FK to Client)
- `project_id` (FK to Project, optional)
- `status` (enum: Available, Registered, Active, Suspended, Expired, Transferred, Cancelled)
- `registrar` (enum: GoDaddy, Namecheap, CloudFlare, other)
- `registrar_account_id` (string, account ref at registrar)
- `registrar_order_id` (string)
- `registered_date` (date)
- `expiration_date` (date)
- `auto_renew` (boolean, default: true)
- `renewal_cost_usd` (decimal)
- `dns_provider` (enum: Same as Registrar, CloudFlare, AWS Route53, etc.)
- `nameservers` (JSONB array, e.g., ["ns1.example.com", "ns2.example.com"])
- `dns_records` (JSONB array, for future DNS mgmt):
  - `type` (A, CNAME, MX, TXT, etc.)
  - `name` (subdomain)
  - `value`
  - `ttl`
- `registration_cost_usd` (decimal)
- `renewal_reminder_sent` (boolean)
- `renewal_reminder_sent_at` (timestamp)
- `expiration_warning_days` (int, alert if < N days to expiry)
- `assigned_to_id` (FK to User, Infra Admin)
- `notes` (text)
- `created_at`, `updated_at`

**Business Rules**:
- Domain status auto-syncs with registrar via webhook/daily job
- Auto-renewal configured by default (prevents expiration)
- Expiration alert sent 60, 30, 14, 7 days before expiry
- Cannot delete domain record (soft delete via Cancelled status)
- DNS records managed separately (Phase 2: DNS management UI)
- Domain transfer requires client authorization + cost change
- Nameserver changes require DNS propagation time (Phase 2)

**Validation**:
- `domain_name` format validation (ICANN rules)
- `expiration_date` > `registered_date`
- `renewal_cost_usd` > 0
- DNS nameservers must be valid

**Audit Requirements**:
- Log registration and renewal transactions
- Log expiration and suspension events
- Track registrar sync operations
- Log nameserver changes

---

#### 7.5.2 Hosting Lifecycle
**States**: Available, Provisioned, Active, Maintenance, Suspended, Decommissioned

**State Transitions**:
```
Available (purchase phase)
  ↓ (Provision)
  Provisioned
  ↓ (Go live)
  Active
  ↓ (Updates/patches)
  Maintenance (back to Active)
  ↓ (Non-payment)
  Suspended
  ↓ (Cleanup)
  Decommissioned
```

**Entity Structure**:
- `id` (UUID)
- `hosting_provider` (enum: AWS, Digital Ocean, Linode, Heroku, Vercel, Netlify, other)
- `account_id` (string, account ref at provider)
- `client_id` (FK to Client)
- `project_id` (FK to Project)
- `status` (enum: Available, Provisioned, Active, Maintenance, Suspended, Decommissioned)
- `plan_type` (string, e.g., "t3.small", "standard-2gb", "standard")
- `plan_cost_monthly_usd` (decimal)
- `region` (string, e.g., "us-east-1", "ap-southeast-1")
- `provisioned_date` (date)
- `active_date` (date)
- `renewal_date` (date, for annual plans)
- `auto_renew` (boolean, default: true)
- `ip_address` (string, if applicable)
- `hostname` (string, if applicable)
- `ssl_certificate_status` (enum: Active, Expired, Missing)
- `ssl_expiration_date` (date)
- `backup_enabled` (boolean)
- `backup_frequency` (enum: Daily, Weekly, Monthly)
- `backup_retention_days` (int)
- `monitoring_enabled` (boolean)
- `uptime_sla_percentage` (decimal, e.g., 99.99)
- `assigned_to_id` (FK to User, Infra Admin)
- `notes` (text)
- `created_at`, `updated_at`

**Business Rules**:
- Hosting created when Project Active
- Auto-renewal enabled to prevent service disruption
- SSL certificate monitored; alert if expiring within 30 days
- Monthly billing tracked for margin calculation
- Maintenance window logged (impact on support SLA)
- Cannot delete hosting (soft delete via Decommissioned)
- Uptime SLA tracked for reporting (Phase 2: detailed monitoring)

**Validation**:
- `plan_cost_monthly_usd` > 0
- `region` valid for provider
- `ssl_expiration_date` if SSL enabled
- `backup_retention_days` >= 7

**Audit Requirements**:
- Log provisioning operations
- Log SSL renewal/expiration events
- Log renewal date changes
- Track uptime incidents

---

#### 7.5.3 Environment Lifecycle
**States**: Development, Staging, Production, Archived

**State Transitions**:
```
Development (initial)
  ↓ (Testing ready)
  Staging
  ↓ (Client approval)
  Production
  ↓ (Decommission)
  Archived
```

**Entity Structure**:
- `id` (UUID)
- `project_id` (FK to Project)
- `client_id` (FK to Client)
- `environment_name` (string, e.g., "Dev", "Staging", "Production")
- `status` (enum: Development, Staging, Production, Archived)
- `environment_type` (enum: Dev, Staging, Production)
- `hosting_id` (FK to Hosting, if applicable)
- `domain_id` (FK to Domain, if applicable)
- `database_name` (string)
- `database_host` (string)
- `database_backup_enabled` (boolean)
- `environment_url` (string, e.g., "https://staging.example.com")
- `is_client_visible` (boolean)
- `access_credentials` (encrypted JSON, for Phase 2):
  - `username`, `password`, `api_key`, etc.
- `deployment_method` (enum: Manual, Git Push, CI/CD Pipeline)
- `last_deployment_at` (timestamp)
- `last_deployed_by_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Development environment created when Project starts
- Staging created when first milestone approaching client review
- Production created when contract complete and hosting active
- Client-visible environments only Production (Phase 2: staging preview)
- Credentials encrypted and audited
- Deployment tracked for version control
- Cannot delete environment (soft delete via Archived)

**Validation**:
- `environment_name` required, unique per project
- `environment_url` valid HTTP URL if provided
- `deployment_method` matches actual process

**Audit Requirements**:
- Log environment creation and status transitions
- Log credential access (encrypted log)
- Track deployments and deployment triggers

---

### 7.6 PERFORMANCE & ANALYTICS MODULE

#### 7.6.1 Analytics Dashboard & Reporting
**Not a lifecycle entity, but a feature framework**

**Dashboards (Real-time + Scheduled Reports)**:

1. **Executive Dashboard**
   - Revenue YTD, MoM growth
   - Project status overview (% complete)
   - Top clients by revenue
   - Overdue invoices
   - Support SLA compliance

2. **Sales Dashboard**
   - Inquiry funnel (New → Qualified → Quoted → Contracted)
   - Pipeline value by stage
   - Conversion rate by source
   - Average deal size
   - Sales forecast vs actual

3. **Project Dashboard**
   - Projects in-progress count
   - Avg project duration vs estimated
   - Revision count vs limit
   - Milestone completion rate
   - Resource utilization

4. **Finance Dashboard**
   - Total revenue, invoiced, paid
   - DSO (Days Sales Outstanding)
   - Overdue invoice aging
   - Payment method breakdown
   - Monthly recurring revenue (MRR)

5. **Support Dashboard**
   - Open tickets, resolution rate
   - SLA compliance %
   - Avg response time, resolution time
   - Top ticket categories

6. **Team Dashboard**
   - Resource utilization %
   - Task completion rate
   - Billable vs non-billable hours
   - Team capacity vs assigned

**Report Entity**:
- `id` (UUID)
- `report_name` (string)
- `report_type` (enum: Executive, Sales, Project, Finance, Support, Team)
- `status` (enum: Draft, Scheduled, Generated)
- `frequency` (enum: On-demand, Weekly, Monthly, Quarterly)
- `schedule_day` (int, day of week or month)
- `schedule_time` (time)
- `recipients` (JSONB array of email addresses)
- `last_generated_at` (timestamp)
- `next_generation_at` (timestamp)
- `format` (enum: PDF, Excel, Email HTML)
- `filters` (JSONB, e.g., date_range, client_id, project_id)
- `created_by_id` (FK to User)
- `created_at`, `updated_at`

**Business Rules**:
- Scheduled reports auto-generate and email
- On-demand reports generated immediately
- Filters enforce row-level security (client users see own data only)
- Historical data retained for trend analysis (12 months minimum)

---

#### 7.6.2 KPI Framework
**Key metrics tracked automatically**:

| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| **Sales Conversion** | Contracts / Inquiries | 25% | Monthly |
| **DSO (Days Sales Outstanding)** | (Accounts Receivable / Revenue) * 30 | 22 days | Daily |
| **Invoice Payment Rate** | Paid Invoices / Total Invoices | 95% | Monthly |
| **Project Completion %** | Completed Milestones / Total Milestones | 98% | Monthly |
| **Avg Project Duration** | (Actual Duration - Estimated) / Estimated | ±5% | Monthly |
| **Revision Rate** | Total Revisions / Total Milestones | < 1.5 | Monthly |
| **Support SLA Compliance** | Resolved Within SLA / Total Resolved | 95% | Weekly |
| **Support Resolution Time** | (Closed - Created) in hours | <7d avg | Weekly |
| **Resource Utilization** | Billable Hours / Available Hours | 75% | Weekly |
| **Margin %** | (Revenue - Costs) / Revenue | 40% | Monthly |
| **Client Satisfaction** | Tickets reopened / Closed | < 5% | Monthly |
| **Uptime %** | Service availability / Total time | 99% | Daily |

**KPI Calculation Entity**:
- `id` (UUID)
- `kpi_name` (string)
- `calculation_date` (date)
- `value` (decimal)
- `target_value` (decimal)
- `variance_percentage` (decimal, calculated)
- `trend` (enum: Up, Down, Stable)
- `data_points` (JSONB, raw data for audit)
- `created_at`

---

#### 7.6.3 Team & Resource Lifecycle
**States**: Onboarded, Active, On Leave, Offboarded

**Entity Structure**:
- `id` (UUID)
- `user_id` (FK to User)
- `name` (string)
- `email` (string)
- `role` (enum: from role matrix above)
- `position_type` (enum: Full-time, Part-time, Contractor)
- `status` (enum: Onboarded, Active, On Leave, Offboarded)
- `department` (string, e.g., "Development", "Design")
- `join_date` (date)
- `leave_dates` (JSONB array, for Phase 2 leave management):
  - `start_date`, `end_date`, `type`
- `hourly_rate_usd` (decimal, optional for billable calculation)
- `billable_hours_per_week` (int, default: 40)
- `skills` (JSONB array, e.g., ["React", "Node.js", "UI Design"])
- `current_projects` (JSONB array of project_ids)
- `total_billable_hours_ytd` (decimal, calculated)
- `utilization_percentage` (decimal, calculated)
- `created_at`, `updated_at`

**Business Rules**:
- Team member capacity affected by on-leave status
- Utilization calculated from assigned task hours
- Billable hours tracked for margin calculation
- Offboarded members archived (cannot be deleted)

---

## 8. FUNCTIONAL REQUIREMENTS (Phase 1)

### Requirement Naming Convention
`{MODULE}-{TYPE}-{SEQUENCE}` where:
- MODULE: CRM, FIN, PRJ, SUP, INF, ANA
- TYPE: UI, API, CALC, VAL, NOTIF
- SEQUENCE: 001, 002, etc.

---

### 8.1 CRM Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| CRM-UI-001 | Client List | Display paginated table of clients with filters by status, industry, location | High |
| CRM-UI-002 | Client Detail | Show client profile, contact history, projects, invoices, tickets | High |
| CRM-UI-003 | Inquiry Form | Create inquiry with title, description, budget estimate, source | High |
| CRM-UI-004 | Inquiry List | Filter inquiries by status, sales manager, date range | High |
| CRM-UI-005 | Quotation Builder | Drag-drop line items, auto-calculate totals with 11% PPN tax | High |
| CRM-UI-006 | Quotation Send | Email quotation to client with PDF attachment, mark as Sent | High |
| CRM-API-001 | Inquiry CRUD | REST endpoints for Create, Read, Update, Delete inquiry | High |
| CRM-API-002 | Quotation CRUD | REST endpoints for quotation management | High |
| CRM-API-003 | Contract Signature | API to upload signed contract PDF and mark as Signed | High |
| CRM-CALC-001 | Quotation Totals | Auto-calculate subtotal, tax (11%), final total from line items | High |
| CRM-CALC-002 | Inquiry → Quotation | Auto-populate quotation from inquiry budget estimate | Medium |
| CRM-VAL-001 | Email Validation | Validate email format, check duplicates per client | High |
| CRM-NOTIF-001 | Inquiry Alert | Email sales team when new inquiry created | High |
| CRM-NOTIF-002 | Quotation Send | Email client with quotation link + PDF | High |
| CRM-NOTIF-003 | Quotation Expiration | Email client 3 days before quotation expires | Medium |

---

### 8.2 Finance Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| FIN-UI-001 | Invoice List | Display invoices with filters by status, client, date range, amount | High |
| FIN-UI-002 | Invoice Detail | Show line items, payment history, overdue status, payment reminder log | High |
| FIN-UI-003 | Invoice Create | Auto-create invoice from approved milestone with line items from contract | High |
| FIN-UI-004 | Invoice Send | Email invoice to client with PDF, mark as Sent | High |
| FIN-UI-005 | Payment Record | Manually upload payment proof (bank transfer screenshot), await finance approval | High |
| FIN-UI-006 | Payment Verify | Finance staff approves payment, updates invoice status to Paid | High |
| FIN-UI-007 | Refund Request | Client initiates refund with reason; finance reviews and approves/rejects | High |
| FIN-UI-008 | Financial Dashboard | Show revenue YTD, invoiced, paid, overdue, DSO | High |
| FIN-API-001 | Invoice CRUD | REST endpoints for invoice management | High |
| FIN-API-002 | Payment Webhook | Receive webhooks from Midtrans/Xendit, auto-verify payment | High |
| FIN-API-003 | Payment Idempotency | Detect duplicate webhooks using idempotency_key, prevent double-counting | High |
| FIN-CALC-001 | Invoice Totals | Auto-calculate subtotal, 11% PPN tax, discount, final total | High |
| FIN-CALC-002 | DSO Calculation | Calculate Days Sales Outstanding = (AR / Revenue) * 30 | High |
| FIN-VAL-001 | Payment Amount | Validate payment amount matches invoice (allow partial payments) | High |
| FIN-VAL-002 | Refund Limit | Cannot refund more than original invoice amount | High |
| FIN-NOTIF-001 | Invoice Send | Email invoice to client with payment instructions | High |
| FIN-NOTIF-002 | Overdue Alert | Auto-email client at +7, +14, +21 days past due | High |
| FIN-NOTIF-003 | Payment Received | Email client when payment received and verified | High |
| FIN-NOTIF-004 | Refund Status | Email client when refund approved/rejected | Medium |

---

### 8.3 Project & Delivery Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| PRJ-UI-001 | Project List | Display projects with filters by status, PM, client, date range | High |
| PRJ-UI-002 | Project Detail | Show milestones, tasks, revision count, progress bar | High |
| PRJ-UI-003 | Milestone List | Display milestones with status, due date, assigned dev, acceptance criteria | High |
| PRJ-UI-004 | Milestone Submit | Dev marks milestone complete; PM reviews and approves/rejects | High |
| PRJ-UI-005 | Task Board | Kanban view (Backlog → To Do → In Progress → In Review → Completed) | High |
| PRJ-UI-006 | Task Detail | Show title, description, assigned to, due date, time entries, linked revision | High |
| PRJ-UI-007 | Revision Request | Client submits revision with title, description, reason | High |
| PRJ-UI-008 | Revision List | PM reviews pending revisions, acknowledges (in scope) or rejects (out of scope) | High |
| PRJ-UI-009 | Asset Upload | Dev uploads file (design, code, document); stores with version number | High |
| PRJ-UI-010 | Asset Approval | PM approves asset; client-visible toggleable | High |
| PRJ-API-001 | Project CRUD | REST endpoints for project management | High |
| PRJ-API-002 | Milestone CRUD | REST endpoints for milestone management | High |
| PRJ-API-003 | Task CRUD | REST endpoints for task management | High |
| PRJ-API-004 | Revision CRUD | REST endpoints for revision management | High |
| PRJ-API-005 | Asset Upload | File upload endpoint with multipart/form-data, virus scan (Phase 2) | High |
| PRJ-CALC-001 | Revision Remaining | Calculate revision_requests_remaining = revision_limit - revision_count | High |
| PRJ-CALC-002 | Project Progress | Calculate progress % = completed_milestones / total_milestones * 100 | High |
| PRJ-CALC-003 | Budget Spent | Sum task hours * hourly rate (Phase 2) | Medium |
| PRJ-VAL-001 | Revision Limit | Enforce revision count <= contract revision_limit | High |
| PRJ-VAL-002 | Task Assignment | Cannot assign task to user unless they are on project team | High |
| PRJ-NOTIF-001 | Milestone Submit | Notify PM when milestone submitted for approval | High |
| PRJ-NOTIF-002 | Revision Request | Notify PM when client submits revision | High |
| PRJ-NOTIF-003 | Task Assign | Notify dev when task assigned | High |
| PRJ-NOTIF-004 | Milestone Approve | Notify client when milestone approved | High |

---

### 8.4 Support Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| SUP-UI-001 | Ticket List | Display tickets with filters by status, priority, client, SLA breach | High |
| SUP-UI-002 | Ticket Detail | Show title, description, priority, assigned agent, SLA deadline, internal notes | High |
| SUP-UI-003 | Ticket Create | Support agent creates ticket or auto-creates from email | High |
| SUP-UI-004 | Ticket Assign | Assign ticket to support agent; notify agent | High |
| SUP-UI-005 | Ticket Update | Add internal notes, change status, update priority | High |
| SUP-UI-006 | SLA Policy List | Admin creates/edits SLA policies with response/resolution times | High |
| SUP-API-001 | Ticket CRUD | REST endpoints for ticket management | High |
| SUP-API-002 | Email to Ticket | Auto-create ticket from incoming email (Phase 1: manual, Phase 2: mail server integration) | Medium |
| SUP-CALC-001 | SLA Response Deadline | response_deadline = created_at + response_time_for_priority | High |
| SUP-CALC-002 | SLA Resolution Deadline | resolution_deadline = created_at + resolution_time_for_priority | High |
| SUP-CALC-003 | Response Time | actual_response_time = acknowledged_at - created_at (in minutes) | High |
| SUP-VAL-001 | SLA Breach Check | Compare acknowledged_at / resolved_at against deadlines | High |
| SUP-NOTIF-001 | Ticket Created | Email assigned agent when ticket created | High |
| SUP-NOTIF-002 | SLA Breach | Alert support lead when SLA deadline approaching (2 hours before) | High |
| SUP-NOTIF-003 | Ticket Resolved | Email client when ticket resolved | Medium |

---

### 8.5 Infrastructure Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| INF-UI-001 | Domain List | Display domains with registrar, expiration date, status | High |
| INF-UI-002 | Domain Detail | Show registration/expiration dates, auto-renew setting, DNS nameservers | High |
| INF-UI-003 | Hosting List | Display hosting with provider, plan, region, monthly cost | High |
| INF-UI-004 | Hosting Detail | Show active date, SSL status/expiration, backup settings, monitoring | High |
| INF-UI-005 | Environment List | Display dev/staging/production environments for project | Medium |
| INF-UI-006 | Environment Detail | Show domain, hosting, deployment method, last deploy date/user | Medium |
| INF-API-001 | Domain CRUD | REST endpoints for domain management | High |
| INF-API-002 | Hosting CRUD | REST endpoints for hosting management | High |
| INF-API-003 | Environment CRUD | REST endpoints for environment management | Medium |
| INF-VAL-001 | Domain Name | Validate domain format (ICANN rules) | High |
| INF-VAL-002 | Expiration Date | Validate renewal_date > registered_date | High |
| INF-NOTIF-001 | Domain Expiration | Email infra team at 60, 30, 14, 7 days before expiration | High |
| INF-NOTIF-002 | SSL Expiration | Email infra team when SSL cert expiring within 30 days | High |
| INF-NOTIF-003 | Maintenance Window | Email clients 24 hours before scheduled maintenance | Medium |

---

### 8.6 Analytics & Reporting Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| ANA-UI-001 | Executive Dashboard | Show YTD revenue, project status, overdue invoices, support SLA compliance | High |
| ANA-UI-002 | Sales Dashboard | Show inquiry funnel, pipeline value, conversion rate, forecast | Medium |
| ANA-UI-003 | Project Dashboard | Show project status, milestone completion %, average duration | Medium |
| ANA-UI-004 | Finance Dashboard | Show revenue, invoiced, paid, DSO, payment method breakdown | High |
| ANA-UI-005 | Support Dashboard | Show open tickets, resolution rate, SLA compliance, avg response time | High |
| ANA-UI-006 | Team Dashboard | Show resource utilization, task completion, billable hours (Phase 2) | Medium |
| ANA-UI-007 | Report Generate | On-demand PDF/Excel export of any dashboard | High |
| ANA-API-001 | Dashboard Data | REST endpoints to fetch dashboard data with date filters | High |
| ANA-API-002 | Report Schedule | API to create scheduled reports (weekly/monthly), auto-email | Medium |
| ANA-CALC-001 | KPI Calculation | Auto-calculate all KPIs in KPI framework daily | High |
| ANA-VAL-001 | Data Accuracy | Validate KPI calculations against source data (spot checks) | High |

---

### 8.7 Cross-Module Requirements

| ID | Feature | Requirement | Priority |
|----|---------|-----------|---------| 
| CROSS-AUTH-001 | Login | Support email + password authentication, session tokens, remember me | High |
| CROSS-AUTH-002 | Role-Based Access | Enforce RBAC from role & permission matrix | High |
| CROSS-AUTH-003 | Row-Level Access | Client users see only own data (filtered by client_id) | High |
| CROSS-AUDIT-001 | Audit Log | Log all state transitions with user_id, timestamp, old_value, new_value | High |
| CROSS-AUDIT-002 | Audit Query | Admin can query audit logs by entity, user, date range | High |
| CROSS-NOTIF-001 | Email Notifications | Send emails via SendGrid/AWS SES with HTML templates | High |
| CROSS-NOTIF-002 | Email Queue | Async email sending via task queue (Bull/Celery) | High |
| CROSS-EXPORT-001 | PDF Export | Generate professional PDF for invoice, proposal, contract, report | High |
| CROSS-EXPORT-002 | Excel Export | Generate Excel for dashboards, lists, reports | Medium |
| CROSS-SEARCH-001 | Global Search | Search clients, projects, tickets, contracts by keyword | Medium |
| CROSS-API-DOCS-001 | API Documentation | Swagger/OpenAPI documentation of all endpoints | High |

---

## 9. NON-FUNCTIONAL REQUIREMENTS

### 9.1 Performance
- **Page Load Time**: < 3 seconds for dashboard, < 2 seconds for list views
- **API Response Time**: < 500ms for 95th percentile
- **Database Query**: < 100ms for indexed queries, < 1s for complex aggregations
- **Concurrent Users**: Support 50 concurrent users without degradation
- **File Upload**: Support files up to 500MB, > 50 Mbps throughput (Phase 2: S3 multipart)
- **Report Generation**: Dashboard reports generate within 5 seconds, scheduled reports within 30 seconds

### 9.2 Scalability
- **Database**: PostgreSQL single instance, ready for read replicas at 10K+ clients
- **Caching**: Redis for session, query results, rate limiting
- **Horizontal Scaling**: Architecture supports horizontal scaling (stateless API)
- **Rate Limiting**: 100 requests/minute per user to prevent abuse

### 9.3 Availability & Reliability
- **Uptime SLA**: 99% (Phase 1: best effort, Phase 2: SLA with automated failover)
- **Backup**: Daily automated backup with 30-day retention
- **Recovery Time Objective (RTO)**: 4 hours (Phase 2: 1 hour)
- **Recovery Point Objective (RPO)**: 1 day (Phase 2: 1 hour)
- **Error Handling**: Graceful error messages, no stack traces to client
- **Data Consistency**: ACID transactions for financial operations

### 9.4 Security
- **Authentication**: JWT + session-based, 30-minute idle timeout
- **Authorization**: RBAC + row-level access control (SQL WHERE clauses)
- **Encryption**: TLS 1.2+ for data in transit, AES-256 for sensitive data at rest (Phase 2)
- **Password Policy**: Min 8 chars, complexity rules, no reuse of last 5 passwords
- **Data Protection**: PII logging disabled (only hashed email), GDPR/UU PDP compliance
- **Secrets Management**: Environment variables, no hardcoded credentials (Phase 2: vault)
- **SQL Injection**: Parameterized queries, ORM usage mandatory
- **CSRF Protection**: CSRF tokens on all state-changing forms
- **XSS Prevention**: Content Security Policy headers, input sanitization
- **Rate Limiting**: 5 failed logins = 15-minute lockout

### 9.5 Compliance
- **UU PDP (Indonesia Data Privacy Law)**: 
  - Consent tracking for data processing
  - Data deletion API for customer requests
  - Audit logging of personal data access
- **Tax Compliance**:
  - PPN 11% auto-calculated on invoices
  - NPWP capture for company clients
  - Tax data export for accounting/auditor
  - Invoice data retention: 30 years
- **Data Retention**: 
  - Active data: indefinite
  - Deleted/archived data: 90 days before hard delete
  - Audit logs: 7 years (tax audit requirement)

### 9.6 Usability
- **Mobile Responsive**: 100% responsive design for mobile (client portal)
- **Accessibility**: WCAG 2.1 Level AA compliance (Phase 2)
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Offline Mode**: None (Phase 2: limited offline task creation)
- **Dark Mode**: Not Phase 1; Phase 2 nice-to-have

### 9.7 Maintainability
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Test Coverage**: >80% for critical paths (CRM, Finance, Project)
- **Documentation**: Inline code comments, API docs (Swagger), deployment runbook
- **Logging**: Structured logging (JSON), severity levels (DEBUG, INFO, WARN, ERROR)
- **Monitoring**: Prometheus metrics, Grafana dashboards (error rates, latency, disk usage)
- **Deployment**: Blue-green deployment, automated rollback on failure

---

## 10. DATA MODEL OVERVIEW

> **Note:** For the complete Entity Relationship Diagram (ERD), table definitions, and SQL schema, please refer to **[Database Schema Design](docs/database-schema.md)**.

### Core Entities (Summary)

```
┌─────────────────┐
│     User        │ (Internal + Client)
├─────────────────┤
│ id              │
│ email           │
│ role            │
│ status          │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
      ┌──▼──────┐    ┌────▼─────┐
      │  Client │    │ Dashboard │
      └─────────┘    └───────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
┌───▼──────┐          ┌──────────▼──┐
│  Inquiry │          │   Project   │
└───┬──────┘          └──┬───────────┘
    │                    │
┌───▼──────┐       ┌─────▼──────┐
│Quotation │       │ Milestone  │
└───┬──────┘       └─────┬──────┘
    │                    │
┌───▼──────┐       ┌─────▼──────┐
│Proposal  │       │    Task    │
└───┬──────┘       └─────┬──────┘
    │                    │
┌───▼──────┐       ┌─────▼──────┐
│ Contract │       │   Asset    │
└───┬──────┘       └────────────┘
    │
┌───▼──────┐
│ Invoice  │
└───┬──────┘
    │
┌───▼──────┐
│ Payment  │
└──────────┘
```

### Key Tables & Indexes

**users**: id (PK), email (UNIQUE), role, status
**clients**: id (PK), email (UNIQUE), status, deleted_at
**inquiries**: id (PK), client_id (FK, IX), status (IX), created_at (IX)
**quotations**: id (PK), inquiry_id (FK, IX), client_id (FK, IX), status (IX)
**proposals**: id (PK), quotation_id (FK, IX), client_id (FK, IX), status (IX)
**contracts**: id (PK), proposal_id (FK, IX), client_id (FK, IX), project_id (FK, IX), status (IX)
**projects**: id (PK), contract_id (FK, IX), client_id (FK, IX), status (IX)
**milestones**: id (PK), project_id (FK, IX), client_id (FK, IX), status (IX), due_date (IX)
**tasks**: id (PK), project_id (FK, IX), milestone_id (FK, IX), client_id (FK, IX), status (IX), assigned_to_id (FK, IX)
**revisions**: id (PK), milestone_id (FK, IX), client_id (FK, IX), status (IX), created_at (IX)
**assets**: id (PK), project_id (FK, IX), client_id (FK, IX), status (IX), created_at (IX)
**invoices**: id (PK), client_id (FK, IX), contract_id (FK, IX), status (IX), due_date (IX), created_at (IX)
**payments**: id (PK), invoice_id (FK, IX), status (IX), provider_reference_id (UNIQUE)
**refunds**: id (PK), invoice_id (FK, IX), client_id (FK, IX), status (IX), created_at (IX)
**support_tickets**: id (PK), client_id (FK, IX), project_id (FK, IX), status (IX), sla_policy_id (FK), sla_response_deadline (IX), sla_resolution_deadline (IX)
**sla_policies**: id (PK), status (IX)
**domains**: id (PK), client_id (FK, IX), status (IX), expiration_date (IX)
**hosting**: id (PK), client_id (FK, IX), project_id (FK, IX), status (IX), renewal_date (IX)
**environments**: id (PK), project_id (FK, IX), client_id (FK, IX), status (IX)
**audit_logs**: id (PK), entity_type (IX), entity_id (IX), user_id (FK, IX), created_at (IX)

---

## 11. KPI & REPORTING FRAMEWORK

### Executive KPIs (Monthly Board Report)

| KPI | Calculation | Target | Red Flag |
|-----|-----------|--------|----------|
| MRR (Monthly Recurring Revenue) | Sum of active contract monthly value | Target varies | < 80% of target |
| Gross Margin | (Revenue - Cost of Goods Sold) / Revenue | 40% | < 35% |
| DSO (Days Sales Outstanding) | (AR / Revenue) * 30 | 22 days | > 45 days |
| Conversion Rate | (Contracts Signed / Inquiries) * 100 | 25% | < 20% |
| Project Delivery On-Time | (On-Time / Total) * 100 | 95% | < 90% |
| Support SLA Compliance | (Resolved Within SLA / Total) * 100 | 95% | < 85% |
| Resource Utilization | (Billable Hours / Available Hours) * 100 | 75% | < 65% |
| Refund Rate | (Refunded Invoices / Total Invoices) * 100 | < 2% | > 5% |

### Operational Dashboards (Weekly)

1. **Revenue Dashboard**: Invoiced vs Paid this week, YTD progress, forecast vs actual
2. **Project Dashboard**: % Milestones on-time, revisions pending, resources idle
3. **Support Dashboard**: Open tickets, SLA at-risk, response time trend
4. **Finance Dashboard**: Collection pipeline, DSO trend, top overdue clients
5. **Team Dashboard**: Utilization by person, task completion rate, billable vs non-billable

### Alerts & Thresholds (Real-time)

- **Invoice Overdue**: Alert finance when any invoice > 14 days overdue
- **SLA At-Risk**: Alert support when ticket SLA deadline < 2 hours
- **Domain Expiration**: Alert infra when domain expires in < 30 days
- **Project Delay**: Alert PM when milestone passes due_date without approval
- **Revision Limit**: Alert PM when revision_count >= 80% of limit
- **Payment Failed**: Alert client when payment verification fails

---

## 12. RISK ANALYSIS & MITIGATION

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Database performance degrades as scale grows | Medium | High | Implement query optimization, add indexes, plan read replicas at 10K clients |
| Payment webhook duplicate processing | Low | High | Implement idempotency_key, detect via provider_reference_id + invoice_id |
| Data loss from backup failure | Low | Critical | Test backup restore weekly, maintain 30-day retention, document RTO/RPO |
| API rate limiting bypass by bot | Medium | Medium | Implement IP-based + user-based rate limiting, CAPTCHA on login attempts |
| File upload virus/malware | Low | High | Scan files with ClamAV (Phase 2), whitelist extensions, sandbox uploads |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Client disputes on revision limits | Medium | Medium | Document revision limit in contract upfront, track revisions in real-time in portal |
| Scope creep on projects | High | Medium | Enforce revision limits, create tracking for change requests, require approval before work |
| Pricing accuracy errors (tax miscalc) | Low | Medium | Implement tax calculation QA, test edge cases (discount + tax), audit invoices quarterly |
| SLA breach leading to customer churn | Medium | High | Monitor SLA compliance weekly, automate escalation, staff support adequately |
| Resource overallocation leading to delays | Medium | Medium | Implement capacity planning dashboard, track utilization weekly, block over-allocation |

### Compliance Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| UU PDP violation (data breach) | Low | Critical | Encrypt sensitive data, limit access to admins, audit data access monthly |
| Tax audit findings (PPN miscalc) | Low | High | Implement 11% auto-calculation, test on sample invoices, document tax logic |
| Invoice retention violation | Low | Medium | Implement 30-year data retention for invoices, automate archival |

---

## 13. ROLLOUT STRATEGY

> **Detailed Roadmap**: For the complete weekly task breakdown, deliverables, and dependency graph, please refer to **[Project Roadmap & Phased Execution Plan](docs/project-roadmap.md)**.

### Phase 1: Accelerated Delivery (8 Weeks)

#### Phase 1.1: Foundation & Core Architecture (Weeks 1-2)
- **Goal**: Production-ready infrastructure, CI/CD, and core Auth/User systems.
- **Key Deliverables**:
  - Docker Compose & PostgreSQL/Redis setup.
  - NestJS Monorepo structure.
  - Auth Service (JWT, RBAC, RLS policies).
  - User & Client Management Modules.

#### Phase 1.2: Core Domain Logic (Weeks 3-5)
- **Goal**: Operational business logic for Sales, Finance, and Projects.
- **Key Deliverables**:
  - CRM Module (Inquiry -> Contract).
  - Finance Module (Invoice -> Payment -> Tax).
  - Project Module (Milestones, Tasks, Kanban).
  - Internal Admin Dashboard (React/Vite).

#### Phase 1.3: Support & Infrastructure (Week 6)
- **Goal**: Customer support and asset management.
- **Key Deliverables**:
  - Support Ticket System with SLA engine.
  - Asset Management (S3 integration).
  - Infrastructure Tracking (Domains/Hosting).

#### Phase 1.4: Polish, Client Portal & Launch (Weeks 7-8)
- **Goal**: External facing features and production deployment.
- **Key Deliverables**:
  - Client Portal (Restricted views).
  - Reporting & Analytics Dashboards.
  - E2E Testing & Security Audit.
  - **Go Live**.

### Post-Launch (Month 3-6)
- Monitor KPIs and gather feedback
- Plan Phase 2 features (security, integrations, automation, knowledge management)
- Scale database if needed
- Implement additional reports and dashboards based on user feedback
- Plan multi-currency and multi-language support (Phase 2)

---

## 14. DETAILED DESIGN DOCUMENTS

For in-depth technical specifications, please refer to the following SRP-aligned documentation:

| Document | Description |
|----------|-------------|
| **[Project Roadmap](docs/project-roadmap.md)** | 8-week phased execution plan, weekly deliverables, and critical path. |
| **[System Architecture](docs/system-architecture.md)** | High-level system design, C4 diagrams, and technology stack decisions. |
| **[Frontend Architecture](docs/frontend-architecture.md)** | React/Vite architecture, component patterns, state management, and performance strategy. |
| **[Backend Architecture](docs/backend-architecture.md)** | NestJS modular monolith design, API patterns, database strategy, and DTO standards. |
| **[Database Schema](docs/database-schema.md)** | Complete ERD, entity relationships, constraints, and RLS policies. |
| **[API Specification](docs/api-specification.md)** | REST API endpoints, request/response schemas (JSend), and OpenAPI spec. |
| **[Security Architecture](docs/security-architecture.md)** | Authentication flows, RBAC/RLS implementation, data protection, and compliance (UU PDP). |
| **[Deployment & Infrastructure](docs/deployment-infrastructure.md)** | Docker setup, CI/CD pipelines (GitHub Actions), and cloud infrastructure. |
| **[Testing Strategy](docs/testing-strategy.md)** | Testing pyramid, tools (Vitest, Playwright), and QA processes. |
| **[Domain State Machines](docs/domain-state-machines.md)** | Visual workflow diagrams for all business entities (Sales, Projects, Finance, Support). |
| **[Development Standards](docs/development-standards.md)** | Coding guidelines, git workflow, and contribution protocols. |
| **[UI/UX Documentation](UI_UX_Documentation_Agency_Portal.md)** | Design system, component specs, accessibility standards, and wireframes. |

---

## 15. GLOSSARY & DEFINITIONS

| Term | Definition |
|------|-----------|
| **Agency** | Website development company (5-20 people) |
| **Client** | External customer purchasing services |
| **Inquiry** | Initial sales lead from prospect |
| **Quotation** | Pricing document with line items, PPN tax |
| **Proposal** | Detailed scope of work, deliverables, timeline, payment schedule |
| **Contract** | Legal agreement signed by both parties; triggers project creation |
| **Project** | Collection of milestones to deliver contractual deliverables |
| **Milestone** | Client-facing deliverable with acceptance criteria and approval gate |
| **Task** | Work item assigned to developer, may or may not be client-visible |
| **Revision** | Change request from client after deliverable submission |
| **Asset** | File (design, code, document) uploaded and versioned |
| **Invoice** | Bill to client for completed milestone, requires payment |
| **Payment** | Receipt of funds from client, verified by finance |
| **Refund** | Return of payment to client due to refund/dispute |
| **Ticket** | Support request from client, tracked with SLA |
| **SLA** | Service Level Agreement defining response/resolution times |
| **Domain** | Internet domain name (e.g., example.com) |
| **Hosting** | Server infrastructure running project (AWS, DigitalOcean, etc.) |
| **Environment** | Dev/Staging/Production instance of deployed project |
| **DSO** | Days Sales Outstanding; average time to collect payment |
| **PPN** | Pajak Pertambahan Nilai (Indonesia VAT, 11%) |
| **NPWP** | Nomor Pokok Wajib Pajak (Indonesian tax ID) |
| **UU PDP** | Undang-Undang Perlindungan Data Pribadi (Indonesia data privacy law) |
| **RBAC** | Role-Based Access Control; permissions assigned to roles |
| **RTO** | Recovery Time Objective; max acceptable downtime |
| **RPO** | Recovery Point Objective; max acceptable data loss |
| **Idempotency** | Operation produces same result if executed multiple times |

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Product Team | Initial PRD for Phase 1 development |

---

## APPROVAL & SIGN-OFF

- [ ] Product Manager
- [ ] CTO / Lead Engineer
- [ ] Finance Manager
- [ ] Sales Manager
- [ ] Client (if applicable)

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

