interface TestimonialProps {
  quote?: string;
  author?: string;
  role?: string;
  avatarImage?: { src: string; alt: string; width?: number; height?: number };
}

// Shared card padding — keep in sync with Card and Dialog.
const CARD_PADDING = "p-6";

export default function Testimonial({
  quote,
  author,
  role,
  avatarImage,
}: TestimonialProps) {
  return (
    <blockquote className={`w-full rounded-lg border border-border bg-background ${CARD_PADDING} shadow-card`}>
      {quote && (
        <div
          className="mb-6 text-lg italic leading-relaxed text-foreground"
          dangerouslySetInnerHTML={{ __html: quote }}
        />
      )}
      <footer className="flex items-center gap-4">
        {avatarImage?.src && (
          <img
            src={avatarImage.src}
            alt={avatarImage.alt || (author ? `${author} avatar` : "Author avatar")}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          {author && (
            <cite className="block text-base font-semibold not-italic text-foreground">
              {author}
            </cite>
          )}
          {role && (
            <span className="block text-sm text-muted-foreground">{role}</span>
          )}
        </div>
      </footer>
    </blockquote>
  );
}
