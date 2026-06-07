"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const testimonials = [
  { name: "Caner S.", role: "Berber Salonu Sahibi", text: "Randevo'ya geçtiğimizden beri telefon trafiğimiz %80 azaldı. Müşterilerim gece yarısı bile randevu alabiliyor. Harika bir sistem." },
  { name: "Ayşe K.", role: "Güzellik Merkezi", text: "Daha önce defter kullanıyorduk ve sürekli karışıklık çıkıyordu. Şimdi her şey dijital, personelimin performansı bile arttı." },
  { name: "Dr. Mehmet Y.", role: "Diş Hekimi", text: "Randevu iptallerinde otomatik olarak sıradakilere haber veren sistem sayesinde boşluklarımız anında doluyor. Kazancımız çok arttı." },
  { name: "Selin T.", role: "Diyetisyen", text: "Online ödeme alma özelliği beni büyük bir dertten kurtardı. Müşterilerim ödemesini yapıp randevusunu kesinleştiriyor." },
  { name: "Ahmet B.", role: "Spor Eğitmeni", text: "Özel derslerimi organize etmek artık çok kolay. Kendi paketlerimi oluşturup satabiliyorum." }
];

export default function TestimonialCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="py-20 overflow-hidden cursor-grab active:cursor-grabbing">
      <div className="max-w-7xl mx-auto px-7 mb-10 text-center">
        <h2 style={{ fontFamily: "var(--font-heading, Outfit, sans-serif)" }} className="text-3xl md:text-4xl font-bold mb-4">
          Binlerce İşletme Bize Güveniyor
        </h2>
        <p className="text-[#8a8aaa] text-lg max-w-2xl mx-auto">
          Randevo kullanan işletmelerin deneyimlerine göz atın. Kaydırarak daha fazlasını okuyun.
        </p>
      </div>
      
      <motion.div ref={carouselRef} className="overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-6 px-7 md:px-[calc(50vw-600px)] w-max"
        >
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="w-[320px] md:w-[400px] min-h-[220px] bg-[#111120] border border-[rgba(119,104,212,0.15)] rounded-[20px] p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4 text-[#a59cf0]">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-[#f0eff8] text-base leading-relaxed mb-6">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7768d4] to-[#f9a8d4] flex items-center justify-center font-bold text-white shadow-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-[#8a8aaa] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
