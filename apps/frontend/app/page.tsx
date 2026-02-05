import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Connect Sponsors with
          <span className="text-[--color-primary]"> Premium Publishers</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-[--color-muted]">
          Anvara is the marketplace where brands discover authentic sponsorship opportunities and
          publishers monetize their audience with relevant partnerships.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/marketplace"
            className="rounded-lg bg-[--color-primary] px-8 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-[--color-border] px-8 py-4 text-lg font-semibold transition-colors hover:bg-gray-50"
          >
            Get Started
          </Link>
        </div>
        <p className="mt-4 text-sm text-[--color-muted]">
          No credit card required. Free to browse.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid gap-8 text-center sm:grid-cols-3">
        <div>
          <p className="text-4xl font-bold text-[--color-primary]">500+</p>
          <p className="text-[--color-muted]">Active Publishers</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-[--color-primary]">10M+</p>
          <p className="text-[--color-muted]">Monthly Reach</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-[--color-primary]">98%</p>
          <p className="text-[--color-muted]">Satisfaction Rate</p>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
              1
            </div>
            <h3 className="mb-2 text-lg font-semibold">Browse Listings</h3>
            <p className="text-sm text-[--color-muted]">
              Explore ad slots from newsletters, podcasts, websites, and more. Filter by category,
              price, and audience.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
              2
            </div>
            <h3 className="mb-2 text-lg font-semibold">Connect & Negotiate</h3>
            <p className="text-sm text-[--color-muted]">
              Request quotes, discuss campaign goals, and negotiate terms directly with publishers.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl">
              3
            </div>
            <h3 className="mb-2 text-lg font-semibold">Launch & Track</h3>
            <p className="text-sm text-[--color-muted]">
              Book placements, upload creatives, and track performance from your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Features for Sponsors & Publishers */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-[--color-border] p-8">
          <div className="mb-4 inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            For Sponsors
          </div>
          <h3 className="mb-4 text-2xl font-bold">Reach Your Target Audience</h3>
          <ul className="space-y-3 text-[--color-muted]">
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Access curated publishers in your niche
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Transparent pricing with no hidden fees
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Campaign management dashboard
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Performance tracking and analytics
            </li>
          </ul>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-[--color-primary] px-6 py-3 font-medium text-white hover:opacity-90"
          >
            Start Advertising
          </Link>
        </div>

        <div className="rounded-xl border border-[--color-border] p-8">
          <div className="mb-4 inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
            For Publishers
          </div>
          <h3 className="mb-4 text-2xl font-bold">Monetize Your Audience</h3>
          <ul className="space-y-3 text-[--color-muted]">
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              List unlimited ad slots for free
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Set your own prices and terms
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Connect with verified sponsors
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">&#10003;</span>
              Manage bookings from one place
            </li>
          </ul>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg border border-[--color-border] px-6 py-3 font-medium hover:bg-gray-50"
          >
            List Your Inventory
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
        <p className="mx-auto mb-8 max-w-xl text-lg opacity-90">
          Join thousands of sponsors and publishers already using Anvara to create meaningful
          partnerships.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 transition-transform hover:scale-105"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
