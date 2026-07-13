'use server';

import { prisma } from '@/src/lib/prisma';
import type { ServiceTemplate, Testimonial, StoreFAQ } from '@/src/features/storefront/types';

// Helper: map Prisma ServiceTemplate to storefront ServiceTemplate type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTemplate(t: any): ServiceTemplate {
  return {
    id: t.id,
    name: t.name,
    description: t.description ?? null,
    thumbnail_url: t.thumbnailUrl ?? null,
    category: t.category ?? null,
    base_price: Number(t.basePrice),
    estimated_days: t.estimatedDays ?? null,
    is_active: t.isActive,
    is_featured: t.isFeatured,
    display_order: t.displayOrder,
    created_at: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
    demo_url: t.demoUrl ?? null,
    revision_limit: t.revisionLimit ?? null,
    gallery_images: Array.isArray(t.galleryImages) ? t.galleryImages : [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTestimonial(t: any): Testimonial {
  return {
    id: t.id,
    client_name: t.clientName,
    client_company: t.clientCompany ?? null,
    avatar_url: t.avatarUrl ?? null,
    content: t.content,
    rating: t.rating,
    is_published: t.isPublished,
    display_order: t.displayOrder,
    created_at: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFaq(f: any): StoreFAQ {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    display_order: f.displayOrder,
    is_published: f.isPublished,
    created_at: f.createdAt instanceof Date ? f.createdAt.toISOString() : String(f.createdAt),
    category: f.category ?? null,
  };
}

export async function getServiceTemplates(filters?: {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
}): Promise<ServiceTemplate[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };
    if (filters?.featured !== undefined) where.isFeatured = filters.featured;
    if (filters?.categorySlug) where.category = filters.categorySlug;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const rows = await prisma.serviceTemplate.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return rows.map(mapTemplate);
  } catch (err) {
    console.error('[getServiceTemplates]', err);
    return [];
  }
}

export async function getTemplateById(id: string): Promise<ServiceTemplate | null> {
  try {
    const row = await prisma.serviceTemplate.findUnique({
      where: { id },
      include: { features: { orderBy: { displayOrder: 'asc' } } },
    });
    if (!row) return null;
    return mapTemplate(row);
  } catch (err) {
    console.error('[getTemplateById]', err);
    return null;
  }
}

export async function getFeaturedTemplates(): Promise<ServiceTemplate[]> {
  try {
    const rows = await prisma.serviceTemplate.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    });
    return rows.map(mapTemplate);
  } catch (err) {
    console.error('[getFeaturedTemplates]', err);
    return [];
  }
}

export async function getRelatedTemplates(
  templateId: string,
  categoryId: string,
): Promise<ServiceTemplate[]> {
  try {
    const rows = await prisma.serviceTemplate.findMany({
      where: {
        isActive: true,
        category: categoryId,
        NOT: { id: templateId },
      },
      orderBy: { displayOrder: 'asc' },
      take: 4,
    });
    return rows.map(mapTemplate);
  } catch (err) {
    console.error('[getRelatedTemplates]', err);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
    return rows.map(mapTestimonial);
  } catch (err) {
    console.error('[getTestimonials]', err);
    return [];
  }
}

export async function getFAQs(category?: string): Promise<StoreFAQ[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isPublished: true };
    if (category) where.category = category;
    const rows = await prisma.storeFaq.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
    return rows.map(mapFaq);
  } catch (err) {
    console.error('[getFAQs]', err);
    return [];
  }
}

// NOTE: No TemplateCategory model in schema — derive unique categories from ServiceTemplate.category
export async function getTemplateCategories(): Promise<string[]> {
  try {
    const rows = await prisma.serviceTemplate.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r: { category: string | null }) => r.category as string);
  } catch (err) {
    console.error('[getTemplateCategories]', err);
    return [];
  }
}
