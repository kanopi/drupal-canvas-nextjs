import { Image } from "drupal-canvas";

interface CanvasImageProps {
  image?: { src: string; alt: string; width?: number; height?: number };
  caption?: string;
}

export default function CanvasImage({
  image,
  caption,
}: CanvasImageProps) {
  if (!image?.src) {
    return null;
  }

  return (
    <figure className="w-full">
      <Image
        src={image.src}
        alt={image.alt || ""}
        width={image.width || 800}
        height={image.height || 600}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg object-cover"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
