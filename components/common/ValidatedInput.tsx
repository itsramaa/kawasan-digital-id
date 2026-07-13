import { cn } from "@/src/lib/utils";

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function ValidatedInput({ label, error, icon, className, ...props }: ValidatedInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
        {props.required && <span className="text-destructive">*</span>}
      </label>
      <input
        {...props}
        className={cn(
          "w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
          error ? "border-destructive focus:ring-destructive/30" : "border-border",
          className
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function ValidatedTextarea({ label, error, className, ...props }: ValidatedTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        {...props}
        className={cn(
          "w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors",
          error ? "border-destructive focus:ring-destructive/30" : "border-border",
          className
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface ValidatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function ValidatedSelect({ label, error, options, className, ...props }: ValidatedSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <select
        {...props}
        className={cn(
          "w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
          error ? "border-destructive focus:ring-destructive/30" : "border-border",
          className
        )}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
