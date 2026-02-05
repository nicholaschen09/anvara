import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Nav } from './components/nav';
import { Footer } from './components/footer';
import { GoogleAnalytics } from './components/analytics';

export const metadata: Metadata = {
  title: {
    default: 'Anvara - Sponsorship Marketplace',
    template: '%s | Anvara',
  },
  description:
    'Connect with premium publishers and sponsors. Anvara is the leading marketplace for sponsorship deals, helping brands reach their target audience through trusted publishers.',
  keywords: ['sponsorship', 'marketplace', 'advertising', 'publishers', 'sponsors', 'ad slots'],
  authors: [{ name: 'Anvara' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Anvara',
    title: 'Anvara - Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. The leading marketplace for sponsorship deals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara - Sponsorship Marketplace',
    description:
      'Connect with premium publishers and sponsors. The leading marketplace for sponsorship deals.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <GoogleAnalytics />
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
