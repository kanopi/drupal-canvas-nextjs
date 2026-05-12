"use client";

import { useState } from "react";

interface CanvasToggleGroupProps {
  option1Label?: string;
  option1Value?: string;
  option2Label?: string;
  option2Value?: string;
  option3Label?: string;
  option3Value?: string;
  option4Label?: string;
  option4Value?: string;
  option5Label?: string;
  option5Value?: string;
  defaultValue?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

interface ToggleOption {
  label: string;
  value: string;
}

export default function CanvasToggleGroup(props: CanvasToggleGroupProps) {
  const options: ToggleOption[] = [];

  for (let i = 1; i <= 5; i++) {
    const label = props[`option${i}Label` as keyof CanvasToggleGroupProps] as string | undefined;
    const value = props[`option${i}Value` as keyof CanvasToggleGroupProps] as string | undefined;
    if (label && value) {
      options.push({ label, value });
    }
  }

  const { defaultValue = "", variant = "default", size = "default" } = props;
  const [selected, setSelected] = useState(defaultValue);

  if (options.length === 0) return null;

  const isOutline = variant === "outline";

  const sizeClasses: Record<string, string> = {
    sm: "min-h-12 px-2 text-xs",
    default: "min-h-12 px-3 text-sm",
    lg: "min-h-12 px-4 text-base",
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-md" role="group" aria-label="Options">
      {options.map((option) => {
        const isSelected = selected === option.value;
        const baseClasses =
          `inline-flex items-center justify-center rounded-md ${sizeClasses[size] || sizeClasses.default} font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`;
        const variantClasses = isOutline
          ? isSelected
            ? "border border-foreground bg-primary text-primary-foreground"
            : "border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          : isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted hover:text-foreground";

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setSelected(option.value)}
            className={`${baseClasses} ${variantClasses}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
