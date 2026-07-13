// Server Component — initial data fetched via Prisma Server Actions
// Client-side filtering is handled by the child TemplatesClient component
import { getServiceTemplates, getTemplateCategories } from '@/app/actions/storefront';
import { TemplatesClient } from '@/src/features/storefront/components/templates/TemplatesClient';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const [templates, categories] = await Promise.all([
    getServiceTemplates(),
    getTemplateCategories(),
  ]);

  return (
    // TODO: TemplatesClient prop types may not match Prisma-mapped types — cast as any
    <TemplatesClient templates={templates as any} categories={categories} />
  );
}
