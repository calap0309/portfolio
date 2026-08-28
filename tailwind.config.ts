import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#fafaf8",
        nearblack: "#18181b",
        terracotta: "#c9694b",
        ochre: "#d4a373",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Georgia", "monospace"],
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.64rem", { lineHeight: "1rem" }],
        sm: ["0.8rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.25rem", { lineHeight: "1.75rem" }],
        xl: ["1.563rem", { lineHeight: "2rem" }],
        "2xl": ["1.953rem", { lineHeight: "2.25rem" }],
        "3xl": ["2.441rem", { lineHeight: "2.75rem" }],
        "4xl": ["3.052rem", { lineHeight: "3.25rem" }],
        "5xl": ["3.815rem", { lineHeight: "1.1" }],
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [typography],
};

export default config;
