interface CanvasButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  linkUrl?: string;
}

const variantClasses: Record<string, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90",
  outline:
    "border-2 border-border bg-background text-foreground hover:bg-muted",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost:
    "border border-border text-foreground hover:bg-muted",
  link:
    "text-foreground underline-offset-4 hover:underline",
};

const sizeClasses: Record<string, string> = {
  default: "min-h-12 px-4 py-2",
  sm: "min-h-12 px-3 text-sm",
  lg: "min-h-12 px-8 text-base",
  icon: "min-h-12 min-w-12",
};

export default function CanvasButton({
  variant = "default",
  size = "default",
  label = "Button",
  linkUrl,
}: CanvasButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const classes = `${baseClasses} ${variantClasses[variant] ?? variantClasses.default} ${sizeClasses[size] ?? sizeClasses.default}`;

  if (linkUrl) {
    return (
      <a href={linkUrl} className={classes}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      {label}
    </button>
  );
}
