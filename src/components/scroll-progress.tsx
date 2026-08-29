"use client";

import { useEffect, useState } from "react";

/**
 * Apple-thin scroll progress bar — 2px high, accent blue.
 * Fixed at top, behind nav (z-50). Width = scrollTop / (scrollHeight - clientHeight).
 * Respects reduced-motion: no transition.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? scrolled / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-transparent"
    >
      <div
        className="h-full bg-accent transition-[transform] duration-150 ease-out will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
