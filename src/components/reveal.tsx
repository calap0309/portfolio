"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts (used for staggering). */
  delay?: number;
  /** Vertical offset (px) the element starts translated up by. Default 20. */
  offset?: number;
}

/**
 * Apple-style scroll reveal (Section II).
 *
 * Fades an element in with a gentle translateY(offset) -> translateY(0) as it
 * enters the viewport via an IntersectionObserver, over 0.6s with ease-out.
 * Respects `prefers-reduced-motion` by rendering fully visible without a
 * transition. Only plays once per mount.
 *
 * @param delay  staggering delay in ms
 * @param offset starting vertical translation in px (Apple signature 20px)
 */

/** Subscribe to the OS reduced-motion preference (client only). */
function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Read the current reduced-motion preference (client only). */
function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({ children, className, delay = 0, offset = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);

  // Live reduced-motion signal; server snapshot is always false.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const visible = entered || reducedMotion;

  useEffect(() => {
    const el = ref.current;
    if (!el || entered) return;

    if (typeof IntersectionObserver === "undefined") {
      // Fallback when IO is unavailable — reveal asynchronously to avoid a
      // synchronous setState within the effect body.
      const t = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(t);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEntered(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [entered]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
        transition: reducedMotion
          ? "none"
          : `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
