interface CanvasSkeletonProps {
  variant?: "text" | "heading" | "circle" | "rectangle" | "card";
  width?: string;
  height?: string;
  repeatCount?: number;
}

// Hover Card / Skeleton card share a smaller padding than Card/Dialog.
const HOVER_CARD_PADDING = "p-4";

function SkeletonPulse({
  className,
  style,
}: {
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse bg-muted ${className}`}
      style={style}
    />
  );
}

function SkeletonItem({
  variant,
  width,
  height,
}: Omit<CanvasSkeletonProps, "repeatCount">) {
  switch (variant) {
    case "heading":
      return (
        <SkeletonPulse
          className="rounded-md"
          style={{
            width: width || "60%",
            height: height || "32px",
          }}
        />
      );

    case "circle":
      return (
        <SkeletonPulse
          className="rounded-full"
          style={{
            width: width || "48px",
            height: height || "48px",
          }}
        />
      );

    case "rectangle":
      return (
        <SkeletonPulse
          className="rounded-lg"
          style={{
            width: width || "100%",
            height: height || "200px",
          }}
        />
      );

    case "card":
      return (
        <div
          className={`rounded-lg ${HOVER_CARD_PADDING} space-y-3`}
          style={{ width: width || "100%" }}
        >
          <SkeletonPulse
            className="rounded-lg"
            style={{ width: "100%", height: "140px" }}
          />
          <SkeletonPulse
            className="rounded-md"
            style={{ width: "70%", height: "24px" }}
          />
          <SkeletonPulse
            className="rounded-md"
            style={{ width: "100%", height: "16px" }}
          />
          <SkeletonPulse
            className="rounded-md"
            style={{ width: "85%", height: "16px" }}
          />
        </div>
      );

    case "text":
    default:
      return (
        <SkeletonPulse
          className="rounded-md"
          style={{
            width: width || "100%",
            height: height || "16px",
          }}
        />
      );
  }
}

export default function CanvasSkeleton({
  variant = "text",
  width,
  height,
  repeatCount = 1,
}: CanvasSkeletonProps) {
  const count = Math.max(1, repeatCount);
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="space-y-2">
      {items.map((i) => (
        <SkeletonItem
          key={i}
          variant={variant}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}
