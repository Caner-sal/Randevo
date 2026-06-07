"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: ScrollRevealProps) {
  const directionOffset = 40;

  let y = 0;
  let x = 0;

  if (direction === "up") y = directionOffset;
  if (direction === "down") y = -directionOffset;
  if (direction === "left") x = directionOffset;
  if (direction === "right") x = -directionOffset;

  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom ease for a premium feel
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
