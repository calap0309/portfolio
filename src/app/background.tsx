import { type ReactNode } from "react";

/**
 * Apple-style static background (Section IV).
 *
 * Layers, bottom to top:
 *  1. Pure white base (#ffffff) — set on <body> via globals.css.
 *  2. Hero radial glow: a very soft #f5f5f7 wash at the top, fading to white.
 *  3. A single large, ultra-soft blue blob (Apple "blob") — blur(150px) at 5%
 *     opacity, #0071e3 — placed in the hero region only. Static (no animation).
 *
 * No gradients elsewhere, no glassmorphism, no particle effects. The blurred
 * blue is driven by a CSS variable that is halved on touch/coarse screens for
 * GPU savings (Section VI). Content is rendered above via `relative z-10`.
 */
export function Background({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Soft radial hero glow — barely perceptible, adds depth. On dark theme
           it stays very subtle so it reads as ambient light, not a gray box. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[60vh]"
        style={{
          background: "var(--topwash)",
        }}
      />

      {/* Single ultra-soft static blue blob — hero region only, 5% opacity.
           Rounded-full so it stays a soft circle even if the blur filter fails
           to render on some devices (otherwise it shows as a sharp square). */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/2 z-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full sm:h-[44rem] sm:w-[44rem]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,113,227,0.05) 0%, rgba(0,113,227,0) 70%)",
          filter: "blur(var(--blob-blur, 150px))",
        }}
      />

      {/* Second subtle blob — soft purple depth, barely visible in light, ambient in dark. */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-20 right-[10%] z-0 hidden h-[28rem] w-[28rem] rounded-full opacity-[0.025] blur-[100px] dark:opacity-[0.06] sm:block"
        style={{
          background: "radial-gradient(circle at center, #7c4dff 0%, transparent 70%)",
        }}
      />

      {/* Ultra-fine grid texture — 1px dots, Apple.com subtle, slightly more visible for depth. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02] dark:opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content is stacked above the decorative background. */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
