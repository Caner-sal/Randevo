import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import {
  Bot,
  BellRing,
  Calendar as CalendarIcon,
  Check,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { getMarketConfig } from "@/config/locale-market";
import { HeroShowcase } from "@/components/landing/HeroShowcase";
import { DiscoveryDemo } from "@/components/landing/DiscoveryDemo";
import { BusinessControlSection } from "@/components/landing/BusinessControlSection";
import { GlobalMapPreview } from "@/components/landing/GlobalMapPreview";
import { FeatureCard } from "@/components/ui/brand/FeatureCard";
import { FadeIn } from "@/components/ui/brand/FadeIn";
import { SectionHeader } from "@/components/ui/brand/SectionHeader";
import { GlowCard } from "@/components/ui/brand/GlowCard";
import { GradientButton } from "@/components/ui/brand/GradientButton";

const RandevoLogo = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="2" y="6" width="28" height="23" rx="5" fill="hsl(var(--primary) / 0.14)" stroke="hsl(var(--primary))" strokeWidth="1.4" />
    <path d="M2 12.5h28" stroke="hsl(var(--primary))" strokeWidth="0.9" opacity="0.4" />
    <line x1="10" y1="3" x2="10" y2="9.5" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="3" x2="22" y2="9.5" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 20.5L14.5 25L22 17" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function HomePage() {
  const t = await getTranslations("landing");
  const cookieStore = await cookies();
  const country = cookieStore.get("randevo_country")?.value ?? "TR";
  const market = getMarketConfig(country);
  const isTurkey = market.landingVariant === "turkey";

  const featureCards = [
    { title: t("f1Title"), desc: t("f1Desc"), icon: CalendarIcon },
    { title: t("f2Title"), desc: t("f2Desc"), icon: BellRing },
    ...(isTurkey ? [{ title: t("f3Title"), desc: t("f3Desc"), icon: MapPin }] : []),
    { title: t("f4Title"), desc: t("f4Desc"), icon: Wallet },
    { title: t("f5Title"), desc: t("f5Desc"), icon: Users },
    { title: t("f6Title"), desc: t("f6Desc"), icon: ShieldCheck },
    { title: t("f7Title"), desc: t("f7Desc"), icon: Bot },
    { title: t("f8Title"), desc: t("f8Desc"), icon: Search },
  ];

  const plans = [
    {
      id: "FREE",
      name: t("ctaFree"),
      price: "₺0",
      per: t("freeForever"),
      features: [t("f1Title"), t("f2Title"), t("f3Title")],
      cta: t("ctaFree"),
      featured: false,
    },
    {
      id: "STARTER",
      name: t("ctaStarter"),
      price: "₺40",
      per: t("monthly"),
      features: [t("f1Title"), t("f2Title"), t("f3Title"), t("f4Title")],
      cta: t("ctaStarter"),
      featured: true,
    },
    {
      id: "PRO",
      name: t("ctaPro"),
      price: "₺249",
      per: t("monthly"),
      features: [t("f1Title"), t("f2Title"), t("f4Title"), t("f5Title")],
      cta: t("ctaPro"),
      featured: false,
    },
  ];

  const stats = [
    { value: "500+", label: t("statBusinesses") },
    { value: "12K+", label: t("statMonthly") },
    ...(isTurkey ? [{ value: t("statSupportValue"), label: t("statSupport") }] : []),
    { value: "%94", label: t("statCompletion") },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── NAV ── */}
      <nav className="fixed inset-x-0 top-0 z-50 h-[66px] border-b border-white/10 bg-background/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-7">
          <Link href="/" className="flex items-center gap-2.5">
            <RandevoLogo />
            <span className="text-xl font-bold tracking-tight text-foreground">Randevo</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="rounded-lg border border-white/10 px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("navSignIn")}
            </Link>
            <GradientButton asChild size="sm" variant="primaryGlow">
              <Link href="/register">{t("navStartFree")}</Link>
            </GradientButton>
          </div>
        </div>
      </nav>

      <HeroShowcase
        isTurkey={isTurkey}
        badge={t("heroBadge")}
        titleLine1={t("heroTitle1")}
        titleLine2={t("heroTitle2")}
        titleLine3={t("heroTitle3")}
        description={t("heroDesc")}
        ctaStartLabel={t("heroStartFree")}
        ctaDemoLabel={t("heroDemo")}
        stats={stats}
        preview={{
          liveLabel: t("previewLiveLabel"),
          todayAppointments: t("previewTodayAppointments"),
          newCustomer: t("previewNewCustomer"),
          nearbySearch: t("previewNearbySearch"),
          openSlot: t("previewOpenSlot"),
          whatsappActive: t("previewWhatsappActive"),
        }}
      />

      {/* ── INDUSTRIES ── */}
      <section className="py-10 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/70">
            {t("industriesLabel")}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[t("i1"), t("i2"), t("i3"), t("i4"), t("i5"), t("i6"), t("i7"), t("i8")].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FadeIn>
        <DiscoveryDemo
          strings={{
            title: t("discoveryDemoTitle"),
            serviceLabel: t("discoveryDemoServiceLabel"),
            locationLabel: t("discoveryDemoLocationLabel"),
            radiusLabel: t("discoveryDemoRadiusLabel"),
            serviceValue: t("discoveryDemoServiceValue"),
            locationValue: t("discoveryDemoLocationValue"),
          }}
        />
      </FadeIn>

      {/* ── FEATURES ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            align="left"
            eyebrow={t("featuresLabel")}
            title={t("featuresTitle")}
            description={t("featuresDesc")}
            className="mb-12 mx-0 text-left"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card, index) => (
              <FadeIn key={card.title} index={index}>
                <FeatureCard icon={card.icon} title={card.title} description={card.desc} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <FadeIn>
        <BusinessControlSection
          strings={{
            title: t("businessControlTitle"),
            description: t("businessControlDesc"),
            schedulingLabel: t("businessControlSchedulingLabel"),
            paymentsLabel: t("businessControlPaymentsLabel"),
            teamLabel: t("businessControlTeamLabel"),
            remindersLabel: t("businessControlRemindersLabel"),
          }}
        />
      </FadeIn>

      <FadeIn>
        <GlobalMapPreview strings={{ title: t("globalMapTitle"), description: t("globalMapDesc") }} />
      </FadeIn>

      {/* ── PRICING ── */}
      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow={t("pricingLabel")} title={t("pricingTitle")} description={t("pricingDesc")} className="mb-12" />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {plans.map((plan, index) => (
              <FadeIn key={plan.id} index={index}>
                <GlowCard
                  variant={plan.featured ? "hero" : "default"}
                  className={`relative p-6 text-left ${plan.featured ? "border-primary/40" : ""}`}
                >
                  {plan.featured ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      {t("mostPopular")}
                    </span>
                  ) : null}
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{plan.name}</p>
                  <p className="text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.price}
                    <span className="text-base font-medium text-muted-foreground">{t("perMonth")}</span>
                  </p>
                  <p className="mb-6 mt-1 text-sm text-muted-foreground">{plan.per}</p>
                  <ul className="mb-6 flex flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check
                          className={`h-4 w-4 shrink-0 ${plan.featured ? "text-secondary-accent" : "text-primary"}`}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <GradientButton
                    asChild
                    className="w-full"
                    variant={plan.featured ? "primaryGlow" : "secondaryGlass"}
                  >
                    <Link href="/register">{plan.cta}</Link>
                  </GradientButton>
                </GlowCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary-accent/10 px-8 py-16 text-center sm:py-20">
            <h2 className="text-[clamp(1.6rem,4vw,2.75rem)] font-extrabold tracking-tight text-foreground">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{t("ctaDesc")}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <GradientButton asChild size="lg" variant="primaryGlow">
                <Link href="/register">{t("ctaCreateAccount")}</Link>
              </GradientButton>
              <GradientButton asChild size="lg" variant="secondaryGlass">
                <Link href="/marketplace">{t("ctaExplore")}</Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <RandevoLogo />
            <span className="text-sm font-semibold text-muted-foreground">Randevo</span>
          </Link>
          <div className="flex gap-5">
            <Link href="/legal/privacy" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
              {t("footerPrivacy")}
            </Link>
            <Link href="/legal/kvkk" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
              {t("footerKVKK")}
            </Link>
            <Link href="/legal/terms" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
              {t("footerTerms")}
            </Link>
            <Link href="/legal/cookies" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
              Cookies
            </Link>
          </div>
          <p className="text-sm text-muted-foreground/70">{t("footerCopyright")}</p>
        </div>
      </footer>
    </main>
  );
}
