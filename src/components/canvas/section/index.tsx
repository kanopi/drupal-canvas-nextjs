import { ReactNode } from "react";
import { Image } from "drupal-canvas";

interface SectionProps {
  sectionWidth?: "100%" | "90%" | "80%" | "75%" | "50%";
  gridLayout?: "100" | "50-50" | "33-33-33" | "75-25" | "25-75" | "67-33" | "33-67" | "50-25-25" | "25-25-50" | "25-25-25-25";
  viewsGrid?: "50-50" | "33-33-33" | "25-25-25-25";
  columnsOnMobile?: "1" | "2" | "3";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  backgroundMedia?: { src: string; alt: string; width?: number; height?: number };
  showHeaderRegion?: boolean;
  showFooterRegion?: boolean;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  headerSlot?: ReactNode;
  mainSlot?: ReactNode;
  footerSlot?: ReactNode;
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

const gridTemplates: Record<string, string> = {
  "100": "grid-cols-1",
  "50-50": "grid-cols-1 md:grid-cols-2",
  "33-33-33": "grid-cols-1 md:grid-cols-3",
  "75-25": "grid-cols-1 md:grid-cols-[3fr_1fr]",
  "25-75": "grid-cols-1 md:grid-cols-[1fr_3fr]",
  "67-33": "grid-cols-1 md:grid-cols-[2fr_1fr]",
  "33-67": "grid-cols-1 md:grid-cols-[1fr_2fr]",
  "50-25-25": "grid-cols-1 md:grid-cols-[2fr_1fr_1fr]",
  "25-25-50": "grid-cols-1 md:grid-cols-[1fr_1fr_2fr]",
  "25-25-25-25": "grid-cols-1 md:grid-cols-4",
};

const mobileGridMap: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
};

export default function Section({
  sectionWidth = "100%",
  gridLayout = "100",
  viewsGrid,
  columnsOnMobile = "1",
  variation,
  backgroundMedia,
  showHeaderRegion = true,
  showFooterRegion = true,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  headerSlot,
  mainSlot,
  footerSlot,
}: SectionProps) {
  const spacingClasses = [
    { "0": "mt-0", "16": "mt-4", "32": "mt-8", "64": "mt-16" }[marginTop || "0"],
    { "0": "mb-0", "16": "mb-4", "32": "mb-8", "64": "mb-16" }[marginBottom || "0"],
    { "0": "pt-0", "16": "pt-4", "32": "pt-8", "64": "pt-16" }[paddingTop || "0"],
    { "0": "pb-0", "16": "pb-4", "32": "pb-8", "64": "pb-16" }[paddingBottom || "0"],
  ].join(" ");

  const activeColumns = viewsGrid || gridLayout;
  const desktopGrid = gridTemplates[activeColumns] || gridTemplates["100"];

  const mobileGrid = mobileGridMap[columnsOnMobile] || mobileGridMap["1"];
  const mdPortion = desktopGrid.split(" ").filter((c) => c.startsWith("md:")).join(" ");
  const gridClasses = `${mobileGrid} ${mdPortion} gap-6`;

  const surfaceClasses = variation ? variationClasses[variation] : "";

  return (
    <section
      className={`relative w-full overflow-hidden ${surfaceClasses} ${spacingClasses}`}
    >
      {backgroundMedia?.src && (
        <div className="absolute inset-0">
          <Image
            src={backgroundMedia.src}
            alt={backgroundMedia.alt || ""}
            width={backgroundMedia.width || 1920}
            height={backgroundMedia.height || 1080}
            sizes="100vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div
        className="relative z-10 mx-auto px-6"
        style={{ maxWidth: sectionWidth }}
      >
        {showHeaderRegion && headerSlot && (
          <div className="mb-6">{headerSlot}</div>
        )}

        <div className={`grid ${gridClasses}`}>
          {mainSlot}
        </div>

        {showFooterRegion && footerSlot && (
          <div className="mt-6">{footerSlot}</div>
        )}
      </div>
    </section>
  );
}
