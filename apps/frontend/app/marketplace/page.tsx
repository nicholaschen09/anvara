import { AdSlotGrid } from './components/ad-slot-grid';

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

async function getAdSlots(): Promise<AdSlot[]> {
  try {
    const res = await fetch(`${API_URL}/api/ad-slots`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch {
    return [];
  }
}

export default async function MarketplacePage() {
  // Fetch ad slots on the server
  const adSlots = await getAdSlots();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      <AdSlotGrid adSlots={adSlots} />
    </div>
  );
}
