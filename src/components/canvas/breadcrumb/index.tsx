import { getPageData } from "drupal-canvas";

interface BreadcrumbItem {
  key: string;
  text: string;
  url: string;
}

export default function CanvasBreadcrumb() {
  const { breadcrumbs } = getPageData();

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {(breadcrumbs as BreadcrumbItem[]).map(({ key, text, url }, index) => (
          <li key={key} className="inline-flex items-center gap-1.5">
            {index > 0 && (
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            {url ? (
              <a href={url} className="inline-flex min-h-12 items-center hover:text-foreground">
                {text}
              </a>
            ) : (
              <span className="font-medium text-foreground">{text}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
