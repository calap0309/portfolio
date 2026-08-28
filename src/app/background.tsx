"use client";

import { useEffect, useRef, type ReactNode } from "react";

const PARALLAX_AMOUNT = 10; // px shift on mouse move (Section IV)
const DRIFT_AMOUNT = 5; // ambient autonomous sway amplitude (px)
const DRIFT_PERIOD_MS = 9000; // one full sway cycle (ms) — slow and calm

/**
 * Detect whether the current device reports hover + a fine pointer. Used to
 * disable the mouse-move parallax entirely on touch devices, where applying a
 * transform per pointer event produces jitter. Prefers `(hover: hover)` over a
 * crude `ontouchstart` sniff, but falls back to that sniff when the media query
 * is unsupported. Returns `false` on the server so SSR never touches `window`.
 */
function supportsHover(): boolean {
  // Never touch `window` when running on the server (SSR/prerender).
  if (typeof window === "undefined") return false;
  if ("matchMedia" in window) {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }
  return "ontouchstart" in window === false;
}

/**
 * Full-viewport layered "analog" background (Section IV):
 *  - a fixed noise-bearing container (opacity/grain handled in globals.css)
 *  - two large soft radial-gradient blobs
 *  - a quiet warm color field
 *  - a low-contrast 12-column grid, visible only on large screens
 *
 * The blobs drift on a slow autonomous sine sway and additionally track the
 * cursor ~10px using `requestAnimationFrame` (not CSS transitions). On touch /
 * no-hover devices both the mouse parallax and heavier blur are disabled; under
 * `prefers-reduced-motion` the globals.css `!important` override freezes them.
 * Content is rendered above via a `relative z-10` wrapper.
 */
export function Background({ children }: { children: ReactNode }) {
  const topRightRef = useRef<HTMLDivElement | null>(null);
  const bottomLeftRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hover = supportsHover();

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!hover) return;
      // Normalise pointer to [-0.5, 0.5] around the viewport centre, then scale
      // by PARALLAX_AMOUNT. Values are written to target coords; the rAF loop
      // eases current coords toward them so movement stays smooth.
      targetX = (event.clientX / window.innerWidth - 0.5) * PARALLAX_AMOUNT * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * PARALLAX_AMOUNT * 2;
    };

    const loop = (t: number) => {
      // Two independent slow sine waves (phase-shifted) for a calm, organic
      // sway that never feels algorithmic. Combined with the eased mouse
      // target below, the blobs read as breathing rather than following.
      const swayX =
        Math.sin((t / DRIFT_PERIOD_MS) * Math.PI * 2) * DRIFT_AMOUNT;
      const swayY =
        Math.sin((t / DRIFT_PERIOD_MS) * Math.PI * 2 + 2) * DRIFT_AMOUNT;

      // Exponential ease toward the (mouse + sway) target — a natural, slightly
      // lazy follow. Transforms touch only these two composited fixed elements.
      currentX += (targetX + swayX - currentX) * 0.05;
      currentY += (targetY + swayY - currentY) * 0.05;

      if (topRightRef.current) {
        topRightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (bottomLeftRef.current) {
        bottomLeftRef.current.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {/* Fixed backdrop layer sits behind everything (z-0). */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" />

      {/* Top-right accent blob: ochre-ish tone at 30% opacity. Blur is driven
          by a CSS variable reduced to 50% on coarse-pointer screens
          (see globals.css) to save GPU. */}
      <div
        ref={topRightRef}
        aria-hidden
        className="bg-blob pointer-events-none fixed -right-24 -top-24 z-0 hidden h-[34rem] w-[34rem] sm:block"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212, 197, 178, 0.3) 0%, rgba(212, 197, 178, 0) 70%)",
          filter: "blur(var(--blob-blur-top, 120px))",
          willChange: "transform",
        }}
      />

      {/* Bottom-left accent blob: terracotta tone at 12% opacity. */}
      <div
        ref={bottomLeftRef}
        aria-hidden
        className="bg-blob pointer-events-none fixed -bottom-32 -left-24 z-0 hidden h-[36rem] w-[36rem] sm:block"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201, 105, 75, 0.12) 0%, rgba(201, 105, 75, 0) 70%)",
          filter: "blur(var(--blob-blur-bottom, 160px))",
          willChange: "transform",
        }}
      />

      {/* 12-column grid overlay — visible on large screens only (>= lg). */}
      <div
        aria-hidden
        className="bg-blob pointer-events-none fixed inset-0 z-0 hidden lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(45, 42, 36, 0.05) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 100%",
        }}
      />

      {/* Quiet warm field — a soft, low-opacity ochre wash that calms the
          near-black contrast behind content. Same palette as the blobs, tuned
          to read as warm light rather than a flat gradient. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(212, 163, 115, 0.10) 0%, rgba(212, 163, 115, 0) 70%)",
        }}
      />

      {/* Content is stacked above the decorative background. */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
