'use client';

import Script from 'next/script';

// Set your GA4 Measurement ID here or via environment variable
// eslint-disable-next-line no-undef
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Custom event tracking helper
export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && 'gtag' in window && GA_MEASUREMENT_ID) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, parameters);
  }
}

// Predefined events for the marketplace
export const analyticsEvents = {
  viewListing: (listingId: string, listingName: string) =>
    trackEvent('view_item', {
      item_id: listingId,
      item_name: listingName,
      content_type: 'ad_slot',
    }),
  bookPlacement: (listingId: string, price: number) =>
    trackEvent('begin_checkout', {
      item_id: listingId,
      value: price,
      currency: 'USD',
    }),
  requestQuote: (listingId: string) =>
    trackEvent('generate_lead', {
      item_id: listingId,
      lead_type: 'quote_request',
    }),
  newsletterSignup: () =>
    trackEvent('sign_up', {
      method: 'newsletter',
    }),
  createCampaign: () =>
    trackEvent('create_campaign', {
      content_type: 'campaign',
    }),
  createAdSlot: () =>
    trackEvent('create_ad_slot', {
      content_type: 'ad_slot',
    }),
};

export function GoogleAnalytics() {
  // Don't render anything if no measurement ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
