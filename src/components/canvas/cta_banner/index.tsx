interface CtaBannerProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonLink?: string;
  headingElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  contentWidth?: "100%" | "90%" | "80%" | "75%" | "50%";
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

const headingStyles: Record<string, string> = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
};

export default function CtaBanner({
  title,
  description,
  buttonLabel,
  buttonLink,
  headingElement,
  variation = "primary",
  contentWidth = "75%",
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: CtaBannerProps) {
  const HeadingTag = headingElement || "h2";

  const spacingClasses = [
    { "0": "mt-0", "16": "mt-4", "32": "mt-8", "64": "mt-16" }[marginTop || "0"],
    { "0": "mb-0", "16": "mb-4", "32": "mb-8", "64": "mb-16" }[marginBottom || "0"],
    { "0": "pt-0", "16": "pt-4", "32": "pt-8", "64": "pt-16" }[paddingTop || "0"],
    { "0": "pb-0", "16": "pb-4", "32": "pb-8", "64": "pb-16" }[paddingBottom || "0"],
  ].join(" ");

  const surfaceClasses = variationClasses[variation] ?? variationClasses.primary;

  return (
    <div
      className={`w-full rounded-lg px-8 py-12 text-center md:px-16 shadow-card ${surfaceClasses} ${spacingClasses}`}
    >
      {title && (
        <HeadingTag className={`mb-4 ${headingStyles[HeadingTag] ?? headingStyles.h2}`}>
          {title}
        </HeadingTag>
      )}
      {description && (
        <div
          className="mx-auto mb-8 text-lg leading-relaxed opacity-90"
          style={{ maxWidth: contentWidth }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {buttonLabel && buttonLink && (
        <a
          href={buttonLink}
          className="inline-block rounded-lg px-8 py-3 text-lg font-semibold transition-colors bg-foreground text-background hover:opacity-90"
        >
          {buttonLabel}
        </a>
      )}
    </div>
  );
}
