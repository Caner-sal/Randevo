"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  timezone: string;
  bookingEnabled: boolean;
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED";
  suspended: boolean;
  suspendedAt: string | null;
  suspendedReason: string | null;
  suspendedByUserId: string | null;
  createdAt: string;
  subscription: { plan: string; status: string; currentPeriodEnd: string | null } | null;
  _count: { appointments: number; staff: number; services: number; members: number };
}

function formatPlan(plan: string | undefined): string {
  switch (plan) {
    case "FREE":
      return "ÜCRETSİZ";
    case "STARTER":
      return "BAŞLANGIÇ";
    case "PRO":
      return "PRO";
    case "ENTERPRISE":
      return "KURUMSAL";
    default:
      return plan ?? "ÜCRETSİZ";
  }
}

function formatSubStatus(status: string | undefined): string {
  switch (status) {
    case "ACTIVE":
      return "AKTİF";
    case "TRIALING":
      return "DENEME";
    case "PAST_DUE":
      return "GECİKMİŞ";
    case "CANCELED":
    case "CANCELLED":
      return "İPTAL";
    case "INCOMPLETE":
      return "EKSİK";
    case "INCOMPLETE_EXPIRED":
      return "SÜRESİ DOLMUŞ";
    case "UNPAID":
      return "ÖDENMEMİŞ";
    default:
      return status ?? "—";
  }
}

export default function AdminOrgDetailPage() {
  const params = useParams<{ id: string }>();
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/organizations/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrg(d.data);
        setLoading(false);
      })
      .catch(() => {
        setError("İşletme yüklenemedi.");
        setLoading(false);
      });
  }, [params.id]);

  async function toggleField(field: "suspended" | "bookingEnabled") {
    if (!org) return;
    setSaving(true);
    const payload =
      field === "suspended"
        ? { status: org.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
        : { bookingEnabled: !org.bookingEnabled };
    const res = await fetch(`/api/admin/organizations/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setOrg(data.data);
    } else {
      setError(data.error);
    }
    setSaving(false);
  }

  if (loading) return <div className="text-muted-foreground">Yükleniyor...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!org) return <div className="text-muted-foreground">İşletme bulunamadı.</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-4">
        <Link
          href="/admin/organizations"
          className="rounded text-primary hover:underline text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ← İşletmelere Dön
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{org.name}</h1>
      <p className="text-muted-foreground text-sm mb-6">/{org.slug}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Randevular", value: org._count.appointments },
          { label: "Çalışanlar", value: org._count.staff },
          { label: "Hizmetler", value: org._count.services },
          { label: "Üyeler", value: org._count.members },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border p-4 mb-4">
        <h2 className="font-semibold text-foreground mb-3">Detaylar</h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">E-posta</dt>
          <dd>{org.email ?? "—"}</dd>
          <dt className="text-muted-foreground">Telefon</dt>
          <dd>{org.phone ?? "—"}</dd>
          <dt className="text-muted-foreground">Saat Dilimi</dt>
          <dd>{org.timezone}</dd>
          <dt className="text-muted-foreground">Plan</dt>
          <dd>{formatPlan(org.subscription?.plan)}</dd>
          <dt className="text-muted-foreground">Abonelik Durumu</dt>
          <dd>{formatSubStatus(org.subscription?.status)}</dd>
          <dt className="text-muted-foreground">Oluşturulma</dt>
          <dd>{new Date(org.createdAt).toLocaleDateString("tr-TR")}</dd>
        </dl>
      </div>

      <div className="bg-card rounded-lg border p-4">
        <h2 className="font-semibold text-foreground mb-3">Kontroller</h2>
        <div className="flex gap-3">
          <button
            onClick={() => toggleField("suspended")}
            disabled={saving}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              org.status !== "ACTIVE" || org.suspended
                ? "bg-success text-success-foreground hover:bg-success/90"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }`}
          >
            {org.status !== "ACTIVE" || org.suspended ? "İşletmeyi Aktifleştir" : "İşletmeyi Askıya Al"}
          </button>
          <button
            onClick={() => toggleField("bookingEnabled")}
            disabled={saving}
            className="px-4 py-2 rounded text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {org.bookingEnabled ? "Rezervasyonu Kapat" : "Rezervasyonu Aç"}
          </button>
        </div>
        {(org.status !== "ACTIVE" || org.suspended) && (
          <p className="mt-2 text-sm text-destructive">
            Bu işletme askıya alındı. Genel rezervasyon istekleri 403 döner.
          </p>
        )}
      </div>
    </div>
  );
}
