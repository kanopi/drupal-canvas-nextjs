"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

interface CanvasHoverCardProps {
  trigger?: ReactNode;
  content?: ReactNode;
  size?: "sm" | "md" | "lg";
}

// Hover Card uses a smaller padding than Card/Dialog — it's a popover surface.
const HOVER_CARD_PADDING = "p-4";

const sizeClasses: Record<string, string> = {
  sm: "w-56",
  md: "w-64",
  lg: "w-80",
};

export default function CanvasHoverCard({
  trigger,
  content,
  size = "md",
}: CanvasHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sizeClass = sizeClasses[size] ?? sizeClasses.md;

  const showCard = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setVisible(true);
  }, []);

  const hideCard = useCallback(() => {
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
    }, 300);
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showCard}
      onMouseLeave={hideCard}
      onFocus={showCard}
      onBlur={hideCard}
    >
      <div className="min-h-[2rem] min-w-[4rem]" tabIndex={0}>
        {trigger || <span className="text-sm text-muted-foreground">Add trigger</span>}
      </div>
      <div
        className={`absolute left-0 top-full z-50 mt-2 ${sizeClass} min-h-[2rem] rounded-lg border border-border bg-background ${HOVER_CARD_PADDING} shadow-popover ${visible ? "" : "hidden"}`}
      >
        {content || <span className="text-sm text-muted-foreground">Add content</span>}
      </div>
    </div>
  );
}
