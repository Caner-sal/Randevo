import { requireAuth } from "@/lib/tenant";
import { getAnalytics } from "@/services/analytics.service";
import { getTranslations } from "next-intl/server";
import { Calendar, CalendarClock, CalendarRange, CheckCircle2, Star, Trophy, UserX, Wallet, XCircle } from "lucide-react";
import { MetricCard } from "@/components/ui/brand/MetricCard";
import { GlowCard } from "@/components/ui/brand/GlowCard";

async function fetchAnalytics() {
  try {
    const { org } = await requireAuth();
    return await getAnalytics(org.id);
  } catch {
    return null;
  }
}

export default async function AnalyticsPage() {
  const t = await getTranslations("analytics");
  const tCommon = await getTranslations("common");
  const analytics = await fetchAnalytics();

  const revenue = analytics
    ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
        analytics.estimatedRevenueCents / 100
      )
    : "—";

  const completionRate =
    analytics && analytics.monthAppointments > 0
      ? Math.round((analytics.completedCount / analytics.monthAppointments) * 100)
      : 0;

  const cancellationRate =
    analytics && analytics.monthAppointments > 0
      ? Math.round((analytics.cancelledCount / analytics.monthAppointments) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {!analytics ? (
        <GlowCard className="p-10 text-center text-muted-foreground/80">{t("loadError")}</GlowCard>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <MetricCard label={t("today")} value={analytics.todayAppointments} helperText={t("todayDesc")} icon={CalendarClock} accent="primary" />
            <MetricCard label={t("thisWeek")} value={analytics.weekAppointments} helperText={t("thisWeekDesc")} icon={CalendarRange} accent="cyan" />
            <MetricCard label={t("thisMonth")} value={analytics.monthAppointments} helperText={t("thisMonthDesc")} icon={Calendar} accent="amber" />
            <MetricCard
              label={tCommon("completed")}
              value={analytics.completedCount}
              trend={{ value: t("completionRate", { rate: completionRate }), direction: "up" }}
              icon={CheckCircle2}
              accent="success"
            />
            <MetricCard
              label={tCommon("cancelled")}
              value={analytics.cancelledCount}
              trend={{ value: t("cancelRate", { rate: cancellationRate }), direction: "down" }}
              icon={XCircle}
              accent="destructive"
            />
            <MetricCard label={tCommon("noShow")} value={analytics.noShowCount} helperText={t("noShowDesc")} icon={UserX} accent="destructive" />
            <MetricCard label={t("estimatedRevenue")} value={revenue} helperText={t("revenueDesc")} icon={Wallet} accent="amber" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <GlowCard className="p-6">
              <h2 className="mb-4 font-semibold text-foreground">{t("statusDistribution")}</h2>
              <div className="space-y-3">
                {[
                  { label: tCommon("completed"), value: analytics.completedCount, color: "bg-success" },
                  { label: tCommon("cancelled"), value: analytics.cancelledCount, color: "bg-destructive" },
                  { label: tCommon("noShow"), value: analytics.noShowCount, color: "bg-warm-accent" },
                ].map(({ label, value, color }) => {
                  const pct =
                    analytics.monthAppointments > 0
                      ? Math.round((value / analytics.monthAppointments) * 100)
                      : 0;
                  return (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium text-foreground">
                          {value} (%{pct})
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlowCard>

            <GlowCard variant="hero" className="p-6">
              <h2 className="mb-4 font-semibold text-foreground">{t("highlights")}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-card-elevated/60 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm-accent/15 text-warm-accent">
                    <Trophy className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{t("topService")}</p>
                    <p className="mt-0.5 font-semibold text-foreground">{analytics.topServiceName ?? tCommon("noData")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-card-elevated/60 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-accent/15 text-secondary-accent">
                    <Star className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{t("topStaff")}</p>
                    <p className="mt-0.5 font-semibold text-foreground">{analytics.busiestStaffName ?? tCommon("noData")}</p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </>
      )}
    </div>
  );
}
