# Security Architecture & Compliance

## 1. Overview
This document details the security posture, authentication mechanisms, data protection strategies, and compliance frameworks (GDPR, UU PDP) for the Agency Internal System. Security is implemented using a **Defense in Depth** approach.

## 2. Authentication & Authorization

### 2.1. Identity Management
-   **Primary Auth**: JWT (JSON Web Tokens) based authentication.
-   **Token Strategy**:
    -   **Access Token**: Short-lived (15 min), signed with HS256/RS256. Contains `user_id`, `role`, `client_id`.
    -   **Refresh Token**: Long-lived (7 days), stored in HTTP-only, Secure, SameSite cookie. Rotated on every use.
-   **Password Security**:
    -   Hashing: Argon2id (recommended) or Bcrypt (12+ rounds).
    -   Policy: Min 12 chars, mixed case, numbers, symbols. Checks against Pwned Passwords list.
-   **MFA (Phase 2)**: TOTP (Google Authenticator) enforced for Admin roles.

### 2.2. Access Control (RBAC & RLS)
-   **Role-Based Access Control (RBAC)**:
    -   Defined roles: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `STAFF`, `CLIENT_ADMIN`, `CLIENT_USER`.
    -   Enforced via NestJS Guards (`@Roles()`) at the controller level.
-   **Row-Level Security (RLS)**:
    -   **Concept**: Users can only access data belonging to their `client_id`.
    -   **Implementation**:
        -   *App Layer*: Middleware extracts `client_id` from JWT. Repositories automatically append `WHERE client_id = ?`.
        -   *DB Layer*: PostgreSQL RLS policies enabled for defense-in-depth.

## 3. Data Protection

### 3.1. Encryption
-   **At Rest**:
    -   Database volume encryption (AWS EBS / LUKS).
    -   Column-level encryption for highly sensitive fields (API Keys, OAuth tokens) using AES-256-GCM.
-   **In Transit**:
    -   TLS 1.2 or 1.3 enforced for all connections.
    -   HSTS (HTTP Strict Transport Security) enabled.

### 3.2. Secrets Management
-   **No Hardcoded Secrets**: Strictly forbidden in code.
-   **Environment Variables**: Loaded from `.env` in Dev.
-   **Production**: Secrets injected via Secrets Manager (AWS Secrets Manager / Vault) or Docker Swarm/K8s Secrets.

### 3.3. Input Validation & Sanitization
-   **Global Validation Pipe**: Strips unknown properties (`whitelist: true`).
-   **Sanitization**: DOMPurify for HTML content (Rich Text).
-   **SQL Injection**: Prevented by using ORM (Prisma) and Parameterized Queries.

## 4. Network Security

### 4.1. Perimeter Defense
-   **WAF (Web Application Firewall)**: Cloudflare / AWS WAF to block common attacks (SQLi, XSS).
-   **DDoS Protection**: Cloudflare basic protection.
-   **Rate Limiting**:
    -   Global: 1000 req/min.
    -   Auth Endpoints: 5 req/min (prevent brute force).

### 4.2. CORS & Headers
-   **CORS**: Strict whitelist of allowed origins (e.g., `https://portal.agency.com`).
-   **Security Headers (Helmet)**:
    -   `Content-Security-Policy`: Restrict sources of scripts/styles.
    -   `X-Frame-Options`: DENY.
    -   `X-Content-Type-Options`: nosniff.

## 5. Compliance (GDPR & UU PDP)

### 5.1. Data Sovereignty
-   Data stored in **Jakarta Region** (if required by UU PDP for public services) or Singapore (AWS ap-southeast-1) with cross-border data transfer agreements.

### 5.2. Data Subject Rights
-   **Right to Access**: "Download My Data" feature generates a JSON dump of user data.
-   **Right to Delete**: "Delete Account" requests trigger a 30-day soft-delete grace period, then hard delete (or anonymization for financial records).
-   **Consent**: Explicit opt-in for marketing; cookie consent banner.

### 5.3. Audit Logging
-   **What**: All write operations (CREATE, UPDATE, DELETE) and sensitive reads.
-   **Where**: Immutable `audit_logs` table (and shipped to external logging service in Phase 2).
-   **Content**: `who` (user_id), `what` (action), `when` (timestamp), `where` (ip_address), `changes` (diff).

## 6. Vulnerability Management
-   **Scanning**: Weekly automated dependency scans (Snyk).
-   **Patching**: Critical security patches applied within 48 hours.
-   **Incident Response**: Documented IR plan for data breaches (Detection -> Containment -> Eradication -> Recovery -> Notification).
