'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAdSlot, updateAdSlot, deleteAdSlot, type ActionState } from '../actions';
import { useEffect, useState } from 'react';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
}

interface AdSlotFormProps {
  adSlot?: AdSlot;
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
      {pending ? 'Saving...' : isEdit ? 'Update Ad Slot' : 'Create Ad Slot'}
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

export function AdSlotForm({ adSlot, onClose }: AdSlotFormProps) {
  const isEdit = !!adSlot;
  const [state, formAction] = useActionState<ActionState, FormData>(
    isEdit ? updateAdSlot : createAdSlot,
    {}
  );
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteAdSlot, {});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (state.success || deleteState.success) {
      onClose();
    }
  }, [state.success, deleteState.success, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">{isEdit ? 'Edit Ad Slot' : 'Create Ad Slot'}</h2>

        {(state.error || deleteState.error) && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {state.error || deleteState.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={adSlot.id} />}

          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={adSlot?.name}
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
              defaultValue={adSlot?.description}
              className="w-full rounded border border-[--color-border] px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select
              name="type"
              defaultValue={adSlot?.type || 'DISPLAY'}
              className="w-full rounded border border-[--color-border] px-3 py-2"
              required
            >
              <option value="DISPLAY">Display</option>
              <option value="VIDEO">Video</option>
              <option value="NATIVE">Native</option>
              <option value="NEWSLETTER">Newsletter</option>
              <option value="PODCAST">Podcast</option>
            </select>
            {state.fieldErrors?.type && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Base Price ($/month)</label>
            <input
              type="number"
              name="basePrice"
              defaultValue={adSlot?.basePrice}
              min="1"
              step="0.01"
              className="w-full rounded border border-[--color-border] px-3 py-2"
              required
            />
            {state.fieldErrors?.basePrice && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.basePrice}</p>
            )}
          </div>

          {isEdit && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                value="true"
                defaultChecked={adSlot?.isAvailable}
                className="h-4 w-4"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium">
                Available for booking
              </label>
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
                Delete this ad slot
              </button>
            ) : (
              <form action={deleteAction} className="flex items-center gap-3">
                <input type="hidden" name="id" value={adSlot.id} />
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
