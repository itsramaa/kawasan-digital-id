import { useActivityLogs } from "../hooks/useActivityLogs";
import { FileText, FolderKanban, Receipt, HeadphonesIcon, Upload, MessageSquare, Activity } from "lucide-react";

const entityIcons: Record<string, typeof Activity> = {
  project: FolderKanban,
  invoice: Receipt,
  ticket: HeadphonesIcon,
  document: FileText,
  feedback: MessageSquare,
  upload: Upload,
};

export function ActivityLogList() {
  const { data: logs, isLoading } = useActivityLogs(30);

  if (isLoading) return <p className="text-sm text-muted-foreground text-center py-4">Memuat...</p>;
  if (!logs?.length) return <p className="text-sm text-muted-foreground text-center py-4" role="status">Belum ada aktivitas tercatat.</p>;

  return (
    <div className="space-y-1">
      {logs.map((log) => {
        const Icon = entityIcons[log.entity_type] || Activity;
        return (
          <div key={log.id} className="flex items-start gap-3 py-2.5 px-3 rounded-md hover:bg-muted/30 transition-colors">
            <div className="p-1.5 rounded-md bg-muted flex-shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{log.action}</p>
              <p className="text-[10px] text-muted-foreground">
                {log.entity_type} · {new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
