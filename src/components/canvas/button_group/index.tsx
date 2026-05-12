import { type ReactNode } from "react";

interface ButtonGroupProps {
  buttons?: ReactNode;
  alignment?: "left" | "center" | "right";
  gap?: "sm" | "md" | "lg";
  direction?: "horizontal" | "vertical";
}

const alignmentClasses: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const gapClasses: Record<string, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const directionClasses: Record<string, string> = {
  horizontal: "flex-row flex-wrap items-center",
  vertical: "flex-col items-stretch",
};

export default function ButtonGroup({
  buttons,
  alignment = "left",
  gap = "md",
  direction = "horizontal",
}: ButtonGroupProps) {
  const classes = [
    "flex",
    directionClasses[direction] ?? directionClasses.horizontal,
    alignmentClasses[alignment] ?? alignmentClasses.left,
    gapClasses[gap] ?? gapClasses.md,
  ].join(" ");

  return <div className={classes}>{buttons}</div>;
}
