import { cn } from "@/lib/utils";

export interface AdminStatCardProps {
  label: string;
  value: number | string;
  danger?: boolean;
  className?: string;
}

/**
 * Single shared "stat tile" for the admin panel — replaces the identical
 * local `StatCard` copy-pasted across subscriptions/usage pages (see
 * docs/ui-redesign-audit.md §3).
 */
export function AdminStatCard({ label, value, danger, className }: AdminStatCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", danger ? "text-destructive" : "text-foreground")}>{value}</p>
    </div>
  );
}
