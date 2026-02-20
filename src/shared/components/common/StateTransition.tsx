import { useState } from "react";
import { cn } from "@/shared/utils/utils";
import { ConfirmDialog } from "./ConfirmDialog";
import { ChevronRight, AlertTriangle } from "lucide-react";

export interface Transition {
  label: string;
  to: string;
  variant?: "primary" | "secondary" | "destructive";
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

interface StateTransitionProps {
  currentStatus: string;
  transitions: Transition[];
  onTransition: (newStatus: string) => void;
  isLoading?: boolean;
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-card border border-border text-foreground hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

export function StateTransition({
  currentStatus,
  transitions,
  onTransition,
  isLoading,
  className,
}: StateTransitionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<Transition | null>(null);

  const handleClick = (t: Transition) => {
    if (t.requiresConfirmation) {
      setPendingTransition(t);
      setConfirmOpen(true);
    } else {
      onTransition(t.to);
    }
  };

  const handleConfirm = () => {
    if (pendingTransition) {
      onTransition(pendingTransition.to);
      setPendingTransition(null);
      setConfirmOpen(false);
    }
  };

  if (transitions.length === 0) return null;

  // Group by variant
  const primary = transitions.filter((t) => t.variant === "primary" || !t.variant);
  const secondary = transitions.filter((t) => t.variant === "secondary");
  const destructive = transitions.filter((t) => t.variant === "destructive");

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Actions</p>
      
      {/* Primary */}
      {primary.map((t) => (
        <button
          key={t.to}
          onClick={() => handleClick(t)}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all disabled:opacity-50",
            variantClasses.primary
          )}
        >
          {t.label}
          <ChevronRight className="w-4 h-4" />
        </button>
      ))}

      {/* Secondary */}
      {secondary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {secondary.map((t) => (
            <button
              key={t.to}
              onClick={() => handleClick(t)}
              disabled={isLoading}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all disabled:opacity-50",
                variantClasses.secondary
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Destructive */}
      {destructive.length > 0 && (
        <>
          <div className="border-t border-border my-2" />
          {destructive.map((t) => (
            <button
              key={t.to}
              onClick={() => handleClick(t)}
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all disabled:opacity-50",
                variantClasses.destructive
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={pendingTransition?.confirmTitle ?? `Confirm ${pendingTransition?.label}`}
        description={pendingTransition?.confirmDescription ?? `Are you sure you want to change status to "${pendingTransition?.to}"? This action may affect related entities.`}
        onConfirm={handleConfirm}
        destructive={pendingTransition?.variant === "destructive"}
      />
    </div>
  );
}

// State machine definitions per PRD domain-state-machines.md
export const STATE_MACHINES = {
  inquiry: {
    New: [
      { label: "Qualify", to: "Qualified", variant: "primary" as const },
      { label: "Reject", to: "Rejected", variant: "destructive" as const, requiresConfirmation: true, confirmTitle: "Reject Inquiry", confirmDescription: "This will mark the inquiry as rejected. The client will not be notified." },
    ],
    Qualified: [
      { label: "Convert to Quotation", to: "Converted", variant: "primary" as const, requiresConfirmation: true },
    ],
    Rejected: [],
    Converted: [],
  },
  quotation: {
    Draft: [
      { label: "Send to Client", to: "Sent", variant: "primary" as const, requiresConfirmation: true, confirmTitle: "Send Quotation", confirmDescription: "This will send the quotation to the client. It cannot be modified after sending." },
    ],
    Sent: [
      { label: "Mark Accepted", to: "Accepted", variant: "primary" as const, requiresConfirmation: true },
      { label: "Mark Rejected", to: "Rejected", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Accepted: [],
    Rejected: [],
    Expired: [],
  },
  contract: {
    Draft: [
      { label: "Send for Signature", to: "Sent", variant: "primary" as const, requiresConfirmation: true },
    ],
    Sent: [
      { label: "Mark as Signed", to: "Signed", variant: "primary" as const, requiresConfirmation: true, confirmTitle: "Mark Contract Signed", confirmDescription: "This will mark the contract as signed and create a linked project." },
      { label: "Contract Expired", to: "Expired", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Signed: [
      { label: "Activate", to: "Active", variant: "primary" as const },
    ],
    Active: [
      { label: "Complete", to: "Completed", variant: "primary" as const, requiresConfirmation: true },
      { label: "Terminate", to: "Terminated", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Completed: [],
    Terminated: [],
    Expired: [],
  },
  project: {
    Planning: [
      { label: "Start Project", to: "In Progress", variant: "primary" as const },
    ],
    "In Progress": [
      { label: "Put On Hold", to: "On Hold", variant: "secondary" as const },
      { label: "Mark Completed", to: "Completed", variant: "primary" as const, requiresConfirmation: true, confirmTitle: "Complete Project", confirmDescription: "Ensure all milestones are approved before completing." },
      { label: "Cancel Project", to: "Cancelled", variant: "destructive" as const, requiresConfirmation: true },
    ],
    "On Hold": [
      { label: "Resume", to: "In Progress", variant: "primary" as const },
      { label: "Cancel", to: "Cancelled", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Completed: [],
    Cancelled: [],
  },
  invoice: {
    Draft: [
      { label: "Send Invoice", to: "Sent", variant: "primary" as const, requiresConfirmation: true },
    ],
    Sent: [
      { label: "Mark Paid", to: "Paid", variant: "primary" as const, requiresConfirmation: true },
      { label: "Void Invoice", to: "Void", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Viewed: [
      { label: "Mark Paid", to: "Paid", variant: "primary" as const, requiresConfirmation: true },
    ],
    Overdue: [
      { label: "Mark Paid", to: "Paid", variant: "primary" as const, requiresConfirmation: true },
      { label: "Write Off", to: "Bad Debt", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Paid: [],
    Void: [],
    "Bad Debt": [],
  },
  ticket: {
    Open: [
      { label: "Start Triage", to: "Triage", variant: "primary" as const },
      { label: "Escalate", to: "Escalated", variant: "destructive" as const, requiresConfirmation: true },
    ],
    Triage: [
      { label: "Assign & Start", to: "In Progress", variant: "primary" as const },
      { label: "Pending Client", to: "Pending Client", variant: "secondary" as const },
    ],
    "In Progress": [
      { label: "Resolve", to: "Resolved", variant: "primary" as const },
      { label: "Escalate", to: "Escalated", variant: "destructive" as const, requiresConfirmation: true },
    ],
    "Pending Client": [
      { label: "Resume Triage", to: "Triage", variant: "secondary" as const },
      { label: "Auto-Close", to: "Closed", variant: "secondary" as const },
    ],
    Resolved: [
      { label: "Close Ticket", to: "Closed", variant: "primary" as const },
      { label: "Reopen", to: "In Progress", variant: "secondary" as const },
    ],
    Escalated: [
      { label: "Assign & Start", to: "In Progress", variant: "primary" as const },
    ],
    Closed: [],
  },
} as const;