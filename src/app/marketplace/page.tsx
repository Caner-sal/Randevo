"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { getMarketplaceCategoryOptions } from "@/data/marketplace-categories";
import { COUNTRY_OPTIONS } from "@/data/country-options";
import AddressAutocomplete from "@/components/address/AddressAutocomplete";
import ProvinceSelect from "@/components/forms/ProvinceSelect";
import DistrictSelect from "@/components/forms/DistrictSelect";
import { buildMarketplaceQueryParams, isTurkeyCountry } from "@/lib/marketplace/filters";
import { DiscoverSearchPanel } from "@/components/discover/DiscoverSearchPanel";
import { BusinessResultCard } from "@/components/discover/BusinessResultCard";
import { LocationPulseMap } from "@/components/discover/LocationPulseMap";
import { GradientButton } from "@/components/ui/brand/GradientButton";
import { FadeIn } from "@/components/ui/brand/FadeIn";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  city: string | null;
  province: string | null;
  district: string | null;
  coverImageUrl: string | null;
  logoUrl: string | null;
  _count: { services: number };
}

export default function MarketplacePage() {
  const locale = useLocale();
  const t = useTranslations("marketplace");

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [locality, setLocality] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const trSelected = isTurkeyCountry(countryCode);
  const categoryOptions = getMarketplaceCategoryOptions(locale);

  const hasActiveFilters = Boolean(q || category || province || district || countryCode || locality);

  useEffect(() => {
    setProvince("");
    setDistrict("");
    setLocality("");
  }, [countryCode]);

  useEffect(() => {
    setDistrict("");
  }, [province]);

  const runSearch = useCallback(() => {
    setLoading(true);
    setError(false);
    const params = buildMarketplaceQueryParams({ q, category, province, district, countryCode, locality });

    fetch(`/api/marketplace?${params.toString()}`)
      .then((r) => r.json())
      .then((res: { data?: Business[]; ok?: boolean }) => {
        if (res.ok === false) {
          setError(true);
          setBusinesses([]);
          return;
        }
        setBusinesses(res.data ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [q, category, province, district, countryCode, locality]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  function clearFilters() {
    setQ("");
    setCategory("");
    setCountryCode("");
    setProvince("");
    setDistrict("");
    setLocality("");
  }

  const locationLabel = [district, province, locality, countryCode].filter(Boolean).join(", ") || t("allCountries");

  return (
    <div className="min-h-screen bg-background pb-16 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <DiscoverSearchPanel
          title={t("title")}
          subtitle={t("subtitle")}
          footer={
            <GradientButton type="button" onClick={runSearch} variant="primaryGlow">
              <Search className="h-4 w-4" aria-hidden="true" />
              {t("searchButton")}
            </GradientButton>
          }
        >
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{t("allCategories")}</option>
            {categoryOptions.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{t("allCountries")}</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {trSelected ? (
            <>
              <ProvinceSelect value={province} onChange={setProvince} placeholder={t("allCities")} />
              <DistrictSelect
                provinceSlug={province}
                value={district}
                onChange={setDistrict}
                disabled={!province}
                placeholder={t("districtPlaceholder")}
              />
            </>
          ) : (
            <AddressAutocomplete
              locale={locale}
              countryCode={countryCode || undefined}
              placeholder={t("citySearchPlaceholder")}
              value={locality}
              onChange={setLocality}
              onSelect={(normalized) => {
                const nextLocality = normalized.locality ?? normalized.adminLevel2 ?? normalized.formattedAddress;
                setLocality(nextLocality);
              }}
            />
          )}
        </DiscoverSearchPanel>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <LocationPulseMap label={locationLabel} />
          <div className="flex items-center gap-4">
            {!loading && !error ? (
              <p className="text-sm text-muted-foreground">{t("resultsCount", { count: businesses.length })}</p>
            ) : null}
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                {t("clearFiltersLabel")}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          {error ? (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span>{t("searchErrorMessage")}</span>
              <button
                onClick={runSearch}
                className="shrink-0 text-xs font-medium underline underline-offset-2 hover:no-underline"
              >
                {t("retryLabel")}
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl border border-border bg-card" />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-foreground">{t("emptyStateTitle")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("emptyStateHint")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((biz, index) => (
                <FadeIn key={biz.id} index={index % 6}>
                  <BusinessResultCard
                    business={{ ...biz, serviceCount: biz._count.services }}
                    strings={{
                      serviceCountLabel: t("service"),
                      noReviewsLabel: t("noReviewsYet"),
                      ctaLabel: t("bookCta"),
                    }}
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
