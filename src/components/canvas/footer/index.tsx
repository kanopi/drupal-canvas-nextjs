import { type ReactNode } from "react";

interface FooterProps {
  top?: ReactNode;
  middle?: ReactNode;
  bottom?: ReactNode;
  width?: "100%" | "90%" | "80%" | "75%" | "50%";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  topBackgroundColor?: string;
  middleBackgroundColor?: string;
  bottomBackgroundColor?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

const variationClasses: Record<string, string> = {
  primary: "variation-primary",
  secondary: "variation-secondary",
  tertiary: "variation-tertiary",
  accent: "variation-accent",
  muted: "variation-muted",
  light: "variation-light",
  dark: "variation-dark",
};

export default function Footer({
  top,
  middle,
  bottom,
  width = "100%",
  variation,
  topBackgroundColor,
  middleBackgroundColor,
  bottomBackgroundColor,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: FooterProps) {
  const spacingClasses = [
    { "0": "mt-0", "16": "mt-4", "32": "mt-8", "64": "mt-16" }[marginTop || "0"],
    { "0": "mb-0", "16": "mb-4", "32": "mb-8", "64": "mb-16" }[marginBottom || "0"],
    { "0": "pt-0", "16": "pt-4", "32": "pt-8", "64": "pt-16" }[paddingTop || "0"],
    { "0": "pb-0", "16": "pb-4", "32": "pb-8", "64": "pb-16" }[paddingBottom || "0"],
  ].join(" ");

  const surfaceClasses = variation
    ? variationClasses[variation]
    : "bg-background text-muted-foreground";

  const baseClasses = `w-full ${surfaceClasses} ${spacingClasses}`;

  const innerStyle: React.CSSProperties = { maxWidth: width };

  return (
    <footer className={baseClasses}>
      {top && (
        <div
          className="w-full"
          style={topBackgroundColor ? { backgroundColor: topBackgroundColor } : {}}
        >
          <div className="mx-auto" style={innerStyle}>
            {top}
          </div>
        </div>
      )}

      {middle && (
        <div
          className="w-full"
          style={middleBackgroundColor ? { backgroundColor: middleBackgroundColor } : {}}
        >
          <div className="mx-auto" style={innerStyle}>
            {middle}
          </div>
        </div>
      )}

      {bottom && (
        <div
          className="w-full"
          style={bottomBackgroundColor ? { backgroundColor: bottomBackgroundColor } : {}}
        >
          <div className="mx-auto text-sm text-muted-foreground" style={innerStyle}>
            {bottom}
          </div>
        </div>
      )}
    </footer>
  );
}
