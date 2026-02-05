import Link from 'next/link';
import { AdSlotGrid } from './components/ad-slot-grid';
import { Pagination } from './components/pagination';

// eslint-disable-next-line no-undef
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: { id: string; name: string; category?: string; monthlyViews?: number };
}

interface PaginatedResponse {
  data: AdSlot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface Props {
  searchParams: Promise<{ page?: string; type?: string }>;
}

async function getAdSlots(page: number, type?: string): Promise<PaginatedResponse> {
  try {
    const params = new URLSearchParams({ page: String(page), limit: '9' });
    if (type) params.set('type', type);

    const res = await fetch(`${API_URL}/api/ad-slots?${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return { data: [], pagination: { page: 1, limit: 9, total: 0, totalPages: 0, hasMore: false } };
    }
    return res.json();
  } catch {
    return { data: [], pagination: { page: 1, limit: 9, total: 0, totalPages: 0, hasMore: false } };
  }
}

const adSlotTypes = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];

export default async function MarketplacePage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const type = params.type;

  // Fetch ad slots on the server
  const { data: adSlots, pagination } = await getAdSlots(page, type);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/marketplace"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !type ? 'bg-[--color-primary] text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        {adSlotTypes.map((t) => (
          <Link
            key={t}
            href={`/marketplace?type=${t}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              type === t ? 'bg-[--color-primary] text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-[--color-muted]">
        Showing {adSlots.length} of {pagination.total} ad slots
      </p>

      <AdSlotGrid adSlots={adSlots} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          baseUrl={type ? `/marketplace?type=${type}&` : '/marketplace?'}
        />
      )}
    </div>
  );
}
