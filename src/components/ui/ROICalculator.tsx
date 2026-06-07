"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function ROICalculator() {
  const [appointments, setAppointments] = useState(300);
  
  const timeSavedValue = useSpring(0, { stiffness: 100, damping: 30 });
  const extraRevenueValue = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    // 10 minutes per appointment = hours saved
    const hoursSaved = Math.round((appointments * 10) / 60);
    // 40 TL extra revenue capacity per appointment
    const revenue = appointments * 40;
    
    timeSavedValue.set(hoursSaved);
    extraRevenueValue.set(revenue);
  }, [appointments, timeSavedValue, extraRevenueValue]);

  const displayTime = useTransform(timeSavedValue, (val) => Math.round(val));
  const displayRevenue = useTransform(extraRevenueValue, (val) => 
    new Intl.NumberFormat("tr-TR").format(Math.round(val)) + " ₺"
  );

  return (
    <div className="w-full max-w-4xl mx-auto my-24 p-[1px] rounded-[24px] bg-gradient-to-b from-[#7768d4]/40 to-transparent shadow-[0_0_40px_rgba(119,104,212,0.08)] relative">
      <div className="bg-[#111120] rounded-[24px] p-8 md:p-14 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#7768d4] blur-[120px] opacity-10 pointer-events-none" />
        
        <h3 style={{ fontFamily: "var(--font-heading, Outfit, sans-serif)" }} className="text-[clamp(24px,3vw,36px)] font-bold mb-4 tracking-tight">
          Potansiyel Kazancınızı Hesaplayın
        </h3>
        <p className="text-[#8a8aaa] text-base mb-12 max-w-xl mx-auto leading-relaxed">
          Randevo kullanarak her bir randevuda kaybettiğiniz manuel süreyi nasıl nakite ve boş zamana dönüştüreceğinizi görün.
        </p>

        <div className="mb-14 max-w-2xl mx-auto">
          <label style={{ fontFamily: "var(--font-heading, Outfit, sans-serif)" }} className="flex justify-between items-center text-sm font-bold text-[#a59cf0] uppercase tracking-wider mb-6">
            <span>Aylık Randevu Sayısı</span>
            <span className="text-white text-xl px-4 py-1 bg-[rgba(119,104,212,0.15)] rounded-lg">{appointments}</span>
          </label>
          <input 
            type="range" 
            min="50" 
            max="2000" 
            step="50" 
            value={appointments} 
            onChange={(e) => setAppointments(parseInt(e.target.value))}
            className="w-full h-2 bg-[rgba(119,104,212,0.2)] rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: "#7768d4"
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="border border-[rgba(119,104,212,0.15)] bg-[#09090e] p-8 rounded-[20px] text-left">
            <p className="text-[#8a8aaa] text-xs font-bold uppercase tracking-wider mb-3">Kazanılan Zaman</p>
            <div style={{ fontFamily: "var(--font-heading, Outfit, sans-serif)" }} className="text-4xl md:text-5xl font-extrabold text-white flex items-baseline gap-2">
              <motion.span>{displayTime}</motion.span>
              <span className="text-base text-[#8a8aaa] font-medium tracking-normal">Saat/Ay</span>
            </div>
          </div>
          <div className="border border-[#7768d4]/30 bg-[#09090e] p-8 rounded-[20px] relative overflow-hidden text-left shadow-[0_0_30px_rgba(119,104,212,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#7768d4]/10 to-transparent pointer-events-none" />
            <p className="text-[#a59cf0] text-xs font-bold uppercase tracking-wider mb-3 relative z-10">Artan Gelir Kapasitesi</p>
            <div style={{ fontFamily: "var(--font-heading, Outfit, sans-serif)" }} className="text-4xl md:text-5xl font-extrabold text-white flex items-baseline gap-2 relative z-10">
              <motion.span>{displayRevenue}</motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
