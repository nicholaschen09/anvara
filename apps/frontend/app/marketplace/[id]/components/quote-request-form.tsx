'use client';

import { useState } from 'react';

// eslint-disable-next-line no-undef
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

interface QuoteRequestFormProps {
  adSlotId: string;
  adSlotName: string;
  onClose: () => void;
}

export function QuoteRequestForm({ adSlotId, adSlotName, onClose }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    phone: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/api/quotes/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adSlotId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        throw new Error(data.error || 'Failed to submit request');
      }

      setStatus('success');
      setSuccessMessage(data.message);
    } catch (err) {
      setStatus('error');
      if (!Object.keys(errors).length) {
        setErrors({ form: err instanceof Error ? err.message : 'Something went wrong' });
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            &#10003;
          </div>
          <h2 className="mb-2 text-xl font-bold text-green-800">Quote Request Submitted!</h2>
          <p className="mb-6 text-[--color-muted]">{successMessage}</p>
          <button
            onClick={onClose}
            className="rounded-lg bg-[--color-primary] px-6 py-2 text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Request a Quote</h2>
            <p className="text-sm text-[--color-muted]">for {adSlotName}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-[--color-muted] hover:text-gray-700">
            &times;
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="mb-1 block text-sm font-medium">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-lg border border-[--color-border] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                required
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[--color-border] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-[--color-border] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              />
            </div>

            <div>
              <label htmlFor="budget" className="mb-1 block text-sm font-medium">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-[--color-border] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
              >
                <option value="">Select budget</option>
                <option value="under-1k">Under $1,000</option>
                <option value="1k-5k">$1,000 - $5,000</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-plus">$25,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="timeline" className="mb-1 block text-sm font-medium">
              Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full rounded-lg border border-[--color-border] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            >
              <option value="">When do you want to start?</option>
              <option value="asap">As soon as possible</option>
              <option value="1-2-weeks">1-2 weeks</option>
              <option value="1-month">Within a month</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your campaign goals, target audience, or any questions..."
              className="w-full rounded-lg border border-[--color-border] px-3 py-2 focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[--color-border] px-4 py-3 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-1 rounded-lg bg-[--color-primary] px-4 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-[--color-muted]">
          We typically respond within 24-48 hours
        </p>
      </div>
    </div>
  );
}
