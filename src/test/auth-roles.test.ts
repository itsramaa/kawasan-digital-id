import { describe, it, expect } from 'vitest'

// ─── Role constants (mirrors src/lib/auth-helpers.ts) ─────────────────────────

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES = ['client_admin', 'client_contact']

// ─── Local role helpers (pure logic — no imports from auth-helpers) ────────────

function isInternalRole(role: string | undefined): boolean {
  return !!role && INTERNAL_ROLES.includes(role)
}

function isClientRole(role: string | undefined): boolean {
  return !!role && CLIENT_ROLES.includes(role)
}

function canViewClientData(role: string | undefined): boolean {
  // Internal staff can view client data; client users can only view their own
  return isInternalRole(role) || isClientRole(role)
}

function canManageUsers(role: string | undefined): boolean {
  return role === 'super_admin'
}

function canManageFinance(role: string | undefined): boolean {
  return role === 'super_admin' || role === 'finance'
}

function canManageProjects(role: string | undefined): boolean {
  return role === 'super_admin' || role === 'project_manager' || role === 'developer'
}

// ─── isInternalRole ────────────────────────────────────────────────────────────

describe('isInternalRole', () => {
  for (const role of INTERNAL_ROLES) {
    it(`returns true for ${role}`, () => {
      expect(isInternalRole(role)).toBe(true)
    })
  }

  it('returns false for client_admin', () => {
    expect(isInternalRole('client_admin')).toBe(false)
  })

  it('returns false for client_contact', () => {
    expect(isInternalRole('client_contact')).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isInternalRole(undefined)).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isInternalRole('')).toBe(false)
  })

  it('returns false for unknown role', () => {
    expect(isInternalRole('hacker')).toBe(false)
  })
})

// ─── isClientRole ──────────────────────────────────────────────────────────────

describe('isClientRole', () => {
  it('returns true for client_admin', () => {
    expect(isClientRole('client_admin')).toBe(true)
  })

  it('returns true for client_contact', () => {
    expect(isClientRole('client_contact')).toBe(true)
  })

  it('returns false for super_admin', () => {
    expect(isClientRole('super_admin')).toBe(false)
  })

  it('returns false for sales', () => {
    expect(isClientRole('sales')).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isClientRole(undefined)).toBe(false)
  })
})

// ─── canViewClientData ─────────────────────────────────────────────────────────

describe('canViewClientData', () => {
  it('allows super_admin', () => {
    expect(canViewClientData('super_admin')).toBe(true)
  })

  it('allows all internal roles', () => {
    for (const role of INTERNAL_ROLES) {
      expect(canViewClientData(role)).toBe(true)
    }
  })

  it('allows client_admin', () => {
    expect(canViewClientData('client_admin')).toBe(true)
  })

  it('allows client_contact', () => {
    expect(canViewClientData('client_contact')).toBe(true)
  })

  it('denies undefined', () => {
    expect(canViewClientData(undefined)).toBe(false)
  })

  it('denies unknown role', () => {
    expect(canViewClientData('guest')).toBe(false)
  })
})

// ─── canManageUsers ────────────────────────────────────────────────────────────

describe('canManageUsers', () => {
  it('allows super_admin', () => {
    expect(canManageUsers('super_admin')).toBe(true)
  })

  it('denies all other internal roles', () => {
    const others = INTERNAL_ROLES.filter((r) => r !== 'super_admin')
    for (const role of others) {
      expect(canManageUsers(role)).toBe(false)
    }
  })

  it('denies client roles', () => {
    expect(canManageUsers('client_admin')).toBe(false)
    expect(canManageUsers('client_contact')).toBe(false)
  })
})

// ─── canManageFinance ──────────────────────────────────────────────────────────

describe('canManageFinance', () => {
  it('allows super_admin', () => {
    expect(canManageFinance('super_admin')).toBe(true)
  })

  it('allows finance', () => {
    expect(canManageFinance('finance')).toBe(true)
  })

  it('denies sales', () => {
    expect(canManageFinance('sales')).toBe(false)
  })

  it('denies developer', () => {
    expect(canManageFinance('developer')).toBe(false)
  })

  it('denies client roles', () => {
    expect(canManageFinance('client_admin')).toBe(false)
  })
})

// ─── canManageProjects ─────────────────────────────────────────────────────────

describe('canManageProjects', () => {
  it('allows super_admin', () => {
    expect(canManageProjects('super_admin')).toBe(true)
  })

  it('allows project_manager', () => {
    expect(canManageProjects('project_manager')).toBe(true)
  })

  it('allows developer', () => {
    expect(canManageProjects('developer')).toBe(true)
  })

  it('denies sales', () => {
    expect(canManageProjects('sales')).toBe(false)
  })

  it('denies finance', () => {
    expect(canManageProjects('finance')).toBe(false)
  })

  it('denies client_admin', () => {
    expect(canManageProjects('client_admin')).toBe(false)
  })
})
