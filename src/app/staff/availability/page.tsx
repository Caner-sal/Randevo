"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;

interface AvailabilityRule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function StaffAvailabilityPage() {
  const t = useTranslations("staffPortal");
  const tCommon = useTranslations("common");

  const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
    MONDAY: tCommon("monday"),
    TUESDAY: tCommon("tuesday"),
    WEDNESDAY: tCommon("wednesday"),
    THURSDAY: tCommon("thursday"),
    FRIDAY: tCommon("friday"),
    SATURDAY: tCommon("saturday"),
    SUNDAY: tCommon("sunday"),
  };

  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/staff/me/availability")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setRules(d.data);
      });
  }, []);

  function updateRule(day: string, field: keyof AvailabilityRule, value: string | boolean) {
    setRules((prev) => {
      const existing = prev.find((r) => r.dayOfWeek === day);
      if (existing) return prev.map((r) => (r.dayOfWeek === day ? { ...r, [field]: value } : r));
      return [...prev, { dayOfWeek: day, startTime: "09:00", endTime: "17:00", isActive: true, [field]: value }];
    });
  }

  function isEnabled(day: string) {
    return rules.some((r) => r.dayOfWeek === day);
  }

  function toggleDay(day: string) {
    if (isEnabled(day)) {
      setRules((prev) => prev.filter((r) => r.dayOfWeek !== day));
    } else {
      setRules((prev) => [...prev, { dayOfWeek: day, startTime: "09:00", endTime: "17:00", isActive: true }]);
    }
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/staff/me/availability", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rules),
    });
    setSaving(false);
    setMessage(res.ok ? t("savedSuccess") : t("saveFailed"));
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t("myAvailability")}</h1>
      <div className="divide-y rounded-lg border bg-card">
        {DAYS.map((day) => {
          const rule = rules.find((r) => r.dayOfWeek === day);
          const enabled = !!rule;
          return (
            <div key={day} className="flex items-center gap-4 px-4 py-3">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleDay(day)}
                aria-label={DAY_LABELS[day]}
                className="h-4 w-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="w-24 text-sm font-medium text-foreground/90">{DAY_LABELS[day]}</span>
              {enabled ? (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={rule?.startTime ?? "09:00"}
                    onChange={(e) => updateRule(day, "startTime", e.target.value)}
                    aria-label={`${DAY_LABELS[day]} start time`}
                    className="rounded border border-input bg-background text-foreground px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-muted-foreground">—</span>
                  <input
                    type="time"
                    value={rule?.endTime ?? "17:00"}
                    onChange={(e) => updateRule(day, "endTime", e.target.value)}
                    aria-label={`${DAY_LABELS[day]} end time`}
                    className="rounded border border-input bg-background text-foreground px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground/80">{tCommon("closed")}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {saving ? tCommon("saving") : t("saveAvailability")}
        </button>
        {message && <span className={`text-sm ${message === t("saveFailed") ? "text-destructive" : "text-success"}`}>{message}</span>}
      </div>
    </div>
  );
}
