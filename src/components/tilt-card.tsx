"use client";

import { useRef } from "react";

/**
 * Subtle 3D tilt on mouse move — max ±4deg, preserves Apple minimalism.
 * Disabled on touch/coarse and reduced-motion.
 */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    const rx = (-py * 4).toFixed(2);
    const ry = (px * 6).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.25s ease-out" }}
    >
      {children}
    </div>
  );
}
