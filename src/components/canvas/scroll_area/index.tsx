import type { ReactNode } from "react";

interface CanvasScrollAreaProps {
  maxHeight?: "sm" | "md" | "lg" | "xl";
  scrollOrientation?: "vertical" | "horizontal";
  content?: ReactNode;
}

const heightMap: Record<string, string> = {
  sm: "200px",
  md: "400px",
  lg: "600px",
  xl: "800px",
};

export default function CanvasScrollArea({
  maxHeight = "md",
  scrollOrientation = "vertical",
  content,
}: CanvasScrollAreaProps) {
  const isHorizontal = scrollOrientation === "horizontal";

  return (
    <div
      className={`relative rounded-md border border-border ${
        isHorizontal
          ? "overflow-x-auto overflow-y-hidden"
          : "overflow-y-auto overflow-x-hidden"
      } [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground`}
      style={
        isHorizontal
          ? { maxWidth: heightMap[maxHeight] ?? "400px" }
          : { maxHeight: heightMap[maxHeight] ?? "400px" }
      }
    >
      <div className={isHorizontal ? "inline-flex" : ""}>
        {content}
      </div>
    </div>
  );
}
