import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BusinessResultCard } from "@/components/discover/BusinessResultCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ country: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city } = await params;
  return {
    title: `${city.toUpperCase()} (${country.toUpperCase()}) — Randevo Marketplace`,
    description: `${city} (${country})`,
  };
}

export default async function MarketplaceCountryCityPage({ params }: Props) {
  const { country, city } = await params;
  const t = await getTranslations("marketplace");
  const countryCode = country.toUpperCase();
  const locality = decodeURIComponent(city);

  const matches = await db.normalizedAddress.findMany({
    where: {
      ownerType: "ORGANIZATION",
      countryCode,
      OR: [
        { locality: { contains: locality } },
        { adminLevel2: { contains: locality } },
        { formattedAddress: { contains: locality } },
      ],
    },
    select: { ownerId: true },
    take: 200,
  });

  const organizationIds = [...new Set(matches.map((item) => item.ownerId as string))];

  const orgs = await db.organization.findMany({
    where: {
      marketplaceEnabled: true,
      bookingEnabled: true,
      status: "ACTIVE",
      suspended: false,
      countryCode,
      OR: [
        ...(organizationIds.length > 0 ? [{ id: { in: organizationIds } }] : []),
        { city: { contains: locality } },
        { locality: { contains: locality } },
        { formattedAddress: { contains: locality } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      city: true,
      province: true,
      district: true,
      coverImageUrl: true,
      logoUrl: true,
      _count: { select: { services: { where: { isActive: true } } } },
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link href="/marketplace" className="text-sm text-primary hover:underline">
            ← {t("backToMarketplace")}
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-foreground">
            {locality} ({countryCode})
          </h1>
          <p className="mt-1 text-muted-foreground">{t("locationResultsSubtitle")}</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {orgs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-foreground">{t("emptyStateTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("emptyStateHint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orgs.map((biz) => (
              <BusinessResultCard
                key={biz.id}
                business={{ ...biz, serviceCount: biz._count.services }}
                strings={{
                  serviceCountLabel: t("service"),
                  noReviewsLabel: t("noReviewsYet"),
                  ctaLabel: t("bookCta"),
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

