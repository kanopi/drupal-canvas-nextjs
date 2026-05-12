"use client";

import React, { useState, useEffect, useCallback, type ReactNode } from "react";

interface CanvasCarouselProps {
  items?: ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function CanvasCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
}: CanvasCarouselProps) {
  const slides = React.Children.toArray(items);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, goToNext, totalSlides]);

  if (totalSlides === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground">
        Add slides to the carousel
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div className="overflow-hidden rounded-lg">
        <div aria-roledescription="slide" aria-label={`Slide ${activeIndex + 1} of ${totalSlides}`}>
          {slides[activeIndex]}
        </div>
      </div>

      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute -left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-card transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous slide"
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
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute -right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-card transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next slide"
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
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full p-5 bg-clip-content transition-colors ${
                  index === activeIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/50 hover:bg-muted-foreground"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
