"use client";

import { useRef, useState } from "react";

export default function SpotlightCard({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[20px] ${className}`}
      style={{
        border: "1px solid rgba(119,104,212,0.1)",
        background: "#111120",
        transition: "all 0.22s",
        ...style
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(119,104,212,0.12), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
