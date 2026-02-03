// Simple API client

// eslint-disable-next-line no-undef
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: string;
  startDate: string;
  endDate: string;
  sponsorId: string;
  sponsor?: { id: string; name: string; logo?: string };
  _count?: { creatives: number; placements: number };
}

export interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisherId: string;
  publisher?: { id: string; name: string; category?: string; monthlyViews?: number };
  _count?: { placements: number };
}

export interface Placement {
  id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  agreedPrice: number;
  pricingModel: string;
  startDate: string;
  endDate: string;
  status: string;
  campaignId: string;
  creativeId: string;
  adSlotId: string;
  publisherId: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
}

export interface CreateCampaignData {
  name: string;
  description?: string;
  budget: number;
  startDate: string;
  endDate: string;
  sponsorId: string;
  cpmRate?: number;
  cpcRate?: number;
  targetCategories?: string[];
  targetRegions?: string[];
}

export interface CreateAdSlotData {
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  publisherId: string;
}

export interface CreatePlacementData {
  campaignId: string;
  creativeId: string;
  adSlotId: string;
  publisherId: string;
  agreedPrice: number;
  startDate: string;
  endDate: string;
}

// eslint-disable-next-line no-undef
export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'API request failed');
  }
  return res.json();
}

// Campaigns
export const getCampaigns = (sponsorId?: string): Promise<Campaign[]> =>
  api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');

export const getCampaign = (id: string): Promise<Campaign> =>
  api<Campaign>(`/api/campaigns/${id}`);

export const createCampaign = (data: CreateCampaignData): Promise<Campaign> =>
  api<Campaign>('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });

export const updateCampaign = (id: string, data: Partial<CreateCampaignData>): Promise<Campaign> =>
  api<Campaign>(`/api/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteCampaign = (id: string): Promise<void> =>
  api<void>(`/api/campaigns/${id}`, { method: 'DELETE' });

// Ad Slots
export const getAdSlots = (publisherId?: string): Promise<AdSlot[]> =>
  api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');

export const getAdSlot = (id: string): Promise<AdSlot> =>
  api<AdSlot>(`/api/ad-slots/${id}`);

export const createAdSlot = (data: CreateAdSlotData): Promise<AdSlot> =>
  api<AdSlot>('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });

export const updateAdSlot = (id: string, data: Partial<CreateAdSlotData>): Promise<AdSlot> =>
  api<AdSlot>(`/api/ad-slots/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteAdSlot = (id: string): Promise<void> =>
  api<void>(`/api/ad-slots/${id}`, { method: 'DELETE' });

// Placements
export const getPlacements = (): Promise<Placement[]> =>
  api<Placement[]>('/api/placements');

export const createPlacement = (data: CreatePlacementData): Promise<Placement> =>
  api<Placement>('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = (): Promise<DashboardStats> =>
  api<DashboardStats>('/api/dashboard/stats');
