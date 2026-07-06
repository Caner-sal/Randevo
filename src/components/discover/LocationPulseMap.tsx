import { MapPin } from "lucide-react";
import { PulseDot } from "@/components/ui/brand/PulseDot";

interface LocationPulseMapProps {
  label: string;
}

/**
 * Lightweight decorative location accent shown next to search results
 * (RANDEVO_PREMIUM_UI_REDESIGN_PLAN.md §5.2 — "Harita preview, opsiyonel").
 * Purely visual — not an interactive map, no Maps/Places API key needed.
 */
export function LocationPulseMap({ label }: LocationPulseMapProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5">
      <span className="relative flex h-4 w-4 items-center justify-center">
        <PulseDot color="cyan" className="absolute" />
      </span>
      <MapPin className="h-3.5 w-3.5 text-secondary-accent" aria-hidden="true" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
