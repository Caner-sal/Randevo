/* eslint-disable @next/next/no-img-element */
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlowCard } from "@/components/ui/brand/GlowCard";
import { GradientButton } from "@/components/ui/brand/GradientButton";

export interface BusinessResultCardData {
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  city: string | null;
  province: string | null;
  district: string | null;
  coverImageUrl: string | null;
  logoUrl: string | null;
  serviceCount: number;
}

export interface BusinessResultCardStrings {
  serviceCountLabel: string;
  noReviewsLabel: string;
  ctaLabel: string;
}

interface BusinessResultCardProps {
  business: BusinessResultCardData;
  strings: BusinessResultCardStrings;
}

/**
 * Single shared marketplace result card — replaces the 3 near-duplicate
 * inline card implementations documented in docs/ui-redesign-audit.md §2
 * (marketplace/page.tsx, marketplace/location/[country]/[city]/page.tsx,
 * and the old discover BusinessCard).
 */
export function BusinessResultCard({ business, strings }: BusinessResultCardProps) {
  const location = [business.district, business.province ?? business.city].filter(Boolean).join(", ");

  return (
    <GlowCard className="group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40">
      <Link href={`/marketplace/${business.slug}`} className="flex flex-1 flex-col gap-3">
        {business.coverImageUrl ? (
          <img
            src={business.coverImageUrl}
            alt={business.name}
            className="h-32 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary-accent/10">
            <span className="text-2xl font-bold text-primary/60">{business.name.charAt(0)}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {business.logoUrl ? (
            <img src={business.logoUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : null}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {business.name}
            </h2>
            {location ? <p className="truncate text-xs text-muted-foreground">{location}</p> : null}
          </div>
        </div>

        {business.description ? (
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{business.description}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs">
          {business.category ? (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{business.category}</span>
          ) : null}
          <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
            {business.serviceCount} {strings.serviceCountLabel}
          </span>
          <span className="ml-auto flex items-center gap-1 text-muted-foreground/50 italic">
            <Star className="h-3 w-3" aria-hidden="true" />
            {strings.noReviewsLabel}
          </span>
        </div>
      </Link>

      <GradientButton asChild size="sm" variant="primaryGlow" className="w-full">
        <Link href={`/booking/${business.slug}`} onClick={(e) => e.stopPropagation()}>
          {strings.ctaLabel}
        </Link>
      </GradientButton>
    </GlowCard>
  );
}
