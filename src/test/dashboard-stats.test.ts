import { describe, it, expect } from 'vitest'
import { Decimal } from '@prisma/client/runtime/client'

// ─── Types (local, no DB imports) ─────────────────────────────────────────────

interface Payment {
  amount: Decimal
  status: 'Pending' | 'Verified' | 'Failed'
}

interface Ticket {
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'In_Progress' | 'Escalated' | 'Resolved' | 'Closed'
  createdAt: Date
}

interface Invoice {
  status: string
  dueDate: Date | null
  amount: Decimal
}

// ─── Revenue sum: only Verified payments ──────────────────────────────────────

function sumVerifiedRevenue(payments: Payment[]): Decimal {
  return payments
    .filter((p) => p.status === 'Verified')
    .reduce((sum, p) => sum.add(p.amount), new Decimal(0))
}

describe('Revenue sum (Verified payments only)', () => {
  it('returns 0 for empty list', () => {
    expect(sumVerifiedRevenue([]).toNumber()).toBe(0)
  })

  it('sums only Verified payments', () => {
    const payments: Payment[] = [
      { amount: new Decimal('5000000'), status: 'Verified' },
      { amount: new Decimal('3000000'), status: 'Pending' },
      { amount: new Decimal('2000000'), status: 'Verified' },
      { amount: new Decimal('1000000'), status: 'Failed' },
    ]
    expect(sumVerifiedRevenue(payments).toNumber()).toBe(7_000_000)
  })

  it('returns 0 when no Verified payments', () => {
    const payments: Payment[] = [
      { amount: new Decimal('5000000'), status: 'Pending' },
      { amount: new Decimal('3000000'), status: 'Failed' },
    ]
    expect(sumVerifiedRevenue(payments).toNumber()).toBe(0)
  })

  it('handles Decimal arithmetic correctly', () => {
    const payments: Payment[] = [
      { amount: new Decimal('1000000.50'), status: 'Verified' },
      { amount: new Decimal('999999.50'), status: 'Verified' },
    ]
    expect(sumVerifiedRevenue(payments).toNumber()).toBe(2_000_000)
  })

  it('handles a single Verified payment', () => {
    const payments: Payment[] = [
      { amount: new Decimal('15000000'), status: 'Verified' },
    ]
    expect(sumVerifiedRevenue(payments).toNumber()).toBe(15_000_000)
  })
})

// ─── Ticket priority sort ──────────────────────────────────────────────────────

const PRIORITY_ORDER: Record<string, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

function sortTicketsByPriority(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
  )
}

describe('Ticket priority sort', () => {
  it('sorts Critical before High before Medium before Low', () => {
    const tickets: Ticket[] = [
      { priority: 'Low', status: 'Open', createdAt: new Date() },
      { priority: 'Critical', status: 'Open', createdAt: new Date() },
      { priority: 'Medium', status: 'Open', createdAt: new Date() },
      { priority: 'High', status: 'Open', createdAt: new Date() },
    ]
    const sorted = sortTicketsByPriority(tickets)
    expect(sorted.map((t) => t.priority)).toEqual(['Critical', 'High', 'Medium', 'Low'])
  })

  it('preserves order of same-priority tickets', () => {
    const t1: Ticket = { priority: 'High', status: 'Open', createdAt: new Date('2024-01-01') }
    const t2: Ticket = { priority: 'High', status: 'Open', createdAt: new Date('2024-01-02') }
    const sorted = sortTicketsByPriority([t1, t2])
    expect(sorted[0]).toBe(t1)
    expect(sorted[1]).toBe(t2)
  })

  it('returns empty array for empty input', () => {
    expect(sortTicketsByPriority([])).toEqual([])
  })

  it('handles single ticket', () => {
    const tickets: Ticket[] = [{ priority: 'Medium', status: 'Open', createdAt: new Date() }]
    expect(sortTicketsByPriority(tickets)).toHaveLength(1)
  })

  it('does not mutate the original array', () => {
    const tickets: Ticket[] = [
      { priority: 'Low', status: 'Open', createdAt: new Date() },
      { priority: 'Critical', status: 'Open', createdAt: new Date() },
    ]
    const original = [...tickets]
    sortTicketsByPriority(tickets)
    expect(tickets[0].priority).toBe(original[0].priority)
  })
})

// ─── Overdue detection ─────────────────────────────────────────────────────────

function isOverdue(invoice: Invoice): boolean {
  if (invoice.status === 'Paid' || invoice.status === 'Void' || invoice.status === 'Bad_Debt') {
    return false
  }
  if (!invoice.dueDate) return false
  return invoice.dueDate < new Date()
}

function countOverdueInvoices(invoices: Invoice[]): number {
  return invoices.filter(isOverdue).length
}

describe('Overdue invoice detection', () => {
  const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)   // 7 days ago
  const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

  it('detects overdue Sent invoice', () => {
    const inv: Invoice = { status: 'Sent', dueDate: past, amount: new Decimal('1000000') }
    expect(isOverdue(inv)).toBe(true)
  })

  it('does not flag future-due invoice as overdue', () => {
    const inv: Invoice = { status: 'Sent', dueDate: future, amount: new Decimal('1000000') }
    expect(isOverdue(inv)).toBe(false)
  })

  it('does not flag Paid invoice as overdue', () => {
    const inv: Invoice = { status: 'Paid', dueDate: past, amount: new Decimal('1000000') }
    expect(isOverdue(inv)).toBe(false)
  })

  it('does not flag Void invoice as overdue', () => {
    const inv: Invoice = { status: 'Void', dueDate: past, amount: new Decimal('1000000') }
    expect(isOverdue(inv)).toBe(false)
  })

  it('does not flag invoice with no dueDate', () => {
    const inv: Invoice = { status: 'Sent', dueDate: null, amount: new Decimal('1000000') }
    expect(isOverdue(inv)).toBe(false)
  })

  it('counts multiple overdue invoices correctly', () => {
    const invoices: Invoice[] = [
      { status: 'Sent', dueDate: past, amount: new Decimal('1000000') },       // overdue
      { status: 'Overdue', dueDate: past, amount: new Decimal('2000000') },    // overdue
      { status: 'Paid', dueDate: past, amount: new Decimal('3000000') },       // paid — not overdue
      { status: 'Sent', dueDate: future, amount: new Decimal('500000') },      // future — not overdue
      { status: 'Draft', dueDate: null, amount: new Decimal('100000') },       // no date — not overdue
    ]
    expect(countOverdueInvoices(invoices)).toBe(2)
  })

  it('returns 0 for empty list', () => {
    expect(countOverdueInvoices([])).toBe(0)
  })
})
