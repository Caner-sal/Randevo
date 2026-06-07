import type { Metadata } from "next";
import MeshGradient from "@/components/ui/MeshGradient";

export const metadata: Metadata = {
  title: "Randevo — Giriş",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Login, Register ve Onboarding sayfaları kendi tam ekran layout'larını yönetiyor.
  // Bu wrapper sadece sade bir geçiş katmanı.
  return (
    <div className="min-h-screen relative">
      <MeshGradient />
      {children}
    </div>
  );
}
