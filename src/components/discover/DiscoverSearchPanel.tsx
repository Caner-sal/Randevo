import type { ReactNode } from "react";
import { GlowCard } from "@/components/ui/brand/GlowCard";

interface DiscoverSearchPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Glass-panel visual shell for the marketplace search form. Holds no state
 * or filter logic itself — the caller supplies the actual inputs as
 * children, keeping this component reusable and presentation-only.
 */
export function DiscoverSearchPanel({ title, subtitle, children, footer }: DiscoverSearchPanelProps) {
  return (
    <GlowCard variant="hero" className="p-5 sm:p-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>

      {footer ? <div className="mt-4 flex justify-end">{footer}</div> : null}
    </GlowCard>
  );
}
