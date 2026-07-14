import { describe, it, expect } from 'vitest'
import {
  inquirySchema,
  ticketSchema,
  clientSchema,
  profileSchema,
  contactSchema,
} from '@/src/lib/validations'

// ─── inquirySchema ────────────────────────────────────────────────────────────

describe('inquirySchema', () => {
  it('accepts valid minimal input', () => {
    const result = inquirySchema.safeParse({ title: 'New project' })
    expect(result.success).toBe(true)
  })

  it('accepts valid full input', () => {
    const result = inquirySchema.safeParse({
      title: 'Build a website',
      description: 'We need a landing page',
      budget_estimate: '10000',
      client_id: 'abc-123',
    })
    expect(result.success).toBe(true)
  })

  it('fails when title is missing', () => {
    const result = inquirySchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('fails when title is empty string', () => {
    const result = inquirySchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })

  it('fails when title exceeds maxLength', () => {
    const result = inquirySchema.safeParse({ title: 'a'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('fails when description exceeds maxLength', () => {
    const result = inquirySchema.safeParse({
      title: 'Valid',
      description: 'x'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from title', () => {
    const result = inquirySchema.safeParse({ title: '  My Inquiry  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.title).toBe('My Inquiry')
  })
})

// ─── ticketSchema ─────────────────────────────────────────────────────────────

describe('ticketSchema', () => {
  it('accepts valid minimal input', () => {
    const result = ticketSchema.safeParse({ subject: 'Bug report', priority: 'Low' })
    expect(result.success).toBe(true)
  })

  it('accepts all valid priority values', () => {
    for (const priority of ['Low', 'Medium', 'High', 'Critical']) {
      const result = ticketSchema.safeParse({ subject: 'Test', priority })
      expect(result.success).toBe(true)
    }
  })

  it('fails when subject is missing', () => {
    const result = ticketSchema.safeParse({ priority: 'Low' })
    expect(result.success).toBe(false)
  })

  it('fails when priority is invalid enum value', () => {
    const result = ticketSchema.safeParse({ subject: 'Test', priority: 'Urgent' })
    expect(result.success).toBe(false)
  })

  it('fails when subject exceeds maxLength', () => {
    const result = ticketSchema.safeParse({ subject: 'a'.repeat(201), priority: 'Low' })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from subject', () => {
    const result = ticketSchema.safeParse({ subject: '  Login issue  ', priority: 'High' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.subject).toBe('Login issue')
  })
})

// ─── clientSchema ─────────────────────────────────────────────────────────────

describe('clientSchema', () => {
  it('accepts valid minimal input', () => {
    const result = clientSchema.safeParse({ name: 'Acme Corp' })
    expect(result.success).toBe(true)
  })

  it('accepts valid full input', () => {
    const result = clientSchema.safeParse({
      name: 'Acme Corp',
      company_name: 'Acme Corp Pte Ltd',
      email: 'info@acme.com',
      phone: '+628123456789',
      industry: 'Technology',
      tax_id: '01.234.567.8-123.000',
    })
    expect(result.success).toBe(true)
  })

  it('fails when name is missing', () => {
    const result = clientSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = clientSchema.safeParse({ name: 'Test', email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('fails when name exceeds maxLength', () => {
    const result = clientSchema.safeParse({ name: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts empty string for optional email', () => {
    const result = clientSchema.safeParse({ name: 'Test', email: '' })
    expect(result.success).toBe(true)
  })

  it('trims whitespace from name', () => {
    const result = clientSchema.safeParse({ name: '  Acme  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe('Acme')
  })
})

// ─── profileSchema ────────────────────────────────────────────────────────────

describe('profileSchema', () => {
  it('accepts valid minimal input', () => {
    const result = profileSchema.safeParse({ full_name: 'Budi Santoso' })
    expect(result.success).toBe(true)
  })

  it('accepts valid full input with phone', () => {
    const result = profileSchema.safeParse({ full_name: 'Budi Santoso', phone: '+6281234567890' })
    expect(result.success).toBe(true)
  })

  it('fails when full_name is missing', () => {
    const result = profileSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('fails when full_name is empty', () => {
    const result = profileSchema.safeParse({ full_name: '' })
    expect(result.success).toBe(false)
  })

  it('fails when full_name exceeds maxLength', () => {
    const result = profileSchema.safeParse({ full_name: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('fails when phone exceeds maxLength', () => {
    const result = profileSchema.safeParse({ full_name: 'Test', phone: '1'.repeat(21) })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from full_name', () => {
    const result = profileSchema.safeParse({ full_name: '  Budi  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.full_name).toBe('Budi')
  })
})

// ─── contactSchema ────────────────────────────────────────────────────────────

describe('contactSchema', () => {
  it('accepts valid minimal input', () => {
    const result = contactSchema.safeParse({
      name: 'Andi',
      email: 'andi@example.com',
      subject: 'Pertanyaan',
      message: 'Saya ingin bertanya tentang layanan Anda.',
    })
    expect(result.success).toBe(true)
  })

  it('fails when name is missing', () => {
    const result = contactSchema.safeParse({
      email: 'andi@example.com',
      subject: 'Test',
      message: 'Pesan yang cukup panjang',
    })
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Andi',
      email: 'bukan-email',
      subject: 'Test',
      message: 'Pesan yang cukup panjang',
    })
    expect(result.success).toBe(false)
  })

  it('fails when message is too short', () => {
    const result = contactSchema.safeParse({
      name: 'Andi',
      email: 'andi@example.com',
      subject: 'Test',
      message: 'Pendek',
    })
    expect(result.success).toBe(false)
  })

  it('fails when message exceeds maxLength', () => {
    const result = contactSchema.safeParse({
      name: 'Andi',
      email: 'andi@example.com',
      subject: 'Test',
      message: 'x'.repeat(1001),
    })
    expect(result.success).toBe(false)
  })

  it('fails when name exceeds maxLength', () => {
    const result = contactSchema.safeParse({
      name: 'a'.repeat(101),
      email: 'andi@example.com',
      subject: 'Test',
      message: 'Pesan yang cukup panjang untuk valid',
    })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from name', () => {
    const result = contactSchema.safeParse({
      name: '  Andi  ',
      email: 'andi@example.com',
      subject: 'Test',
      message: 'Pesan yang cukup panjang untuk valid',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe('Andi')
  })
})
