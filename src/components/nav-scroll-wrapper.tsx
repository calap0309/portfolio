"use client";

import { useEffect, useState } from "react";

/**
 * Wraps nav inner row — adds shadow + stronger blur when scrolled > 12px.
 * Pure UX: gives depth when user leaves hero, Apple-style.
 */
export function NavScrollWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`row items-center py-3 transition-shadow duration-300 ${scrolled ? "nav-scrolled" : ""}`}>
      {children}
    </div>
  );
}
