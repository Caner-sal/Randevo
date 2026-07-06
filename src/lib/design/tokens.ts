/**
 * Additive brand design constants for the premium UI redesign (REDESIGN-1+).
 *
 * These mirror the CSS custom properties in src/styles/tokens.css. Prefer
 * the CSS variables / Tailwind utility classes (bg-secondary-accent,
 * bg-warm-accent, bg-success, bg-card-elevated, ...) inside components —
 * use these JS constants only where a raw string is required (inline
 * `style` gradients, framer-motion transition config, etc.).
 */

export const brandColors = {
  primaryAccent: "#7768D4",
  secondaryAccent: "#22D3EE",
  warmAccent: "#F59E0B",
  success: "#10B981",
  cardElevated: "#141D33",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
} as const;

export const brandGradients = {
  /** Two soft radial glows, meant to sit above the app's existing bg-background. */
  heroGlow:
    "radial-gradient(circle at 20% 10%, rgba(124, 92, 255, 0.22), transparent 35%), " +
    "radial-gradient(circle at 85% 20%, rgba(34, 211, 238, 0.16), transparent 30%)",
} as const;

export const motionDuration = {
  fast: 150,
  base: 250,
  slow: 400,
} as const;
