import { Bell, Calendar, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { GlowCard } from "@/components/ui/brand/GlowCard";
import { PulseDot } from "@/components/ui/brand/PulseDot";

export interface LiveDashboardPreviewStrings {
  liveLabel: string;
  todayAppointments: string;
  newCustomer: string;
  nearbySearch: string;
  openSlot: string;
  whatsappActive: string;
}

interface LiveDashboardPreviewProps {
  strings: LiveDashboardPreviewStrings;
}

/**
 * Marketing-only mockup — every value below is synthetic demo data, not a
 * live query against real tenant data (see docs/ui-redesign-audit.md's
 * security notes for REDESIGN-3).
 */
export function LiveDashboardPreview({ strings }: LiveDashboardPreviewProps) {
  const rows = [
    { icon: Calendar, label: strings.todayAppointments, value: "12" },
    { icon: Sparkles, label: strings.newCustomer, value: "+1" },
    { icon: MapPin, label: strings.nearbySearch, value: "" },
    { icon: Bell, label: strings.openSlot, value: "16:00" },
    { icon: MessageCircle, label: strings.whatsappActive, value: "" },
  ];

  return (
    <GlowCard variant="hero" className="w-full max-w-md p-5">
      <div className="mb-4 flex items-center gap-2">
        <PulseDot color="cyan" />
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary-accent">
          {strings.liveLabel}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-card-elevated/60 px-3 py-2.5"
          >
            <span className="flex items-center gap-2.5 text-sm text-foreground">
              <row.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {row.label}
            </span>
            {row.value ? (
              <span className="shrink-0 text-sm font-semibold tabular-nums text-secondary-accent">
                {row.value}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
