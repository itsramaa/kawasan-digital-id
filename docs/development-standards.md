# Development Standards & Guidelines

## 1. Overview
This document establishes the coding standards, contribution guidelines, and development workflows for the Agency Internal System. All team members must adhere to these standards to ensure code quality, consistency, and maintainability.

## 2. Code Quality Standards

### 2.1. General Principles
-   **KISS (Keep It Simple, Stupid)**: Avoid over-engineering. Simple code is easier to test and maintain.
-   **DRY (Don't Repeat Yourself)**: Extract common logic into utilities or hooks.
-   **SOLID**: Follow SOLID principles for class/component design.
-   **Boy Scout Rule**: Leave the code cleaner than you found it.

### 2.2. Naming Conventions
-   **Variables/Functions**: `camelCase` (e.g., `getUser`, `isValid`).
-   **Classes/Components**: `PascalCase` (e.g., `UserService`, `Button`).
-   **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`).
-   **Files**: `kebab-case` (e.g., `user-service.ts`, `login-form.tsx`).
-   **Interfaces**: `PascalCase` (no 'I' prefix, e.g., `User`, not `IUser`).

### 2.3. Comments & Documentation
-   **Self-Documenting Code**: Prefer clear variable names over comments.
-   **JSDoc**: Use JSDoc for complex functions, explaining *why* something is done, not *what*.
-   **TODOs**: Use `// TODO: [Owner] Description` for debt.

## 3. Git Workflow

### 3.1. Branching Strategy (Git Flow / Feature Branch)
-   `main`: Production-ready code. Protected.
-   `develop`: Integration branch for next release. Protected.
-   `feature/feature-name`: New features. Created from `develop`.
-   `fix/bug-name`: Bug fixes. Created from `develop`.
-   `hotfix/issue-name`: Urgent production fixes. Created from `main`.

### 3.2. Commit Messages (Conventional Commits)
Format: `<type>(<scope>): <subject>`

Types:
-   `feat`: A new feature
-   `fix`: A bug fix
-   `docs`: Documentation only changes
-   `style`: Changes that do not affect the meaning of the code (white-space, formatting)
-   `refactor`: A code change that neither fixes a bug nor adds a feature
-   `perf`: A code change that improves performance
-   `test`: Adding missing tests or correcting existing tests
-   `chore`: Changes to the build process or auxiliary tools

Example: `feat(auth): implement JWT refresh token rotation`

### 3.3. Pull Requests (PR)
-   **Title**: Matches commit format.
-   **Description**: Link to Jira/Linear ticket, explanation of changes, screenshots (for UI).
-   **Reviewers**: Min 1 approval required.
-   **Checks**: CI pipeline must pass.

## 4. Tech Stack Specifics

### 4.1. React (Frontend)
-   **Functional Components**: Use functional components with Hooks.
-   **Props**: Use TypeScript interfaces for props.
-   **Hooks**: Custom hooks for logic reuse.
-   **Styling**: Use Tailwind utility classes. Avoid inline styles.

### 4.2. NestJS (Backend)
-   **Strict Typing**: No `any`. Use `unknown` if necessary.
-   **DTOs**: Use DTOs for all Input/Output.
-   **Env Vars**: Access via `ConfigService`, never `process.env`.
-   **Async/Await**: Prefer `async/await` over RxJS Observables unless working with streams.

## 5. Documentation Map
For detailed architectural guidelines, refer to the specific domain documents:

-   **[Frontend Architecture](frontend-architecture.md)**: React, State, UI Patterns.
-   **[Backend Architecture](backend-architecture.md)**: NestJS, DB, API Design.
-   **[Security Architecture](security-architecture.md)**: Auth, Compliance, Data Protection.
-   **[Deployment & Infrastructure](deployment-infrastructure.md)**: Docker, CI/CD, Cloud.
-   **[Testing Strategy](testing-strategy.md)**: Testing pyramid, tools, standards.
