import { ReactNode } from "react";
import { Image } from "drupal-canvas";

interface HeroProps {
  title?: string;
  backgroundImage?: { src: string; alt: string; width?: number; height?: number };
  headingElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  heroHeight?: "auto" | "small" | "medium" | "large" | "full";
  contentWidth?: "100%" | "90%" | "80%" | "75%" | "50%";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  imageOverlay?: "dark" | "light" | "none";
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  content?: ReactNode;
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

// Overlay auto-inverts in dark mode so light text stays on a darkened image
// in light mode, and dark text on a lightened image in dark mode.
const overlayClasses: Record<string, string> = {
  dark: "bg-black/40 dark:bg-white/40",
  light: "bg-white/40 dark:bg-black/40",
  none: "",
};

const heightClasses: Record<string, string> = {
  auto: "",
  small: "min-h-[30vh]",
  medium: "min-h-[60vh]",
  large: "min-h-[80vh]",
  full: "min-h-screen",
};

const headingStyles: Record<string, string> = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
};

export default function Hero({
  title,
  backgroundImage,
  headingElement,
  heroHeight = "medium",
  contentWidth = "75%",
  variation,
  imageOverlay = "dark",
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  content,
}: HeroProps) {
  const HeadingTag = headingElement || "h1";

  const spacingClasses = [
    { "0": "mt-0", "16": "mt-4", "32": "mt-8", "64": "mt-16" }[marginTop || "0"],
    { "0": "mb-0", "16": "mb-4", "32": "mb-8", "64": "mb-16" }[marginBottom || "0"],
    { "0": "pt-0", "16": "pt-4", "32": "pt-8", "64": "pt-16" }[paddingTop || "0"],
    { "0": "pb-0", "16": "pb-4", "32": "pb-8", "64": "pb-16" }[paddingBottom || "0"],
  ].join(" ");

  const minHeightClass = heightClasses[heroHeight] ?? heightClasses.medium;

  const surfaceClasses = variation
    ? variationClasses[variation]
    : "bg-muted text-foreground";

  return (
    <section
      className={`relative flex w-full items-center justify-center overflow-hidden px-6 py-24 ${surfaceClasses} ${minHeightClass} ${spacingClasses}`}
    >
      {backgroundImage?.src && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt || ""}
            width={backgroundImage.width || 1920}
            height={backgroundImage.height || 1080}
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {overlayClasses[imageOverlay] && (
            <div className={`absolute inset-0 ${overlayClasses[imageOverlay]}`} />
          )}
        </div>
      )}
      <div
        className="relative z-10 mx-auto text-center"
        style={{ maxWidth: contentWidth }}
      >
        {title && (
          <HeadingTag className={`mb-6 ${headingStyles[HeadingTag] ?? headingStyles.h1}`}>
            {title}
          </HeadingTag>
        )}
        {content}
      </div>
    </section>
  );
}
