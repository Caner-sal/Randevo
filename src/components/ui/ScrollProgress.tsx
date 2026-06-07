"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #7768d4, #d49cf5, #f9a8d4)",
        boxShadow: "0 0 10px rgba(212, 156, 245, 0.8), 0 0 20px rgba(119, 104, 212, 0.6)",
        transformOrigin: "0%",
        zIndex: 99999,
      }}
    />
  );
}
