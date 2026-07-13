import 'dotenv/config'
import { resolve } from 'path'
import { config } from 'dotenv'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Make sure .env.local exists and contains DATABASE_URL.')
  }

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  try {
    // Check if any super_admin exists
    const existing = await prisma.user.findFirst({
      where: { role: 'super_admin' },
    })

    if (existing) {
      console.log('✅ super_admin already exists:')
      console.log(`   email: ${existing.email}`)
      console.log(`   role:  ${existing.role}`)
      console.log('Skipping seed.')
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash('KawasanAdmin2026!', 12)

    // Create super_admin
    const user = await prisma.user.create({
      data: {
        email: 'admin@kawasandigital.com',
        name: 'Super Admin',
        passwordHash,
        role: 'super_admin',
        isActive: true,
      },
    })

    console.log('✅ super_admin created successfully:')
    console.log(`   id:    ${user.id}`)
    console.log(`   email: ${user.email}`)
    console.log(`   name:  ${user.name}`)
    console.log(`   role:  ${user.role}`)
    console.log(`   isActive: ${user.isActive}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
