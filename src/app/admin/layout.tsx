import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id || session.user.platformRole !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 text-foreground">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">Randevo Yönetim</span>
          <nav aria-label="Admin navigation" className="flex gap-4 text-sm flex-wrap">
            <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Genel Bakış</Link>
            <Link href="/admin/organizations" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">İşletmeler</Link>
            <Link href="/admin/subscriptions" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Abonelikler</Link>
            <Link href="/admin/usage" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Kullanım</Link>
            <Link href="/admin/audit-logs" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">İşlem Kayıtları</Link>
            <Link href="/admin/health" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Sağlık</Link>
            <Link href="/admin/product-events" className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Product Events</Link>
          </nav>
        </div>
        <div className="text-sm text-muted-foreground">{session.user.email}</div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
