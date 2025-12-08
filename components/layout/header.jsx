'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const pathname = usePathname();
  const drawerRef = React.useRef(null);
  const menuButtonRef = React.useRef(null);

  // ---------------------------------------------------------------------------
  // Scroll shadow effect
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur transition-shadow supports-[backdrop-filter]:bg-white/80',
          isScrolled && 'shadow-sm'
        )}
      >
        <nav
          className="container flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex h-10 items-center rounded-md px-2 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Home"
            >
              <span className="font-heading text-xl font-bold text-primary">
                Banner<span className="text-foreground">Direct</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  0
                </Badge>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/product/pvc-banner-3x6">Create Your Banner</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  0
                </Badge>
              </Link>
            </Button>
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="h-11 w-11"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </nav>
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
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Home"
          >
            <span className="font-heading text-xl font-bold text-primary">
              Banner<span className="text-foreground">Direct</span>
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
            className="h-11 w-11"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>

        {/* Drawer navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1" role="list">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
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

        {/* Drawer footer */}
        <div className="border-t px-4 py-6">
          <Button asChild size="lg" className="w-full">
            <Link href="/product/pvc-banner-3x6" onClick={handleNavClick}>
              Create Your Banner
            </Link>
          </Button>

          {/* Trust microcopy */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            <span>Made in Canada • Fast Shipping</span>
          </div>
        </div>
      </div>
    </>
  );
}

export { Header };
