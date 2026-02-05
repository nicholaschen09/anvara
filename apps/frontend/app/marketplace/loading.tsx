export default function MarketplaceLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
        ))}
      </div>

      {/* Results count skeleton */}
      <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-[--color-border] p-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mb-3 h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
