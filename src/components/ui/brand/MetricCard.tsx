import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "primary" | "cyan" | "amber" | "success" | "destructive";

export interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down" | "flat";
  };
  accent?: Accent;
  className?: string;
}

const accentGradient: Record<Accent, string> = {
  primary: "from-primary to-secondary-accent",
  cyan: "from-secondary-accent to-primary",
  amber: "from-warm-accent to-primary",
  success: "from-success to-secondary-accent",
  destructive: "from-destructive to-warm-accent",
};

const accentText: Record<Accent, string> = {
  primary: "text-primary",
  cyan: "text-secondary-accent",
  amber: "text-warm-accent",
  success: "text-success",
  destructive: "text-destructive",
};

const trendClasses: Record<NonNullable<MetricCardProps["trend"]>["direction"], string> = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

const trendGlyph: Record<NonNullable<MetricCardProps["trend"]>["direction"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

/**
 * Single shared "big number" card, replacing the ad-hoc StatCard/BigStat
 * duplicates across dashboard/analytics/admin (see docs/ui-redesign-audit.md §3).
 */
export function MetricCard({ label, value, icon: Icon, trend, accent = "primary", className }: MetricCardProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-5", className)}>
      <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r", accentGradient[accent])} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        </div>
        {Icon ? (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card-elevated",
              accentText[accent]
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {trend ? (
        <p className={cn("mt-2 text-xs font-medium", trendClasses[trend.direction])}>
          {trendGlyph[trend.direction]} {trend.value}
        </p>
      ) : null}
    </div>
  );
}
