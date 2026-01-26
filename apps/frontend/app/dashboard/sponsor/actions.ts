'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieString = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
  return {
    'Content-Type': 'application/json',
    Cookie: cookieString,
  };
}

export async function createCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const budget = formData.get('budget') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;

  // Validation
  const fieldErrors: Record<string, string> = {};
  if (!name?.trim()) fieldErrors.name = 'Name is required';
  if (!budget || Number(budget) <= 0) fieldErrors.budget = 'Budget must be a positive number';
  if (!startDate) fieldErrors.startDate = 'Start date is required';
  if (!endDate) fieldErrors.endDate = 'End date is required';
  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    fieldErrors.endDate = 'End date must be after start date';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}/api/campaigns`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        budget: Number(budget),
        startDate,
        endDate,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error || 'Failed to create campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch {
    return { error: 'Failed to create campaign' };
  }
}

export async function updateCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const budget = formData.get('budget') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const status = formData.get('status') as string;

  // Validation
  const fieldErrors: Record<string, string> = {};
  if (!name?.trim()) fieldErrors.name = 'Name is required';
  if (!budget || Number(budget) <= 0) fieldErrors.budget = 'Budget must be a positive number';
  if (!startDate) fieldErrors.startDate = 'Start date is required';
  if (!endDate) fieldErrors.endDate = 'End date is required';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        budget: Number(budget),
        startDate,
        endDate,
        status: status || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error || 'Failed to update campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch {
    return { error: 'Failed to update campaign' };
  }
}

export async function deleteCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'Campaign ID is required' };
  }

  try {
    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      return { error: data.error || 'Failed to delete campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch {
    return { error: 'Failed to delete campaign' };
  }
}
