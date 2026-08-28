"use client";

import { Moon, Sun } from "lucide-react";

/** Storage key shared with the inline <head> script in layout.tsx. */
const STORAGE_KEY = "theme";

/**
 * Apple-style dark/light toggle rendered as a sliding switch.
 *
 * The switch is styled purely with Tailwind `dark:` variants, so its visuals
 * (sun/moon cross-fade + knob position) are driven by the `dark` class on
 * <html> — which the inline <head> script in layout.tsx applies before paint.
 * That keeps the first render FOUC-free and free of hydration mismatches,
 * because React markup is identical regardless of theme. The click handler
 * simply toggles the class and persists the choice to localStorage.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#0a0a0c" : "#ffffff");

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Storage unavailable (private mode) — theme still applies for the session. */
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="group relative inline-flex h-8 w-14 shrink-0 items-center rounded-full bg-heroglow hairline transition-colors duration-300 ease-apple hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-surface"
    >
      {/* Sun — shown in light mode (left). Cross-fades out in dark. */}
      <Sun
        className="pointer-events-none absolute left-0 ml-2 h-4 w-4 text-subtext transition-all duration-300 ease-apple scale-100 opacity-100 dark:scale-0 dark:opacity-0"
        aria-hidden
      />
      {/* Moon — shown in dark mode (right). */}
      <Moon
        className="pointer-events-none absolute right-0 mr-2 h-4 w-4 text-subtext transition-all duration-300 ease-apple opacity-0 scale-50 dark:opacity-100 dark:scale-100"
        aria-hidden
      />

      {/* Sliding knob. */}
      <span
        className="pointer-events-none absolute inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-apple translate-x-1 dark:translate-x-8"
        aria-hidden
      />
    </button>
  );
}
