import { cn } from "@/lib/utils";

export interface PulseDotProps {
  color?: "primary" | "cyan" | "success";
  className?: string;
}

const colorClasses: Record<NonNullable<PulseDotProps["color"]>, string> = {
  primary: "bg-primary",
  cyan: "bg-secondary-accent",
  success: "bg-success",
};

/**
 * Small pulsing indicator (map markers, "live" badges). Uses Tailwind's
 * animate-ping, which is already scoped down to 0.01ms under
 * prefers-reduced-motion via the global rule in src/styles/tokens.css.
 */
export function PulseDot({ color = "primary", className }: PulseDotProps) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)} aria-hidden="true">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
          colorClasses[color]
        )}
      />
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", colorClasses[color])} />
    </span>
  );
}
