interface CanvasSeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export default function CanvasSeparator({
  orientation = "horizontal",
  decorative = true,
}: CanvasSeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        role={decorative ? "none" : "separator"}
        aria-hidden={decorative ? "true" : undefined}
        aria-orientation="vertical"
        className="mx-2 inline-block h-full min-h-[1rem] w-px shrink-0 bg-muted"
      />
    );
  }

  return (
    <hr
      role={decorative ? "none" : "separator"}
      aria-hidden={decorative ? "true" : undefined}
      className="h-px w-full shrink-0 border-0 bg-muted"
    />
  );
}
