/* eslint-disable @next/next/no-img-element */
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";
import { getProvinceBySlug } from "@/data/turkey-provinces";
import { Link } from "@/i18n/navigation";
import { GradientButton } from "@/components/ui/brand/GradientButton";
import type { Metadata } from "next";

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("marketplace");
  const province = getProvinceBySlug(slug);
  if (province) {
    return {
      title: `${province.name} — Randevo Marketplace`,
      description: `${province.name}`,
    };
  }
  const org = await db.organization.findFirst({
    where: { slug, marketplaceEnabled: true },
    select: { name: true, description: true },
  });
  if (!org) return { title: t("businessNotFoundTitle") };
  return {
    title: `${org.name} — Randevo`,
    description: org.description ?? org.name,
  };
}

export default async function MarketplaceSlugPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("marketplace");

  const province = getProvinceBySlug(slug);
  if (province) {
    permanentRedirect(`/marketplace/location/tr/${province.slug}`);
  }

  const org = await db.organization.findFirst({
    where: {
      slug,
      marketplaceEnabled: true,
      bookingEnabled: true,
      suspended: false,
      status: "ACTIVE",
    },
    select: {
      name: true,
      slug: true,
      description: true,
      category: true,
      city: true,
      province: true,
      district: true,
      coverImageUrl: true,
      logoUrl: true,
      phone: true,
      email: true,
      address: true,
      services: {
        where: { isActive: true },
        select: { id: true, name: true, durationMinutes: true, priceCents: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!org) notFound();

  const location = [org.district, org.province ?? org.city].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/marketplace" className="text-sm text-primary hover:underline">
            ← {t("backToMarketplace")}
          </Link>
        </div>
        {org.coverImageUrl && <img src={org.coverImageUrl} alt={org.name} className="h-48 w-full object-cover" />}
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-6">
          {org.logoUrl && (
            <img src={org.logoUrl} alt="" className="h-16 w-16 rounded-full border border-border object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              {org.category && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{org.category}</span>
              )}
              {location && <span className="text-muted-foreground">{location}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {org.description && (
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">{t("aboutTitle")}</h2>
            <p className="text-muted-foreground">{org.description}</p>
          </section>
        )}

        {(org.phone || org.email || org.address) && (
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">{t("contactTitle")}</h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              {org.phone && (
                <p>
                  {t("phoneLabel")}: {org.phone}
                </p>
              )}
              {org.email && (
                <p>
                  {t("emailLabel")}: {org.email}
                </p>
              )}
              {org.address && (
                <p>
                  {t("addressLabel")}: {org.address}
                </p>
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t("servicesTitle")}</h2>
          {org.services.length === 0 ? (
            <p className="text-muted-foreground">{t("noServicesYet")}</p>
          ) : (
            <div className="grid gap-3">
              {(org.services as Service[]).map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{svc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("durationMinutes", { count: svc.durationMinutes })}
                    </p>
                  </div>
                  {svc.priceCents > 0 && (
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                        svc.priceCents / 100,
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="pt-4 text-center">
          <GradientButton asChild size="lg" variant="primaryGlow">
            <Link href={`/booking/${org.slug}`}>{t("bookCta")}</Link>
          </GradientButton>
        </div>
      </main>
    </div>
  );
}
