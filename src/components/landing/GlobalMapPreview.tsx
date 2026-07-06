import { GlowCard } from "@/components/ui/brand/GlowCard";
import { PulseDot } from "@/components/ui/brand/PulseDot";
import { SectionHeader } from "@/components/ui/brand/SectionHeader";

export interface GlobalMapPreviewStrings {
  title: string;
  description: string;
}

interface GlobalMapPreviewProps {
  strings: GlobalMapPreviewStrings;
}

/**
 * Pure CSS/SVG decorative world-dot map — no Maps/Places/Geocoding API key
 * involved, per docs/ui-redesign-audit.md's security guardrails.
 */
const CITIES = [
  { name: "London", x: 26, y: 20 },
  { name: "Amsterdam", x: 40, y: 14 },
  { name: "Berlin", x: 54, y: 16 },
  { name: "Rome", x: 47, y: 46 },
  { name: "Istanbul", x: 70, y: 36 },
];

export function GlobalMapPreview({ strings }: GlobalMapPreviewProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title={strings.title} description={strings.description} className="mb-10" />

        <GlowCard variant="cyan" className="mx-auto aspect-[16/9] max-w-3xl overflow-hidden p-0">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 60"
            className="h-full w-full text-secondary-accent/25"
          >
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 18 }).map((__, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={col * 5.6 + 3}
                  cy={row * 6 + 3}
                  r="0.6"
                  fill="currentColor"
                />
              ))
            )}
          </svg>

          <div className="pointer-events-none absolute inset-0">
            {CITIES.map((city) => (
              <div
                key={city.name}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <PulseDot color="cyan" />
                <span className="whitespace-nowrap rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground">
                  {city.name}
                </span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
