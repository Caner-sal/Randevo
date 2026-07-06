import { Check } from "lucide-react";
import { GlowCard } from "@/components/ui/brand/GlowCard";
import { GradientButton } from "@/components/ui/brand/GradientButton";
import { cn } from "@/lib/utils";

export interface PremiumPlanCardProps {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
  isCurrent?: boolean;
  mostPopularLabel: string;
  currentPlanLabel: string;
  activePlanLabel: string;
  ctaLabel?: string;
  onSelect?: () => void;
  /** Shown instead of a CTA when the plan can't be selected directly (e.g. FREE downgrade requires contact). */
  disabledNote?: string;
}

export function PremiumPlanCard({
  name,
  price,
  features,
  featured,
  isCurrent,
  mostPopularLabel,
  currentPlanLabel,
  activePlanLabel,
  ctaLabel,
  onSelect,
  disabledNote,
}: PremiumPlanCardProps) {
  return (
    <GlowCard
      variant={featured ? "hero" : "default"}
      className={cn(
        "relative flex flex-col p-6 text-left",
        featured && "border-primary/40",
        isCurrent && "ring-2 ring-primary/40"
      )}
    >
      {featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          {mostPopularLabel}
        </span>
      ) : null}
      {isCurrent ? (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">{currentPlanLabel}</div>
      ) : null}
      <h3 className="text-xl font-bold text-foreground">{name}</h3>
      <p className="mt-1 text-2xl font-bold text-foreground">{price}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        {isCurrent ? (
          <div className="rounded-lg border border-border py-2 text-center text-sm text-muted-foreground">
            {activePlanLabel}
          </div>
        ) : disabledNote ? (
          <p className="py-2 text-center text-sm text-muted-foreground/80">{disabledNote}</p>
        ) : onSelect && ctaLabel ? (
          <GradientButton
            onClick={onSelect}
            variant={featured ? "primaryGlow" : "secondaryGlass"}
            className="w-full"
          >
            {ctaLabel}
          </GradientButton>
        ) : null}
      </div>
    </GlowCard>
  );
}
