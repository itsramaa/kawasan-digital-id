# Testing Strategy & Quality Assurance

## 1. Overview
This document defines the comprehensive testing strategy for the Agency Internal System. Our goal is to ensure high reliability, maintainability, and security through a multi-layered testing approach (Testing Pyramid) that provides fast feedback and high confidence.

## 2. Testing Pyramid
We strictly adhere to the Testing Pyramid principles:

| Layer | Type | Scope | Volume | Tools | Responsibility |
|-------|------|-------|--------|-------|----------------|
| **Top** | **E2E Tests** | Full User Flows | 10% | Playwright | QA / Lead Dev |
| **Middle** | **Integration** | Module Interaction | 20% | Supertest, Vitest | Developers |
| **Bottom** | **Unit Tests** | Isolated Functions | 70% | Jest, Vitest | Developers |

## 3. Detailed Testing Levels

### 3.1. Unit Testing
-   **Objective**: Verify the logic of individual units (functions, classes, components) in isolation.
-   **Backend**:
    -   *Tool*: Jest
    -   *Scope*: Services, Helpers, Pipes, Guards.
    -   *Mocking*: All external dependencies (Repositories, External APIs) must be mocked.
    -   *Standard*: >80% coverage required.
-   **Frontend**:
    -   *Tool*: Vitest + React Testing Library
    -   *Scope*: Utilities, Hooks, Shared Components.
    -   *Standard*: Test behavior, not implementation details.

### 3.2. Integration Testing
-   **Objective**: Verify that different modules or services work together correctly.
-   **Backend (API)**:
    -   *Tool*: Supertest + Jest
    -   *Scope*: Controllers + Services + Database (using a test DB container).
    -   *Scenario*: Send HTTP request -> Check DB state -> Verify Response.
-   **Frontend**:
    -   *Tool*: Vitest
    -   *Scope*: Page components, Complex Forms.
    -   *Mocking*: MSW (Mock Service Worker) to mock API responses.

### 3.3. End-to-End (E2E) Testing
-   **Objective**: Verify the system behaves as expected from a user's perspective in a real-like environment.
-   **Tool**: Playwright
-   **Scope**: Critical User Journeys (CUJs).
-   **Scenarios**:
    1.  **Auth**: Login, Logout, Forgot Password.
    2.  **CRM**: Create Inquiry -> Convert to Project.
    3.  **Finance**: Create Invoice -> Pay Invoice.
    4.  **Client Portal**: View Dashboard, Submit Ticket.
-   **Environment**: Runs against Staging environment.

## 4. Quality Assurance Processes

### 4.1. Static Analysis
-   **Linting**: ESLint (AirBnb/Standard config) runs on pre-commit.
-   **Formatting**: Prettier runs on save/pre-commit.
-   **Type Checking**: TypeScript strict mode enabled.

### 4.2. Continuous Integration (CI)
GitHub Actions pipeline runs on every Pull Request:
1.  **Lint & Format Check**: Fails if standards not met.
2.  **Build Check**: Ensures code compiles.
3.  **Unit Tests**: Runs all unit tests.
4.  **Integration Tests**: Runs API integration tests.
5.  **Report**: Generates coverage report.

### 4.3. Code Review
-   Manual review by at least 1 peer.
-   Checklist:
    -   [ ] Logic correctness.
    -   [ ] Security implications (Auth/Input).
    -   [ ] Performance impact.
    -   [ ] Test coverage included.

## 5. Security Testing
-   **SAST (Static Application Security Testing)**: SonarQube integrated into CI.
-   **Dependency Scanning**: `npm audit` / Snyk to check for vulnerable packages.
-   **Penetration Testing**: Annual third-party audit (Phase 2).

## 6. Performance Testing
-   **Load Testing**: K6 scripts to simulate concurrent users.
-   **Scenarios**:
    -   Login spike (100 users/sec).
    -   Dashboard load (heavy read queries).
    -   Report generation (heavy compute).
-   **Thresholds**: 95th percentile response < 500ms.

## 7. Test Data Management
-   **Seeding**: Automated seed scripts to populate Dev/Staging DB with realistic dummy data.
-   **Sanitization**: Production data is NEVER used in lower environments without anonymization.
-   **Cleanup**: Tests must clean up data created during execution (transaction rollback or explicit delete).
