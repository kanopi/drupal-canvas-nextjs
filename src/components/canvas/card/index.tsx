import type { ReactNode } from "react";
import { Image } from "drupal-canvas";

interface CanvasCardProps {
  title?: string;
  description?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  cardStyle?: "default" | "icon" | "horizontal";
  headingElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variation?: "primary" | "secondary" | "tertiary" | "accent" | "muted" | "light" | "dark";
  cardLink?: string;
  footer?: ReactNode;
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

// Shared card padding — keep in sync with Dialog and Testimonial.
const CARD_PADDING = "p-6";
const CARD_PADDING_NO_TOP = "p-6 pt-0";
const CARD_CONTENT_GAP = "space-y-1.5";

// Heading scale — keep in sync with Heading, Hero, CTA Banner, Page Title.
const headingStyles: Record<string, string> = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
};

export default function CanvasCard({
  title,
  description,
  image,
  cardStyle = "default",
  headingElement,
  variation,
  cardLink,
  footer,
}: CanvasCardProps) {
  const HeadingTag = headingElement || "h3";
  const titleClass = headingStyles[HeadingTag] ?? headingStyles.h3;
  const surfaceClasses = variation
    ? variationClasses[variation]
    : "bg-background text-foreground";

  const wrapWithLink = (content: ReactNode) => {
    if (cardLink) {
      return (
        <a href={cardLink} className="block h-full no-underline">
          {content}
        </a>
      );
    }
    return content;
  };

  if (cardStyle === "icon") {
    return wrapWithLink(
      <div className={`flex h-full flex-col rounded-lg shadow-card text-center ${surfaceClasses}`}>
        <div className={`flex flex-1 flex-col items-center ${CARD_CONTENT_GAP} ${CARD_PADDING}`}>
          {image?.src && (
            <div className="flex justify-center">
              <Image
                src={image.src}
                alt={image.alt || ""}
                width={64}
                height={64}
                loading="lazy"
                style={{ width: "64px", height: "64px", objectFit: "contain" }}
              />
            </div>
          )}
          {title && <HeadingTag className={titleClass}>{title}</HeadingTag>}
          {description && (
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
        {footer && (
          <div className={`flex items-center justify-center ${CARD_PADDING_NO_TOP}`}>{footer}</div>
        )}
      </div>
    );
  }

  if (cardStyle === "horizontal") {
    return wrapWithLink(
      <div className={`flex h-full flex-row rounded-lg shadow-card overflow-hidden ${surfaceClasses}`}>
        {image?.src && (
          <div className="relative flex-shrink-0 w-48">
            <Image
              src={image.src}
              alt={image.alt || ""}
              width={image.width || 400}
              height={image.height || 300}
              loading="lazy"
              sizes="192px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <div className="flex flex-col justify-center flex-1">
          {(title || description) && (
            <div className={`flex flex-col ${CARD_CONTENT_GAP} ${CARD_PADDING}`}>
              {title && <HeadingTag className={titleClass}>{title}</HeadingTag>}
              {description && (
                <div
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          )}
          {footer && (
            <div className={`flex items-center ${CARD_PADDING_NO_TOP}`}>{footer}</div>
          )}
        </div>
      </div>
    );
  }

  // Default style: image on top
  return wrapWithLink(
    <div className={`flex h-full flex-col rounded-lg shadow-card overflow-hidden ${surfaceClasses}`}>
      {image?.src && (
        <Image
          src={image.src}
          alt={image.alt || ""}
          width={image.width || 400}
          height={image.height || 300}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      )}
      {(title || description) && (
        <div className={`flex flex-1 flex-col ${CARD_CONTENT_GAP} ${CARD_PADDING}`}>
          {title && <HeadingTag className={titleClass}>{title}</HeadingTag>}
          {description && (
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      )}
      {footer && (
        <div className={`flex items-center ${CARD_PADDING_NO_TOP}`}>{footer}</div>
      )}
    </div>
  );
}
