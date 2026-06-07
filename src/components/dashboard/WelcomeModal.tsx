"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function WelcomeModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setOpen(true);
      
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#7768d4', '#2de4a4', '#f43f5e']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#7768d4', '#2de4a4', '#f43f5e']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Clean URL silently without triggering a reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md text-center p-8 bg-card border-border">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2 text-center text-foreground" style={{ fontFamily: "var(--font-heading, Outfit, sans-serif)" }}>
            Randevo'ya Hoş Geldiniz!
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            İşletmeniz başarıyla kuruldu. Artık randevularınızı almaya ve işinizi dijitalde büyütmeye hazırsınız.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-3">
          <button 
            onClick={() => { setOpen(false); router.push("/dashboard/services"); }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold transition-all hover:opacity-90"
          >
            İlk Hizmetinizi Ekleyin
          </button>
          <button 
            onClick={() => setOpen(false)}
            className="w-full text-muted-foreground hover:text-foreground py-2 font-medium transition-colors"
          >
            Paneli Keşfet
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
