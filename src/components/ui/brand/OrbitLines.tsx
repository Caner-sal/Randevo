export interface OrbitLinesProps {
  className?: string;
}

/**
 * Purely decorative concentric-orbit motif (RANDEVO_PREMIUM_UI_REDESIGN_PLAN.md
 * §3.2 — "hafif orbit çizgileri"). Inherits color via `currentColor`, so wrap
 * it in an element with a text-* color class (e.g. text-primary).
 */
export function OrbitLines({ className }: OrbitLinesProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className={className} fill="none">
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
      <circle cx="200" cy="200" r="170" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <circle
        cx="200"
        cy="200"
        r="80"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    </svg>
  );
}
