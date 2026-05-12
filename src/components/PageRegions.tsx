"use client";

import { useState, useEffect, type ReactNode } from "react";

/**
 * Hides page regions (header, footer, etc.) when rendered inside
 * the Drupal preview iframe, since Drupal already renders them
 * outside the iframe via canvas-island web components.
 *
 * Uses CSS display:none instead of conditional rendering to avoid
 * Cumulative Layout Shift during hydration.
 */
export function PageRegions({ children }: { children: ReactNode }) {
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    try {
      setInIframe(window.self !== window.top);
    } catch {
      // Cross-origin iframe — assume we're embedded.
      setInIframe(true);
    }
  }, []);

  return (
    <div style={inIframe ? { display: "none" } : undefined}>
      {children}
    </div>
  );
}
