"use client";

import { useState, useId, type ReactNode } from "react";

interface CanvasCollapsibleProps {
  triggerLabel?: string;
  defaultOpen?: boolean;
  content?: ReactNode;
}

export default function CanvasCollapsible({
  triggerLabel = "Toggle Content",
  defaultOpen = false,
  content,
}: CanvasCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <div className="rounded-md border border-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={regionId}
        className="flex min-h-12 w-full items-center justify-between px-4 text-sm font-medium text-foreground hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span>{triggerLabel}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id={regionId}
        className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
        role="region"
        hidden={!isOpen}
      >
        <div className="px-4 pb-4 pt-0 text-sm text-foreground">
          {content}
        </div>
      </div>
    </div>
  );
}
