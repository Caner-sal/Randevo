"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function InfiniteMarquee({ children }: { children: ReactNode }) {
  return (
    <div 
      className="flex overflow-hidden whitespace-nowrap relative w-full" 
      style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <motion.div
        className="flex gap-8 items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
      >
        <div className="flex gap-8 items-center px-4">{children}</div>
        <div className="flex gap-8 items-center px-4">{children}</div>
      </motion.div>
    </div>
  );
}
