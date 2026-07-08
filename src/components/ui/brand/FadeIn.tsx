"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Stagger index — each increment delays entrance by ~60ms. */
  index?: number;
  /** Direction the content slides in from. Defaults to "up". */
  direction?: "up" | "none";
}

/**
 * Subtle fade+slide entrance, used sparingly on public marketing/discovery
 * surfaces only (RANDEVO_PREMIUM_UI_REDESIGN_PLAN.md §6 — "Result card
 * appear: fade + slide", not overused in the dashboard). Fully collapses to
 * an instant, no-motion appearance when the user prefers reduced motion.
 */
export function FadeIn({ children, className, index = 0, direction = "up" }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: direction === "up" ? 16 : 0 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, delay: index * 0.06, ease: "easeOut" },
        },
      };

  return (
    <motion.div
      className={cn("motion-fade-in", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
