import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { StatsCards } from './components/stats-cards';

// eslint-disable-next-line no-undef
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
}

async function getAdSlotsForPublisher(publisherId: string): Promise<AdSlot[]> {
  try {
    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}&limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    const response = await res.json();
    // Handle paginated response
    return response.data || response;
  } catch {
    return [];
  }
}

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher') {
    redirect('/');
  }

  // Fetch ad slots on the server
  const adSlots = roleData.publisherId ? await getAdSlotsForPublisher(roleData.publisherId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
      </div>

      <StatsCards adSlots={adSlots} />

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
