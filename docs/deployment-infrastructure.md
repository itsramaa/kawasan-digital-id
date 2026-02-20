# Deployment & Infrastructure Architecture

## 1. Overview
This document details the infrastructure design, deployment strategy, and DevOps practices for the Agency Internal System. The infrastructure is designed to be **immutable, reproducible, and scalable**, leveraging containerization and automated CI/CD pipelines.

## 2. Infrastructure Design

### 2.1. Environment Strategy
We maintain parity between environments to minimize "it works on my machine" issues.

| Environment | Purpose | Infrastructure | Deployment Trigger |
|-------------|---------|----------------|--------------------|
| **Local** | Development | Docker Compose | Manual (`docker-compose up`) |
| **Staging** | QA / UAT | VPS / Cloud Container | Push to `develop` branch |
| **Production** | Live Usage | Managed K8s / PaaS | Release Tag / Manual Approval |

### 2.2. Component Architecture (Production)
```
[User] -> [Cloudflare DNS/WAF] -> [Load Balancer]
                                      |
                                      v
                               [Frontend Service] (React/Nginx)
                                      |
                                      v
                               [Backend Service] (NestJS Cluster)
                                      |
           ┌──────────────────────────┼──────────────────────────┐
           v                          v                          v
    [PostgreSQL DB]              [Redis Cache]              [Object Storage]
    (Managed RDS)                (Managed ElastiCache)      (S3 / MinIO)
```

## 3. Containerization (Docker)

### 3.1. Backend Dockerfile
-   **Base Image**: `node:20-alpine` (lightweight, secure).
-   **Multi-Stage Build**:
    1.  *Builder*: Install dependencies, build NestJS app.
    2.  *Runner*: Copy built artifacts, install only production dependencies.
-   **Security**: Run as non-root user (`node`).

### 3.2. Frontend Dockerfile
-   **Build Stage**: Build React app with Vite.
-   **Serve Stage**: Nginx Alpine image to serve static files.
-   **Config**: Custom `nginx.conf` for SPA routing (fallback to index.html) and caching headers.

### 3.3. Orchestration
-   **Local**: `docker-compose.yml` orchestrates App, DB, Redis, and Mailpit (email testing).
-   **Production**: Docker Swarm or Kubernetes (Phase 2). For Phase 1, Docker Compose on a hardened VPS is sufficient.

## 4. CI/CD Pipeline (GitHub Actions)

### 4.1. Workflow: Pull Request (`pr-check.yml`)
-   **Trigger**: Open/Sync PR.
-   **Jobs**:
    1.  Lint & Type Check.
    2.  Unit Tests.
    3.  Build Check (ensure Docker build succeeds).

### 4.2. Workflow: Deploy Staging (`deploy-staging.yml`)
-   **Trigger**: Push to `develop`.
-   **Jobs**:
    1.  Run Integration Tests.
    2.  Build & Push Docker Images to Registry (GHCR/ECR).
    3.  Deploy to Staging Server (SSH + `docker-compose pull && docker-compose up -d`).
    4.  Run Database Migrations.

### 4.3. Workflow: Deploy Production (`deploy-prod.yml`)
-   **Trigger**: Release Tag (`v*`).
-   **Jobs**:
    1.  Run Full Test Suite (E2E).
    2.  Build & Tag Production Images.
    3.  Deploy to Production (Blue-Green strategy if possible, or Rolling Update).
    4.  Notify Slack/Discord of deployment status.

## 5. Monitoring & Observability

### 5.1. Metrics (Prometheus + Grafana)
-   **System**: CPU, RAM, Disk I/O.
-   **Application**: Request Latency, Error Rate, Request Count (RPS).
-   **Business**: Active Users, New Invoices, Failed Jobs.

### 5.2. Logging (ELK / Loki)
-   Centralized log aggregation.
-   Logs formatted in JSON.
-   Retention: 30 days hot, 1 year cold (S3 Glacier).

### 5.3. Alerting
-   **Tools**: Alertmanager / PagerDuty.
-   **Triggers**:
    -   Server Down.
    -   High Error Rate (> 1%).
    -   High Latency (> 2s p95).
    -   Disk Space < 10%.

## 6. Backup & Disaster Recovery

### 6.1. Database Backups
-   **Daily**: Full snapshot (pg_dump).
-   **WAL Archiving**: Continuous archiving for Point-in-Time Recovery (PITR).
-   **Storage**: Encrypted S3 bucket in a different region.

### 6.2. Disaster Recovery Plan
-   **Scenario**: Primary region failure.
-   **Action**:
    1.  Spin up infrastructure in Secondary Region (IaC - Terraform).
    2.  Restore Database from cross-region backup.
    3.  Update DNS to point to new Load Balancer.
-   **RTO**: 4 Hours.
-   **RPO**: 1 Hour.
