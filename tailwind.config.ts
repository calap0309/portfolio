import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/**
 * Apple-inspired design system.
 *
 * Palette mirrors apple.com product pages:
 *   - background  : pure white #ffffff
 *   - text primary: near-black #1d1d1f (not pure black)
 *   - text secondary : medium gray #86868b
 *   - accent      : Apple blue #0071e3 (hover #0077ed)
 *   - hairline    : section separator #d2d2d7 @ 0.5px
 *
 * Type uses the SF Pro Display stack (falling back through the system UI
 * fonts) at the perfect-fourth (1.333x) scale, all driven by clamp() so it
 * stays fluid and never drops below 16px on mobile (avoids iOS auto-zoom).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        appbg: "#ffffff",
        ink: "#1d1d1f",
        subtext: "#86868b",
        accent: {
          DEFAULT: "#0071e3",
          hover: "#0077ed",
        },
        hairline: "#d2d2d7",
        heroglow: "#f5f5f7",
        /* Apple system red — used only for validation / destructive states. */
        danger: "#d70015",
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.64rem", { lineHeight: "1rem" }],
        sm: ["0.8rem", { lineHeight: "1.25rem" }],
        base: ["clamp(1rem, 1rem + 0.2vw, 1.0625rem)", { lineHeight: "1.47059" }],
        lg: ["1.25rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["2rem", { lineHeight: "2.375rem" }],
        "4xl": ["clamp(2rem, 5vw, 2.75rem)", { lineHeight: "1.1" }],
        "5xl": ["clamp(3rem, 10vw, 5.5rem)", { lineHeight: "1.05" }],
      },
      letterSpacing: {
        apple: "-0.045em",
        tight2: "-0.02em",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.02)",
        "card-hover":
          "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)",
        cta: "0 4px 8px rgba(0,0,0,0.08)",
      },
      maxWidth: {
        text: "980px",
        grid: "1200px",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.28, 0.11, 0.32, 1)",
      },
    },
  },
  plugins: [typography, animate],
};

export default config;
