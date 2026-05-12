interface CanvasLabelProps {
  labelText?: string;
  htmlFor?: string;
  required?: boolean;
}

export default function CanvasLabel({
  labelText = "Label",
  htmlFor,
  required = false,
}: CanvasLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none text-foreground"
    >
      {labelText}
      {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
    </label>
  );
}
