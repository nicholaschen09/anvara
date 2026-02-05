import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}page=${currentPage - 1}`}
          className="rounded-lg border border-[--color-border] px-3 py-2 text-sm hover:bg-gray-50"
        >
          Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-[--color-border] px-3 py-2 text-sm opacity-50">
          Previous
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[--color-muted]">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={`${baseUrl}page=${page}`}
              className={`min-w-[40px] rounded-lg px-3 py-2 text-center text-sm ${
                page === currentPage
                  ? 'bg-[--color-primary] text-white'
                  : 'border border-[--color-border] hover:bg-gray-50'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={`${baseUrl}page=${currentPage + 1}`}
          className="rounded-lg border border-[--color-border] px-3 py-2 text-sm hover:bg-gray-50"
        >
          Next
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-[--color-border] px-3 py-2 text-sm opacity-50">
          Next
        </span>
      )}
    </nav>
  );
}
