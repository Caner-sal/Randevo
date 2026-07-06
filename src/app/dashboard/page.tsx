import { requireAuth } from "@/lib/tenant";
import { getAnalytics, getTodayAppointments } from "@/services/analytics.service";
import { db } from "@/lib/db";
import OnboardingChecklistCard from "@/components/dashboard/OnboardingChecklistCard";
import { TodayCommandCenter } from "@/components/dashboard/TodayCommandCenter";
import { AppointmentTimeline } from "@/components/dashboard/AppointmentTimeline";
import { SmartSuggestions } from "@/components/dashboard/SmartSuggestions";
import { MetricCard } from "@/components/ui/brand/MetricCard";
import {
  Calendar,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  ExternalLink,
  Settings,
  Star,
  Trophy,
  UserX,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

async function getDashboardData() {
  try {
    const { org } = await requireAuth();
    const [analytics, todayAppointments, auditLogs] = await Promise.all([
      getAnalytics(org.id),
      getTodayAppointments(org.id),
      db.auditLog.findMany({
        where: { organizationId: org.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);
    return { analytics, todayAppointments, auditLogs, org };
  } catch {
    return null;
  }
}

const quickLinkMeta = [
  { href: "/dashboard/appointments", labelKey: "viewAppointments" as const, icon: Calendar },
  { href: "/dashboard/services", labelKey: "manageServices" as const, icon: CalendarRange },
  { href: "/dashboard/staff", labelKey: "manageStaff" as const, icon: Users },
  { href: "/dashboard/settings", labelKey: "businessSettings" as const, icon: Settings },
];

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const data = await getDashboardData();
  const analytics = data?.analytics ?? null;
  const todayAppointments = data?.todayAppointments ?? [];
  const auditLogs = data?.auditLogs ?? [];
  const org = data?.org ?? null;

  const quickLinks = quickLinkMeta.map((ql) => ({ ...ql, label: t(ql.labelKey) }));

  const revenue = analytics
    ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
        analytics.estimatedRevenueCents / 100
      )
    : "—";

  const cancellationRate =
    analytics && analytics.monthAppointments > 0
      ? Math.round((analytics.cancelledCount / analytics.monthAppointments) * 100)
      : 0;

  const suggestions: string[] = [];
  if (analytics) {
    if (analytics.pendingTodayCount > 0) {
      suggestions.push(t("suggestionPendingConfirm", { count: analytics.pendingTodayCount }));
    }
    if (analytics.noShowCount > 0) {
      suggestions.push(t("suggestionNoShowReminder", { count: analytics.noShowCount }));
    }
    if (analytics.monthAppointments > 0 && cancellationRate >= 15) {
      suggestions.push(t("suggestionHighCancellation", { rate: cancellationRate }));
    }
  }

  return (
    <div className="space-y-5">
      <TodayCommandCenter
        todayCount={analytics?.todayAppointments ?? 0}
        pendingCount={analytics?.pendingTodayCount ?? 0}
        strings={{
          headlineActive: t("commandCenterHeadlineActive"),
          headlineCalm: t("commandCenterHeadlineCalm"),
          appointmentsTodayLabel: t("commandCenterAppointmentsToday", { count: analytics?.todayAppointments ?? 0 }),
          pendingCustomersLabel: t("commandCenterPendingCustomers", { count: analytics?.pendingTodayCount ?? 0 }),
        }}
      />

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard label={t("todayAppointments")} value={analytics?.todayAppointments ?? "—"} icon={CalendarClock} accent="primary" />
        <MetricCard label={t("thisWeek")} value={analytics?.weekAppointments ?? "—"} icon={CalendarRange} accent="cyan" />
        <MetricCard label={t("thisMonth")} value={analytics?.monthAppointments ?? "—"} icon={Calendar} accent="amber" />
        <MetricCard label={t("completed")} value={analytics?.completedCount ?? "—"} icon={CheckCircle2} accent="success" />
        <MetricCard label={t("cancelled")} value={analytics?.cancelledCount ?? "—"} icon={XCircle} accent="destructive" />
        <MetricCard label={t("noShow")} value={analytics?.noShowCount ?? "—"} icon={UserX} accent="destructive" />
      </div>

      {/* Metric cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label={t("estimatedRevenue")} value={revenue} icon={Wallet} accent="amber" />
        <MetricCard label={t("topService")} value={analytics?.topServiceName ?? t("noData")} icon={Trophy} accent="primary" />
        <MetricCard label={t("topStaff")} value={analytics?.busiestStaffName ?? t("noData")} icon={Star} accent="cyan" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <AppointmentTimeline
          title={t("timelineTitle")}
          emptyLabel={t("timelineEmpty")}
          appointments={todayAppointments}
        />
        <SmartSuggestions title={t("suggestionsTitle")} suggestions={suggestions} allGoodLabel={t("suggestionAllGood")} />
      </div>

      <OnboardingChecklistCard />

      {/* Bottom grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Quick links */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("quickAccess")}</h3>
          <div className="flex flex-col gap-2">
            {quickLinks.map((ql) => (
              <Link
                key={ql.href}
                href={ql.href}
                className="flex items-center gap-3 rounded-lg border border-white/5 px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              >
                <ql.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {ql.label}
              </Link>
            ))}
            {org && (
              <Link
                href={`/booking/${org.slug}`}
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-success/20 px-3.5 py-2.5 text-sm font-medium text-success transition-colors hover:bg-success/5"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("openBookingPage")}
              </Link>
            )}
          </div>
        </div>

        {/* Audit log */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("recentTransactions")}</h3>
          {auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noTransactions")}</p>
          ) : (
            <div>
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 border-b border-white/5 py-2.5 last:border-b-0">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <div>
                      <span className="text-[13px] font-semibold text-foreground">
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <span className="ml-1 text-[13px] text-muted-foreground">· {log.entityType}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                      {new Date(log.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
