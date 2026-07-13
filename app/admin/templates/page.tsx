export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAllTemplates } from '@/app/actions/admin'

export default async function AdminTemplatesPage() {
  const templates = await getAllTemplates()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Templates</h1>
        <p className="text-muted-foreground">
          All available service templates ordered by display order.
        </p>
      </div>

      {templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{template.name}</CardTitle>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {template.isFeatured && (
                      <Badge variant="default" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={template.isActive ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Category: <span className="font-medium text-foreground">{template.category}</span>
                  </p>
                  {template.description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  )}
                </div>
                <p className="text-lg font-semibold">
                  Rp {Number(template.basePrice).toLocaleString('id-ID')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
