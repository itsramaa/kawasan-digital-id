'use server'

import { prisma } from '@/src/lib/prisma'
import { InvoiceStatus, UserRole } from '@prisma/client'
import type { User, ServiceTemplate } from '@prisma/client'

export async function getUsers(role?: string): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: role ? { role: role as UserRole } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({ where: { id } })
  } catch {
    return null
  }
}

export async function getAdminStats(): Promise<{
  totalUsers: number
  totalClients: number
  totalTemplates: number
  totalRevenue: number
}> {
  try {
    const [totalUsers, totalClients, totalTemplates, revenueAgg] = await Promise.all([
      prisma.user.count(),
      prisma.client.count(),
      prisma.serviceTemplate.count(),
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: InvoiceStatus.Paid },
      }),
    ])
    return {
      totalUsers,
      totalClients,
      totalTemplates,
      totalRevenue: Number(revenueAgg._sum.amount ?? 0),
    }
  } catch {
    return { totalUsers: 0, totalClients: 0, totalTemplates: 0, totalRevenue: 0 }
  }
}

export async function getAllTemplates(): Promise<ServiceTemplate[]> {
  try {
    return await prisma.serviceTemplate.findMany({
      orderBy: { displayOrder: 'asc' },
    })
  } catch {
    return []
  }
}

// ponytail: SystemSetting model not in schema yet — returns static fallback
export async function getSystemSettings(): Promise<[]> {
  return []
}

// ponytail: SystemSetting model not in schema yet — returns static fallback
export async function updateSystemSetting(_key: string, _value: string): Promise<null> {
  return null
}
