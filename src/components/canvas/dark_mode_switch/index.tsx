"use client";

import { useSyncExternalStore } from "react";

interface DarkModeSwitchProps {
  label?: string;
  showLabel?: boolean;
}

// Subscribe to changes on the <html> class list via a MutationObserver so
// multiple instances of this component stay in sync.
function subscribeToDarkClass(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getDarkClassSnapshot(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
}

function getDarkClassServerSnapshot(): boolean {
  // Server can't know the user's preference; the inline bootstrap script in
  // layout.tsx applies it before paint. We render the switch as "off" on the
  // server; React reconciles to the real state on hydration.
  return false;
}

/**
 * Toggle between light and dark mode by flipping the `.dark` class on `<html>`.
 * Persists to localStorage under "theme"; falls back to system preference.
 *
 * Pair with the inline script in src/app/layout.tsx that applies the stored
 * preference before render so there's no flash of light mode on dark-preferred
 * sessions.
 */
export default function DarkModeSwitch({
  label = "Toggle dark mode",
  showLabel = false,
}: DarkModeSwitchProps) {
  const isDark = useSyncExternalStore(
    subscribeToDarkClass,
    getDarkClassSnapshot,
    getDarkClassServerSnapshot,
  );

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Ignore quota / privacy-mode errors — UI still toggles in-session.
    }
  };

  const checked = isDark;
  const disabled = false;

  return (
    <div className="inline-flex min-h-12 items-center gap-3">
      <span
        aria-hidden="true"
        className={`inline-flex h-5 w-5 items-center justify-center transition-opacity ${checked ? "opacity-40" : "opacity-100"}`}
      >
        <SunIcon />
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-popover ring-0 transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span
        aria-hidden="true"
        className={`inline-flex h-5 w-5 items-center justify-center transition-opacity ${checked ? "opacity-100" : "opacity-40"}`}
      >
        <MoonIcon />
      </span>
      {showLabel && (
        <span className="text-sm font-medium leading-none text-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
