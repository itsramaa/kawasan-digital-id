# Frontend Architecture & Design Strategy

## 1. Overview
This document outlines the architectural decisions, patterns, and standards for the frontend of the Agency Internal System and Client Portal. The frontend is built as a **Single Page Application (SPA)** using **React 18** and **Vite**, focusing on performance, accessibility, and maintainability.

## 2. Technology Stack

| Category | Technology | Rationale |
|----------|------------|-----------|
| **Core Framework** | React 18 | Industry standard, robust ecosystem, concurrent features. |
| **Build Tool** | Vite | Extremely fast HMR, optimized production builds (Rollup). |
| **Language** | TypeScript 5+ | Strict type safety, better developer experience. |
| **Styling** | Tailwind CSS v3.4 | Utility-first, consistent design system, small bundle size. |
| **UI Library** | shadcn/ui (Radix UI) | Accessible, customizable, copy-paste components (not a black box). |
| **State Management** | Zustand | Minimalistic, fast, scalable global state without boilerplate. |
| **Server State** | TanStack Query v5 | Caching, deduplication, optimistic updates, loading states. |
| **Routing** | React Router v6 | Standard routing, nested layouts, loaders/actions support. |
| **Forms** | React Hook Form + Zod | Performant forms, schema validation, type inference. |
| **Icons** | Lucide React | Consistent, lightweight, accessible SVG icons. |
| **Charts** | Recharts | Composable, reliable charting library for dashboards. |

## 3. Architecture Patterns

### 3.1. Directory Structure (Feature-Based)
We adhere to a feature-based organization to ensure scalability.

```
src/
├── assets/             # Static assets (images, fonts)
├── components/         # Shared UI components (Button, Input, etc.)
│   ├── ui/             # shadcn/ui components
│   └── layout/         # Layout components (Sidebar, Header)
├── config/             # Environment variables, global config
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   │   ├── api/        # API calls specific to auth
│   │   ├── components/ # Auth-specific components (LoginForm)
│   │   ├── hooks/      # Auth hooks (useLogin)
│   │   ├── stores/     # Auth state (useAuthStore)
│   │   └── types/      # Auth types
│   ├── crm/            # CRM feature
│   ├── projects/       # Projects feature
│   └── finance/        # Finance feature
├── hooks/              # Global hooks (useTheme, useDebounce)
├── lib/                # Utility libraries (axios instance, utils)
├── pages/              # Route pages (lazy loaded)
├── providers/          # Context providers (QueryClient, Theme)
├── routes/             # Route definitions
├── stores/             # Global stores (NotificationStore)
└── types/              # Global types
```

### 3.2. Component Architecture
- **Presentational vs. Container**:
    - *Presentational Components*: UI only, receive data via props, emit events via callbacks. Located in `components/` or `features/*/components`.
    - *Container Components* (Pages/Smart Components): Connect to stores/queries, handle logic, pass data to presentational components.
- **Composition**: Use React children and slots to avoid prop drilling.
- **Custom Hooks**: Encapsulate logic (data fetching, form handling) in custom hooks.

### 3.3. State Management Strategy
1.  **Server State**: Managed by `TanStack Query`. Used for all API data (Clients, Projects, Invoices).
    -   *Stale-while-revalidate*: Data is fresh for X seconds, then background refetch.
    -   *Optimistic Updates*: UI updates immediately on mutation, reverts on error.
2.  **Global Client State**: Managed by `Zustand`. Used for:
    -   User Session (Auth token, user profile)
    -   UI State (Sidebar toggle, Modals, Toasts)
    -   Theme (Dark/Light mode)
3.  **Local State**: Managed by `useState` / `useReducer`. Used for form inputs, toggles, ephemeral UI state.
4.  **URL State**: Managed by `React Router`. Used for filters, pagination, search queries (bookmarkable URLs).

## 4. Performance Optimization

### 4.1. Code Splitting
- **Route-based**: All top-level routes are lazy-loaded using `React.lazy` and `Suspense`.
- **Component-based**: Heavy components (e.g., Rich Text Editor, Charts) are lazy-loaded.

### 4.2. Render Optimization
- **Memoization**: Use `React.memo` for list items and expensive components.
- **Stable References**: Use `useCallback` and `useMemo` to prevent unnecessary re-renders of child components.
- **Virtualization**: Use `tanstack-virtual` for long lists (e.g., Client List, Audit Logs).

### 4.3. Asset Optimization
- **Images**: WebP format, lazy loading (`loading="lazy"`), proper sizing.
- **Fonts**: Subsetting, self-hosted (Woff2).
- **Bundle Analysis**: Regular checks with `rollup-plugin-visualizer`.

## 5. Design System Implementation

### 5.1. Tailwind Configuration
The design system is implemented using Tailwind CSS with a custom configuration that maps semantic color names to CSS variables. This allows for seamless dark mode support and consistent theming.

**Color Configuration (`tailwind.config.js`):**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)', // Light: #FAFAF6, Dark: #212121
        surface: 'var(--surface)',       // Light: #FFFFFF, Dark: #323232
        primary: {
          DEFAULT: 'var(--primary)',     // Light: #3D6CB9, Dark: #14FFEC
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',   // Light: #00D1FF, Dark: #0D7377
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',      // Light: #00FFF0, Dark: #00D1FF
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',       // Light: #F1F5F9, Dark: #323232
          foreground: 'var(--muted-foreground)',
        },
      }
    }
  }
}
```

**CSS Variables (`globals.css`):**

```css
@layer base {
  :root {
    --background: #FAFAF6;
    --surface: #FFFFFF;
    --primary: #3D6CB9;
    --primary-foreground: #FFFFFF;
    --secondary: #00D1FF;
    --secondary-foreground: #FFFFFF;
    --accent: #00FFF0;
    --accent-foreground: #212121;
    --text-primary: #212121;
    --text-secondary: #323232;
  }
 
  .dark {
    --background: #212121;
    --surface: #323232;
    --primary: #14FFEC;
    --primary-foreground: #212121;
    --secondary: #0D7377;
    --secondary-foreground: #FAFAF6;
    --accent: #00D1FF;
    --accent-foreground: #FAFAF6;
    --text-primary: #FAFAF6;
    --text-secondary: #A1A1AA;
  }
}
```

- **Design Tokens**: Colors, spacing, and typography defined in `tailwind.config.js`.
- **Dark Mode**: Implementation via `class` strategy, persisted in local storage.
- **Plugins**: `tailwindcss-animate`, `@tailwindcss/typography`.

### 5.2. Component Library (shadcn/ui)
- Components are installed into `src/components/ui`.
- Customized via `components.json` and CSS variables in `globals.css`.
- **Accessibility**: All components must be keyboard navigable and screen-reader friendly (Headless UI / Radix primitives).

## 6. Error Handling & Monitoring
- **Error Boundaries**: Global `ErrorBoundary` to catch render errors and display a fallback UI.
- **API Errors**: Centralized error handling in Axios interceptors (auto-logout on 401, global toast on 500).
- **Logging**: Sentry integration for production error tracking.

## 7. Testing (Frontend)
- **Unit Tests**: `Vitest` + `React Testing Library`. Focus on utilities and hooks.
- **Component Tests**: `Vitest`. Focus on user interactions and accessibility.
- **E2E Tests**: `Playwright`. Focus on critical user flows (Login, Create Project, Pay Invoice).

## 8. Development Workflow
- **Linting**: ESLint with `react-app` config + `prettier`.
- **Commit Hooks**: Husky + lint-staged to enforce code quality.
- **CI/CD**: GitHub Actions to build and test on PR.
