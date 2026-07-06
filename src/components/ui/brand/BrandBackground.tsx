import { brandGradients } from "@/lib/design/tokens";

interface BrandBackgroundProps {
  /**
   * "hero" gives a stronger glow for public marketing sections (landing,
   * marketplace). "calm" is a lighter touch for authenticated dashboard
   * surfaces that already have dense UI. Defaults to "calm".
   */
  variant?: "hero" | "calm";
  className?: string;
}

/**
 * Decorative gradient glow layer. Renders absolutely within its nearest
 * positioned ancestor — mount it inside a `relative` section wrapper, not
 * globally, since the base subtle glow is already applied to every page
 * via the `body` background in globals.css.
 */
export function BrandBackground({ variant = "calm", className = "" }: BrandBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: brandGradients.heroGlow,
        opacity: variant === "hero" ? 1 : 0.5,
      }}
    />
  );
}
