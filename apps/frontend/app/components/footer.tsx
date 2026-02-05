import { NewsletterSignup } from './newsletter-signup';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[--color-border] bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-[--color-primary]">Anvara</h3>
            <p className="mt-2 text-sm text-[--color-muted]">
              The sponsorship marketplace connecting sponsors with publishers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">For Sponsors</h4>
            <ul className="space-y-2 text-sm text-[--color-muted]">
              <li>
                <a href="/marketplace" className="hover:text-[--color-primary]">
                  Browse Marketplace
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[--color-primary]">
                  Create Campaign
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">For Publishers</h4>
            <ul className="space-y-2 text-sm text-[--color-muted]">
              <li>
                <a href="/login" className="hover:text-[--color-primary]">
                  List Ad Slots
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[--color-primary]">
                  Manage Inventory
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Stay Updated</h4>
            <p className="mb-3 text-sm text-[--color-muted]">
              Get notified about new opportunities and marketplace updates.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-8 border-t border-[--color-border] pt-8 text-center text-sm text-[--color-muted]">
          <p>&copy; {new Date().getFullYear()} Anvara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
