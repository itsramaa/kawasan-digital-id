import { describe, it, expect } from 'vitest'

// ─── Role constants (mirrors middleware.ts) ────────────────────────────────────

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES = ['client_admin', 'client_contact']

// ─── Local helper functions replicating middleware route-guard logic ────────────

function canAccessAdmin(role: string | undefined): boolean {
  return role === 'super_admin'
}

function canAccessDashboard(role: string | undefined): boolean {
  return !!role && INTERNAL_ROLES.includes(role)
}

function canAccessClientPortal(role: string | undefined): boolean {
  return !!role && CLIENT_ROLES.includes(role)
}

function resolveRedirect(pathname: string, role: string | undefined, isAuthenticated: boolean): 'allow' | 'redirect' {
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) return 'redirect'
    if (!canAccessAdmin(role)) return 'redirect'
  }
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) return 'redirect'
    if (!canAccessDashboard(role)) return 'redirect'
  }
  if (pathname.startsWith('/client')) {
    if (!isAuthenticated) return 'redirect'
    if (!canAccessClientPortal(role)) return 'redirect'
  }
  return 'allow'
}

// ─── Admin route tests ─────────────────────────────────────────────────────────

describe('Admin route guard', () => {
  it('allows super_admin', () => {
    expect(resolveRedirect('/admin/users', 'super_admin', true)).toBe('allow')
  })

  it('redirects unauthenticated user', () => {
    expect(resolveRedirect('/admin/users', undefined, false)).toBe('redirect')
  })

  it('redirects sales role', () => {
    expect(resolveRedirect('/admin/users', 'sales', true)).toBe('redirect')
  })

  it('redirects client_admin role', () => {
    expect(resolveRedirect('/admin/users', 'client_admin', true)).toBe('redirect')
  })

  it('redirects developer role', () => {
    expect(resolveRedirect('/admin/users', 'developer', true)).toBe('redirect')
  })
})

// ─── Dashboard route tests ─────────────────────────────────────────────────────

describe('Dashboard route guard', () => {
  for (const role of INTERNAL_ROLES) {
    it(`allows internal role: ${role}`, () => {
      expect(resolveRedirect('/dashboard/projects', role, true)).toBe('allow')
    })
  }

  it('redirects unauthenticated user', () => {
    expect(resolveRedirect('/dashboard/projects', undefined, false)).toBe('redirect')
  })

  it('redirects client_admin', () => {
    expect(resolveRedirect('/dashboard/projects', 'client_admin', true)).toBe('redirect')
  })

  it('redirects client_contact', () => {
    expect(resolveRedirect('/dashboard/projects', 'client_contact', true)).toBe('redirect')
  })
})

// ─── Client portal route tests ─────────────────────────────────────────────────

describe('Client portal route guard', () => {
  it('allows client_admin', () => {
    expect(resolveRedirect('/client/dashboard', 'client_admin', true)).toBe('allow')
  })

  it('allows client_contact', () => {
    expect(resolveRedirect('/client/dashboard', 'client_contact', true)).toBe('allow')
  })

  it('redirects unauthenticated user', () => {
    expect(resolveRedirect('/client/dashboard', undefined, false)).toBe('redirect')
  })

  it('redirects super_admin from client portal', () => {
    expect(resolveRedirect('/client/dashboard', 'super_admin', true)).toBe('redirect')
  })

  it('redirects sales from client portal', () => {
    expect(resolveRedirect('/client/dashboard', 'sales', true)).toBe('redirect')
  })
})

// ─── Public route tests ────────────────────────────────────────────────────────

describe('Public routes (no guard)', () => {
  it('allows unauthenticated access to /', () => {
    expect(resolveRedirect('/', undefined, false)).toBe('allow')
  })

  it('allows unauthenticated access to /auth/login', () => {
    expect(resolveRedirect('/auth/login', undefined, false)).toBe('allow')
  })

  it('allows unauthenticated access to /services', () => {
    expect(resolveRedirect('/services', undefined, false)).toBe('allow')
  })
})
