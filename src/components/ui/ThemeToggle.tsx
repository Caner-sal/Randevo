"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 36, height: 36 }} />;
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid var(--color-border)",
        background: "var(--color-card)",
        color: "var(--color-foreground)",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s"
      }}
      title="Toggle theme"
    >
      <Sun 
        size={18} 
        style={{ 
          position: "absolute", 
          transition: "all 0.3s",
          opacity: currentTheme === "light" ? 1 : 0, 
          transform: currentTheme === "light" ? "scale(1)" : "scale(0) rotate(-90deg)" 
        }} 
      />
      <Moon 
        size={18} 
        style={{ 
          position: "absolute", 
          transition: "all 0.3s",
          opacity: currentTheme === "dark" ? 1 : 0, 
          transform: currentTheme === "dark" ? "scale(1)" : "scale(0) rotate(90deg)" 
        }} 
      />
    </button>
  );
}
