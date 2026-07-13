import { ActivityItem } from "../hooks/useClientActivity";
import { FolderKanban, Receipt, HeadphonesIcon } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";

const typeConfig = {
  project: { icon: FolderKanban, label: "Proyek" },
  invoice: { icon: Receipt, label: "Tagihan" },
  ticket: { icon: HeadphonesIcon, label: "Tiket" },
};

const statusVariant = (status: string): "info" | "success" | "warning" | "error" | "neutral" => {
  if (["Paid", "Completed", "Resolved", "Closed", "Approved"].includes(status)) return "success";
  if (["In Progress", "Sent", "Open"].includes(status)) return "info";
  if (["Overdue", "Escalated", "Critical"].includes(status)) return "error";
  if (["Planning", "Draft", "Pending"].includes(status)) return "warning";
  return "neutral";
};

interface ActivityTimelineProps {
  items: ActivityItem[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (!items.length) return <p className="text-sm text-muted-foreground text-center py-4" role="status">Belum ada aktivitas terbaru.</p>;

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const cfg = typeConfig[item.type];
        const Icon = cfg.icon;
        return (
          <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/30 transition-colors">
            <div className="p-1.5 rounded-md bg-muted flex-shrink-0">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{cfg.label} · {new Date(item.created_at).toLocaleDateString("id-ID")}</p>
            </div>
            <StatusBadge status={item.status} variant={statusVariant(item.status)} className="text-[10px] px-1.5 py-0" />
          </div>
        );
      })}
    </div>
  );
}
