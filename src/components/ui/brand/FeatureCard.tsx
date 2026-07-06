import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-6 transition-all duration-[var(--motion-base)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(124,92,255,0.12)]",
        className
      )}
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-card-elevated text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
