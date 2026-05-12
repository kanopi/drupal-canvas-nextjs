interface CanvasBadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  text?: string;
}

const variantClasses: Record<string, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80",
  destructive:
    "bg-destructive text-white hover:bg-destructive/80",
  outline:
    "border border-border text-foreground bg-transparent",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

export default function CanvasBadge({
  variant = "default",
  size = "md",
  text = "Badge",
}: CanvasBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold transition-colors ${sizeClasses[size] ?? sizeClasses.md} ${variantClasses[variant] ?? variantClasses.default}`}
    >
      {text}
    </span>
  );
}
