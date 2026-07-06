import { MapPin, Scissors, Search, Star } from "lucide-react";
import { GlowCard } from "@/components/ui/brand/GlowCard";
import { SectionHeader } from "@/components/ui/brand/SectionHeader";

export interface DiscoveryDemoStrings {
  title: string;
  serviceLabel: string;
  locationLabel: string;
  radiusLabel: string;
  serviceValue: string;
  locationValue: string;
}

interface DiscoveryDemoProps {
  strings: DiscoveryDemoStrings;
}

const DEMO_RESULTS = [
  { name: "Salon Aurora", rating: "4.9" },
  { name: "Nova Barber", rating: "4.8" },
  { name: "Luma Beauty", rating: "4.7" },
];

/**
 * Decorative marketplace-search mockup. Sample business names/ratings are
 * static demo fixtures, not a live query — no address/geocoding API call.
 */
export function DiscoveryDemo({ strings }: DiscoveryDemoProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title={strings.title} className="mb-10" />

        <GlowCard className="mx-auto max-w-3xl p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card-elevated/60 px-3.5 py-3">
              <Scissors className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{strings.serviceLabel}</p>
                <p className="truncate text-sm font-medium text-foreground">{strings.serviceValue}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card-elevated/60 px-3.5 py-3">
              <MapPin className="h-4 w-4 shrink-0 text-secondary-accent" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{strings.locationLabel}</p>
                <p className="truncate text-sm font-medium text-foreground">{strings.locationValue}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card-elevated/60 px-3.5 py-3">
              <Search className="h-4 w-4 shrink-0 text-warm-accent" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{strings.radiusLabel}</p>
                <p className="truncate text-sm font-medium text-foreground">5 km</p>
              </div>
            </div>
          </div>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
            {DEMO_RESULTS.map((result) => (
              <li
                key={result.name}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary/40"
              >
                <span className="truncate text-sm font-medium text-foreground">{result.name}</span>
                <span className="ml-2 flex shrink-0 items-center gap-1 text-xs text-warm-accent">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  {result.rating}
                </span>
              </li>
            ))}
          </ul>
        </GlowCard>
      </div>
    </section>
  );
}
