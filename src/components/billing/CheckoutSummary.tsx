import { Check } from "lucide-react";
import { GlowCard } from "@/components/ui/brand/GlowCard";

export interface CheckoutSummaryProps {
  planName: string;
  price: string;
  perMonthLabel: string;
  selectedPlanLabel: string;
  includedFeaturesLabel: string;
  features: string[];
  billingCycleLabel: string;
  monthlyLabel: string;
  totalLabel: string;
}

export function CheckoutSummary({
  planName,
  price,
  perMonthLabel,
  selectedPlanLabel,
  includedFeaturesLabel,
  features,
  billingCycleLabel,
  monthlyLabel,
  totalLabel,
}: CheckoutSummaryProps) {
  return (
    <GlowCard variant="hero" className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{selectedPlanLabel}</p>
          <h2 className="mt-1 text-xl font-bold text-foreground">{planName}</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{price}</p>
          <p className="text-xs text-muted-foreground">{perMonthLabel}</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {includedFeaturesLabel}
        </p>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{billingCycleLabel}</span>
          <span className="font-medium text-foreground">{monthlyLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{totalLabel}</span>
          <span className="font-bold text-foreground">{price}</span>
        </div>
      </div>
    </GlowCard>
  );
}
