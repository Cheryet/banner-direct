'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * AuthHeader - Title and description for auth pages
 * Accepts props for customization (no hardcoded copy)
 */
function AuthHeader({ title, description, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}

/**
 * AuthLogo - Optional logo/branding for auth pages
 */
function AuthLogo({ className }) {
  return (
    <Link href="/" className={cn('inline-block', className)}>
      <span className="text-xl font-bold text-emerald-600">Banner Direct</span>
    </Link>
  );
}

export { AuthHeader, AuthLogo };
