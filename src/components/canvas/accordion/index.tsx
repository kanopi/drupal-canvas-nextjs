"use client";

import type { ReactNode } from "react";

interface CanvasAccordionProps {
  accordionType?: "single" | "multiple";
  collapsible?: boolean;
  items?: ReactNode;
}

export default function CanvasAccordion({
  accordionType = "single",
  collapsible = true,
  items,
}: CanvasAccordionProps) {
  return (
    <div className="space-y-1" data-accordion-type={accordionType} data-collapsible={collapsible}>
      {items}
    </div>
  );
}
