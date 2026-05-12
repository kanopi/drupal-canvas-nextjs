interface CanvasPaginationProps {
  totalPages?: number;
  currentPage?: number;
  baseUrl?: string;
}

export default function CanvasPagination({
  totalPages = 1,
  currentPage = 1,
  baseUrl = "/page/",
}: CanvasPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const baseLinkClasses =
    "inline-flex min-h-12 min-w-12 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const disabledClasses = "pointer-events-none text-muted-foreground";
  const activeLinkClasses = "bg-primary text-primary-foreground";
  const inactiveLinkClasses =
    "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground";

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="inline-flex items-center gap-1">
        <li>
          {hasPrevious ? (
            <a
              href={`${baseUrl}${currentPage - 1}`}
              className={`${baseLinkClasses} ${inactiveLinkClasses}`}
              aria-label="Go to previous page"
            >
              Previous
            </a>
          ) : (
            <button
              type="button"
              disabled
              className={`${baseLinkClasses} ${disabledClasses}`}
            >
              Previous
            </button>
          )}
        </li>

        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <a
                href={`${baseUrl}${page}`}
                className={`${baseLinkClasses} ${isCurrent ? activeLinkClasses : inactiveLinkClasses}`}
                aria-label={`Page ${page}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {page}
              </a>
            </li>
          );
        })}

        <li>
          {hasNext ? (
            <a
              href={`${baseUrl}${currentPage + 1}`}
              className={`${baseLinkClasses} ${inactiveLinkClasses}`}
              aria-label="Go to next page"
            >
              Next
            </a>
          ) : (
            <button
              type="button"
              disabled
              className={`${baseLinkClasses} ${disabledClasses}`}
            >
              Next
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
