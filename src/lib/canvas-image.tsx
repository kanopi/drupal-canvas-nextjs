"use client";

import NextImage from "next-image-standalone";
import type { ImageLoaderParams, ImageProps } from "next-image-standalone";

/**
 * Canvas-compatible Image component.
 *
 * Wraps next-image-standalone with a default loader that parses the
 * `alternateWidths` query parameter from the src URL to generate
 * responsive srcset URLs pointing to Drupal's canvas_parametrized_width
 * image style.
 */
export default function Image(
  props: Omit<ImageProps, "loader"> & {
    loader?: (params: ImageLoaderParams) => string;
  },
) {
  const { src, loader } = props;
  const srcString = typeof src === "string" ? src : "";

  if (!loader) {
    const defaultLoader = ({ width, imageProps }: ImageLoaderParams) => {
      try {
        const result = new URL(srcString, "https://example.com").searchParams.get(
          "alternateWidths",
        );
        if (!result) {
          return srcString;
        }
        let resolved = result.replace("{width}", width.toString());

        if (resolved.includes("{height}") && imageProps.width && imageProps.height) {
          const height = Math.round(
            width / (Number(imageProps.width) / Number(imageProps.height)),
          );
          resolved = resolved.replace("{height}", height.toString());
        }

        return resolved;
      } catch {
        return srcString;
      }
    };
    return (
      <NextImage
        {...props}
        loader={defaultLoader}
        sizes={props.sizes || "100vw"}
      />
    );
  }
  return (
    <NextImage {...props} loader={loader} sizes={props.sizes || "100vw"} />
  );
}
