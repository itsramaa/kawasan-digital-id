# Project Roadmap: Agency Internal Operations + Client Portal

This document outlines the phased execution strategy for the Agency Internal Operations + Client Portal system. The roadmap is structured over 8 weeks, ensuring a logical progression from architectural foundation to production deployment.

## Phase 1: Foundation & Core Architecture (Weeks 1-2)

**Goal:** Establish the technical groundwork, development environment, and core system utilities.

### Week 1: System Setup & Architecture
- **Infrastructure as Code (IaC)**
  - [ ] Initialize Git repository with `monorepo` structure (or modular monolith).
  - [ ] Set up Docker Compose for local development (PostgreSQL, Redis, MinIO).
  - [ ] Configure CI/CD pipeline (GitHub Actions) for linting and unit tests.
- **Backend Core**
  - [ ] Initialize NestJS project with strict TypeScript configuration.
  - [ ] Implement Global Error Handling and Logging (Winston/Pino).
  - [ ] Set up Database connection (Prisma/TypeORM) with migration system.
  - [ ] Implement Redis connection for caching and queues.
- **Frontend Foundation**
  - [ ] Initialize Vite + React + TypeScript projects (Internal & Client).
  - [ ] Configure Tailwind CSS and shadcn/ui component library.
  - [ ] Set up routing (React Router) and state management (Zustand/Query).
  - [ ] Implement "Theme Provider" and basic layout shells.

### Week 2: Authentication & Security
- **Identity Management**
  - [ ] Design and implement `users` table with RBAC roles.
  - [ ] Implement JWT Auth Guard (Access/Refresh tokens).
  - [ ] Build Auth API: Login, Register, Forgot Password, Refresh Token.
  - [ ] Implement Rate Limiting (ThrottlerGuard) and Helmet security headers.
- **Frontend Auth Integration**
  - [ ] Create Login/Register forms with Zod validation.
  - [ ] Implement Protected Routes and Role-based Route Guards.
  - [ ] Integrate Auth hooks (useAuth) with Axios interceptors for token refresh.

## Phase 2: Core Domain Logic (Weeks 3-5)

**Goal:** Implement the primary business modules: CRM, Projects, and Finance.

### Week 3: CRM & Client Management
- **Backend (CRM Module)**
  - [ ] Implement `clients` CRUD with RLS policies (Client vs Internal view).
  - [ ] Implement `inquiries` and `quotations` logic.
  - [ ] Create PDF generation service for Quotations.
- **Frontend (CRM UI)**
  - [ ] Build Client List and Detail views.
  - [ ] Create Inquiry Kanban/List view.
  - [ ] Build Quotation Editor (dynamic line items).

### Week 4: Project Management Engine
- **Backend (Project Module)**
  - [ ] Implement `projects`, `milestones`, and `tasks` entities.
  - [ ] Create state machine logic for Project Lifecycle.
  - [ ] Implement "Revision Request" flow.
- **Frontend (Project Dashboard)**
  - [ ] Build Project Overview dashboard (Internal & Client views).
  - [ ] Implement Milestone tracker and Task Kanban board.
  - [ ] Create File Upload interface for project assets.

### Week 5: Finance & Invoicing
- **Backend (Finance Module)**
  - [ ] Implement `invoices` generation logic (from Milestones).
  - [ ] Integrate Payment Gateway Webhooks (Midtrans/Xendit) simulation.
  - [ ] Implement "Overdue" cron job for notifications.
- **Frontend (Finance UI)**
  - [ ] Build Invoice management table.
  - [ ] Create Invoice Detail view with "Pay Now" button (Client).
  - [ ] Implement Revenue Dashboard charts (Recharts).

## Phase 3: Support & Infrastructure (Week 6)

**Goal:** Add support ticketing and infrastructure management capabilities.

### Week 6: Support & Infra
- **Support Module**
  - [ ] Implement `tickets` CRUD with commenting system.
  - [ ] Build Ticket list with SLA countdown indicators.
- **Infrastructure Module**
  - [ ] Implement `domains` and `hosting` tracking.
  - [ ] Create Expiration Alert cron jobs.
- **Notification System**
  - [ ] Finalize Email Service (SendGrid/SES) integration.
  - [ ] Implement In-App Notification center.

## Phase 4: Polish, QA & Launch (Weeks 7-8)

**Goal:** Rigorous testing, optimization, and production deployment.

### Week 7: Testing & Optimization
- **Quality Assurance**
  - [ ] Write Integration Tests for critical flows (Auth, Payment, Project).
  - [ ] Perform User Acceptance Testing (UAT) simulation.
  - [ ] Security Audit: OWASP ZAP scan, Dependency check.
- **Performance Tuning**
  - [ ] Optimize Database queries (Indexes, Explain Analyze).
  - [ ] Implement Response Caching for public/static data.
  - [ ] Frontend bundle optimization (Lazy loading, Code splitting).

### Week 8: Deployment & Handover
- **Production Infrastructure**
  - [ ] Provision Production Database (Managed RDS/Postgres).
  - [ ] Set up Object Storage (S3) with lifecycle policies.
  - [ ] Configure Domain and SSL certificates.
- **Deployment**
  - [ ] Deploy Backend to Cloud (AWS/DigitalOcean/Vercel).
  - [ ] Deploy Frontends to CDN (Vercel/Netlify).
  - [ ] Run final smoke tests in production.
- **Documentation & Handover**
  - [ ] Finalize API Documentation (Swagger).
  - [ ] Create User Manuals (Internal & Client).
  - [ ] Conduct Training Session for Agency staff.

## Deliverables Checklist
- [ ] Source Code Repository (GitHub/GitLab)
- [ ] Docker Compose file for local dev
- [ ] Database Schema Migration Scripts
- [ ] API Documentation (OpenAPI/Swagger)
- [ ] System Architecture Document
- [ ] User Guides (Admin & Client)
- [ ] Deployment Runbook
