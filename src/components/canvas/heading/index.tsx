type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "lead";

interface CanvasHeadingProps {
  headingLevel?: HeadingLevel;
  text?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
  lead: "text-xl text-muted-foreground",
};

export default function CanvasHeading({
  headingLevel = "h2",
  text = "",
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: CanvasHeadingProps) {
  if (!text) return null;

  const Tag = headingLevel === "lead" ? "p" : headingLevel;

  const spacingClasses = [
    { "0": "mt-0", "16": "mt-4", "32": "mt-8", "64": "mt-16" }[marginTop || "0"],
    { "0": "mb-0", "16": "mb-4", "32": "mb-8", "64": "mb-16" }[marginBottom || "0"],
    { "0": "pt-0", "16": "pt-4", "32": "pt-8", "64": "pt-16" }[paddingTop || "0"],
    { "0": "pb-0", "16": "pb-4", "32": "pb-8", "64": "pb-16" }[paddingBottom || "0"],
  ].join(" ");

  const className = `${headingStyles[headingLevel]} ${spacingClasses}`;

  return <Tag className={className}>{text}</Tag>;
}
