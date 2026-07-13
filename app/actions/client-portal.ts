'use server'

import { prisma } from '@/src/lib/prisma'
import type {
  Project,
  Invoice,
  Contract,
  Domain,
  Hosting,
  SupportTicket,
  Client,
} from '@prisma/client'

export async function getClientProjects(clientId: string): Promise<Project[]> {
  try {
    return await prisma.project.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getClientInvoices(clientId: string): Promise<Invoice[]> {
  try {
    return await prisma.invoice.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getClientContracts(clientId: string): Promise<Contract[]> {
  try {
    return await prisma.contract.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

// Order has no clientId — query by userId stored on the order
export async function getClientOrders(clientId: string): Promise<any[]> {
  try {
    // Orders are linked via userId; find users belonging to this client first
    const users = await prisma.user.findMany({
      where: { clientId },
      select: { id: true },
    })
    const userIds = users.map((u) => u.id)
    if (userIds.length === 0) return []
    return await prisma.order.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getClientDomains(clientId: string): Promise<Domain[]> {
  try {
    return await prisma.domain.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getClientHostings(clientId: string): Promise<Hosting[]> {
  try {
    return await prisma.hosting.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getClientTickets(clientId: string): Promise<SupportTicket[]> {
  try {
    return await prisma.supportTicket.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getClientProfile(clientId: string): Promise<Client | null> {
  try {
    return await prisma.client.findUnique({ where: { id: clientId } })
  } catch {
    return null
  }
}
