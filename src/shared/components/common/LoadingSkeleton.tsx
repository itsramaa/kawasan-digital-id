import { cn } from "@/shared/utils/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function StatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={cn("grid gap-4", count <= 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4")}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
          <Bone className="w-10 h-10 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Bone className="h-6 w-16" />
            <Bone className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-md">
          <Bone className="w-8 h-8 rounded-md shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Bone className="h-4 w-3/4" />
            <Bone className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 px-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Bone key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-3 py-2.5">
          {Array.from({ length: cols }).map((_, j) => (
            <Bone key={j} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Bone className="h-8 w-48" />
      <Bone className="h-32 w-full rounded-xl" />
      <StatSkeleton />
      <TableSkeleton />
    </div>
  );
}
