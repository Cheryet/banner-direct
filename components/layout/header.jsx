'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, MapPin, Phone, Truck, ChevronDown, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { UserMenu, MobileUserMenu } from '@/components/auth/user-menu';

// =============================================================================
// NAVIGATION CONFIG
// =============================================================================
const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Templates', href: '/templates' },
  { name: 'Bulk Orders', href: '/bulk' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Help', href: '/help' },
];

// =============================================================================
// HEADER COMPONENT
// =============================================================================
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const drawerRef = React.useRef(null);
  const menuButtonRef = React.useRef(null);

  // ---------------------------------------------------------------------------
  // Ensure client-side mounting before dynamic content
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------------------------------------------------------------------
  // Scroll shadow effect
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    // Check initial scroll position
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // ---------------------------------------------------------------------------
  // Focus trap and escape key for mobile drawer
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };

    // Trap focus within drawer
    const focusableElements = drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    // Prevent body scroll when drawer is open
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('mousedown', handleClickOutside);

    // Focus first element in drawer
    firstElement?.focus();

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // ---------------------------------------------------------------------------
  // Close drawer on route change
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-all',
          mounted && isScrolled && 'shadow-sm'
        )}
      >
        <div className="container">
          <nav className="flex h-16 items-center gap-8" aria-label="Main navigation">
            {/* Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center" aria-label="Home">
              <span className="text-[22px] font-extrabold tracking-tight">
                <span className="text-emerald-600">Banner</span>
                <span className="text-gray-900">Direct</span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden flex-1 items-center justify-center md:flex h-full">
              <div className="flex h-full items-center">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex h-full items-center px-4 text-[14px] font-medium transition-colors',
                        isActive
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-900'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 md:flex">
              <UserMenu />
              <div className="mx-1 h-5 w-px bg-gray-200" />
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                  0
                </span>
              </Link>
              <Link 
                href="/product/pvc-banner-3x6"
                className="ml-2 flex h-10 items-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 md:hidden">
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                  0
                </span>
              </Link>
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Open menu"
                className="h-9 w-9"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" onClick={handleNavClick} aria-label="Home">
            <span className="text-xl font-bold">
              <span className="text-emerald-600">Banner</span>
              <span className="text-gray-900">Direct</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMobileMenuOpen(false);
              menuButtonRef.current?.focus();
            }}
            aria-label="Close menu"
            className="h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1" role="list">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'block rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t px-4 py-4">
          <MobileUserMenu onNavigate={handleNavClick} />
        </div>

        {/* CTA */}
        <div className="border-t p-4">
          <Link 
            href="/product/pvc-banner-3x6"
            onClick={handleNavClick}
            className="block w-full rounded-md bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}

export { Header };
