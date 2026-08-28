"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/** Storage key shared with the inline <head> script in layout.tsx. */
const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : getSystemTheme();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

/**
 * Apple-style dark/light toggle rendered as a sliding switch. Persists the
 * choice to localStorage so the inline <head> script (layout.tsx) can restore
 * it before paint and avoid a flash of the wrong theme.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="group relative inline-flex h-8 w-14 items-center rounded-full hairline transition-colors duration-300 ease-apple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{ backgroundColor: isDark ? "rgb(var(--surface))" : "rgb(var(--heroglow))" }}
    >
      {/* Sun — visible in light mode (left side). */}
      <Sun
        className="pointer-events-none absolute left-0 ml-2 h-4 w-4 text-subtext transition-opacity duration-300 ease-apple"
        style={{ opacity: isDark ? 0 : 1 }}
      />
      {/* Moon — visible in dark mode (right side). */}
      <Moon
        className="pointer-events-none absolute right-0 mr-2 h-4 w-4 text-subtext transition-opacity duration-300 ease-apple"
        style={{ opacity: isDark ? 1 : 0 }}
      />

      {/* Sliding knob. */}
      <span
        className="pointer-events-none absolute inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-apple"
        style={{
          transform: isDark ? "translateX(1.5rem)" : "translateX(0.25rem)",
          transitionTimingFunction: "cubic-bezier(0.28, 0.11, 0.32, 1)",
        }}
      />
    </button>
  );
}
