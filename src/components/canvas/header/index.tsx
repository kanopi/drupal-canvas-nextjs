"use client";

import { type ReactNode, useState, useEffect } from "react";

interface HeaderProps {
  chrome?: ReactNode;
  brand?: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  width?: "100%" | "90%" | "80%" | "75%" | "50%";
  collapseBreakpoint?: "640" | "768" | "1024";
  chromeAlignment?: "start" | "center" | "end" | "between" | "around";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  chromeVariation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  overlayVariation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  brandInOverlay?: boolean;
  chromeInOverlay?: boolean;
  navigationInOverlay?: boolean;
  actionsInOverlay?: boolean;
}

const chromeAlignmentClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const variationClasses: Record<string, string> = {
  primary: "variation-primary",
  secondary: "variation-secondary",
  tertiary: "variation-tertiary",
  accent: "variation-accent",
  muted: "variation-muted",
  light: "variation-light",
  dark: "variation-dark",
};

export default function Header({
  chrome,
  brand,
  navigation,
  actions,
  width = "100%",
  collapseBreakpoint = "768",
  chromeAlignment = "between",
  variation,
  chromeVariation,
  overlayVariation,
  brandInOverlay = false,
  chromeInOverlay = false,
  navigationInOverlay = true,
  actionsInOverlay = true,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const breakpoint = parseInt(collapseBreakpoint, 10);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  // Close overlay when switching to desktop.
  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  const hasOverlayContent =
    isMobile &&
    ((brandInOverlay && brand) ||
      (chromeInOverlay && chrome) ||
      (navigationInOverlay && navigation) ||
      (actionsInOverlay && actions));

  const surfaceClasses = variation
    ? variationClasses[variation]
    : "bg-background text-foreground";

  const chromeVariationClass = chromeVariation
    ? variationClasses[chromeVariation]
    : "";

  const overlayVariationClass = overlayVariation
    ? variationClasses[overlayVariation]
    : "bg-background";

  const innerStyle: React.CSSProperties = { maxWidth: width };

  return (
    <div className={`relative w-full border-b border-border ${surfaceClasses}`}>
      {/* Chrome bar — full width above nav row, background goes edge to edge */}
      {chrome && !(isMobile && chromeInOverlay) && (
        <div className={`w-full border-b border-border ${chromeVariationClass}`}>
          <div
            className={`mx-auto flex items-center gap-4 px-6 py-2 ${
              chromeAlignmentClasses[chromeAlignment] ?? chromeAlignmentClasses.between
            }`}
            style={innerStyle}
          >
            {chrome}
          </div>
        </div>
      )}

      {/* Main nav row */}
      <div className="mx-auto flex items-center gap-4 px-6 py-4" style={innerStyle}>
        {/* Brand — hidden on mobile if brandInOverlay */}
        {brand && !(isMobile && brandInOverlay) && (
          <div className="flex shrink-0 items-center gap-2">{brand}</div>
        )}

        {/* Navigation — takes remaining space; hidden on mobile if navigationInOverlay */}
        {navigation && !(isMobile && navigationInOverlay) && (
          <div className="min-w-0 flex-1">{navigation}</div>
        )}

        {/* Actions — hidden on mobile if actionsInOverlay */}
        {actions && !(isMobile && actionsInOverlay) && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}

        {/* Hamburger toggle — only on mobile when there's overlay content */}
        {hasOverlayContent && (
          <button
            type="button"
            className="ml-auto inline-flex min-h-12 min-w-12 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Overlay panel — absolutely positioned below header */}
      {menuOpen && hasOverlayContent && (
        <div
          className={`absolute left-0 right-0 top-full z-40 border-b border-border shadow-overlay ${overlayVariationClass}`}
        >
          <style>{`
            .header-overlay ul {
              flex-direction: column !important;
              align-items: stretch !important;
              width: 100% !important;
              gap: 0 !important;
            }
            .header-overlay nav {
              width: 100% !important;
            }
            .header-overlay nav a {
              min-height: 48px !important;
              display: flex !important;
              align-items: center !important;
              padding: 12px 24px !important;
              width: 100% !important;
              box-sizing: border-box !important;
              border-radius: 0 !important;
            }
            .header-overlay nav button {
              min-width: 48px !important;
              min-height: 48px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .header-overlay nav li > div {
              display: flex !important;
              width: 100% !important;
            }
            .header-overlay nav li > div > a {
              flex: 1 !important;
            }
            .header-overlay nav ul ul {
              position: static !important;
              min-width: unset !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
              background: transparent !important;
            }
            .header-overlay nav ul ul a {
              padding-left: 48px !important;
            }
          `}</style>
          <div className="header-overlay mx-auto flex flex-col" style={innerStyle}>
            {brandInOverlay && brand && (
              <div className="px-6 py-4">{brand}</div>
            )}
            {navigationInOverlay && navigation && (
              <div>{navigation}</div>
            )}
            {chromeInOverlay && chrome && (
              <div>{chrome}</div>
            )}
            {actionsInOverlay && actions && (
              <div className="px-6 py-4">{actions}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
