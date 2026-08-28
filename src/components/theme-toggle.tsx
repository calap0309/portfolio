"use client";

import { useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";

/** Storage key shared with the inline <head> script in layout.tsx. */
const STORAGE_KEY = "theme";

function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

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
  const ref = useRef<HTMLButtonElement>(null);

  /* Sync the ARIA checked state from the DOM `.dark` class. Mutates the
     attribute directly (no setState) so it stays SSR-stable — the inline
     <head> script applies the class before paint, and the visuals are purely
     CSS driven, so there's no hydration mismatch. */
  useEffect(() => {
    ref.current?.setAttribute("aria-checked", String(isDark()));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    ref.current?.setAttribute("aria-checked", String(next === "dark"));

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
      ref={ref}
      type="button"
      role="switch"
      aria-checked={false}
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="group relative inline-flex h-9 w-16 shrink-0 items-center rounded-full bg-heroglow hairline transition-colors duration-300 ease-apple hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-surface sm:h-8 sm:w-14"
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
        className="pointer-events-none absolute inline-block h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-300 ease-apple translate-x-1 dark:translate-x-8 sm:h-6 sm:w-6 sm:translate-x-1 sm:dark:translate-x-7"
        aria-hidden
      />
    </button>
  );
}
