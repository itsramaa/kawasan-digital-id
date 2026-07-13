'use server';

import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(filters?: { status?: string; search?: string }) {
  try {
    const where: Prisma.ProjectWhereInput = {};
    if (filters?.status) {
      where.status = filters.status as Prisma.EnumProjectStatusFilter;
    }
    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }
    return await prisma.project.findMany({
      where,
      include: { client: true, pm: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        pm: true,
        tasks: { orderBy: { createdAt: 'desc' } },
        milestones: { orderBy: { orderIndex: 'asc' } },
      },
    });
  } catch {
    return null;
  }
}

export async function getProjectTasks(projectId: string) {
  try {
    return await prisma.task.findMany({
      where: { projectId },
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProjects,
      activeProjects,
      totalClients,
      openTickets,
      monthlyRevenueResult,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'In_Progress' } }),
      prisma.client.count({ where: { status: 'Active' } }),
      prisma.supportTicket.count({ where: { status: { in: ['Open', 'In_Progress', 'Escalated'] } } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'Verified',
          paymentDate: { gte: startOfMonth },
        },
      }),
    ]);

    return {
      totalProjects,
      activeProjects,
      totalClients,
      openTickets,
      monthlyRevenue: monthlyRevenueResult._sum.amount ?? new Prisma.Decimal(0),
    };
  } catch {
    return {
      totalProjects: 0,
      activeProjects: 0,
      totalClients: 0,
      openTickets: 0,
      monthlyRevenue: 0,
    };
  }
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export async function getClients(search?: string) {
  try {
    const where: Prisma.ClientWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    return await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export async function getInquiries(status?: string) {
  try {
    const where: Prisma.InquiryWhereInput = {};
    if (status) {
      where.status = status as Prisma.EnumInquiryStatusFilter;
    }
    return await prisma.inquiry.findMany({
      where,
      include: { client: true, assigned: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getQuotations(status?: string) {
  try {
    const where: Prisma.QuotationWhereInput = {};
    if (status) {
      where.status = status as Prisma.EnumQuoteStatusFilter;
    }
    return await prisma.quotation.findMany({
      where,
      include: { client: true, inquiry: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getContracts(status?: string) {
  try {
    const where: Prisma.ContractWhereInput = {};
    if (status) {
      where.status = status as Prisma.EnumContractStatusFilter;
    }
    return await prisma.contract.findMany({
      where,
      include: { client: true, quotation: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export async function getInvoices(status?: string) {
  try {
    const where: Prisma.InvoiceWhereInput = {};
    if (status) {
      where.status = status as Prisma.EnumInvoiceStatusFilter;
    }
    return await prisma.invoice.findMany({
      where,
      include: { client: true, project: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getPayments() {
  try {
    return await prisma.payment.findMany({
      include: { invoice: { include: { client: true } }, verifier: true },
      orderBy: { paymentDate: 'desc' },
    });
  } catch {
    return [];
  }
}

// ─── Support ──────────────────────────────────────────────────────────────────

export async function getTickets(status?: string) {
  try {
    const where: Prisma.SupportTicketWhereInput = {};
    if (status) {
      where.status = status as Prisma.EnumTicketStatusFilter;
    }
    return await prisma.supportTicket.findMany({
      where,
      include: { client: true, assignee: true, project: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

// ─── Infrastructure ───────────────────────────────────────────────────────────

export async function getDomains() {
  try {
    return await prisma.domain.findMany({
      include: { client: true },
      orderBy: { expiryDate: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getHostings() {
  try {
    return await prisma.hosting.findMany({
      include: { client: true },
      orderBy: { expiryDate: 'asc' },
    });
  } catch {
    return [];
  }
}
