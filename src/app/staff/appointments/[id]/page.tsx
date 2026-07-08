"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type AppointmentDetails = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  notes?: string | null;
  service: { name: string; durationMinutes: number; priceCents: number; currency: string };
  customer: { fullName: string; phone?: string | null; email?: string | null };
};

export default function StaffAppointmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/staff/me/appointments/${id}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? "Failed to load appointment");
        setAppointment(body.data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function setStatus(status: "COMPLETED" | "NO_SHOW") {
    if (!appointment) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch(`/api/staff/me/appointments/${appointment.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json();

    if (!res.ok) {
      setError(body?.error ?? "Failed to update status");
      setSaving(false);
      return;
    }

    setAppointment((prev) => (prev ? { ...prev, status } : prev));
    setMessage(`Status updated to ${status}`);
    setSaving(false);
  }

  if (loading) {
    return <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">Loading appointment...</div>;
  }

  if (!appointment) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
        {error ?? "Appointment not found"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-lg border bg-card p-5">
        <h1 className="mb-3 text-xl font-semibold text-foreground">Appointment details</h1>
        <p className="text-sm text-muted-foreground">Status: {appointment.status}</p>
        <p className="text-sm text-foreground/90">
          {new Date(appointment.startTime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
        </p>
        <p className="text-sm text-foreground/90">
          Service: {appointment.service.name} ({appointment.service.durationMinutes} min)
        </p>
        <p className="text-sm text-foreground/90">
          Customer: {appointment.customer.fullName} ({appointment.customer.phone ?? appointment.customer.email ?? "-"})
        </p>
        {appointment.notes ? <p className="mt-2 text-sm text-foreground/90">Notes: {appointment.notes}</p> : null}
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="mb-3 font-semibold text-foreground">Update status</h2>
        <div className="flex gap-3">
          <button
            disabled={saving}
            onClick={() => setStatus("COMPLETED")}
            className="rounded bg-success px-4 py-2 text-sm font-medium text-success-foreground transition-colors hover:bg-success/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Mark Completed
          </button>
          <button
            disabled={saving}
            onClick={() => setStatus("NO_SHOW")}
            className="rounded bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Mark No-show
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-success">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
