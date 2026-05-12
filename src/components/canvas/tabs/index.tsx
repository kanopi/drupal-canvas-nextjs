"use client";

import React, { useState, useRef, useId, type ReactNode } from "react";

interface CanvasTabsProps {
  items?: ReactNode;
}

export default function CanvasTabs({ items }: CanvasTabsProps) {
  const children = React.Children.toArray(items);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  if (children.length === 0) return null;

  const labels = children.map((child) => {
    if (React.isValidElement(child)) {
      return (child as React.ReactElement<{ label?: string }>).props.label ?? "Tab";
    }
    return "Tab";
  });

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % labels.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + labels.length) % labels.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = labels.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div>
      <div
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
        role="tablist"
      >
        {labels.map((label, index) => (
          <button
            key={index}
            ref={(el) => { tabRefs.current[index] = el; }}
            id={`${baseId}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`${baseId}-tabpanel-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-sm px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeIndex === index
                ? "bg-background text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((child, index) => (
        <div
          key={index}
          id={`${baseId}-tabpanel-${index}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          tabIndex={0}
          hidden={activeIndex !== index}
          className="mt-2 text-sm text-foreground"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
