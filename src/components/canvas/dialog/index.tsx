"use client";

import { useState, useEffect, useCallback, useRef, useId, type ReactNode } from "react";

interface CanvasDialogProps {
  triggerLabel?: string;
  title?: string;
  description?: string;
  content?: ReactNode;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerSize?: "default" | "sm" | "lg";
  headingElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  dialogSize?: "sm" | "md" | "lg" | "xl";
}

// Shared card padding — keep in sync with Card and Testimonial.
const CARD_PADDING = "p-6";

// Heading scale — keep in sync with Heading, Hero, CTA Banner, Card, Page Title.
const headingStyles: Record<string, string> = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
};

const dialogSizeClasses: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const variantClasses: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  outline: "border border-border bg-background text-foreground hover:bg-muted",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
  ghost: "text-foreground hover:bg-muted",
  link: "text-foreground underline-offset-4 hover:underline",
};

const sizeClasses: Record<string, string> = {
  default: "min-h-12 px-4 py-2",
  sm: "min-h-12 px-3 text-sm",
  lg: "min-h-12 px-8 text-base",
};

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function CanvasDialog({
  triggerLabel = "Open Dialog",
  title,
  description,
  content,
  triggerVariant = "default",
  triggerSize = "default",
  headingElement = "h2",
  dialogSize = "md",
}: CanvasDialogProps) {
  const TitleTag = headingElement;
  const titleClass = headingStyles[TitleTag] ?? headingStyles.h2;
  const sizeClass = dialogSizeClasses[dialogSize] ?? dialogSizeClasses.md;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Focus trap + Escape
  useEffect(() => {
    if (!open) return;

    // Move focus into the panel.
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const buttonClasses = `${baseClasses} ${variantClasses[triggerVariant] ?? variantClasses.default} ${sizeClasses[triggerSize] ?? sizeClasses.default}`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses}
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            ref={panelRef}
            className={`relative z-10 w-full ${sizeClass} rounded-lg border border-border bg-background ${CARD_PADDING} shadow-popover`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 inline-flex min-h-12 min-w-12 items-center justify-center rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-opacity"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {title && (
              <TitleTag id={titleId} className={`${titleClass} text-foreground`}>
                {title}
              </TitleTag>
            )}

            {description && (
              <div
                className="mt-2 text-sm text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {content && <div className="mt-4">{content}</div>}
          </div>
        </div>
      )}
    </>
  );
}
