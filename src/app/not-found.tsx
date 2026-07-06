import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GradientButton } from "@/components/ui/brand/GradientButton";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-primary leading-none">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Sayfa bulunamadı</h1>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </p>
        <GradientButton asChild size="lg" variant="primaryGlow" className="mt-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Ana Sayfaya Dön
          </Link>
        </GradientButton>
      </div>
    </main>
  );
}
