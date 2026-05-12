"use client";

import { useState } from "react";

interface CanvasAvatarProps {
  avatarImage?: { src: string; alt: string; width?: number; height?: number };
  fallbackText?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

export default function CanvasAvatar({
  avatarImage,
  fallbackText = "?",
  size = "md",
}: CanvasAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = sizeClasses[size] ?? sizeClasses.md;

  return (
    <span className={`relative flex shrink-0 overflow-hidden rounded-full ${sizeClass}`}>
      {avatarImage?.src && !imgError ? (
        <img
          src={avatarImage.src}
          alt={avatarImage.alt || ""}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
          {fallbackText}
        </span>
      )}
    </span>
  );
}
