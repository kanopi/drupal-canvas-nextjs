"use client";

import { useState, useId, type ReactNode } from "react";

interface CanvasTooltipProps {
  tooltipContent?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  trigger?: ReactNode;
}

const sideStyles: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
};

const arrowStyles: Record<string, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-primary border-x-transparent border-b-transparent border-4",
  right: "right-full top-1/2 -translate-y-1/2 border-r-primary border-y-transparent border-l-transparent border-4",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-primary border-x-transparent border-t-transparent border-4",
  left: "left-full top-1/2 -translate-y-1/2 border-l-primary border-y-transparent border-r-transparent border-4",
};

export default function CanvasTooltip({
  tooltipContent = "Tooltip",
  tooltipSide = "top",
  trigger,
}: CanvasTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <div
        tabIndex={0}
        aria-describedby={visible ? tooltipId : undefined}
      >
        {trigger || <span className="text-sm text-muted-foreground underline decoration-dotted cursor-help">Hover me</span>}
      </div>

      {visible && tooltipContent && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-tooltip ${sideStyles[tooltipSide] ?? sideStyles.top}`}
        >
          {tooltipContent}
          <span
            className={`absolute h-0 w-0 ${arrowStyles[tooltipSide] ?? arrowStyles.top}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
