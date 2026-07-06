import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GradientButton } from "@/components/ui/brand/GradientButton";
import { OrbitLines } from "@/components/ui/brand/OrbitLines";
import { PulseDot } from "@/components/ui/brand/PulseDot";
import { LiveDashboardPreview, type LiveDashboardPreviewStrings } from "./LiveDashboardPreview";

export interface HeroShowcaseProps {
  isTurkey: boolean;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  ctaStartLabel: string;
  ctaDemoLabel: string;
  stats: Array<{ value: string; label: string }>;
  preview: LiveDashboardPreviewStrings;
}

export function HeroShowcase({
  isTurkey,
  badge,
  titleLine1,
  titleLine2,
  titleLine3,
  description,
  ctaStartLabel,
  ctaDemoLabel,
  stats,
  preview,
}: HeroShowcaseProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 sm:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-primary opacity-70"
      >
        <OrbitLines className="absolute -right-24 -top-24 h-[420px] w-[420px] sm:h-[560px] sm:w-[560px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
        <div className="text-center lg:text-left">
          {isTurkey ? (
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <PulseDot />
              <span className="text-xs font-bold uppercase tracking-wide text-accent-foreground">{badge}</span>
            </div>
          ) : null}

          <h1 className="text-[clamp(2.6rem,7vw,4.75rem)] font-extrabold leading-[1.06] tracking-tight text-foreground">
            {titleLine1}
            <br />
            <span className="bg-gradient-to-r from-[#b3aaff] via-[#d49cf5] to-[#f9a8d4] bg-clip-text text-transparent">
              {titleLine2}
            </span>
            <br />
            {titleLine3}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[clamp(0.95rem,2vw,1.2rem)] leading-relaxed text-muted-foreground lg:mx-0">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3.5 lg:justify-start">
            <GradientButton asChild size="lg" variant="primaryGlow">
              <Link href="/register" className="text-base">
                {ctaStartLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </GradientButton>
            <GradientButton asChild size="lg" variant="secondaryGlass">
              <Link href="/booking/barber-demo" className="text-base">
                {ctaDemoLabel}
              </Link>
            </GradientButton>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-x-14 gap-y-6 border-t border-white/10 pt-10 lg:justify-start">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LiveDashboardPreview strings={preview} />
        </div>
      </div>
    </section>
  );
}
