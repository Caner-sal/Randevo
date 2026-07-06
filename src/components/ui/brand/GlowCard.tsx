import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowCardVariants = cva(
  "relative rounded-xl border backdrop-blur-md transition-shadow duration-[var(--motion-base)]",
  {
    variants: {
      variant: {
        default: "border-border bg-card/80 shadow-[0_0_30px_rgba(124,92,255,0.08)]",
        hero: "border-white/10 bg-card/60 shadow-[0_0_42px_rgba(124,92,255,0.18)]",
        cyan: "border-secondary-accent/20 bg-card/70 shadow-[0_0_30px_rgba(34,211,238,0.14)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface GlowCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glowCardVariants> {}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(glowCardVariants({ variant }), className)} {...props} />
  )
);
GlowCard.displayName = "GlowCard";

export { GlowCard, glowCardVariants };
