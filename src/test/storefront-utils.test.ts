import { describe, it, expect } from 'vitest'

// ─── UUID validation regex (mirrors app/api/orders/track/route.ts) ─────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('UUID validation regex', () => {
  it('accepts a valid lowercase UUID', () => {
    expect(UUID_RE.test('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('accepts a valid uppercase UUID', () => {
    expect(UUID_RE.test('550E8400-E29B-41D4-A716-446655440000')).toBe(true)
  })

  it('accepts a valid mixed-case UUID', () => {
    expect(UUID_RE.test('550e8400-E29b-41d4-A716-446655440000')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(UUID_RE.test('')).toBe(false)
  })

  it('rejects a plain string', () => {
    expect(UUID_RE.test('not-a-uuid')).toBe(false)
  })

  it('rejects UUID without dashes', () => {
    expect(UUID_RE.test('550e8400e29b41d4a716446655440000')).toBe(false)
  })

  it('rejects a UUID with wrong segment lengths', () => {
    expect(UUID_RE.test('550e8400-e29b-41d4-a716-44665544000')).toBe(false)
  })

  it('rejects a UUID with extra characters', () => {
    expect(UUID_RE.test('550e8400-e29b-41d4-a716-446655440000-extra')).toBe(false)
  })

  it('rejects a numeric-only string', () => {
    expect(UUID_RE.test('12345678901234567890123456789012')).toBe(false)
  })
})

// ─── Price calculation (basePrice + non-included addon prices) ─────────────────

interface Feature {
  price: number
  is_included: boolean
}

function calculateTotalPrice(basePrice: number, features: Feature[]): number {
  const addonTotal = features
    .filter((f) => !f.is_included)
    .reduce((sum, f) => sum + f.price, 0)
  return basePrice + addonTotal
}

describe('Price calculation', () => {
  it('returns basePrice when no features', () => {
    expect(calculateTotalPrice(5_000_000, [])).toBe(5_000_000)
  })

  it('returns basePrice when all features are included', () => {
    const features: Feature[] = [
      { price: 500_000, is_included: true },
      { price: 300_000, is_included: true },
    ]
    expect(calculateTotalPrice(5_000_000, features)).toBe(5_000_000)
  })

  it('adds only non-included (addon) feature prices', () => {
    const features: Feature[] = [
      { price: 500_000, is_included: true },   // excluded from sum
      { price: 300_000, is_included: false },  // added
      { price: 200_000, is_included: false },  // added
    ]
    expect(calculateTotalPrice(5_000_000, features)).toBe(5_500_000)
  })

  it('handles all non-included features', () => {
    const features: Feature[] = [
      { price: 100_000, is_included: false },
      { price: 200_000, is_included: false },
      { price: 300_000, is_included: false },
    ]
    expect(calculateTotalPrice(1_000_000, features)).toBe(1_600_000)
  })

  it('handles zero-price addons', () => {
    const features: Feature[] = [
      { price: 0, is_included: false },
    ]
    expect(calculateTotalPrice(2_000_000, features)).toBe(2_000_000)
  })
})

// ─── IDR currency formatting ───────────────────────────────────────────────────

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

describe('IDR formatting', () => {
  it('formats zero correctly', () => {
    const result = formatIDR(0)
    expect(result).toContain('0')
    expect(result).toContain('Rp')
  })

  it('formats a round million', () => {
    const result = formatIDR(5_000_000)
    expect(result).toContain('5')
    expect(result).toContain('000')
  })

  it('formats a large amount', () => {
    const result = formatIDR(150_000_000)
    expect(result).toContain('150')
  })

  it('does not include decimal places', () => {
    const result = formatIDR(1_500_000)
    // Should not have ,00 or .00 at end
    expect(result).not.toMatch(/[,.]00$/)
  })
})
