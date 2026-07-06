import { Bell, CalendarCheck, Users, Wallet } from "lucide-react";
import { MetricCard } from "@/components/ui/brand/MetricCard";
import { SectionHeader } from "@/components/ui/brand/SectionHeader";

export interface BusinessControlSectionStrings {
  title: string;
  description: string;
  schedulingLabel: string;
  paymentsLabel: string;
  teamLabel: string;
  remindersLabel: string;
}

interface BusinessControlSectionProps {
  strings: BusinessControlSectionStrings;
}

/** Metric values are illustrative demo figures, not live tenant data. */
export function BusinessControlSection({ strings }: BusinessControlSectionProps) {
  const metrics = [
    { icon: CalendarCheck, label: strings.schedulingLabel, value: "24", accent: "primary" as const },
    { icon: Wallet, label: strings.paymentsLabel, value: "₺4.2K", accent: "amber" as const },
    { icon: Users, label: strings.teamLabel, value: "6", accent: "cyan" as const },
    { icon: Bell, label: strings.remindersLabel, value: "98%", accent: "success" as const },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title={strings.title} description={strings.description} className="mb-10" />

        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              accent={metric.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
