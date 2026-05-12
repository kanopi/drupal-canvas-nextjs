interface CanvasAlertProps {
  variant?: "default" | "info" | "warning" | "danger" | "success";
  title?: string;
  headingElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  description?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

const variantClasses: Record<string, string> = {
  default:
    "border-border bg-background text-foreground",
  info:
    "border-blue-300 bg-blue-50 text-blue-900",
  warning:
    "border-amber-300 bg-amber-50 text-amber-900",
  danger:
    "border-red-300 bg-red-50 text-red-900",
  success:
    "border-green-300 bg-green-50 text-green-900",
};

export default function CanvasAlert({
  variant = "default",
  title,
  headingElement,
  description,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: CanvasAlertProps) {
  const HeadingTag = headingElement || "h5";

  const spacingClasses = [
    { "0": "mt-0", "16": "mt-4", "32": "mt-8", "64": "mt-16" }[marginTop || "0"],
    { "0": "mb-0", "16": "mb-4", "32": "mb-8", "64": "mb-16" }[marginBottom || "0"],
    { "0": "pt-0", "16": "pt-4", "32": "pt-8", "64": "pt-16" }[paddingTop || "0"],
    { "0": "pb-0", "16": "pb-4", "32": "pb-8", "64": "pb-16" }[paddingBottom || "0"],
  ].join(" ");

  return (
    <div
      role="status"
      className={`relative w-full rounded-lg border px-4 py-3 text-sm ${variantClasses[variant] ?? variantClasses.default} ${spacingClasses}`}
    >
      {title && (
        <HeadingTag className="mb-1 font-medium leading-none tracking-tight">
          {title}
        </HeadingTag>
      )}
      {description && (
        <div
          className="text-sm leading-relaxed opacity-90"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}
