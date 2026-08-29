"use client";

import { useRef } from "react";

/**
 * Subtle magnetic pull — moves button up to 8px toward cursor while hovered.
 * Light, Apple-like: only translates, no scale, respects reduced-motion.
 * Wraps any child (usually Link styled as .btn).
 */
export function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const mx = Math.max(-8, Math.min(8, x * 0.15));
    const my = Math.max(-6, Math.min(6, y * 0.12));
    el.style.transform = `translate(${mx}px, ${my}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex will-change-transform transition-transform duration-200 ease-apple"
      style={{ transitionProperty: "transform" }}
    >
      {children}
    </div>
  );
}
