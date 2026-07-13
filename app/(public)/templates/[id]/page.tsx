// Server Component — data fetched via Prisma Server Actions
// Interactive state (add-ons selection) is handled by TemplateDetailClient
import { getTemplateById, getRelatedTemplates } from '@/app/actions/storefront';
import { TemplateDetailClient } from '@/src/features/storefront/components/detail/TemplateDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage({ params }: Props) {
  const { id } = await params;

  const template = await getTemplateById(id);
  if (!template) notFound();

  const related = await getRelatedTemplates(id, template.category ?? '');

  return (
    // TODO: TemplateDetailClient prop types may not match Prisma-mapped types — cast as any
    <TemplateDetailClient template={template as any} related={related as any} />
  );
}
