"use client";

import type { ReactNode } from "react";

interface CanvasAccordionItemProps {
  title?: string;
  content?: ReactNode;
}

export default function CanvasAccordionItem({
  title = "Accordion Item",
  content,
}: CanvasAccordionItemProps) {
  return (
    <details className="group border border-border rounded-md">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between px-4 text-sm font-medium text-foreground hover:bg-background transition-colors [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
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
      </summary>
      <div className="px-4 pb-4 pt-0 text-sm text-foreground">
        {content}
      </div>
    </details>
  );
}
