"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function TiltImage() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-4xl mx-auto mt-20 mb-8 rounded-[24px] cursor-default perspective-1000"
    >
      {/* Outer glow that moves with mouse */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-[#7768d4] to-[#f9a8d4] opacity-30 blur-[80px] -z-10 rounded-full" 
        animate={{ 
          scale: isHovering ? 1.1 : 0.9,
          opacity: isHovering ? 0.4 : 0.2
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Container */}
      <div 
        className="rounded-[24px] border border-[rgba(119,104,212,0.25)] bg-[#09090e]/80 backdrop-blur-sm p-3 md:p-4 shadow-[0_0_50px_rgba(119,104,212,0.15)] relative transform-gpu"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden border border-white/5">
          <Image 
            src="/images/dashboard-mockup.png" 
            alt="Randevo Dashboard Mockup" 
            fill
            className="object-cover"
            priority
          />
          {/* Shiny overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
