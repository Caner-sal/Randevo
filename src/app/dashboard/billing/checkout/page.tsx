"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { formatPlanPriceTR, getPlanTR, type TurkeyPlanId } from "@/config/pricing.tr";
import { isUpgradablePlan } from "@/config/billing-plans";
import { CheckoutSummary } from "@/components/billing/CheckoutSummary";
import { GradientButton } from "@/components/ui/brand/GradientButton";
import { ShieldCheck } from "lucide-react";

function CheckoutContent() {
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();

  const planParam = searchParams.get("plan")?.toUpperCase() ?? "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loading state — session henüz hazır değil
  if (sessionStatus === "loading") {
    return (
      <div className="max-w-lg mx-auto mt-16 flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  // Unauthenticated — login'e yönlendir
  if (sessionStatus === "unauthenticated") {
    const callbackUrl = encodeURIComponent(`/dashboard/billing/checkout?plan=${planParam}`);
    router.replace(`/login?callbackUrl=${callbackUrl}`);
    return null;
  }

  // Redirect staff users
  if (session?.user?.appRole === "STAFF_MEMBER") {
    router.replace("/dashboard");
    return null;
  }

  // Validate plan param
  if (!isUpgradablePlan(planParam)) {
    return (
      <div className="max-w-lg mx-auto mt-16 rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-destructive font-medium mb-2">{t("invalidPlan")}</p>
        <p className="text-sm text-muted-foreground mb-6">{t("invalidPlanDesc")}</p>
        <button
          onClick={() => router.push("/dashboard/billing")}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted/40 transition-colors"
        >
          {t("backToBilling")}
        </button>
      </div>
    );
  }

  const selectedPlanId = planParam as TurkeyPlanId;
  const selectedPlan = getPlanTR(selectedPlanId);

  async function handleProceed() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlanId }),
      });
      const json = await res.json() as {
        data?: { url?: string; mode?: string; message?: string; checkoutUrl?: string };
        error?: string;
        code?: string;
      };

      if (!res.ok) {
        if (res.status === 401) {
          const callbackUrl = encodeURIComponent(`/dashboard/billing/checkout?plan=${selectedPlanId}`);
          router.replace(`/login?callbackUrl=${callbackUrl}`);
          return;
        }
        if (res.status === 403) {
          setError(t("checkoutForbidden"));
          return;
        }
        if (res.status === 404 && json.code === "ACTIVE_ORGANIZATION_REQUIRED") {
          setError(t("checkoutOrgRequired"));
          return;
        }
        setError(json.error ?? t("checkoutError"));
        return;
      }

      if (json.data?.url) {
        window.location.href = json.data.url;
        return;
      }
      if (json.data?.checkoutUrl) {
        window.location.href = json.data.checkoutUrl;
        return;
      }
      if (json.data?.mode === "test") {
        // Fake provider: simulate success
        router.push("/dashboard/billing/success?fake=1&plan=" + selectedPlanId);
        return;
      }
      setError(t("checkoutError"));
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 space-y-6">
      <div>
        <button
          onClick={() => router.push("/dashboard/billing")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          ← {t("backToBilling")}
        </button>
        <h1 className="mt-4 text-2xl font-bold text-foreground">{t("checkoutTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("checkoutSubtitle")}</p>
      </div>

      {/* Selected plan summary */}
      <CheckoutSummary
        planName={selectedPlan.nameTR}
        price={formatPlanPriceTR(selectedPlan)}
        perMonthLabel={t("perMonth")}
        selectedPlanLabel={t("selectedPlan")}
        includedFeaturesLabel={t("includedFeatures")}
        features={selectedPlan.features}
        billingCycleLabel={t("billingCycle")}
        monthlyLabel={t("monthly")}
        totalLabel={t("total")}
      />

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">{t("securePaymentNote")}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/dashboard/billing")}
          className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground/90 hover:bg-muted/40 transition-colors"
        >
          {tCommon("cancel")}
        </button>
        <GradientButton
          onClick={() => void handleProceed()}
          disabled={loading}
          variant="primaryGlow"
          className="flex-1"
        >
          {loading ? t("processingPayment") : t("proceedToPayment")}
        </GradientButton>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const tCommon = useTranslations("common");
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground/80">{tCommon("loading")}</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
