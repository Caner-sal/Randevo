import { CalendarClock, Users } from "lucide-react";
import { GlowCard } from "@/components/ui/brand/GlowCard";
import { PulseDot } from "@/components/ui/brand/PulseDot";

export interface TodayCommandCenterStrings {
  headlineActive: string;
  headlineCalm: string;
  appointmentsTodayLabel: string;
  pendingCustomersLabel: string;
}

interface TodayCommandCenterProps {
  todayCount: number;
  pendingCount: number;
  strings: TodayCommandCenterStrings;
}

/** Real-data hero banner — this is the authenticated owner dashboard, not marketing. */
export function TodayCommandCenter({ todayCount, pendingCount, strings }: TodayCommandCenterProps) {
  const headline = todayCount > 0 ? strings.headlineActive : strings.headlineCalm;

  return (
    <GlowCard variant="hero" className="p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <PulseDot color={todayCount > 0 ? "cyan" : "primary"} />
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary-accent">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>
      <h2 className="mt-3 text-xl font-bold text-foreground sm:text-2xl">{headline}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-card-elevated px-3.5 py-1.5 text-sm text-foreground">
          <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
          {strings.appointmentsTodayLabel}
        </span>
        {pendingCount > 0 ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-warm-accent/15 px-3.5 py-1.5 text-sm text-warm-accent">
            <Users className="h-4 w-4" aria-hidden="true" />
            {strings.pendingCustomersLabel}
          </span>
        ) : null}
      </div>
    </GlowCard>
  );
}
