'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/auth-client';

type UserRole = 'sponsor' | 'publisher' | null;

// eslint-disable-next-line no-undef
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fetch user role from backend when user is logged in
  useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/api/auth/role/${user.id}`)
        .then((res) => res.json())
        .then((data: { role: UserRole }) => setRole(data.role))
        .catch(() => setRole(null));
    } else {
      setRole(null);
    }
  }, [user?.id]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? 'text-[--color-primary] font-medium'
        : 'text-[--color-muted] hover:text-[--color-foreground]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[--color-border] bg-[--color-background]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/marketplace" className={linkClass('/marketplace')}>
            Marketplace
          </Link>

          {user && role === 'sponsor' && (
            <Link href="/dashboard/sponsor" className={linkClass('/dashboard/sponsor')}>
              My Campaigns
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link href="/dashboard/publisher" className={linkClass('/dashboard/publisher')}>
              My Ad Slots
            </Link>
          )}

          {isPending ? (
            <span className="text-[--color-muted]">...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[--color-muted]">
                {user.name} {role && `(${role})`}
              </span>
              <button
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
                className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[--color-border] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[--color-border] bg-[--color-background] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/marketplace" className={`py-2 ${linkClass('/marketplace')}`}>
              Marketplace
            </Link>

            {user && role === 'sponsor' && (
              <Link href="/dashboard/sponsor" className={`py-2 ${linkClass('/dashboard/sponsor')}`}>
                My Campaigns
              </Link>
            )}
            {user && role === 'publisher' && (
              <Link href="/dashboard/publisher" className={`py-2 ${linkClass('/dashboard/publisher')}`}>
                My Ad Slots
              </Link>
            )}

            <hr className="border-[--color-border]" />

            {isPending ? (
              <span className="py-2 text-[--color-muted]">Loading...</span>
            ) : user ? (
              <>
                <span className="py-2 text-sm text-[--color-muted]">
                  Signed in as {user.name} {role && `(${role})`}
                </span>
                <button
                  onClick={async () => {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          window.location.href = '/';
                        },
                      },
                    });
                  }}
                  className="w-full rounded bg-gray-600 py-3 text-center text-sm text-white hover:bg-gray-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full rounded bg-[--color-primary] py-3 text-center text-sm text-white hover:bg-[--color-primary-hover]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
