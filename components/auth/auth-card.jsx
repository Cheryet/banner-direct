'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * AuthCard - Container for auth forms
 * Provides consistent styling and layout for all auth pages
 */
function AuthCard({ children, className }) {
  return (
    <div
      className={cn(
        'w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * AuthCardHeader - Header section of auth card
 */
function AuthCardHeader({ children, className }) {
  return <div className={cn('px-6 pt-8 pb-2 text-center', className)}>{children}</div>;
}

/**
 * AuthCardContent - Main content area of auth card
 */
function AuthCardContent({ children, className }) {
  return <div className={cn('px-6 pb-8', className)}>{children}</div>;
}

/**
 * AuthCardFooter - Footer section of auth card
 */
function AuthCardFooter({ children, className }) {
  return (
    <div
      className={cn(
        'border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-center text-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

export { AuthCard, AuthCardHeader, AuthCardContent, AuthCardFooter };
