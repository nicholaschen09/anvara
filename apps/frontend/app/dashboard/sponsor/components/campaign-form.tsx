'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCampaign, updateCampaign, deleteCampaign, type ActionState } from '../actions';
import { useEffect, useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface CampaignFormProps {
  campaign?: Campaign;
  onClose: () => void;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : isEdit ? 'Update Campaign' : 'Create Campaign'}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function CampaignForm({ campaign, onClose }: CampaignFormProps) {
  const isEdit = !!campaign;
  const [state, formAction] = useActionState<ActionState, FormData>(
    isEdit ? updateCampaign : createCampaign,
    {}
  );
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteCampaign, {});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (state.success || deleteState.success) {
      onClose();
    }
  }, [state.success, deleteState.success, onClose]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">{isEdit ? 'Edit Campaign' : 'Create Campaign'}</h2>

        {(state.error || deleteState.error) && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {state.error || deleteState.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={campaign.id} />}

          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={campaign?.name}
              className="w-full rounded border border-[--color-border] px-3 py-2"
              required
            />
            {state.fieldErrors?.name && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={campaign?.description}
              className="w-full rounded border border-[--color-border] px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Budget ($)</label>
            <input
              type="number"
              name="budget"
              defaultValue={campaign?.budget}
              min="1"
              step="0.01"
              className="w-full rounded border border-[--color-border] px-3 py-2"
              required
            />
            {state.fieldErrors?.budget && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.budget}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                defaultValue={campaign?.startDate ? formatDate(campaign.startDate) : ''}
                className="w-full rounded border border-[--color-border] px-3 py-2"
                required
              />
              {state.fieldErrors?.startDate && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.startDate}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                defaultValue={campaign?.endDate ? formatDate(campaign.endDate) : ''}
                className="w-full rounded border border-[--color-border] px-3 py-2"
                required
              />
              {state.fieldErrors?.endDate && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.endDate}</p>
              )}
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={campaign?.status}
                className="w-full rounded border border-[--color-border] px-3 py-2"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[--color-border] px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <SubmitButton isEdit={isEdit} />
          </div>
        </form>

        {isEdit && (
          <div className="mt-6 border-t pt-4">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete this campaign
              </button>
            ) : (
              <form action={deleteAction} className="flex items-center gap-3">
                <input type="hidden" name="id" value={campaign.id} />
                <span className="text-sm text-gray-600">Are you sure?</span>
                <DeleteButton />
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
