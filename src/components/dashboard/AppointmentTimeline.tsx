import { GlowCard } from "@/components/ui/brand/GlowCard";
import type { TodayAppointmentSummary } from "@/services/analytics.service";

interface AppointmentTimelineProps {
  title: string;
  emptyLabel: string;
  appointments: TodayAppointmentSummary[];
  locale?: string;
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  PENDING: "bg-warm-accent/15 text-warm-accent",
  CONFIRMED: "bg-secondary-accent/15 text-secondary-accent",
  COMPLETED: "bg-success/15 text-success",
  CANCELLED: "bg-destructive/15 text-destructive",
  NO_SHOW: "bg-muted text-muted-foreground",
};

export function AppointmentTimeline({ title, emptyLabel, appointments, locale }: AppointmentTimelineProps) {
  return (
    <GlowCard className="p-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {appointments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-1">
          {appointments.map((apt) => (
            <li
              key={apt.id}
              className="flex items-center gap-3 border-b border-white/5 py-2.5 text-sm last:border-b-0"
            >
              <span className="w-14 shrink-0 tabular-nums text-muted-foreground">
                {new Date(apt.startTime).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{apt.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {apt.serviceName} · {apt.staffName}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  STATUS_BADGE_CLASSES[apt.status] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {apt.status.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ol>
      )}
    </GlowCard>
  );
}
