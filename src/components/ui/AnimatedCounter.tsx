"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  
  // Extract number and text parts
  const numMatch = value.match(/(\d+)/);
  const number = numMatch ? parseInt(numMatch[1], 10) : 0;
  const prefix = numMatch ? value.substring(0, numMatch.index) : "";
  const suffix = numMatch ? value.substring((numMatch.index || 0) + numMatch[1].length) : value;

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(number);
    }
  }, [inView, motionValue, number]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.floor(latest).toString() + suffix;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
