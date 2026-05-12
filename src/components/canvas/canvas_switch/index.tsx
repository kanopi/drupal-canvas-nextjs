"use client";

import { useState } from "react";

interface CanvasSwitchProps {
  label?: string;
  description?: string;
  defaultChecked?: boolean;
  name?: string;
}

export default function CanvasSwitch({
  label = "Switch",
  description,
  defaultChecked = false,
  name = "switch",
}: CanvasSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const switchId = `switch-${name}`;
  const descId = description ? `${switchId}-desc` : undefined;

  return (
    <div className="flex min-h-12 items-center space-x-3">
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descId}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-popover ring-0 transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <input
        type="hidden"
        name={name}
        value={checked ? "on" : "off"}
      />
      <div className="space-y-1">
        <label
          htmlFor={switchId}
          className="text-sm font-medium leading-none text-foreground cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p id={descId} className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
