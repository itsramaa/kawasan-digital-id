# Backend Architecture & Design Strategy

## 1. Overview
This document outlines the architectural decisions, patterns, and standards for the backend of the Agency Internal System. The backend is built as a **Modular Monolith** using **NestJS**, focusing on strict typing, scalability, and domain-driven design principles.

## 2. Technology Stack

| Category | Technology | Rationale |
|----------|------------|-----------|
| **Framework** | NestJS | Modular, dependency injection, TypeScript-first, scalable. |
| **Language** | TypeScript 5+ | Strict type safety, shared DTOs with frontend. |
| **Runtime** | Node.js (LTS) | High performance, vast ecosystem. |
| **Database** | PostgreSQL 14+ | Relational integrity, JSONB support, robust RLS. |
| **ORM** | Prisma | Type-safe database access, automated migrations, intuitive schema. |
| **Caching** | Redis | High-performance caching, session storage, rate limiting. |
| **Queue** | BullMQ | Reliable job processing (email, reports) based on Redis. |
| **Validation** | class-validator | Decorator-based validation for DTOs. |
| **Documentation** | Swagger (OpenAPI) | Auto-generated API documentation. |
| **Logging** | Winston / Pino | Structured JSON logging for observability. |

## 3. Architecture Patterns

### 3.1. Modular Monolith
The application is structured into self-contained modules based on business domains.

```
src/
├── app.module.ts       # Root module
├── main.ts             # Entry point
├── common/             # Shared code (decorators, filters, guards, interceptors)
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── config/             # Configuration modules (Env validation)
├── modules/            # Feature modules
│   ├── auth/           # Authentication
│   ├── users/          # User management
│   ├── clients/        # Client management (CRM)
│   ├── projects/       # Project management
│   ├── finance/        # Invoices, Payments
│   ├── support/        # Tickets, SLAs
│   └── notifications/  # Email, System notifications
└── prisma/             # Database schema and migrations
```

### 3.2. Layered Architecture (Per Module)
Each module follows a strict layered architecture:

1.  **Controller Layer** (`*.controller.ts`):
    -   Handles HTTP requests/responses.
    -   Validates input (DTOs).
    -   Delegates business logic to Service.
    -   *No business logic allowed here.*

2.  **Service Layer** (`*.service.ts`):
    -   Contains business logic.
    -   Orchestrates data flow.
    -   Interacts with Repository/ORM.
    -   Transactional boundaries.

3.  **Repository/Data Layer** (`*.repository.ts` or Prisma Service):
    -   Direct database access.
    -   Encapsulates queries.

### 3.3. Request/Response Lifecycle
1.  **Request**: Incoming HTTP Request.
2.  **Guard**: Authentication & Authorization (JWT, RBAC).
3.  **Interceptor**: Logging, Response Transformation (JSend).
4.  **Pipe**: Validation (`ValidationPipe`).
5.  **Controller**: Route handling.
6.  **Service**: Business Logic.
7.  **Exception Filter**: Global Error Handling (transforms exceptions to standard error responses).

## 4. Data & Database Strategy

### 4.1. Schema Design
-   **Normalization**: 3NF for core relational data.
-   **JSONB**: Used for flexible data (e.g., `audit_log.changes`, `user.settings`).
-   **Indexes**: B-tree indexes on Foreign Keys, Search columns, and Sort columns.

### 4.2. Multi-Tenancy (Row-Level Security)
-   **Strategy**: Logical separation via `client_id` column.
-   **Enforcement**:
    -   *Application Level*: NestJS Guards and Interceptors ensure `user.client_id` is applied to queries.
    -   *Database Level*: PostgreSQL RLS policies (as a defense-in-depth measure).

### 4.3. Migrations
-   Managed via Prisma Migrate.
-   Version controlled in `prisma/migrations`.
-   Applied automatically in CI/CD pipeline (Staging) and manually/controlled in Production.

## 5. Security Architecture

### 5.1. Authentication
-   **JWT (JSON Web Tokens)**: Stateless authentication.
-   **Access Token**: Short-lived (15 min).
-   **Refresh Token**: Long-lived (7 days), stored securely (HttpOnly Cookie + DB rotation).

### 5.2. Authorization
-   **RBAC**: Role-Based Access Control (`@Roles('ADMIN', 'MANAGER')`).
-   **CASL**: Attribute-based access control for complex permissions (e.g., "User can edit *their own* profile").

### 5.3. Data Protection
-   **Encryption at Rest**: Sensitive fields (API keys, secrets) encrypted using AES-256.
-   **Encryption in Transit**: TLS 1.2+ required.
-   **Sanitization**: All inputs sanitized to prevent XSS/SQL Injection.

## 6. Scalability & Performance

### 6.1. Horizontal Scaling
-   The backend is stateless.
-   Can scale horizontally by adding more instances (replicas) behind a load balancer (Nginx/AWS ALB).

### 6.2. Caching Strategy
-   **Global Cache**: Redis for shared cache across instances.
-   **Endpoint Caching**: `@CacheKey()` decorator for GET endpoints with static data.
-   **Query Caching**: Cache heavy database queries (e.g., Dashboards).

### 6.3. Asynchronous Processing
-   **Queues**: BullMQ used for time-consuming tasks:
    -   Sending Emails.
    -   Generating PDF Reports.
    -   Processing Webhooks.
    -   Data Archival.

## 7. Development Standards
-   **Dependency Injection**: All dependencies injected via constructor.
-   **Interfaces**: Define interfaces for all services and DTOs.
-   **Testing**:
    -   *Unit*: Jest (100% coverage for Utils/Helpers).
    -   *Integration*: Supertest (API endpoints).
    -   *E2E*: Full flow testing.
