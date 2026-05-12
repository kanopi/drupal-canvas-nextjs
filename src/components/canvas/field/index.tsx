import type { ReactNode } from "react";

interface CanvasFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  control?: ReactNode;
}

export default function CanvasField({
  label = "Label",
  description,
  errorMessage,
  required = false,
  control,
}: CanvasFieldProps) {
  const fieldId = `field-${label?.toLowerCase().replace(/\s+/g, "-") ?? "default"}`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = errorMessage ? `${fieldId}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2" aria-describedby={ariaDescribedBy}>
      <label
        htmlFor={fieldId}
        className="text-sm font-medium leading-none text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      <div>{control}</div>
      {description && !errorMessage && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {errorMessage && (
        <p id={errorId} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
