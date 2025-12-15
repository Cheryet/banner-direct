'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth-context';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { 
  User, 
  LogOut, 
  Settings, 
  Package, 
  Shield,
  ChevronDown,
  Loader2
} from 'lucide-react';

/**
 * User Menu Component
 * Shows login button for guests, dropdown menu for authenticated users
 */
export function UserMenu() {
  const auth = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const menuRef = React.useRef(null);

  // Ensure client-side only
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  React.useEffect(() => {
    if (!mounted) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted]);

  // Close menu on escape
  React.useEffect(() => {
    if (!mounted) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mounted]);

  // Show loading state during SSR and initial load
  if (!mounted || auth?.isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  const { user, profile, isAnonymous, isAdmin, signOut } = auth || {};

  // Anonymous or no user - show login button
  if (!user || isAnonymous) {
    return (
      <Link 
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        Sign In
      </Link>
    );
  }

  // Authenticated user - show dropdown
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Account';
  const initials = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">
          {initials}
        </div>
        <span className="hidden lg:inline">{displayName}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border bg-white py-1 shadow-lg">
          {/* User info */}
          <div className="border-b px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Package className="h-4 w-4" />
              Order History
            </Link>
            <Link
              href="/account/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          {/* Admin link */}
          {isAdmin && (
            <div className="border-t py-1">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </div>
          )}

          {/* Sign out */}
          <div className="border-t py-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile User Menu
 * Simplified version for mobile drawer
 */
export function MobileUserMenu({ onNavigate }) {
  const auth = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || auth?.isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const { user, profile, isAnonymous, isAdmin, signOut } = auth || {};

  if (!user || isAnonymous) {
    return (
      <div className="space-y-2">
        <LinkButton href="/login" className="w-full" onClick={onNavigate}>
          Sign In
        </LinkButton>
        <LinkButton href="/signup" variant="outline" className="w-full" onClick={onNavigate}>
          Create Account
        </LinkButton>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Account';

  const handleSignOut = async () => {
    onNavigate?.();
    await signOut();
  };

  return (
    <div className="space-y-4">
      {/* User info */}
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900">{displayName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-1">
        <Link
          href="/account"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <User className="h-5 w-5" />
          My Account
        </Link>
        <Link
          href="/orders"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Package className="h-5 w-5" />
          Order History
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-emerald-700 hover:bg-emerald-50"
          >
            <Shield className="h-5 w-5" />
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </div>
  );
}
